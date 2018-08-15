import Vue from 'vue'
import { FontAwesomeIcon, FontAwesomeLayers } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { faComment } from '@fortawesome/free-regular-svg-icons';

import App from './App.vue'
import store from './store/index.js';
import Tooltip from './components/Tooltip.vue';

Vue.config.productionTip = false

library.add(faLink, faComment);

Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('font-awesome-layers', FontAwesomeLayers);
Vue.component('tooltip', Tooltip);

new Vue({
  render: h => h(App),
  store: store,
}).$mount('#app')
