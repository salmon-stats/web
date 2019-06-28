import Vue from 'vue';
import dayjs from 'dayjs';
import dayjsPluginUTC from 'dayjs/plugin/utc';
import App from './App.vue';
import router from './router';
import store from './store/store';
import { metadataModule } from './store/modules/metadata';

metadataModule.fetchMetadata();

Vue.config.productionTip = false;

dayjs.extend(dayjsPluginUTC);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
