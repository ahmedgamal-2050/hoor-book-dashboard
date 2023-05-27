import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import "./plugins/stoarge"
import "./plugins/axios"
import "./plugins/globalComponents"
import "./plugins/fragment"
import "./plugins/VueCropper"
import "./plugins/vee-validate";

import 'vuetify/dist/vuetify.min.css'
import vuetify from "./plugins/vuetify"

import VueLodash from 'vue-lodash'
import lodash from 'lodash'

// name is optional
Vue.use(VueLodash, { lodash: lodash })

Vue.use(require('vue-moment'));

Vue.config.productionTip = false

new Vue({
  vuetify: vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
