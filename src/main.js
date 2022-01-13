import Vue from "vue";
import App from "./App.vue";
import VueAnalytics from "vue-analytics";
import router from "./router";
import store from "./store";
import NProgress from "nprogress";
import i18n from "@/locale";

import "@/assets/icons";
import "@/assets/css/global.scss";
import "@/assets/css/nprogress.css";

Vue.use(VueAnalytics, {
  id: "UA-180189423-1",
  router,
});
Vue.config.productionTip = false;

NProgress.configure({
  showSpinner: false,
  trickleSpeed: 100,
});

new Vue({
  i18n,
  store,
  router,
  render: (h) => h(App),
}).$mount("#app");
