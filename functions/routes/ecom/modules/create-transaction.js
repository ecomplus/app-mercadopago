const { baseUri } = require('./../../../__env')
const axios = require('axios')

exports.post = ({ appSdk, admin }, req, res) => {
  // body was already pre-validated on @/bin/web.js
  // treat module request body
  const { params, application } = req.body
  const { storeId } = req

  // app configured options
  const config = Object.assign({}, application.data, application.hidden_data)
  const notificationUrl = `${baseUri}/mercadopago/notifications`

  let token, paymentMethodId, deviceId
  const isPix = params.payment_method.code === 'account_deposit'
  if (params.credit_card && params.credit_card.hash) {
    const hashParts = params.credit_card.hash.split(' // ')
    token = hashParts[0]
    try {
      const parsed = JSON.parse(hashParts[1])
      paymentMethodId = parsed.payment_method_id 
      deviceId = parsed.deviceId
    } catch (e) {
      paymentMethodId = params.credit_card.company || 'visa'
    }
  } else if (params.payment_method.code === 'banking_billet') {
    paymentMethodId = 'bolbradesco'
  } else if (params.payment_method.code === 'account_deposit') {
    paymentMethodId = 'pix'
  } else {
    return res.status(400).send({
      error: 'NO_CARD_ERR',
      message: 'Credit card hash is required'
    })
  }

  const { buyer } = params
  const orderId = params.order_id
  console.log('> MP Transaction #', storeId, orderId)

  // https://www.mercadopago.com.br/developers/pt/reference/payments/_payments/post/
  const payerPhone = {
    area_code: buyer.phone.number.substr(0, 2),
    number: buyer.phone.number.substr(2, 11)
  }
  const additionalInfo = {
    items: [],
    payer: {
      first_name: buyer.fullname.replace(/\s.*/, ''),
      last_name: buyer.fullname.replace(/[^\s]+\s/, ''),
      phone: payerPhone
    }
  }

  if (params.to && params.to.street) {
    additionalInfo.shipments = {
      receiver_address: {
        zip_code: params.to.zip,
        street_name: params.to.street,
        street_number: params.to.number || 0
      }
    }
  }
  if (params.billing_address && params.billing_address.street) {
    additionalInfo.payer.address = {
      zip_code: params.billing_address.zip,
      street_name: params.billing_address.street,
      street_number: params.billing_address.number || 0
    }
  } else if (additionalInfo.shipments) {
    additionalInfo.payer.address = additionalInfo.shipments.receiver_address
  }

  if (Array.isArray(params.items)) {
    params.items.forEach(item => {
      additionalInfo.items.push({
        id: item.sku || item.variation_id || item.product_id,
        title: item.name || item.sku,
        description: item.name || item.sku,
        quantity: item.quantity,
        unit_price: item.final_price || item.price
      })
    })
  }

  const payerOrBuyer = {
    ...buyer,
    ...params.payer
  }
  for (const field in payerOrBuyer) {
    if (!payerOrBuyer[field] && buyer[field]) {
      payerOrBuyer[field] = buyer[field]
    }
  }

  const payment = {
    payer: {
      type: 'customer',
      email: buyer.email,
      first_name: payerOrBuyer.fullname.replace(/\s.*/, ''),
      last_name: payerOrBuyer.fullname.replace(/[^\s]+\s/, ''),
      identification: {
        type: payerOrBuyer.registry_type === 'j' ? 'CNPJ' : 'CPF',
        number: String(payerOrBuyer.doc_number)
      }
    },
    external_reference: String(params.order_number),
    transaction_amount: Number(params.amount.total.toFixed(2)),
    description: `Pedido #${params.order_number} de ${buyer.fullname}`.substring(0, 60),
    payment_method_id: paymentMethodId,
    token,
    statement_descriptor: config.statement_descriptor || `${params.domain}_MercadoPago`,
    installments: params.installments_number || 1,
    notification_url: notificationUrl,
    additional_info: additionalInfo,
    metadata: {
      ecom_store_id: storeId,
      ecom_order_id: orderId
    }
  }
  console.log(JSON.stringify(payment))
  let headers
  if (deviceId) {
    headers = {'X-meli-session-id': deviceId}
  }

  axios({
    url: `https://api.mercadopago.com/v1/payments?access_token=${config.mp_access_token}`,
    method: 'post',
    data: payment,
    headers
  })
    .then(({ data }) => {
      console.log('> MP Checkout #', storeId, orderId)
      const statusPayment = parsePaymentStatus(data.status)

      let isSaveRetry = false
      const saveToDb = () => {
        admin.firestore().collection('mp_payments')
          .doc(String(data.id))
          .set({
            transaction_code: data.id,
            store_id: storeId,
            order_id: orderId,
            createAt: new Date().toISOString(),
            status: statusPayment,
            paymentMethod: paymentMethodId,
            notificationUrl
          }, {
            merge: true
          })
          .then(() => {
            console.log('> Payment #', String(data.id))
          })
          .catch(err => {
            if (err.code === 13 && !isSaveRetry) {
              isSaveRetry = true
              setTimeout(saveToDb, 500)
            } else {
              console.error('PAYMENT_SAVE_ERR', err)
            }
          })
      }
      saveToDb()

      const transaction = {
        amount: data.transaction_details.total_paid_amount,
        currency_id: data.currency_id,
        intermediator: {
          payment_method: {
            code: paymentMethodId || params.payment_method.code
          },
          transaction_id: String(data.id),
          transaction_code: String(data.id),
          transaction_reference: data.external_reference
        },
        status: {
          current: statusPayment
        }
      }

      if (params.payment_method.code === 'credit_card') {
        if (data.card) {
          transaction.credit_card = {
            holder_name: data.card.cardholder.name,
            last_digits: data.card.last_four_digits,
            token
          }
        }
        if (data.installments) {
          transaction.installments = {
            number: data.installments,
            tax: (data.transaction_details.total_paid_amount > data.transaction_amount),
            total: data.transaction_details.total_paid_amount,
            value: data.transaction_details.installment_amount
          }
        }
      } else if (!isPix && data.transaction_details && data.transaction_details.external_resource_url) {
        transaction.payment_link = data.transaction_details.external_resource_url
        transaction.banking_billet = {
          link: transaction.payment_link
        }
        if (data.date_of_expiration) {
          const dateValidThru = new Date(data.date_of_expiration)
          if (dateValidThru.getTime() > 0) {
            transaction.banking_billet.valid_thru = dateValidThru.toISOString()
          }
        }
      } else if (isPix && data.point_of_interaction && data.point_of_interaction.transaction_data) {
        // https://www.mercadopago.com.br/developers/pt/docs/checkout-api/integration-configuration/integrate-with-pix#bookmark_visualiza%C3%A7%C3%A3o_de_pagamento
        const qrCode = data.point_of_interaction.transaction_data.qr_code
        const qrCodeBase64 = data.point_of_interaction.transaction_data.qr_code_base64
        transaction.notes = '<div style="display:block;margin:0 auto"> ' +
          `<img width="280" height="280" style="margin:5px auto" src='data:image/jpeg;base64,${qrCodeBase64}'/> ` +
          `<input readonly type="text" id="pix-copy" value="${qrCode}" />` +
          `<button type="button" class="btn btn-sm btn-light" onclick="let codePix = document.getElementById('pix-copy')
          codePix.select()
          document.execCommand('copy')">Copiar Pix</button></div>`
      }

      return res.send({
        redirect_to_payment: false,
        transaction
      })
    })

    .catch(error => {
      let { message } = error
      const err = new Error(`CREATE_TRANSACTION_ERR #${storeId} - ${orderId} => ${message}`)
      if (error.response) {
        const { status, data } = error.response
        if (status !== 401 && status !== 403) {
          err.payment = JSON.stringify(payment)
          err.status = status
          if (typeof data === 'object' && data) {
            err.response = JSON.stringify(data)
          } else {
            err.response = data
          }
          if (typeof data.message === 'string' && data.message) {
            message = data.message
          }
        }
      }
      console.error(err)
      res.status(409)
      res.send({
        error: 'CREATE_TRANSACTION_ERR',
        message
      })
    })
}

const parsePaymentStatus = status => {
  switch (status) {
    case 'rejected': return 'voided'
    case 'in_process': return 'under_analysis'
    case 'approved': return 'paid'
    default: return 'pending'
  }
}
