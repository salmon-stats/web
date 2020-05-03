// This code is based on @kazupon's vue-i18n sample code (Released under the MIT License)
// https://kazupon.github.io/vue-i18n/guide/lazy-loading.html

import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

// First language will be used as default language.
const supportedLanguages = ['en', 'ja'];
const defaultLanguage = supportedLanguages[0];

export const i18n = new VueI18n({
  locale: defaultLanguage,
  fallbackLocale: defaultLanguage,
});

const loadedLanguages: string[] = [];

const setI18nLanguage = (lang: string) => {
  i18n.locale = lang;
  // axios.defaults.headers.common['Accept-Language'] = lang;
  document.querySelector('html')!.setAttribute('lang', lang);
  return lang;
};

export const loadLanguageAsync = (lang: string, forceLoad = false) => {
  lang = supportedLanguages.includes(lang) ? lang : defaultLanguage;

  if (forceLoad || i18n.locale !== lang) {
    if (!loadedLanguages.includes(lang)) {
      return import(
        /* webpackChunkName: 'i18n-[request]' */
        `splatoon2-constants/dist/salmon/locale/${lang}.json`
      ).then((data) => {
        loadedLanguages.push(lang);
        i18n.setLocaleMessage(lang, data);
        return setI18nLanguage(lang);
      });
    }
    return Promise.resolve(setI18nLanguage(lang));
  }
  return Promise.resolve(lang);
};
