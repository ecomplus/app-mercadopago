const axios = require('axios')
const getAppData = require('./../../lib/store-api/get-app-data')
const ECHO_SKIP = 'SKIP'

exports.post = ({ appSdk, admin }, req, res) => {
  /**
   * Treat E-Com Plus trigger body here
   * Ref.: https://developers.e-com.plus/docs/api/#/store/triggers/
   */
  const notification = req.body

  if (notification.type !== 'payment') {
    return res.send(ECHO_SKIP)
  }

  const handler = (notification) => {
    console.log(`> MP Notification for Payment #`, notification.data.id)
    const db = admin.firestore()
    return db
      .collection('mercadopago_payment')
      .doc(notification.data.id)
      .get()
      .then(doc => {
        if (doc.exists) {
          const data = doc.data()
          const storeId = data.store_id
          getAppData({ appSdk, storeId })

            .then(config => {
              const resource = `orders/${data.order_id}.json`
              return appSdk
                .apiRequest(storeId, resource)
                .then(resp => ({ order: resp.response.data, config }))
            })

            .then(({ order, config }) => {
              const url = `https://api.mercadopago.com/v1/payments/${notification.data.id}?access_token=${config.mp_access_token}`
              return axios({ url })
                .then(resp => {
                  return resp
                })
                .then(resp => ({ payment: resp.data, order }))
            })

            .then(({ payment, order }) => {
              const transaction = order.transactions.find(trans => trans.intermediator.transaction_code === notification.data.id)
              const resource = `orders/${order._id}/payments_history.json`
              const method = 'POST'
              const body = {
                transaction_id: transaction._id,
                date_time: new Date().toISOString(),
                status: parsePaymentStatus(payment.status),
                notification_code: String(notification.id),
                flags: [
                  'mercadopago'
                ]
              }

              return appSdk.apiRequest(storeId, resource, method, body)
            })

            .catch(err => {
              console.error('NOTIFICATION_ERR', err)
              if (err.name === ECHO_SKIP) {
                // trigger ignored by app configuration
              } else {
                // console.error(err)
                // request to Store API with error response
                // return error status code
                const { message } = err
              }
            })
        } else {
          console.error('Payment not found', notification.data.id)
        }
        return
      })

      .catch(err => {
        console.error('NOTIFICATION_ERR', err)
        if (err.name === ECHO_SKIP) {
          // trigger ignored by app configuration
        } else {
          // console.error(err)
          // request to Store API with error response
          // return error status code
          const { message } = err
        }
      })
  }

  setTimeout(() => {
    handler(notification)
  }, Math.random() * (5000 - 1000) + 1000)
  return res.send()
}

const parsePaymentStatus = status => {
  switch (status) {
    case 'rejected': return 'voided'
    case 'in_process': return 'under_analysis'
    case 'approved': return 'paid'
    default: return 'pending'
  }
}