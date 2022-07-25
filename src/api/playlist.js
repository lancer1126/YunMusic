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

/**
 * 歌单 ( 网友精选碟 )
 * 说明 : 调用此接口 , 可获取网友精选碟歌单
 * - order: 可选值为 'new' 和 'hot', 分别对应最新和最热 , 默认为 'hot'
 * - cat: tag, 比如 " 华语 "、" 古风 " 、" 欧美 "、" 流行 ", 默认为 "全部",可从歌单分类接口获取(/playlist/catlist)
 * - limit: 取出歌单数量 , 默认为 50
 */
export function topPlaylist(params) {
  return request({
    url: "/top/playlist",
    method: "get",
    params,
  });
}

/**
 * 获取精品歌单
 * 说明 : 调用此接口 , 可获取精品歌单
 * - cat: tag, 比如 " 华语 "、" 古风 " 、" 欧美 "、" 流行 ", 默认为 "全部", 可从精品歌单标签列表接口获取(/playlist/highquality/tags)
 * - limit: 取出歌单数量 , 默认为 20
 * - before: 分页参数,取上一页最后一个歌单的 updateTime 获取下一页数据
 */
export function highQualityPlaylist(params) {
  return request({
    url: "/top/playlist/highquality",
    method: "get",
    params,
  });
}
