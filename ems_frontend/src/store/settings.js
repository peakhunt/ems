import i18n from '../i18n';

export default {
  state: {
    lang: 'en',
  },
  mutations: {
    set_lang(state, l) {
      state.lang = l;
      i18n.locale = l;
    },
  },
  getters: {
    lang: (state) => state.lang,
  },
  actions: {
  },
};
