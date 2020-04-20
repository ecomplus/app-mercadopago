'use strict'

const fs = require('fs')
const path = require('path')

// UglifyJS to minify JS Client expressions
// https://www.npmjs.com/package/uglify-js#api-reference
const uglifyJS = require('uglify-js')

// read JS script and minify to setup onload expression string
const onloadScriptfile = path.join(__dirname, '../public/', '/onload-expression.js')
let onloadExpressions = uglifyJS.minify(fs.readFileSync(onloadScriptfile, 'utf8')).code

module.exports = () => {
  return {
    payment_method: {
      code: 'credit_card'
    },
    intermediator: {
      code: 'mercadopago',
      link: 'https://www.mercadopago.com.br',
      name: 'Mercado Pago'
    },
    payment_url: 'https://www.mercadopago.com.br/',
    type: 'payment',
    js_client: {
      script_uri: 'https://secure.mlstatic.com/sdk/javascript/v1/mercadopago.js',
      onload_expression: onloadExpressions,
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
  }
}