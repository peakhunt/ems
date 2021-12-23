import axios from 'axios';

let alarmTimer = null;

export default {
  state: {
    alarmHash: {},
    alarmArray: [],
    stat: {
      totalAlarms: 0,
      totalUnacked: 0,
      bySeverity: {
        minor: {
          total: 0,
          unacked: 0,
        },
        major: {
          total: 0,
          unacked: 0,
        },
        critical: {
          total: 0,
          unacked: 0,
        },
      },
    },
  },
  mutations: {
    rebuild_alarms(state, alarms) {
      console.log('rebuilding alarms');
      const alarmHash = {};
      const alarmArray = [];

      alarms.forEach((alarm) => {
        const aObj = {
          id: alarm.id,
          name: alarm.name,
          time: '-',
          severity: alarm.severity,
          state: 0,
        };

        alarmHash[alarm.id] = aObj;
        alarmArray.push(aObj);
      });

      state.alarmHash = alarmHash;
      state.alarmArray = alarmArray;
    },
    update_alarms(state, alarms) {
      const stat = {
        totalAlarms: 0,
        totalUnacked: 0,
        bySeverity: {
          minor: {
            total: 0,
            unacked: 0,
          },
          major: {
            total: 0,
            unacked: 0,
          },
          critical: {
            total: 0,
            unacked: 0,
          },
        },
      };

      alarms.forEach((stateInfo) => {
        const alarm = state.alarmHash[stateInfo.id];

        if (alarm === undefined) {
          return;
        }

        switch (stateInfo.state) {
          default:
          case 0: // inactive
            break;

          case 1: // active pending
          case 2: // inactive pending
            stat.totalAlarms += 1;
            stat.totalUnacked += 1;
            stat.bySeverity[alarm.severity].total += 1;
            stat.bySeverity[alarm.severity].unacked += 1;
            break;

          case 3: // active
            stat.totalAlarms += 1;
            stat.bySeverity[alarm.severity].total += 1;
            break;
        }

        if (alarm.state === stateInfo.state) {
          return;
        }

        alarm.state = stateInfo.state;
        alarm.time = stateInfo.time;
      });
      Object.assign(state.stat, stat);
    },
    update_alarm(state, info) {
      const alarm = state.alarmHash[info.id];
      alarm.state = info.state;
    },
  },
  getters: {
    alarmHash: (state) => state.alarmHash,
    alarmArray: (state) => state.alarmArray,
    alarmStat: (state) => state.stat,
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
    ackAlarm({ commit }, id) {
      return new Promise((resolve, reject) => {
        axios({ url: '/api/private/alarm_ack', data: { id }, method: 'POST' })
          .then((resp) => {
            commit('update_alarm', resp.data);
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },
    startAlarmPolling({ dispatch }) {
      console.log('startAlarmPolling activated');
      alarmTimer = setInterval(() => {
        dispatch('updateAlarms');
      }, 1000);
    },
    stopAlarmPolling() {
      if (alarmTimer !== null) {
        clearInterval(alarmTimer);
      }
    },
  },
};
