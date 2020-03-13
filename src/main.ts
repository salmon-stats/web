import Vue from 'vue';
import dayjs from 'dayjs';
import dayjsPluginUTC from 'dayjs/plugin/utc';
import Buefy from 'buefy';
import App from './App.vue';
import router from './router';
import store from './store/store';
import { metadataModule } from './store/modules/metadata';
import { idKeyMapModule } from './store/modules/id-key-map';
import { i18n, loadLanguageAsync } from './i18n-setup';

Vue.use(Buefy);

idKeyMapModule.fetchIdKeyMap();

Vue.config.productionTip = false;

const browserLang = navigator.language.slice(0, 2);
loadLanguageAsync(browserLang, true);

dayjs.extend(dayjsPluginUTC);

(async () => {
  await metadataModule.fetchMetadata().catch(() => console.error('Failed to fetch metadata.'));

  new Vue({
    i18n,
    router,
    store,
    render: (h) => h(App),
  }).$mount('#app');
})();
