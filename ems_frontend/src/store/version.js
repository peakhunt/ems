export default {
  state: {
    packageVersion: process.env.PACKAGE_VERSION || '0',
  },
  getters: {
    appVersion: (state) => state.packageVersion,
  },
};
