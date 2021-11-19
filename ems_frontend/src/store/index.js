import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
// import SecureLS from 'secure-ls';
import User from './user';
import Ui from './ui';

// const ls = new SecureLS({ isCompression: false });

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    User,
    Ui,
  },
  plugins: [
    createPersistedState({
      paths: [
        'User',
      ],
      storage: window.sessionStorage,
      /*
      storage: {
        getItem: (key) => ls.get(key),
        setItem: (key, value) => ls.set(key, value),
        removeItem: (key) => ls.remove(key),
      },
      */
    }),
  ],
  strict: true,
});
