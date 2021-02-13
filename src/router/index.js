import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Chart from "../views/Chart.vue";
import Settings from "../views/Settings.vue";
import KataEditor from "../views/KataEditor.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/edit/:id",
    name: "EditKata",
    component: KataEditor,
  },

  {
    path: "/c",
    name: "Stats",
    component: Chart,
  },
  {
    path: "/s",
    name: "Settings",
    component: Settings,
    meta: { showHeader: true },
  },
];

const router = new VueRouter({
  routes,
});

export default router;
