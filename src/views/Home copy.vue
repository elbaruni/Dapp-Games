<template>
  <div class="center">
    <landing v-if="!userSession.isUserSignedIn()"></landing>
    <dashboard v-if="user" :user="user"></dashboard>
  </div>
</template>

<script>
import Landing from "@/components/Landing.vue";
import Games from "@/components/Games.vue";
import { Person } from "blockstack";
import { userSession } from "../userSession";

export default {
  name: "Home",
  components: { Landing, Games },
  created() {
    this.userSession = userSession;
  },
  mounted() {
    if (userSession.isUserSignedIn()) {
      let user;
      this.userData = userSession.loadUserData();
      user = new Person(this.userData.profile);
      user.username = this.userData.username;
      this.$store.commit({
        type: "setUser",
        user
      });
    } else if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then(userData => {
        window.location = window.location.origin;
      });
    }
  },
  data() {
    return {
      userSession: null
    };
  },
  computed: {
    user() {
      return this.$store.getters.getUser;
    }
  }
};
</script>
