import Vue from 'vue'
import { FontAwesomeIcon, FontAwesomeLayers } from '@fortawesome/vue-fontawesome'

import App from './App.vue'
import store from './store/index.js';

Vue.config.productionTip = false

Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('font-awesome-layers', FontAwesomeLayers);

new Vue({
  render: h => h(App),
  store: store,
}).$mount('#app')
