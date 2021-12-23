let timer500ms = null;
let count = 0;

export default {
  state: {
    tick500ms: false,
    tick1sec: false,
  },
  mutations: {
    tick_500ms(state) {
      state.tick500ms = !state.tick500ms;
      count += 1;

      if (count === 2) {
        count = 0;
        state.tick1sec = !state.tick1sec;
      }
    },
    reset_ticksrc(state) {
      state.tick500ms = false;
      state.tick1sec = false;
      count = 0;
    },
  },
  getters: {
    tick500ms: (state) => state.tick500ms,
    tick1sec: (state) => state.tick1sec,
  },
  actions: {
    startTickSrc({ commit }) {
      commit('reset_ticksrc');
      timer500ms = setInterval(() => {
        commit('tick_500ms');
      }, 500);
    },
    stopTickSrc() {
      if (timer500ms !== null) {
        clearInterval(timer500ms);
      }
    },
  },
};
