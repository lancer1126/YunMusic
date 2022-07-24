import request from "@/utils/request";

export function getNewAlbums(params) {
  return request({
    url: "/album/new",
    method: "get",
    params,
  });
}
