import Vue from 'vue';
import pluralize from 'pluralize';
import VueTelInput from 'vue-tel-input';
import moment from 'vue-moment';
import VCurrencyField from 'v-currency-field';
import { VTextField } from 'vuetify/lib'; // Globally import VTextField
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';

Vue.use(VueTelInput);
Vue.use(moment);

Vue.config.productionTip = false;

Vue.filter('pluralize', (value, number) => pluralize(value, number));

Vue.component('v-text-field', VTextField);
Vue.use(VCurrencyField, {
	locale: 'en-US',
	decimalLength: 2,
	autoDecimalMode: true,
	min: null,
	max: null,
	defaultValue: 0,
});

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
  beforeCreate() {
    this.$store.commit('initializeStore');
  },
}).$mount('#app');
