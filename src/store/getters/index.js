import { userSession } from "../../userSession";
export default {
  unregisteredUsers(state) {
    return state.users;
  },
  isUserSignedIn(state) {
    return userSession.isUserSignedIn();
  }
};
