const { baseUri } = require('./../../../__env')
const axios = require('axios')

exports.post = ({ appSdk, admin }, req, res) => {
  // body was already pre-validated on @/bin/web.js
  // treat module request body
  const { params, application } = req.body
  const { storeId } = req
  // app configured options
  const config = Object.assign({}, application.data, application.hidden_data)

  if (!config.mp_public_key || !config.mp_access_token) {
    // must have configured PayPal app ID and secret
    return res.status(400).send({
      error: 'LIST_PAYMENTS_ERR',
      message: 'Mercado pago Public Key or Access Token is unset on app hidden data (merchant must configure the app)'
    })
  }

  const notificationUrl = `${baseUri}/mercadopago/notifications`
  const amount = params.amount || {}
  const hash = params.credit_card.hash.split(' // ')
  const token = hash[0]
  const paymentMethodId = JSON.parse(hash[1])
  const { buyer, to, items } = params

  const payer = {
    email: buyer.email,
    identification: {
      type: buyer.registry_type === 'j' ? 'CNPJ' : 'CPF',
      number: buyer.doc_number
    },
    first_name: buyer.fullname,
  }

  const payment = {
    payer,
    external_reference: String(params.order_number),
    transaction_amount: amount.total,
    payment_method_id: paymentMethodId.payment_method_id,
    // issuer_id: ,
    token,
    statement_descriptor: config.statement_descriptor || 'Mercado Pago',
    installments: params.installments_number || 1,
    notification_url: notificationUrl,
    additional_info: {
      items: [],
      payer: {
        first_name: buyer.fullname,
        phone: {
          area_code: buyer.phone.number.substr(0, 2),
          number: buyer.phone.number.substr(2, 11)
        },
        address: {
          zip_code: to.zip || '',
          street_name: to.street || '',
          street_number: to.number || 0
        }
      },
      shipments: {
        receiver_address: {
          zip_code: to.zip || '',
          street_name: to.street || '',
          street_number: to.number || 0
        }
      }
    }
  }

  if (items && Array.isArray(items)) {
    items.forEach(item => {
      payment.additional_info.items.push({
        id: item.product_id,
        title: item.name || item.sku,
        description: item.name || item.sku,
        quantity: item.quantity,
        unit_price: item.final_price || item.price
      })
    });
  }

  const options = {
    url: `https://api.mercadopago.com/v1/payments?access_token=${config.mp_access_token}`,
    method: 'post',
    data: payment
  }

  console.log('> MP Transaction #', storeId)

  axios(options)
    .then(resp => resp.data)
    .then(data => {
      console.log('> MP Checkout #', storeId)
      const response = {
        redirect_to_payment: false,
        transaction: {
          amount: data.transaction_details.total_paid_amount,
          credit_card: {
            holder_name: data.card.cardholder.name,
            last_digits: data.card.last_four_digits,
            token
          },
          creditor_fees: {
            installment: data.installments,
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
      }

      const db = admin.firestore()
      db.collection('mercadopago_payment')
        .doc(String(data.id))
        .set({
          payment_id: data.id,
          store_id: storeId,
          status: data.status,
          order_number: params.order_number,
          order_id: params.order_id,
          created_at: admin.firestore.Timestamp.fromDate(new Date())
        })
        .then(() => {
          console.log('> Payment #', String(data.id))
        })
        .catch(err => {
          console.error('PAYMENT_SAVE_ERR', err)
        })

      return res.send(response)
    }).catch(error => {
      console.error('CREATE_TRANSACTION_ERR', error)
      res.status(error.status || 500)
      const { message } = error
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