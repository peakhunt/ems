import axios from 'axios';
import lodash from 'lodash';
import i18n from '../i18n';
import ErrorCodes from '../ErrorCodes';

export default {
  state: {
    status: '',
    errorMsg: '',
    token: '',
    user: {},
  },
  mutations: {
    auth_request(state) {
      state.status = 'loading';
      state.errorMsg = '';
    },
    auth_success(state, { token, user }) {
      state.status = 'success';
      state.errorMsg = '';
      state.token = token;
      state.user = user;
    },
    auth_error(state, msg) {
      state.status = 'error';
      state.errorMsg = msg;
    },
    clear_auth_err_msg(state) {
      state.errorMsg = '';
    },
    logout(state) {
      state.status = '';
      state.token = '';
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.token,
    token: (state) => state.token,
    authStatus: (state) => state.status,
    authUser: (state) => state.user,
    authErr: (state) => state.errorMsg,
    userName: (state) => state.user.username,
    userCaps: (state) => state.user.capabilities,
    caps: (state) => {
      return (flag) => {
        const u32 = new Uint32Array(1);
        u32[0] = (state.user.capabilities >>> 0);

        return (u32[0] & flag) !== 0;
      };
    },
    isAdmin: (state) => state.user.isAdmin,
  },
  actions: {
    login({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit('auth_request');
        axios({ url: '/api/public/login', data: user, method: 'POST' })
          .then((resp) => {
            const { token, info } = resp.data;

            axios.defaults.headers.common.Authorization = token;
            commit('auth_success', { token, user: info });

            resolve(resp);
          })
          .catch((err) => {
            let errorCode = ErrorCodes.ErrorNetwork;

            if (lodash.has(err, 'response.data.errorCode')) {
              errorCode = err.response.data.errorCode;
            }
            const msg = i18n.t(`errors[${errorCode}]`);

            commit('auth_error', msg);
            reject(err);
          });
      });
    },
    logout({ commit, dispatch }) {
      return new Promise((resolve, reject) => {
        axios({ url: '/api/private/logout', method: 'POST' })
          .then(() => {
            dispatch('cleanupUI');
            commit('logout');
            sessionStorage.clear();
            delete axios.defaults.headers.common.Authorization;
            resolve();
          })
          .catch(() => {
            dispatch('cleanupUI');
            commit('logout');
            sessionStorage.clear();
            delete axios.defaults.headers.common.Authorization;
            reject();
          });
      });
    },
    logout_force({ commit, dispatch }) {
      dispatch('cleanupUI');
      commit('logout');
      sessionStorage.clear();
      delete axios.defaults.headers.common.Authorization;
    },
    get_all_users() {
      return new Promise((resolve, reject) => {
        axios({ url: '/api/private/get_all_users', method: 'GET' })
          .then((resp) => {
            const users = resp.data.map((u) => {
              const w = { ...u };

              w.admin = w.admin === 1;
              w.capabilities >>>= 0;
              return w;
            });
            resolve(users);
          })
          .catch(() => {
            reject();
          });
      });
    },
    delete_user(_, { username }) {
      return new Promise((resolve, reject) => {
        axios({ url: '/api/private/del_user', data: { username }, method: 'POST' })
          .then(() => {
            resolve();
          })
          .catch((err) => {
            reject(err.response.data.errorCode);
          });
      });
    },
    update_capabilities(_, { username, capabilities }) {
      return new Promise((resolve, reject) => {
        axios({ url: '/api/private/update_capabilities_for', data: { username, capabilities }, method: 'POST' })
          .then(() => {
            resolve();
          })
          .catch((err) => {
            reject(err.response.data.errorCode);
          });
      });
    },
    update_password_for(_, { username, password }) {
      return new Promise((resolve, reject) => {
        axios({ url: '/api/private/update_password_for', data: { username, password }, method: 'POST' })
          .then(() => {
            resolve();
          })
          .catch((err) => {
            reject(err.response.data.errorCode);
          });
      });
    },
    update_password(_, { username, orgPassword, newPassword }) {
      return new Promise((resolve, reject) => {
        axios({ url: '/api/private/update_password', data: { username, orgPassword, newPassword }, method: 'POST' })
          .then(() => {
            resolve();
          })
          .catch((err) => {
            reject(err.response.data.errorCode);
          });
      });
    },
    add_new_user(_, { username, password, capabilities }) {
      return new Promise((resolve, reject) => {
        axios({ url: '/api/private/add_new_user', data: { username, password, capabilities }, method: 'POST' })
          .then(() => {
            resolve();
          })
          .catch((err) => {
            reject(err.response.data.errorCode);
          });
      });
    },
  },
};
