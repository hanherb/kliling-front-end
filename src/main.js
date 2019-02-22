import Vue from 'vue';
import SuiVue from 'semantic-ui-vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import VueSession from 'vue-session';
import VueLayers from 'vuelayers';

import App from './App.vue';
import router from './router';
import store from './store';
import graphqlFetchAll from './graphqlFunction';
import './registerServiceWorker';

import 'semantic-ui-css/semantic.min.css';

Vue.config.productionTip = false;
Vue.use(SuiVue);
Vue.use(VueAxios, axios);
Vue.use(VueSession);
Vue.use(VueLayers, {
  dataProjection: 'EPSG:4326',
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
