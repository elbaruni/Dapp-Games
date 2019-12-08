import { userSession } from "../../userSession";
import { Profile } from "../../utils/radiks";

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
  }
};
