import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);
const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/home"),
    meta: {
      keepAlive: true,
      savePosition: true,
    },
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

const originPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originPush.call(this, location).catch((err) => err);
};

export default router;
