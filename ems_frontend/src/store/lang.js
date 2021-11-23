export default {
  state: {
    languagesSupported: [
      { name: 'English', lang: 'en' },
      { name: '한국어', lang: 'kr' },
    ],
  },
  getters: {
    languagesSupported: (state) => state.languagesSupported,
  },
};
