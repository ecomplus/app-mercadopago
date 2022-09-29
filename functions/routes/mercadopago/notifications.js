const axios = require('axios')
const getAppData = require('./../../lib/store-api/get-app-data')
const ECHO_SKIP = 'SKIP'
let ECHO_SUCCESS = 'SUCCESS'

exports.post = ({ appSdk, admin }, req, res) => {
  const notification = req.body
  if (notification.type !== 'payment' || !notification.data || !notification.data.id) {
    return res.send(ECHO_SKIP)
  }
  console.log('>>Webhook ', JSON.stringify(notification), ' <<')

  setTimeout(() => {
    console.log('> MP Notification for Payment #', notification.data.id)

    const docRef = admin.firestore()
      .collection('mp_payments')
      .doc(String(notification.data.id))

    docRef.get()
      .then(doc => {
        if (doc.exists) {
          const data = doc.data()
          const storeId = data.store_id

          return getAppData({ appSdk, storeId })
            .then(config => {
              const resource = `orders/${data.order_id}.json`
              return appSdk
                .apiRequest(storeId, resource)
                .then(({ response }) => ({ order: response.data, config }))
            })

            .then(({ order, config }) => {
              const url = `https://api.mercadopago.com/v1/payments/${notification.data.id}?` +
                `access_token=${config.mp_access_token}`
              return axios({ url })
                .then(({ data }) => ({ payment: data, order }))
                .catch(err => {
                  console.log(config, order)
                  throw err
                })
            })

            .then(({ payment, order }) => {
              const transaction = order.transactions.find(({ intermediator }) => {
                return intermediator && intermediator.transaction_code === notification.data.id
              })
              const resource = `orders/${order._id}/payments_history.json`
              const method = 'POST'
              const status = parsePaymentStatus(payment.status)
              const body = {
                transaction_id: transaction._id,
                date_time: new Date().toISOString(),
                status,
                notification_code: String(notification.id),
                flags: [
                  'mercadopago'
                ]
              }
              if (status !== order.financial_status?.current) {
                const updatedAt = new Date().toISOString()
                docRef.set({ status, updatedAt }, { merge: true }).catch(console.error)

                return appSdk.apiRequest(storeId, resource, method, body)
              } else {
                ECHO_SUCCESS = 'OK'
                return true
              }
            })

            .then(() => {
              res.status(200).send(ECHO_SUCCESS)
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
    case 'charged_back':
    case 'refunded':
      return 'refunded'
    case 'in_process': return 'under_analysis'
    case 'approved': return 'paid'
    default: return 'pending'
  }
}
