<template>
  <div>
    <div>
      <b-navbar toggleable="lg" type="dark" variant="info">
        <b-navbar-brand to="/">
          <img :src="logo" class="brand-logo" />
        </b-navbar-brand>

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
                <em>{{ user.givenName }}</em>
              </template>
              <!-- <b-dropdown-item href="#"></b-dropdown-item> -->
              <b-dropdown-item @click.prevent="signOut" href="#"
                >Sign Out</b-dropdown-item
              >
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
      <b-container v-show="main" class="mt-5">
        <b-row>
          <b-col>
            <b-card
              :img-src="fb_card"
              img-alt="Image"
              img-top
              tag="article"
              style="max-width: 20rem;"
              class="mb-2"
            >
              <b-button to="/games/flappybird">Flappy Bird</b-button>
            </b-card></b-col
          >
          <b-col>
            <b-card
              :img-src="ch_card"
              img-alt="Image"
              img-top
              tag="article"
              style="max-width: 20rem;"
              class="mb-2"
            >
              <b-button to="/games/chess">Chess</b-button>
            </b-card></b-col
          >
        </b-row>
      </b-container>
    </div>

    <div class="mt-1">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { userSession } from "../userSession";
import { Profile } from "../utils/radiks.js";
import fb_card from "../assets/img/fb-card.png";
import ch_card from "../assets/img/ch-card.png";
import logo from "../assets/img/7-01.png";
export default {
  computed: {
    main() {
      return this.$route.name === "games";
    },
    fb_card() {
      return fb_card;
    },
    ch_card() {
      return ch_card;
    },
    logo() {
      return logo;
    },

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
    } /* ,
    radkis1() {
      let payload = {
        name: this.$store.getters.getUser.name(),
        Blockstack_id: this.$store.getters.getUser.username,
        Gender: "male"
      };
      this.$store.dispatch("createProfile", payload);
    } */
  },
  mounted() {
    if (this.signedIn === false) {
      this.$router.push("/");
    }
  }
};
</script>

<style scoped></style>
