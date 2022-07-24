import request from "@/utils/request";

/**
 * 获取推荐歌单
 */
export function recommendPlaylist(params) {
  return request({
    url: "/personalized",
    method: "get",
    params,
  });
}

/**
 * 获取各个排行榜列表
 */
export function getTopCharts() {
  return request({
    url: "/toplist",
    method: "get",
  });
}
