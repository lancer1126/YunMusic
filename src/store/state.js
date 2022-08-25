import initLocalStorage from "@/store/initLocalStorage";
import pkg from "../../package.json";
import updateApp from "@/utils/updateApp";

if (localStorage.getItem("appVersion") === null) {
  localStorage.setItem("settings", JSON.stringify(initLocalStorage.settings));
  localStorage.setItem("userData", JSON.stringify(initLocalStorage.userData));
  localStorage.setItem("appVersion", pkg.version);
}

updateApp();

export default {
  showLyrics: false,
  enableScrolling: true,
  player: JSON.parse(localStorage.getItem("player")),
  settings: JSON.parse(localStorage.getItem("settings")),
  userData: JSON.parse(localStorage.getItem("userData")),
  dailyTracks: [],
};
