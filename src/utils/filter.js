import Vue from "vue";
import locale from "@/locale";
import dayjs from "dayjs";

Vue.filter("resizeImage", (imgUrl, size = 512) => {
  if (!imgUrl) return "";
  let httpsImgUrl = imgUrl;
  if (imgUrl.slice(0, 5) !== "https") {
    httpsImgUrl = "https" + imgUrl.slice(4);
  }
  return `${httpsImgUrl}?param=${size}y${size}`;
});

Vue.filter("formatDate", (timestamp, format = "MMM D, YYYY") => {
  if (!timestamp) return "";
  if (locale.locale === "zh-CN") format = "YYYY年MM月DD日";
  else if (locale.locale === "zh-TW") format = "YYYY年MM月DD日";
  return dayjs(timestamp).format(format);
});
