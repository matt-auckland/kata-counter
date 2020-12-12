import Vue from "vue";
import App from "./App.vue";
import appData from "./appData";
import router from "./router";
import rootMethods from "./rootMethods";

Vue.config.productionTip = false;

Vue.filter("capitalize", function(str) {
  if (!str) return "";
  return str[0].toUpperCase() + str.slice(1);
});

new Vue({
  router,
  methods: rootMethods,
  data: appData,
  render: (h) => h(App),
}).$mount("#app");
