import Vue from 'vue';
import VueI18n from 'vue-i18n';
import Lang from './lang';

Vue.use(VueI18n);

const l = JSON.parse(localStorage.getItem('vuex'));
const s = l ? l.Settings.lang : 'en';

const i18n = new VueI18n({
  //
  // this is a dirty hack but it looks like this is the only
  // way to prevent cyclic dependency.
  // vuex already initialized session storage no matter what!
  //
  locale: s,
  messages: Lang,
});

export default i18n;
