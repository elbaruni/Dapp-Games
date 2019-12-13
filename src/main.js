import Vue from "vue";
import App from "./App.vue";
import router from "./router/router";
import { store } from "./store/store";
import { Person } from "blockstack";
import { userSession } from "./userSession";
import { configure } from "radiks";
import { User, getConfig } from "radiks";

import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "./assets/styles.css";
import "./assets/css/chessboard-1.0.0.css";
import "./assets/js/chessboard-1.0.0";

window.axios = require("axios");
Vue.use(BootstrapVue);
Vue.config.productionTip = false;
configure({
  apiServer: "https://sportup.gq:3050",
  userSession
  //apiServer: "https://sportup.website:3000"
});
new Vue({
  router,
  store,
  render: h => h(App),
  async created() {
    const { userSession } = getConfig();

    if (userSession.isUserSignedIn()) {
      let user;
      this.userData = userSession.loadUserData();

      user = new Person(this.userData.profile);

      user.username = this.userData.username;

      this.$store.commit({
        type: "setUser",
        user
      });

      await this.$store.dispatch("getFlappyBirdScore", user.username);
    } else if (userSession.isSignInPending()) {
      //////////////
      userSession.handlePendingSignIn().then(async userData => {
        await User.createWithCurrentUser();
        window.location = window.location.origin;
      });
    }
  }
}).$mount("#app");
