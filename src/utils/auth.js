import Cookies from "js-cookie";
import store from "@/store";

export function getCookie(key) {
  return Cookies.get(key) ?? localStorage.getItem(`cookie-${key}`);
}

// 账号是否登录
export function isAccountLoggedIn() {
  return (
    getCookie("MUSIC_U") !== undefined &&
    store.state.data.loginMode === "account"
  );
}

// 用户名搜索（用户数据为只读）
export function isUsernameLoggedIn() {
  return store.state.data.loginMode === "username";
}

// 判断是否已登录
export function isLoggedIn() {
  return isAccountLoggedIn() || isUsernameLoggedIn();
}
