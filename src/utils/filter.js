import Vue from "vue";
import locale from "@/locale";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";

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

Vue.filter("formatTime", (Milliseconds, format = "HH:MM:SS") => {
  if (!Milliseconds) return "";
  dayjs.extend(duration);
  dayjs.extend(relativeTime);

  let time = dayjs.duration(Milliseconds);
  let hours = time.hours().toString();
  let mins = time.minutes().toString();
  let seconds = time.seconds().toString().padStart(2, "0");

  if (format === "HH:MM:SS") {
    return hours !== "0" ? `${hours}:${mins.padStart(2, "0")}:${seconds}` : `${mins}:${seconds}`;
  } else if (format === "Human") {
    let hoursUnit, minitesUnit;
    switch (locale.locale) {
      case "zh-CN":
        hoursUnit = "小时";
        minitesUnit = "分钟";
        break;
      case "zh-TW":
        hoursUnit = "小時";
        minitesUnit = "分鐘";
        break;
      default:
        hoursUnit = "hr";
        minitesUnit = "min";
        break;
    }
    return hours !== "0" ? `${hours} ${hoursUnit} ${mins} ${minitesUnit}` : `${mins} ${minitesUnit}`;
  }
});
