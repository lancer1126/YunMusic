import request from "@/utils/request";
import { mapTrackPlayableStatus } from "@/utils/common";

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

/**
 * 获取歌单详情
 * 说明 : 歌单能看到歌单名字, 但看不到具体歌单内容 , 调用此接口 , 传入歌单 id, 可以获取对应歌单内的所有的音乐(未登录状态只能获取不完整的歌单,登录后是完整的)，
 * 但是返回的trackIds是完整的，tracks 则是不完整的，可拿全部 trackIds 请求一次 song/detail 接口
 * 获取所有歌曲的详情 (https://github.com/Binaryify/NeteaseCloudMusicApi/issues/452)
 * - id : 歌单 id
 * - s : 歌单最近的 s 个收藏者, 默认为8
 */
export function getPlaylistDetail(id, noCache = false) {
  let params = { id };
  if (noCache) params.timestamp = new Date().getTime();
  return request({
    url: "/playlist/detail",
    method: "get",
    params,
  }).then((data) => {
    if (data.playlist) {
      data.playlist.tracks = mapTrackPlayableStatus(data.playlist.tracks, data.privileges || []);
    }
    return data;
  });
}
