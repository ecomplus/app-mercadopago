const axios = require('axios')
const getAppData = require('./../../lib/store-api/get-app-data')
const ECHO_SKIP = 'SKIP'

exports.post = ({ appSdk, admin }, req, res) => {
  const notification = req.body
  if (notification.type !== 'payment' || !notification.data || !notification.data.id) {
    return res.send(ECHO_SKIP)
  }

  setTimeout(() => {
    console.log('> MP Notification for Payment #', notification.data.id)

    admin.firestore()
      .collection('mp_payments')
      .where('transaction_code', '==', parseInt(notification.data.id, 10))
      .get()

      .then(querySnapshot => {
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data()
          const storeId = data.store_id

          return getAppData({ appSdk, storeId })
            .then(config => {
              const resource = `orders/${data.order_id}.json`
              return appSdk
                .apiRequest(storeId, resource)
                .then(resp => ({ order: resp.response.data, config }))
            })

            .then(({ order, config }) => {
              const url = `https://api.mercadopago.com/v1/payments/${notification.data.id}?` +
                `access_token=${config.mp_access_token}`
              return axios({ url })
                .then(({ data }) => ({ payment: data, order }))
            })

            .then(({ payment, order }) => {
              const transaction = order.transactions.find(({ intermediator }) => {
                return intermediator && intermediator.transaction_code === notification.data.id
              })
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

            .then(() => {
              res.sendStatus(200)
            })
        } else {
          throw new Error(`Payment ${notification.data.id} not found`)
        }
      })

      .catch(err => {
        console.error(err)
        res.sendStatus(503)
      })
  }, 3000)
}

const parsePaymentStatus = status => {
  switch (status) {
    case 'rejected': return 'voided'
    case 'in_process': return 'under_analysis'
    case 'approved': return 'paid'
    default: return 'pending'
  }
}
