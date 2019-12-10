<template>
  <div>
    <div>
      <b-navbar toggleable="lg" type="dark" variant="info">
        <b-navbar-brand to="/">Dapp Games</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav>
            <b-nav-item href="#"></b-nav-item>
          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">
            <b-nav-item to="/games/chess">Chess</b-nav-item>
            <b-nav-item to="/games/flappybird">Flappy Bird</b-nav-item>

            <b-nav-item-dropdown right>
              <!-- Using 'button-content' slot -->
              <template v-slot:button-content>
                <em>{{user.givenName}}</em>
              </template>
              <!-- <b-dropdown-item href="#"></b-dropdown-item> -->
              <b-dropdown-item @click.prevent="signOut" href="#">Sign Out</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>

    <div class="mt-1">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { userSession } from "../userSession";
import { Profile } from "../utils/radiks.js";
export default {
  computed: {
    user() {
      //to add computed  avatar and name
      let givenName;
      let avatar = "https://s3.amazonaws.com/onename/avatar-placeholder.png";
      let User = { givenName, avatar };
      if (this.signedIn) {
        User = this.$store.getters.getUser;
        givenName = User.name() ? User.name() : "Nameless Person";
        if (User.avatarUrl()) avatar = User.avatarUrl();
        User = { ...User, givenName, avatar };
        return User;
      }
    },
    signedIn() {
      return this.$store.getters.isUserSignedIn;
    }
  },
  methods: {
    signOut() {
      this.$store.dispatch("signOut");
    },
    radkis1() {
      let payload = {
        name: this.$store.getters.getUser.name(),
        Blockstack_id: this.$store.getters.getUser.username,
        Gender: "male"
      };
      this.$store.dispatch("createProfile", payload);
    }
  },
  mounted() {
    if (this.signedIn === false) {
      this.$router.push("/");
    }
  }
};
</script>

<style scoped></style>