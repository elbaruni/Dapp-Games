export default {
  setUser(state, payload) {
    state.user = payload.user;
  },
  SetFlappyBirdScore(state, payload) {
    console.log("here we are ...", payload);
    state.flappyBird.score = payload;
  }
};
