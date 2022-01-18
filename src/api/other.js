import request from "@/utils/request";

/**
 * 获取电台歌曲
 * @returns {*}
 */
export function personFM() {
  return request({
    url: "/personal_fm",
    method: "get",
    params: {
      timestamp: new Date().getTime(),
    },
  });
}
