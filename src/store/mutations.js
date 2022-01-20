export default {
  enableScrolling(state, status = null) {
    state.enableScrolling = status ? status : state.enableScrolling;
  },
  toggleLyrics(state) {
    state.showLyrics = !state.showLyrics;
  },
};
