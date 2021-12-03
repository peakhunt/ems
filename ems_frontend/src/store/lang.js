export default {
  state: {
    languagesSupported: [
      { name: 'English', lang: 'en' },
      { name: '한국어', lang: 'ko' },
    ],
  },
  getters: {
    languagesSupported: (state) => state.languagesSupported,
  },
};
