const { baseUri } = require('./../../../__env')
const path = require('path')
const fs = require('fs')

exports.post = ({ appSdk }, req, res) => {
  // body was already pre-validated on @/bin/web.js
  // treat module request body
  const { params, application } = req.body
  const amount = params.amount || {}

  // app configured options
  const config = Object.assign({}, application.data, application.hidden_data)
  if (!config.mp_public_key || !config.mp_access_token) {
    // must have configured PayPal app ID and secret
    return res.status(409).send({
      error: 'LIST_PAYMENTS_ERR',
      message: 'MP Public Key or Access Token is unset on app hidden data (merchant must configure the app)'
    })
  }

  // start mounting response body
  // https://apx-mods.e-com.plus/api/v1/list_payments/response_schema.json?store_id=100
  const response = {
    payment_gateways: []
  }

  // calculate discount value
  const { discount } = config
  if (discount && discount.value) {
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
        if (discountValue) {
          amount.discount = (amount.discount || 0) + discountValue
          amount.total -= discountValue
          if (amount.total < 0) {
            amount.total = 0
          }
        }
      }
    }
  }

  // setup payment gateway objects
  const intermediator = {
    code: 'mercadopago',
    link: 'https://www.mercadopago.com.br',
    name: 'Mercado Pago'
  }
  ;['credit_card', 'banking_billet'].forEach(paymentMethod => {
    const isCreditCard = paymentMethod === 'credit_card'
    const methodConfig = isCreditCard ? config : config[paymentMethod]
    if (methodConfig && (methodConfig.enable || (isCreditCard && !methodConfig.disable))) {
      const label = methodConfig.label || (isCreditCard ? 'Cartão de crédito' : 'Boleto bancário')
      const gateway = {
        label,
        icon: methodConfig.icon,
        text: methodConfig.text,
        payment_method: {
          code: paymentMethod,
          name: `${label} - ${intermediator.name}`
        },
        intermediator,
        type: 'payment'
      }

      if (isCreditCard) {
        if (!gateway.icon) {
          gateway.icon = `${baseUri}/checkout-stamp.png`
        }
        gateway.js_client = {
          script_uri: 'https://secure.mlstatic.com/sdk/javascript/v1/mercadopago.js',
          onload_expression: `window.Mercadopago.setPublishableKey("${config.mp_public_key}");` +
            fs.readFileSync(path.join(__dirname, '../../../public/onload-expression.min.js'), 'utf8'),
          cc_brand: {
            function: '_mpBrand',
            is_promise: true
          },
          cc_hash: {
            function: '_mpHash',
            is_promise: true
          },
          cc_installments: {
            function: '_mpInstallments',
            is_promise: true
          }
        }

        // default configured default installments option
        const installmentsOption = config.installments_option
        if (installmentsOption && installmentsOption.max_number) {
          response.installments_option = installmentsOption
          const minInstallment = installmentsOption.min_installment

          // optional configured installments list
          if (amount.total && Array.isArray(config.installments) && config.installments.length) {
            gateway.installment_options = []
            config.installments.forEach(({ number, interest }) => {
              if (number >= 2) {
                const value = amount.total / number
                if (value >= minInstallment) {
                  gateway.installment_options.push({
                    number,
                    value: interest > 0 ? value + value * interest / 100 : value,
                    tax: Boolean(interest)
                  })
                }
              }
            })
          }
        }
      }

      // check available discount by payment method
      if (discount && discount.value && discount[paymentMethod] !== false) {
        gateway.discount = {}
        ;['apply_at', 'type', 'value'].forEach(field => {
          gateway.discount[field] = discount[field]
        })
        if (response.discount_option && !response.discount_option.label) {
          response.discount_option.label = label
        }
      }

      response.payment_gateways.push(gateway)
    }
  })

  res.send(response)
}
