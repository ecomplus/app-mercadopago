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

  let token, paymentMethodId
  if (params.credit_card && params.credit_card.hash) {
    const hashParts = params.credit_card.hash.split(' // ')
    token = hashParts[0]
    try {
      paymentMethodId = JSON.parse(hashParts[1]).payment_method_id
    } catch (e) {
      paymentMethodId = params.credit_card.company || 'visa'
    }
  } else {
    return res.status(400).send({
      error: 'NO_CARD_ERR',
      message: 'Credit card hash is required'
    })
  }
  const { buyer, payer } = params
  const orderId = params.order_id
  console.log('> MP Transaction #', storeId, orderId)

  // https://www.mercadopago.com.br/developers/pt/reference/payments/_payments/post/
  const additionalInfo = {
    items: [],
    payer: {
      first_name: buyer.fullname.replace(/\s.*/, ''),
      last_name: buyer.fullname.replace(/[^\s]+\s/, ''),
      phone: {
        area_code: buyer.phone.number.substr(0, 2),
        number: buyer.phone.number.substr(2, 11)
      }
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

  const payment = {
    payer: {
      email: buyer.email
    },
    external_reference: String(params.order_number),
    transaction_amount: params.amount.total,
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

  if (payer) {
    if (payer.fullname) {
      payment.payer.first_name = payer.fullname.replace(/\s.*/, '')
      payment.payer.last_name = payer.fullname.replace(/[^\s]+\s/, '')
    }
    if (payer.registry_type && payer.doc_number) {
      payment.payer.identification = {
        type: payer.registry_type === 'j' ? 'CNPJ' : 'CPF',
        number: payer.doc_number
      }
    }
    if (payer.phone) {
      payment.payer.phone = {
        area_code: payer.phone.number.substr(0, 2),
        number: payer.phone.number.substr(2)
      }
    }
  }

  axios({
    url: `https://api.mercadopago.com/v1/payments?access_token=${config.mp_access_token}`,
    method: 'post',
    data: payment
  })
    .then(({ data }) => {
      console.log('> MP Checkout #', storeId, orderId)

      const db = admin.firestore()
      db.collection('mercadopago_payment')
        .doc(String(data.id))
        .set({
          payment_id: data.id,
          store_id: storeId,
          status: data.status,
          order_number: params.order_number,
          order_id: orderId,
          created_at: admin.firestore.Timestamp.fromDate(new Date())
        })
        .then(() => {
          console.log('> Payment #', String(data.id))
        })
        .catch(err => {
          console.error('PAYMENT_SAVE_ERR', err)
        })

      return res.send({
        redirect_to_payment: false,
        transaction: {
          amount: data.transaction_details.total_paid_amount,
          credit_card: {
            holder_name: data.card.cardholder.name,
            last_digits: data.card.last_four_digits,
            token
          },
          creditor_fees: {
            installment: data.installments
          },
          currency_id: data.currency_id,
          installments: {
            number: data.installments,
            tax: (data.transaction_details.total_paid_amount > data.transaction_amount),
            total: data.transaction_details.total_paid_amount,
            value: data.transaction_details.installment_amount
          },
          intermediator: {
            payment_method: {
              code: 'credit_card',
              name: 'Cartão de Crédito'
            },
            transaction_id: String(data.id),
            transaction_code: String(data.id),
            transaction_reference: data.external_reference
          },
          status: {
            current: parsePaymentStatus(data.status)
          }
        }
      })
    })

    .catch(error => {
      const { message } = error
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
