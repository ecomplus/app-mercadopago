; (function () {
  window.Mercadopago.getIdentificationTypes()

  window._mpHash = function (data) {
    return new Promise(function (resolve, reject) {
      window
        ._mpBrand(data.number)
        .then(function () {
          return setMPForm(data)
        })
        .then(function (res) {
          window
            .Mercadopago
            .getIssuers(window.mpPaymentMethodId, function (status, issuer) {
              console.log(issuer)
              var token = res.id + ' // ' + JSON.stringify({ 'payment_method_id': window.mpPaymentMethodId, 'issuer': issuer })
              return resolve(token)
            })
        })
        .catch(reject)
    })
  }

  window._mpInstallments = function (data) {
    return new Promise(function (resolve, reject) {
      window
        ._mpBrand(data.number)
        .then(function (paymentMethodId) {
          var options = {
            'payment_method_id': paymentMethodId,
            'amount': data.amount
          }

          return window
            .Mercadopago
            .getInstallments(options, function (status, data) {
              if (status === 200) {
                var installmentList = []
                for (var i = 0; i < data[0].payer_costs.length; i++) {
                  var opt = data[0].payer_costs[i]
                  installmentList.push({
                    number: opt.installments,
                    tax: (opt.installment_rate > 0),
                    value: opt.installment_amount
                  })
                }

                resolve(installmentList)
              } else {
                console.log('installments method info error:', response)
                reject(response)
              }
            });
        })
        .catch(reject)
    })
  }

  window._mpBrand = function (number) {
    return new Promise(function (resolve, reject) {
      var bin = String(number)
      bin = bin.substring(0, 6)
      window
        .Mercadopago
        .getPaymentMethod({
          'bin': bin
        }, function (status, resp) {
          if (status === 200) {
            window.mpPaymentMethodId = resp[0].id
            resolve(resp[0].id)
          } else {
            console.log('payment method info error:', resp);
            reject(resp)
          }
        })
    })
  }

  function setMPForm(data) {
    return new Promise(function (resolve, reject) {
      var customer = window.storefrontApp.customer
      var mpParams = {}
      mpParams.cardNumber = data.number
      mpParams.cardholderName = data.name
      mpParams.cardExpirationMonth = data.month
      mpParams.cardExpirationYear = data.year
      mpParams.securityCode = data.cvc

      if (data.doc) {
        mpParams.docNumber = data.doc
      } else {
        mpParams.docNumber = customer.doc_number
      }

      mpParams.email = customer.main_email
      mpParams.payment_method_id = window.mpPaymentMethodId

      var $form = document.createElement('form')

      for (var key in mpParams) {
        if (mpParams[key]) {
          var value = mpParams[key];
          var $input = document.createElement('input')
          $input.setAttribute('type', 'text')
          $input.setAttribute('id', key)
          $input.setAttribute('data-checkout', key)
          $input.setAttribute('value', value)
          $form.appendChild($input)
        }
      }

      // todo
      // - select typeDoc
      var $typeDoc = document.createElement('select');
      $typeDoc.setAttribute('data-checkout', 'docType')
      var $typeDocOption = document.createElement('option');
      $typeDocOption.text = customer.registry_type === 'j' ? 'CNPJ' : 'CPF'
      $typeDocOption.value = customer.registry_type === 'j' ? 'CNPJ' : 'CPF'
      $typeDocOption.setAttribute('selected', true)
      $typeDoc.add($typeDocOption)

      $form.appendChild($typeDoc)
      // - select installments

      window.Mercadopago.createToken($form, function (status, resp) {
        if (status === 200) {
          resolve(resp)
        } else {
          reject(resp)
        }
      })
    })
  }
})()
