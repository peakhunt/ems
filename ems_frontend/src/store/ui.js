//
// a set of global UI elements
//

const MAX_SNACKBAR_ITEMS = 30;
function uniqueId(prefix) {
  return `${prefix}_ + ${Math.random().toString(36).substr(2, 9)}`;
}

export default {
  state: {
    confirmBottomSheet: {
      show: false,
      msg: '',
      callback: null,
      cbArg: null,
    },
    progressOverlay: {
      show: false,
      msg: '',
    },
    snackbarQueue: {
      items: [],
    },
  },
  mutations: {
    show_confirm_bottom_sheet(state, arg) {
      state.confirmBottomSheet.msg = arg.msg;
      state.confirmBottomSheet.callback = arg.callback;
      state.confirmBottomSheet.cbArg = arg.cbArg;
      state.confirmBottomSheet.show = true;
    },
    hide_confirm_bottom_sheet(state) {
      state.confirmBottomSheet.show = false;
    },
    show_progress_overlay(state, msg) {
      state.progressOverlay.msg = msg;
      state.progressOverlay.show = true;
    },
    hide_progress_overlay(state) {
      state.progressOverlay.show = false;
    },
    add_snackbar_item(state, item) {
      if (state.snackbarQueue.items.length > MAX_SNACKBAR_ITEMS) {
        state.snackbarQueue.items.shift();
      }
      state.snackbarQueue.items.push(item);
    },
    remove_snackbar_item(state, id) {
      const index = state.snackbarQueue.items.findIndex((item) => item.id === id);

      if (index !== -1) {
        state.snackbarQueue.items.splice(index, 1);
      }
    },
    clear_snackbar(state) {
      state.snackbarQueue.items.splice(0);
    },
  },
  getters: {
    confirm_bottom_sheet_callback: (state) => state.confirmBottomSheet.callback,
    confirm_bottom_sheet_cb_arg: (state) => state.confirmBottomSheet.cb_arg,
    confirm_bottom_sheet_msg: (state) => state.confirmBottomSheet.msg,
    confirm_bottom_sheet_visible: (state) => state.confirmBottomSheet.show,
    progress_overlay_visible: (state) => state.progressOverlay.show,
    progress_overlay_msg: (state) => state.progressOverlay.msg,
    snackbar_queue_items: (state) => state.snackbarQueue.items,
  },
  actions: {
    showConfirmBottomSheet({ commit }, arg) {
      commit('show_confirm_bottom_sheet', arg);
    },
    closeConfirmBottomSheet({ commit }) {
      commit('hide_confirm_bottom_sheet');
    },
    showProgress({ commit }, msg) {
      commit('show_progress_overlay', msg);
    },
    closeProgress({ commit }) {
      commit('hide_progress_overlay');
    },
    addToSnackbar({ commit }, { color, message }) {
      commit('add_snackbar_item', {
        id: uniqueId('snackbar-'),
        color,
        message,
      });
    },
    removeFromSnackbar({ commit }, id) {
      commit('remove_snackbar_item', id);
    },
    clearSnackbar({ commit }) {
      commit('clear_snackbar');
    },
    cleanupUI({ commit }) {
      commit('clear_snackbar');
    },
  },
};
