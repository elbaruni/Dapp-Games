export default {
  setUser(state, payload) {
    state.user = payload.user;
  },
  SetFlappyBirdScore(state, payload) {
    state.flappyBird.score = payload;
  }
};
