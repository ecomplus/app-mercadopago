# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.4.1](https://github.com/ecomplus/application-starter/compare/v1.4.0...v1.4.1) (2020-08-09)


### Bug Fixes

* **create-payment:** ensure required payer info is sent ([21ff653](https://github.com/ecomplus/application-starter/commit/21ff653573f7b95c4678bd9c269aa3625ec8a680))
* **create-payment:** remove mp payment param payer.phone ([6a205d2](https://github.com/ecomplus/application-starter/commit/6a205d2ca451efbfb4550c26639465e75b313f7a))

## [1.4.0](https://github.com/ecomplus/application-starter/compare/v1.3.0...v1.4.0) (2020-08-09)


### Features

* **banking-billet:** supporting "MP boleto" payment method ([#11](https://github.com/ecomplus/application-starter/issues/11)) ([6654a68](https://github.com/ecomplus/application-starter/commit/6654a68bbc4882ab74211ea0702ff9b1699c9332))


### Bug Fixes

* **deps:** update all non-major dependencies ([#14](https://github.com/ecomplus/application-starter/issues/14)) ([f96836c](https://github.com/ecomplus/application-starter/commit/f96836ca0cbf119ef4edbbbd49d81397bf24a8df))
* **list-payments:** fix checking enabled payment methods ([e6dadd1](https://github.com/ecomplus/application-starter/commit/e6dadd1ab26b42205d9c0d7dde0dfaa2f08385f1))
* **list-payments:** fix credit card checkout icon url ([cb2cad5](https://github.com/ecomplus/application-starter/commit/cb2cad5e40a043d0594ec009753e93fd34727718))

## [1.3.0](https://github.com/ecomplus/application-starter/compare/v1.2.0...v1.3.0) (2020-07-31)


### Features

* **list-payments:** optional configured installments list ([6f129aa](https://github.com/ecomplus/application-starter/commit/6f129aa9050b01b8e35c4ad88eed0218a7bb3d92))

## [1.2.0](https://github.com/ecomplus/application-starter/compare/v1.1.8...v1.2.0) (2020-07-30)


### Features

* **create-transaction:** add description to mp payment with order number ([c6000dd](https://github.com/ecomplus/application-starter/commit/c6000ddba36684a70c3cb135cbe335b28b3f5ba8))

### [1.1.8](https://github.com/ecomplus/application-starter/compare/v1.1.7...v1.1.8) (2020-06-03)


### Bug Fixes

* **deps:** update @ecomplus/application-sdk to firestore version ([e859697](https://github.com/ecomplus/application-starter/commit/e859697ae596ba9890b998ba7041cdf82b7514c8))
* **deps:** update all non-major dependencies ([#4](https://github.com/ecomplus/application-starter/issues/4)) ([43a638b](https://github.com/ecomplus/application-starter/commit/43a638b73905f1a45a41307d7de4444ad555f713))
* **refresh-tokens:** force appSdk update tokens task ([f8e2f7d](https://github.com/ecomplus/application-starter/commit/f8e2f7d3fa0e27c33ee01aed8665e031b045d994))

### [1.1.7](https://github.com/ecomplus/application-starter/compare/v1.1.6...v1.1.7) (2020-04-27)


### Bug Fixes

* **deps:** update @ecomplus/application-sdk to v1.11.13 ([ffde073](https://github.com/ecomplus/application-starter/commit/ffde073dea44533e61afa969cf41faabab849dab))
* **setup:** ensure enable token updates by default ([42a09e1](https://github.com/ecomplus/application-starter/commit/42a09e1094554105386b98e466972a763c97eae7))

### [1.1.6](https://github.com/ecomplus/application-starter/compare/v1.1.5...v1.1.6) (2020-04-27)


### Bug Fixes

* **setup:** do not disable updates on refresh-tokens route ([fe2c27e](https://github.com/ecomplus/application-starter/commit/fe2c27e27179362dce52134fe94047aa5c60ca80))

### [1.1.5](https://github.com/ecomplus/application-starter/compare/v1.1.4...v1.1.5) (2020-04-21)


### Bug Fixes

* **auth-scope:** remove (comment) not needed resources/methods ([ee10d45](https://github.com/ecomplus/application-starter/commit/ee10d45e824024bc8e43d11a015145d02a03036e))
* **deps:** update @ecomplus/application-sdk to v1.11.10 ([11d0c6f](https://github.com/ecomplus/application-starter/commit/11d0c6f9cacbb702bd79759c8614e765bed77028))

### [1.1.4](https://github.com/ecomplus/application-starter/compare/v1.1.3...v1.1.4) (2020-04-21)


### Bug Fixes

* **create-transactions:** add retry for firestore internal error ([185de82](https://github.com/ecomplus/application-starter/commit/185de82d73f4f9d71c164ec1ed815787d046cce2))
* **firestore:** ensure payment id is saved as string ([a314c3c](https://github.com/ecomplus/application-starter/commit/a314c3c89181a4324f996643829582a0827ae836))
* **firestore:** save payment id as is (revert) ([ab4acc7](https://github.com/ecomplus/application-starter/commit/ab4acc7cf08243c73983ef434a9a428e00491156))
* **firestore:** using coll.add to try fix 'The query requires an index' ([2b650e8](https://github.com/ecomplus/application-starter/commit/2b650e8274256c95c8e8e131c291bcbbe4dd4623))
* **notification:** retry with delay when payment not found ([17f3629](https://github.com/ecomplus/application-starter/commit/17f3629ff7242fdecbf9cb7a3fc56803c3afa5e1))
* **notification:** try to fix founding payment document (id string) ([143060d](https://github.com/ecomplus/application-starter/commit/143060df5c1ff536c62dae267b6c303c50e3c4e3))
* **notifications:** parseInt transaction_code before execute query ([0ce1ed2](https://github.com/ecomplus/application-starter/commit/0ce1ed2277ac50366326c55aa7321b85539971ea))
* **notifications:** remove retry, hardset 10s timeout ([9131157](https://github.com/ecomplus/application-starter/commit/9131157e5d86b717bb41044f99241d5ea2ebf7a2))
* **notifications:** work with mp webhooks retry, returns 503 on error ([2b38365](https://github.com/ecomplus/application-starter/commit/2b383651588062da022c771361836505c4e03206))

### [1.1.3](https://github.com/ecomplus/application-starter/compare/v1.1.2...v1.1.3) (2020-04-21)


### Bug Fixes

* **create-transaction:** fix setting shipments on payment body ([9671ac5](https://github.com/ecomplus/application-starter/commit/9671ac55f04205285c6749edc0f453e81edb98d6))
* **create-transaction:** try variation id before product id ([c18f6ad](https://github.com/ecomplus/application-starter/commit/c18f6ad1eadaf7a6d35155cf9471025e6267f7c8))

### [1.1.2](https://github.com/ecomplus/application-starter/compare/v1.1.1...v1.1.2) (2020-04-21)


### Bug Fixes

* **create-transaction:** general improves for payment body and debugs ([50e3b2a](https://github.com/ecomplus/application-starter/commit/50e3b2a4c75e7b16e311ee7ad1d67a2f6ae7a855))
* **list-payments:** returns 409 when credentials are unset (config) ([b2a7fef](https://github.com/ecomplus/application-starter/commit/b2a7fef3c4c372d5446347951d1093e53abc365e))

### [1.1.1](https://github.com/ecomplus/application-starter/compare/v1.1.0...v1.1.1) (2020-04-20)


### Bug Fixes

* **list-payments:** fix setting 'payment_gateways' on response body ([ed8aa5a](https://github.com/ecomplus/application-starter/commit/ed8aa5a3a2e108f586b4c89483bf9f779d1f3710))

## [1.1.0](https://github.com/ecomplus/application-starter/compare/v1.0.2...v1.1.0) (2020-04-20)


### Features

* **list-payments:** add default payment gateway icon ([f502b9b](https://github.com/ecomplus/application-starter/commit/f502b9b2869d3dd1cb729e575192b28a28dbefc9))

### [1.0.2](https://github.com/ecomplus/application-starter/compare/v1.0.1...v1.0.2) (2020-04-20)


### Bug Fixes

* **admin-settings:** add installments interest field, remove cc disable ([1433419](https://github.com/ecomplus/application-starter/commit/14334195f2474a661edd7957941cb27cf45374da))
* **list-payments:** fix reading onload expression minified file ([8de5799](https://github.com/ecomplus/application-starter/commit/8de57995b4daf14ccb730adcc9e5882d92585e4d))

### [1.0.1](https://github.com/ecomplus/application-starter/compare/v1.0.0...v1.0.1) (2020-04-20)


### Bug Fixes

* __env path ([f506dfd](https://github.com/ecomplus/application-starter/commit/f506dfd38e98946b5e5f8fa6d6200de88c34dd51))

## 1.0.0 (2020-04-20)


### Features

* **create-transaction:** handle transaction and create new payment ([ad09805](https://github.com/ecomplus/application-starter/commit/ad0980509edde29142a8b49ac7d36daeddb01baa))
* **list-payments:** response with available payment methods ([89d3865](https://github.com/ecomplus/application-starter/commit/89d3865e0cb78017c6d843a53153253ae0a09d65))
* **notifications:** handle mercado pago payments notifications ([a1dcdcc](https://github.com/ecomplus/application-starter/commit/a1dcdcc5d5a2938dce419aabb629e0893170729f))

## [1.0.0-starter.7](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.6...v1.0.0-starter.7) (2020-04-07)

## [1.0.0-starter.6](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.5...v1.0.0-starter.6) (2020-04-06)


### Bug Fixes

* **deps:** update all non-major dependencies ([#10](https://github.com/ecomplus/application-starter/issues/10)) ([b3c65e5](https://github.com/ecomplus/application-starter/commit/b3c65e5c7eb89a4825eb47c852ce65293d172314))
* **deps:** update all non-major dependencies ([#13](https://github.com/ecomplus/application-starter/issues/13)) ([33ff19b](https://github.com/ecomplus/application-starter/commit/33ff19bbdad1f34b6d1c255089dc0a0e4092b955))
* **deps:** update all non-major dependencies ([#8](https://github.com/ecomplus/application-starter/issues/8)) ([feba5b9](https://github.com/ecomplus/application-starter/commit/feba5b9cdc54e8304beff2b12658a6343ef37569))
* **deps:** update dependency firebase-functions to ^3.6.0 ([#15](https://github.com/ecomplus/application-starter/issues/15)) ([5f7f0a2](https://github.com/ecomplus/application-starter/commit/5f7f0a2bf5c744000996e2a0b78690b363462ee7))
* **deps:** update dependency firebase-tools to ^7.16.1 ([#14](https://github.com/ecomplus/application-starter/issues/14)) ([b8e4798](https://github.com/ecomplus/application-starter/commit/b8e479851bd02bf5929a7df8a71a761f1c1c1654))
* **deps:** update dependency firebase-tools to v8 ([#16](https://github.com/ecomplus/application-starter/issues/16)) ([b72560e](https://github.com/ecomplus/application-starter/commit/b72560e4fc86496499d553e47094ace25436272b))
* **ecom-modules:** fix parsing mod names to filenames and vice versa ([99c185a](https://github.com/ecomplus/application-starter/commit/99c185afebeae77deb61537ed9de1c77132c16ce))

## [1.0.0-starter.5](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.4...v1.0.0-starter.5) (2020-03-05)


### Features

* **market-publication:** handle full featured app publication to Market ([28379dc](https://github.com/ecomplus/application-starter/commit/28379dc3c4784e757c8f25e5d737f6143682b0db))
* **static:** handle static with server app files from public folder ([827d000](https://github.com/ecomplus/application-starter/commit/827d00079b0dc169b2eef31b8e0ac73c596307a8))

## [1.0.0-starter.4](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.3...v1.0.0-starter.4) (2020-02-21)


### Features

* **calculate-shipping:** basic setup for calculate shipping module ([db77595](https://github.com/ecomplus/application-starter/commit/db7759514bb25d151dd4508fb96b84c52b3e94ba))


### Bug Fixes

* **home:** fix replace accets regex exps to generate slug from title ([198cc0b](https://github.com/ecomplus/application-starter/commit/198cc0b911d4874d96f3cd5254d30cab5fe89765))
* **home:** gen slug from pkg name or app title if not set or default ([25c20bf](https://github.com/ecomplus/application-starter/commit/25c20bfade65a86e4f4b1026ef59a5694a022a74))

## [1.0.0-starter.3](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.2...v1.0.0-starter.3) (2020-02-21)

## [1.0.0-starter.2](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.1...v1.0.0-starter.2) (2020-02-21)


### Bug Fixes

* **config:** stop reading app from functions config ([7b9aab7](https://github.com/ecomplus/application-starter/commit/7b9aab727fefe8a5b84695e90a0d68e02b8c3f62))

## [1.0.0-starter.1](https://github.com/ecomplus/application-starter/compare/v1.0.0-starter.0...v1.0.0-starter.1) (2020-02-20)


### Features

* **get-auth:** endpoint to return auth id and token for external usage ([40a8ae2](https://github.com/ecomplus/application-starter/commit/40a8ae2e895d6e32c7032ca500040ec82c80dc5d))
* **server:** also supporting passing Store Id from query ([111f3a7](https://github.com/ecomplus/application-starter/commit/111f3a716fbfd2e155e3fb24242bddcae7cb065c))


### Bug Fixes

* **server:** remove 'routes' path when setting filename for routes ([119524c](https://github.com/ecomplus/application-starter/commit/119524c523a11364ed912769637a6f8e479af5f1))

## [1.0.0-starter.0](https://github.com/ecomplus/application-starter/compare/v0.1.1...v1.0.0-starter.0) (2020-02-18)


### Features

* **router:** recursive read routes dir to auto setup server routes ([ff2b456](https://github.com/ecomplus/application-starter/commit/ff2b45604723a8146c9481ea36a9400da5ccc2bc))


### Bug Fixes

* **home:** fix semver on for app.version (remove version tag if any) ([ad36461](https://github.com/ecomplus/application-starter/commit/ad364614a7f5599850ad39e00a94d310742e8f80))
* **middlewares:** update route files exports (named exports by methods) ([6a22e67](https://github.com/ecomplus/application-starter/commit/6a22e67135bc6110e6da6b4ab25f67ad8d77f597))

### [0.1.1](https://github.com/ecomplus/application-starter/compare/v0.1.0...v0.1.1) (2020-02-18)


### Features

* **env:** get 'pkg' from functions config ([bf45ec3](https://github.com/ecomplus/application-starter/commit/bf45ec33a2147d5be91fdc4955bd6cfa1b0867e2))
* **home:** set version and slug from root package, fix with uris ([d4b61fa](https://github.com/ecomplus/application-starter/commit/d4b61fab427aefdb2ac485d90eb1abe15d6aafc6))


### Bug Fixes

* **env:** firebase doesnt uppercase config ([502185e](https://github.com/ecomplus/application-starter/commit/502185ed30f346d8db77b849d6ba0eb48cb777cb))
* **require:** update @ecomplus/application-sdk dependency name ([d4174ac](https://github.com/ecomplus/application-starter/commit/d4174ac5425b85590db0e92d4b1d69a8567a6c55))

## [0.1.0](https://github.com/ecomplus/application-starter/compare/v0.0.4...v0.1.0) (2020-02-17)

### [0.0.4](https://github.com/ecomclub/firebase-app-boilerplate/compare/v0.0.3...v0.0.4) (2020-02-16)


### Bug Fixes

* **server:** update routes names (refresh-tokens) ([79a2910](https://github.com/ecomclub/firebase-app-boilerplate/commit/79a2910817cf4193b40e02b2b1e6b920e7fefb2d))

### [0.0.3](https://github.com/ecomclub/express-app-boilerplate/compare/v0.0.2...v0.0.3) (2020-02-15)


### Features

* **server:** start reading env options, handle operator token ([ce107b7](https://github.com/ecomclub/express-app-boilerplate/commit/ce107b74cde375e875a85cc3ba0cc6a73740785d))
* **update-tokens:** adding route to start update tokens service (no content) ([20c62ec](https://github.com/ecomclub/express-app-boilerplate/commit/20c62ec6800fc326b89e8cf54b2916f56e5910e4))


### Bug Fixes

* **auth-callback:** fix handling docRef (desn't need to get by id again) ([629ca5a](https://github.com/ecomclub/express-app-boilerplate/commit/629ca5ab9849e3822cc190f423da5bf2e0c4daab))
* **auth-callback:** save procedures if not new, check and set 'settep_up' ([#3](https://github.com/ecomclub/express-app-boilerplate/issues/3)) ([4a01f86](https://github.com/ecomclub/express-app-boilerplate/commit/4a01f86c37e09cd7c0363f6fbc80de6eeef3ba20))
* **ECOM_AUTH_UPDATE_INTERVAL:** disable set interval (no daemons on cloud functions) ([2aa2442](https://github.com/ecomclub/express-app-boilerplate/commit/2aa2442061f0308be9eb9430552fa04ad148788c))
* **env:** fixed to get appInfor variable ([e9b1a3c](https://github.com/ecomclub/express-app-boilerplate/commit/e9b1a3ce0d17ee74a5eada70589340fd5a70e786))
* **env:** fixed to get appInfor variable ([22687e2](https://github.com/ecomclub/express-app-boilerplate/commit/22687e25f611d49f8c01494af114e0289cec251e))
* **middleware:** check standard http headers for client ip ([5045113](https://github.com/ecomclub/express-app-boilerplate/commit/504511329afe9277d540f0f542a316d04634ce9e))

### 0.0.2 (2020-02-11)


### Bug Fixes

* **lib:** remove unecessary/incorrect requires with new deps ([69f2b77](https://github.com/ecomclub/express-app-boilerplate/commit/69f2b77))
* **routes:** fix handling appSdk (param) ([0cf2dde](https://github.com/ecomclub/express-app-boilerplate/commit/0cf2dde))
* **setup:** added initializeApp() to firebase admin ([e941e59](https://github.com/ecomclub/express-app-boilerplate/commit/e941e59))
* **setup:** manually setup ecomplus-app-sdk with firestore ([64e49f8](https://github.com/ecomclub/express-app-boilerplate/commit/64e49f8))
* **setup:** manually setup ecomplus-app-sdk with firestore ([c718bd0](https://github.com/ecomclub/express-app-boilerplate/commit/c718bd0))
* **setup:** manually setup ecomplus-app-sdk with firestore ([33909bf](https://github.com/ecomclub/express-app-boilerplate/commit/33909bf)), closes [/github.com/ecomclub/ecomplus-app-sdk/blob/master/main.js#L45](https://github.com/ecomclub//github.com/ecomclub/ecomplus-app-sdk/blob/master/main.js/issues/L45)
* **startup:** setup routes after appSdk ready, add home route ([d182555](https://github.com/ecomclub/express-app-boilerplate/commit/d182555))


### Features

* **firestore-app-boilerplate:** Initial commit ([c9963f0](https://github.com/ecomclub/express-app-boilerplate/commit/c9963f0))
* **firestore-app-boilerplate:** Initial commit ([be493ea](https://github.com/ecomclub/express-app-boilerplate/commit/be493ea))
* **firestore-support:** minor changes ([3718cba](https://github.com/ecomclub/express-app-boilerplate/commit/3718cba))
* **firestore-support:** refactoring to  use saveProcedures function ([62971ef](https://github.com/ecomclub/express-app-boilerplate/commit/62971ef))
* **firestore-support:** removed sqlite error clausule ([2d47996](https://github.com/ecomclub/express-app-boilerplate/commit/2d47996))
* **routes:** add home route (app json) ([42a3f2b](https://github.com/ecomclub/express-app-boilerplate/commit/42a3f2b))

# [LEGACY] Express App Boilerplate

### [0.1.1](https://github.com/ecomclub/express-app-boilerplate/compare/v0.1.0...v0.1.1) (2019-07-31)


### Bug Fixes

* **procedures:** fix checking for procedures array to run configureSetup ([1371cdc](https://github.com/ecomclub/express-app-boilerplate/commit/1371cdc))

## [0.1.0](https://github.com/ecomclub/express-app-boilerplate/compare/v0.0.2...v0.1.0) (2019-07-31)

### 0.0.2 (2019-07-31)


### Bug Fixes

* chain promise catch on lib getConfig ([281abf9](https://github.com/ecomclub/express-app-boilerplate/commit/281abf9))
* fix mergin hidden data to config ([8b64d58](https://github.com/ecomclub/express-app-boilerplate/commit/8b64d58))
* fix path to require 'get-config' from lib ([11425b0](https://github.com/ecomclub/express-app-boilerplate/commit/11425b0))
* get storeId from header and set on req object ([a3bebaa](https://github.com/ecomclub/express-app-boilerplate/commit/a3bebaa))
* handle error on get config instead of directly debug ([f182589](https://github.com/ecomclub/express-app-boilerplate/commit/f182589))
* routes common fixes ([2758a57](https://github.com/ecomclub/express-app-boilerplate/commit/2758a57))
* using req.url (from http module) instead of req.baseUrl ([d9057ca](https://github.com/ecomclub/express-app-boilerplate/commit/d9057ca))


### Features

* authentication callback ([8f18892](https://github.com/ecomclub/express-app-boilerplate/commit/8f18892))
* conventional store api error handling ([bcde87e](https://github.com/ecomclub/express-app-boilerplate/commit/bcde87e))
* function to get app config from data and hidden data ([ba470f5](https://github.com/ecomclub/express-app-boilerplate/commit/ba470f5))
* getting store id from web.js ([72f18c6](https://github.com/ecomclub/express-app-boilerplate/commit/72f18c6))
* handling E-Com Plus webhooks ([63ba19f](https://github.com/ecomclub/express-app-boilerplate/commit/63ba19f))
* main js file including bin web and local ([6b8a71a](https://github.com/ecomclub/express-app-boilerplate/commit/6b8a71a))
* pre-validate body for ecom modules endpoints ([f06bdb0](https://github.com/ecomclub/express-app-boilerplate/commit/f06bdb0))
* setup app package dependencies and main.js ([b2826ed](https://github.com/ecomclub/express-app-boilerplate/commit/b2826ed))
* setup base app.json ([015599a](https://github.com/ecomclub/express-app-boilerplate/commit/015599a))
* setup daemon processes, configure store setup ([db3ca8c](https://github.com/ecomclub/express-app-boilerplate/commit/db3ca8c))
* setup procedures object ([c5e8627](https://github.com/ecomclub/express-app-boilerplate/commit/c5e8627))
* setup web app with express ([d128430](https://github.com/ecomclub/express-app-boilerplate/commit/d128430))
