import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

Vue.filter("capitalize", function(str) {
  if (!str) return "";
  return str[0].toUpperCase() + str.slice(1);
});

new Vue({
  render: (h) => h(App),
}).$mount("#app");
