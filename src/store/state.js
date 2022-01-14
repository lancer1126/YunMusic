import initLocalStorage from "@/store/initLocalStorage";
import pkg from "../../package.json";

if (localStorage.getItem("appVersion") === null) {
  localStorage.setItem("settings", JSON.stringify(initLocalStorage.settings));
  localStorage.setItem("data", JSON.stringify(initLocalStorage.data));
  localStorage.setItem("appVersion", pkg.version);
}

export default {
  showLyrics: false,
  enableScrolling: true,
  player: JSON.parse(localStorage.getItem("player")),
  settings: JSON.parse(localStorage.getItem("settings")),
  data: JSON.parse(localStorage.getItem("data")),
};
