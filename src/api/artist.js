import request from "@/utils/request";

export function getArtistByType(type = null) {
  let params = {};
  if (type) {
    params.type = type;
  }
  return request({
    url: "/toplist/artist",
    method: "get",
    params,
  });
}
