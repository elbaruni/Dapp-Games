import Vue from "vue";
import Router from "vue-router";
import Home from "../views/Home.vue";
//import Home from "./views/Games.vue";
import Games from "@/components/Games.vue";
import FlappyBird from "@/components/games/FlappyBird.vue";
import Chess from "@/components/games/Chess.vue";
import AuthGuard from "./auth-guard";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/games",
      name: "games",
      component: Games,
      children: [
        {
          path: "flappybird",
          name: "flappybird",
          component: FlappyBird
        },
        {
          path: "chess",
          name: "chess",
          component: Chess
        }
      ],
      beforeEnter: AuthGuard
    }
  ]
});
