import Cookies from "js-cookie";
import store from "@/store";
import { logout } from "@/api/auth";

export function getCookie(key) {
  return Cookies.get(key) ?? localStorage.getItem(`cookie-${key}`);
}

export function removeCookie(key) {
  Cookies.remove(key);
  localStorage.removeItem(`cookie-${key}`);
}

export function setCookies(string) {
  let cookies = string.split(";;");
  cookies.map((c) => {
    document.cookie = c;
    const keyValue = c.split(";")[0].split("=");
    localStorage.setItem(`cookie-${keyValue[0]}`, keyValue[1]);
  });
}

// 账号是否登录
export function isAccountLoggedIn() {
  return getCookie("MUSIC_U") !== undefined && store.state.data.loginMode === "account";
}

// 用户名搜索（用户数据为只读）
export function isUsernameLoggedIn() {
  return store.state.data.loginMode === "username";
}

// 判断是否已登录
export function isLoggedIn() {
  return isAccountLoggedIn() || isUsernameLoggedIn();
}

export function doLogout() {
  logout();
  removeCookie("MUSIC_U");
  removeCookie("__csrf");
  store.commit("updateDate", { key: "user", value: {} });
  store.commit("updateDate", { key: "loginMode", value: null });
  store.commit("updateDate", { key: "likedSongPlaylistID", value: undefined });
}
