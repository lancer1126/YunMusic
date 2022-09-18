import request from "@/utils/request";
import { mapTrackPlayableStatus } from "@/utils/common";

export function getTrackDetail(ids) {
  return request({
    url: "/song/detail",
    method: "get",
    params: {
      ids,
    },
  }).then((data) => {
    data.songs = mapTrackPlayableStatus(data.songs, data.privileges);
    return data;
  });
}
