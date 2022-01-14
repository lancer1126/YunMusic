console.debug("[debug][initLocalStorage.js]");

let localStorage = {
  player: {},
  settings: {
    lang: null,
    musicLanguage: "all",
    appearance: "auto",
    musicQuality: 320000,
    lyricFontSize: 28,
    outputDevice: "default",
    showPlaylistsByAppleMusic: true,
    enableUnblockNeteaseMusic: true,
    automaticallyCacheSongs: true,
    cacheLimit: 8192,
    nyancatStyle: false,
    showLyricsTranslation: true,
    lyricsBackground: true,
    closeAppOption: "ask",
    enableDiscordRichPresence: false,
    enableGlobalShortcut: true,
    showLibraryDefault: false,
    subTitleDefault: false,
    proxyConfig: {
      protocol: "noProxy",
      server: "",
      port: null,
    },
  },
  data: {
    user: {},
    likedSongPlaylistID: 0,
    lastRefreshCookieDate: 0,
    loginMode: null,
  },
};

if (process.env.IS_ELECTRON === true) {
  localStorage.settings.automaticallyCacheSongs = true;
}

export default localStorage;
