import axios from 'axios';

export default {
  state: {
    info: null,
    initialized: false,
  },
  mutations: {
    set_sys_info(state, info) {
      state.info = info;
    },
    set_initialized(state, v) {
      state.initialized = v;
    },
  },
  getters: {
    sysVersion(state) {
      if (state.info === null) {
        return '-';
      }
      return state.info.version;
    },
    sysInitialized(state) {
      return state.initialized;
    },
    projectName(state) {
      if (state.info === null) {
        return '-';
      }
      return state.info.project.info.name;
    },
    projectSchema(state) {
      if (state.info === null) {
        return '-';
      }
      return state.info.project.info.schema;
    },
  },
  actions: {
    get_sys_info({ commit }) {
      return new Promise((resolve, reject) => {
        axios({ url: '/api/private/info', method: 'GET' })
          .then((resp) => {
            const info = resp.data;
            commit('set_sys_info', info);
            commit('rebuild_alarms', info.project.alarms);
            commit('set_initialized', true);
            resolve(resp);
          })
          .catch(() => {
            reject();
          });
      });
    },
  },
};
