import { userSession } from "../../userSession";
import { Profile, FlappyBird } from "../../utils/radiks";

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
        console.log("mmmm00", _Scores);
        const flappyBird = new FlappyBird({
          Blockstack_id: payload.Blockstack_id,
          Scores: _Scores
        });
        flappyBird.update();
        await flappyBird.save();
      } else {
        console.log(notExist[0].attrs.Scores);
        console.log("mmmm01", _Scores);
        _Scores = notExist[0].attrs.Scores;
        console.log("mmmm02", _Scores);
        _Scores[parseInt(payload.level)] = payload.score;
        console.log("mmmm03", _Scores);
        console.log(_Scores);
        notExist[0].update({
          Scores: _Scores
        });
        notExist[0].save();
      }
      console.log("3", notExist[0]);
      // console.log(payload);

      const flappyscore = await FlappyBird.fetchList({
        Blockstack_id: payload.Blockstack_id
      });

      commit("SetFlappyBirdScore", flappyscore[0].attrs.Scores);
    } catch (e) {
      console.log(e.message);
    }
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
    } catch (e) {
      console.log(e.message);
    }
  }
};
