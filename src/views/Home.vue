<template>
  <div>
    <landing v-if="!signedIn"></landing>
    <router-view></router-view>
  </div>
</template>

<script>
import Landing from "@/components/Landing.vue";

export default {
  name: "Home",
  components: { Landing },
  created() {},
  mounted() {
    if (this.signedIn === true) {
      this.$router.push("/games");
    }
  },

  computed: {
    user() {
      return this.$store.getters.getUser;
    },
    signedIn() {
      return this.$store.getters.isUserSignedIn;
    }
  }
};
</script>
