import { personFM } from "@/api/other";

const excludeSaveKeys = ["_playing", "_personalFMLoading", "_personalFMNextLoading"];
const UNPLAYABLE_CONDITION = {
  PLAY_NEXT_TRACK: "playNextTrack",
  PLAY_PREV_TRACK: "playPrevTrack",
};

export default class {
  constructor() {
    // 播放器状态
    this._playing = false; // 是否正在播放中
    this._progress = 0; // 当前播放歌曲的进度
    this._enabled = true; // 是否启用Player
    this._repeatMode = "off"; // off | on | one
    this._shuffle = false; // true | false
    this._volume = 1; // 0 to 1
    this._volumeBeforeMuted = 1; // 用于保存静音前的音量
    this._personalFMLoading = false; // 是否正在私人FM中加载新的track
    this._personalFMNextLoading = false; // 是否正在缓存私人FM的下一首歌曲

    // 播放信息
    this._list = []; // 播放列表
    this._current = 0; // 当前播放歌曲在播放列表里的index
    this._shuffledList = []; // 被随机打乱的播放列表，随机播放模式下会使用此播放列表
    this._shuffledCurrent = 0; // 当前播放歌曲在随机列表里面的index
    this._playlistSource = { type: "album", id: 123 }; // 当前播放列表的信息
    this._currentTrack = { id: 86827685 }; // 当前播放歌曲的详细信息
    this._playNextList = []; // 当这个list不为空时，会优先播放这个list的歌
    this._isPersonalFM = false; // 是否是私人FM模式
    this._personalFMTrack = { id: 0 }; // 私人FM当前歌曲
    this._personalFMNextTrack = { id: 0 }; // 私人FM下一首歌曲信息（为了快速加载下一首）

    this.createdBlobRecords = [];
    this._howler = null;
    Object.defineProperty(this, "_howler", {
      enumerable: false,
    });

    // init
    this._init();

    window.yesplaymusic = {};
    window.yesplaymusic.player = this;
  }

  // region getter/setter
  get personalFMTrack() {
    return this._personalFMTrack;
  }
  get enabled() {
    return this._enabled;
  }
  get currentTrack() {
    return this._currentTrack;
  }
  get shuffle() {
    return this._shuffle;
  }
  get list() {
    return this.shuffle ? this._shuffledList : this._list;
  }
  get current() {
    return this.shuffle ? this._shuffledCurrent : this._current;
  }
  get currentTrackId() {
    return this._currentTrack?.id ?? 0;
  }
  // endregion

  // region 内部方法
  _init() {
    if (
      this._personalFMTrack.id === 0 ||
      this._personalFMNextTrack.id === 0 ||
      this._personalFMTrack.id === this._personalFMNextTrack.id
    ) {
      personFM().then((result) => {
        this._personalFMTrack = result.data[0];
        this._personalFMNextTrack = result.data[1];
        return this._personalFMTrack;
      });
    }
  }
  _shuffleTheList(firstTrackId = this.currentTrackId) {
    // todo 随机列表
    return firstTrackId;
  }
  _replaceCurrentTrack(id, autoplay = true, nextUnplayable = UNPLAYABLE_CONDITION.PLAY_NEXT_TRACK) {
    // todo 设置当前播放列表
    return autoplay + nextUnplayable;
  }
  // endregion

  // region 外部方法
  saveSelfToLocalStorage() {
    let player = {};
    for (let [key, value] of Object.entries(this)) {
      if (excludeSaveKeys.includes(key)) continue;
      player[key] = value;
    }
    localStorage.setItem("player", JSON.stringify(player));
  }
  replacePlaylist(trackIds, sourceId, sourceType, autoPlayTrackId = "first") {
    this._isPersonalFM = false;
    if (!this._enabled) this._enabled = true;
    this.list = trackIds;
    this.current = 0;
    this._playlistSource = {
      id: sourceId,
      type: sourceType,
    };
    if (this.shuffle) this._shuffleTheList(autoPlayTrackId);
    if (autoPlayTrackId === "first") {
      this._replaceCurrentTrack(this.list[0]);
    } else {
      this.current = trackIds.indexOf(autoPlayTrackId);
      this._replaceCurrentTrack(autoPlayTrackId);
    }
  }
  // endregion
}
