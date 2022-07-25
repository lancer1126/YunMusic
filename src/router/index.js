import Vue from "vue";
import VueRouter from "vue-router";
import { isAccountLoggedIn } from "@/utils/auth";

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
  {
    path: "/playlist/:id",
    name: "playlist",
    component: () => import("@/views/playlist"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login"),
  },
  {
    path: "/login/account",
    name: "loginAccount",
    component: () => import("@/views/loginAccount"),
  },
  {
    path: "/explore",
    name: "explore",
    component: () => import("@/views/explore"),
    meta: {
      keepAlive: true,
      savePosition: true,
    },
  },
  {
    path: "/library",
    name: "library",
    component: () => import("@/views/library"),
    meta: {
      requireLogin: true,
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

router.beforeEach((to, from, next) => {
  // 进入需要登录页面需要登录验证
  if (to.meta.requireLogin) {
    if (isAccountLoggedIn()) {
      next();
    } else {
      next({ path: "/login" });
    }
  } else {
    next();
  }
});

export default router;
