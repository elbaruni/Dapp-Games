export default {
  setUser(state, payload) {
    state.user = payload.user;
  },
  SetFlappyBirdScore(state, payload) {
    state.flappyBird.score = payload;
  },
  SetChessPlayer(state, payload) {
    state.chess.score = payload;
  },
  setOppent(state, payload) {
    let givenName;
    let avatar = "https://s3.amazonaws.com/onename/avatar-placeholder.png";
    givenName = payload.profile.name()
      ? payload.profile.name()
      : "Nameless Person";
    if (payload.profile.avatarUrl()) avatar = payload.profile.avatarUrl();
    state.chessOppene = {
      Blockstack_id: payload.Blockstack_id,
      givenName,
      avatar,
      Elo: payload.Elo
    };
  }
};
