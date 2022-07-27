import { isAccountLoggedIn } from "@/utils/auth";
import store from "@/store";
/**
 * 从列表arr中随机获取count数量的元素
 */
export function getShuffledItems(arr, count) {
  let shuffled = arr.slice(0),
    i = arr.length,
    min = i - count,
    temp,
    index;
  while (i-- > min) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(min);
}

export function mapTrackPlayableStatus(tracks, privileges = []) {
  if (tracks?.length === undefined) return tracks;
  return tracks.map((t) => {
    const privilege = privileges.find((item) => item.id === t.id) || {};
    if (t.privilege) {
      Object.assign(t.privilege, privilege);
    } else {
      t.privilege = privilege;
    }
    let result = isTrackPlayable(t);
    t.playable = result.playable;
    t.reason = result.reason;
    return t;
  });
}

export function isTrackPlayable(track) {
  let result = {
    playable: true,
    reason: "",
  };
  if (track?.privilege?.pl > 0) {
    return result;
  }
  // cloud storage judgement logic
  if (isAccountLoggedIn() && track?.privilege?.cs) {
    return result;
  }
  if (track.fee === 1 || track.privilege?.fee === 1) {
    if (isAccountLoggedIn() && store.state.data.user.vipType === 11) {
      result.playable = true;
    } else {
      result.playable = false;
      result.reason = "VIP Only";
    }
  } else if (track.fee === 4 || track.privilege?.fee === 4) {
    result.playable = false;
    result.reason = "付费专辑";
  } else if (track.noCopyrightRcmd !== null && track.noCopyrightRcmd !== undefined) {
    result.playable = false;
    result.reason = "无版权";
  } else if (track.privilege?.st < 0 && isAccountLoggedIn()) {
    result.playable = false;
    result.reason = "已下架";
  }
  return result;
}
