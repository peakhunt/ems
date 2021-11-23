import i18n from '../i18n';

export default {
  state: {
    lang: 'en',
  },
  mutations: {
    set_lang(state, l) {
      state.lang = l;
      i18n.locale = l;
      //
      // XXX
      // another dirty hack.
      // until I find a proper solution...
      //
      window.location.reload();
    },
  },
  getters: {
    lang: (state) => state.lang,
  },
  actions: {
  },
};
