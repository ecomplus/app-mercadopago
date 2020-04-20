const newPaymentGatways = require('./../../../lib/new-payment-gateway')

exports.post = ({ appSdk }, req, res) => {
  // body was already pre-validated on @/bin/web.js
  // treat module request body
  const { params, application } = req.body

  // app configured options
  const config = Object.assign({}, application.data, application.hidden_data)
  const mpCheckoutLabel = config.label || 'Pagar com Mercado Pago'

  if (!config.mp_public_key || !config.mp_access_token) {
    // must have configured PayPal app ID and secret
    return res.status(400).send({
      error: 'LIST_PAYMENTS_ERR',
      message: 'Mercado pago Public Key or Access Token is unset on app hidden data (merchant must configure the app)'
    })
  }

  const amount = params.amount || {}

  // start mounting response body
  // https://apx-mods.e-com.plus/api/v1/list_payments/response_schema.json?store_id=100
  const response = {
    payment_gateways: []
  }

  // calculate discount value
  const { discount } = config
  if (discount && discount.value > 0) {
    if (discount.apply_at !== 'freight') {
      // default discount option
      const { value } = discount
      response.discount_option = {
        label: config.discount_option_label,
        value
      }
        // specify the discount type and min amount is optional
        ;['type', 'min_amount'].forEach(prop => {
          if (discount[prop]) {
            response.discount_option[prop] = discount[prop]
          }
        })
    }

    if (amount.total) {
      // check amount value to apply discount
      if (amount.total < discount.min_amount) {
        discount.value = 0
      } else {
        delete discount.min_amount

        // fix local amount object
        const maxDiscount = amount[discount.apply_at || 'subtotal']
        let discountValue
        if (discount.type === 'percentage') {
          discountValue = maxDiscount * discount.value / 100
        } else {
          discountValue = discount.value
          if (discountValue > maxDiscount) {
            discountValue = maxDiscount
          }
        }
        if (discountValue > 0) {
          amount.discount = (amount.discount || 0) + discountValue
          amount.total -= discountValue
          if (amount.total < 0) {
            amount.total = 0
          }
        }
      }
    }
  }

  const paymentGateway = newPaymentGatways()
  const onloadFunction = `window.Mercadopago.setPublishableKey("${config.mp_public_key}");`
  paymentGateway.js_client.onload_expression = onloadFunction + paymentGateway.js_client.onload_expression
  paymentGateway.label = mpCheckoutLabel
  paymentGateway.payment_method.name = mpCheckoutLabel

  // check available discount by payment method
  if (discount && discount.value > 0) {
    paymentGateway.discount = discount
    if (response.discount_option && !response.discount_option.label) {
      response.discount_option.label = paymentGateway.label
    }
  }

  const installmentsOption = config.installments_option
  if (installmentsOption && installmentsOption.max_number) {
    // default configured installments option
    response.installments_option = installmentsOption
  }

  if (config.text) {
    paymentGateway.text = config.text
  }

  if (config.icon) {
    paymentGateway.icon = config.icon
  }

  if (!config.disable_credit_card) {
    response.payment_gateways.unshift(paymentGateway)
  }

  res.send(response)
}
