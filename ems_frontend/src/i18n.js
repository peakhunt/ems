import Vue from 'vue';
import VueI18n from 'vue-i18n';
import Lang from './lang';

Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: 'en',
  messages: Lang,
});

export default i18n;
