import { userSession } from "../../userSession";

export default {
  signOut({ commit }) {
    userSession.signUserOut(window.location.href);
  }
};
