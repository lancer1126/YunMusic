export default {
  enableScrolling(state, status = null) {
    state.enableScrolling = status ? status : state.enableScrolling;
  },
};
