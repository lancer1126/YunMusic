import Vue from "vue";
import VueClipboard from "vue-clipboard2";
import VueI18n from "vue-i18n";
import store from "@/store";

import en from "./lang/en";
import zhCN from "./lang/zh-CN";
import zhTW from "./lang/zh-TW";

Vue.use(VueClipboard);
Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: store.state.settings.lang,
  messages: {
    en,
    "zh-CN": zhCN,
    "zh-TW": zhTW,
  },
  silentFallbackWarn: true,
});

export default i18n;
