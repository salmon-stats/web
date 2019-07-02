import Vue from 'vue';
import dayjs from 'dayjs';
import dayjsPluginUTC from 'dayjs/plugin/utc';
import App from './App.vue';
import router from './router';
import store from './store/store';
import { metadataModule } from './store/modules/metadata';
import { idKeyMapModule } from './store/modules/id-key-map';
import { i18n, loadLanguageAsync } from './i18n-setup';

metadataModule.fetchMetadata();
idKeyMapModule.fetchIdKeyMap();

Vue.config.productionTip = false;

const browserLang = navigator.language.slice(0, 2);
loadLanguageAsync(browserLang, true);

dayjs.extend(dayjsPluginUTC);

new Vue({
  i18n,
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
