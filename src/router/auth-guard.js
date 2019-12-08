import { store } from "../store/store";

export default (to, from, next) => {
  if (store.getters.isUserSignedIn) {
    next();
  } else {
    next("/");
  }
};
