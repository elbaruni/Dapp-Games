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
    user: null,
    flappyBird: {
      score: [0, 0, 0]
    },
    chess: {
      Elo: 1200,
      BestElo: 1200
    },
    chessOppenet: null
  },
  getters,
  mutations,
  actions
});
