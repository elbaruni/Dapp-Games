import { userSession } from "../../userSession";
import { Profile, FlappyBird, Chess } from "../../utils/radiks";
import { Person, lookupProfile } from "blockstack";

async function isexistProfile(payload) {
  const notExist = await Profile.fetchList({
    Blockstack_id: payload
  });

  return notExist.length === 0;
}
export default {
  signOut({ commit }) {
    userSession.signUserOut(window.location.href);
  },
  async createProfile({ commit }, payload) {
    if (await isexistProfile(payload.Blockstack_id)) {
      const profile = new Profile({
        name: payload.name,
        Blockstack_id: payload.Blockstack_id,
        Gender: payload.Gender
      });
      profile.update();
      await profile.save();
    }
  },
  async SetFlappyBirdScore({ commit }, payload) {
    try {
      const notExist = await FlappyBird.fetchList({
        Blockstack_id: payload.Blockstack_id
      });
      let _Scores = [0, 0, 0];

      if (notExist.length === 0) {
        _Scores[parseInt(payload.level)] = payload.score;

        const flappyBird = new FlappyBird({
          Blockstack_id: payload.Blockstack_id,
          Scores: _Scores
        });
        flappyBird.update();
        await flappyBird.save();
      } else {
        _Scores = notExist[0].attrs.Scores;

        _Scores[parseInt(payload.level)] = payload.score;

        notExist[0].update({
          Scores: _Scores
        });
        notExist[0].save();
        commit("SetFlappyBirdScore", _Scores);
      }
    } catch (e) {}
  },

  async getFlappyBirdScore({ commit }, payload) {
    try {
      const notExist = await FlappyBird.fetchList({
        Blockstack_id: payload
      });
      let _Scores = [0, 0, 0];
      if (notExist.length !== 0) {
        _Scores = notExist[0].attrs.Scores;
      }

      commit("SetFlappyBirdScore", _Scores);
    } catch (e) {}
  },

  async getChessPlayer({ commit }, payload) {
    try {
      const notExist = await Chess.fetchList({
        Blockstack_id: payload
      });
      let Elo = 1200;
      let BestElo = 1200;

      if (notExist.length === 0) {
        const chess = new Chess({
          Blockstack_id: payload
        });
        chess.update();
        await chess.save();
      } else {
        Elo = notExist[0].attrs.Elo;
        BestElo = notExist[0].attrs.BestElo;
      }

      commit("SetChessPlayer", {
        Elo: Elo,
        BestElo: BestElo
      });
    } catch (e) {}
  }
};
