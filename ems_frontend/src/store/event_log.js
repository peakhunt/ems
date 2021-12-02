import axios from 'axios';

export default {
  state: {
  },
  mutations: {
  },
  getters: {
  },
  actions: {
    get_event_logs(_, params) {
      return new Promise((resolve, reject) => {
        axios({ url: '/api/private/event_logs', method: 'GET', params })
          .then((resp) => {
            resolve(resp.data);
          })
          .catch(() => {
            reject();
          });
      });
    },
  },
};
