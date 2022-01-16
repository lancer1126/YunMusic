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
