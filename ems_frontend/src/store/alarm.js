import axios from 'axios';

export default {
  state: {
    alarmHash: {},
    alarmArray: [],
  },
  mutations: {
    rebuild_alarms(state, alarms) {
      console.log('rebuilding alarms');
      const alarmHash = {};
      const alarmArray = [];
      let cnt = 0;

      alarms.forEach((alarm) => {
        const aObj = {
          id: alarm.id,
          name: alarm.name,
          time: `2000-01-01 11:11:1${cnt}`,
          severity: alarm.severity,
          state: 2,
        };
        cnt += 1;

        alarmHash[alarm.id] = aObj;
        alarmArray.push(aObj);
      });

      state.alarmHash = alarmHash;
      state.alarmArray = alarmArray;
    },
    update_alarms(state, alarms) {
      alarms.forEach((stateInfo) => {
        const alarm = state.alarmHash[stateInfo.id];

        if (alarm === undefined || alarm.state === stateInfo.state) {
          return;
        }

        alarm.state = stateInfo.state;
        alarm.time = stateInfo.time;
      });
    },
  },
  getters: {
    alarmHash: (state) => state.alarmHash,
    alarmArray: (state) => state.alarmArray,
  },
  actions: {
    updateAlarms({ commit }) {
      return new Promise((resolve, reject) => {
        axios({ url: '/api/private/alarms', method: 'GET' })
          .then((resp) => {
            commit('update_alarms', resp.data);
          })
          .catch(() => {
            reject();
          });
      });
    },
  },
};
