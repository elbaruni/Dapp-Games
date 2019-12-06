import Vue from "vue";
import Vuex from "vuex";
import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";
import { Person } from "blockstack";
import { userSession } from "../userSession";
Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    userSession,
    registrations: [],
    users: [
      { id: 1, name: "Max", registered: false },
      { id: 2, name: "Anna", registered: false },
      { id: 3, name: "Chris", registered: false },
      { id: 4, name: "Sven", registered: false }
    ]
  },
  getters, //,
  // mutations,
  actions
});
