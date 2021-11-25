import Vue from 'vue';
import Axios from 'axios';
import VuetifySnackbarQueue from 'vuetify-snackbar-queue';
import VueChartist from 'vue-chartist';
import 'chartist/dist/chartist.min.css';
import store from './store';
//
// i18n must be initialized after vuex so that it can
// extract locale properly
//
import i18n from './i18n';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';

require('typeface-roboto');

Vue.prototype.$http = Axios;

//
// token is automatically reloaded by vuex using vuex-persistedstate
// reload token if stored in session storage.
//
const token = store.getters.token;
if (token !== '') {
  Vue.prototype.$http.defaults.headers.common.Authorization = token;
}

Vue.config.productionTip = false;

Vue.use(VueChartist);
Vue.use(VuetifySnackbarQueue);

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
