import { userSession } from "../../userSession";
export default {
  isUserSignedIn(state) {
    return userSession.isUserSignedIn();
  },
  getUser(state) {
    return state.user;
  }
};
