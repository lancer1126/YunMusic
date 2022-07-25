import { recommendPlaylist } from "@/api/playlist";
import { isAccountLoggedIn } from "@/utils/auth";

export async function getRecPlaylist(limit) {
  if (isAccountLoggedIn()) {
    //todo 筛选
  } else {
    return await recommendPlaylist({ limit });
  }
}
