import { personFM } from "@/api/other";
import { Howler, Howl } from "howler";
import { getTrackDetail } from "@/api/track";
import store from "@/store";
import { isAccountLoggedIn } from "@/utils/auth";
import { getPlaylistDetail } from "@/api/playlist";

const PLAY_PAUSE_FADE_DURATION = 200;
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
    this._enabled = false; // 是否启用Player
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
    this._currentTrack = { id: 39519285 }; // 当前播放歌曲的详细信息
    this._playNextList = []; // 当这个list不为空时，会优先播放这个list的歌
    this._isPersonalFM = false; // 是否是私人FM模式
    this._personalFMTrack = { id: 0 }; // 私人FM当前歌曲
    this._personalFMNextTrack = { id: 0 }; // 私人FM下一首歌曲信息（为了快速加载下一首）

    this.createdBlobRecords = [];
    this._howler = null;
    Object.defineProperty(this, "_howler", {
      enumerable: false,
    });

    this._init();

    window.yunmusic = {};
    window.yunmusic.player = this;
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
  set list(list) {
    this._list = list;
  }
  get current() {
    return this.shuffle ? this._shuffledCurrent : this._current;
  }
  set current(current) {
    if (this.shuffle) {
      this._shuffledCurrent = current;
    } else {
      this._current = current;
    }
  }
  get currentTrackId() {
    return this._currentTrack?.id ?? 0;
  }
  get volume() {
    return this._volume;
  }
  get playing() {
    return this._playing;
  }
  set playing(isPlaying) {
    this._playing = isPlaying;
  }
  get isPersonalFM() {
    return this._isPersonalFM;
  }
  get playNextList() {
    return this._playNextList;
  }
  get repeatMode() {
    return this._repeatMode;
  }
  // endregion

  // region 内部方法
  /**
   * 初始化数据
   */
  _init() {
    this._loadSelfFromLocalStorage();
    Howler.volume(this.volume);

    if (this.enabled) {
      // 页面初始化后恢复播放当前歌曲
      this._replaceCurrentTrack(this.currentTrackId, false).then(() => {
        // 获取当前歌曲进度
        this._howler?.seek(localStorage.getItem("curTrackTime") ?? 0);
      });
    }

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

  /**
   * 从localStorage中读取当前歌曲信息并赋予到自身属性上
   */
  _loadSelfFromLocalStorage() {
    let player = JSON.parse(localStorage.getItem("player"));
    if (!player) return;
    for (const [key, value] of Object.entries(player)) {
      this[key] = value;
    }
  }

  /**
   * 设置随机播放列表
   */
  _shuffleTheList(firstTrackId = this.currentTrackId) {
    // todo 随机列表
    return firstTrackId;
  }

  /**
   * 设置当前播放的歌曲
   */
  _replaceCurrentTrack(trackId, autoplay = true, nextUnplayable = UNPLAYABLE_CONDITION.PLAY_NEXT_TRACK) {
    if (autoplay && this.currentTrack.name) {
      // todo 播放进度条
    }
    return getTrackDetail(trackId).then((data) => {
      const track = data.songs[0];
      this._currentTrack = track;
      this._updateMediaSessionMetaData(track);
      return this._replaceCurTrackAudio(track, autoplay, true, nextUnplayable);
    });
  }

  /**
   * 将歌曲信息更新到navigator中
   */
  _updateMediaSessionMetaData(track) {
    if (!("mediaSession" in navigator)) {
      return;
    }
    let artists = track.ar.map((a) => a.name);
    const metadata = {
      title: track.name,
      artist: artists.join(","),
      album: track.al.name,
      artwork: [
        {
          src: track.al.picUrl + "?param=224y224",
          type: "image/jpg",
          sizes: "224x224",
        },
        {
          src: track.al.picUrl + "?param=512y512",
          type: "image/jpg",
          sizes: "512x512",
        },
      ],
      length: this.currentTrackDuration,
      trackId: this.current,
    };

    navigator.mediaSession.metadata = new window.MediaMetadata(metadata);
  }

  /**
   * 设置当前播放的歌曲的音频
   */
  _replaceCurTrackAudio(track, autoplay, isCachedNext, isNextUnplayable) {
    return this._getAudioSource(track).then((source) => {
      if (source) {
        let replaced = false;
        if (track.id === this.currentTrackId) {
          this._playAudioSource(source, autoplay);
          replaced = true;
        }
        if (isCachedNext) {
          // todo 缓存下一首
        }
        return replaced;
      } else {
        store.dispatch("showToast", `无法播放 ${track.name}`);
        switch (isNextUnplayable) {
          case UNPLAYABLE_CONDITION.PLAY_NEXT_TRACK:
            break;
          case UNPLAYABLE_CONDITION.PLAY_PREV_TRACK:
            break;
          default:
            store.dispatch("showToast", `undefined Unplayable condition: ${isNextUnplayable}`);
        }
        return false;
      }
    });
  }

  /**
   * 获取音频源
   */
  _getAudioSource(track) {
    return this._getAudioSourceFromNetease(track);
  }

  /**
   * 播放音频
   */
  _playAudioSource(source, autoplay = true) {
    Howler.unload();
    this._howler = new Howl({
      src: [source],
      html5: true,
      preload: true,
      format: ["mp3", "flac"],
      onend: () => {
        this._nextTrackCallback();
      },
    });

    if (autoplay) {
      this.play();
    }
  }

  /**
   * 从netease中获取音频源
   */
  _getAudioSourceFromNetease(track) {
    if (isAccountLoggedIn()) {
      // todo 登录后的获取
    } else {
      return new Promise((resolve) => {
        resolve(`https://music.163.com/song/media/outer/url?id=${track.id}`);
      });
    }
  }

  /**
   * 设置播放状态
   */
  _setPlaying(isPlaying) {
    this._playing = isPlaying;
  }

  /**
   * 获取列表中的下一首
   */
  _getNextTrack() {
    const next = this.current + 1;
    if (this.repeatMode === "on") {
      if (this.current + 1 === this.list.length) {
        return [this.list[0], 0];
      }
    }
    return [this.list[next], next];
  }

  /**
   * 获取列表中的上一首
   */
  _getPrevTrack() {
    const prev = this.current - 1;
    if (this.repeatMode === "on") {
      if (this.current === 0) {
        return [this.list[this.list.length - 1], this.list.length - 1];
      }
    }
    return [this.list[prev], prev];
  }

  /**
   * 歌曲结束时自动切换下一首
   */
  _nextTrackCallback() {
    this.playNextTrack();
  }
  // endregion

  // region 播放器动作
  /**
   * 播放
   */
  play() {
    if (this._howler?.playing()) return;
    this._howler?.play();

    this._howler?.once("play", () => {
      this._howler?.fade(0, this.volume, PLAY_PAUSE_FADE_DURATION);
      this._setPlaying(true);
    });
  }

  /**
   * 暂停
   */
  pause() {
    this._howler?.fade(this.volume, 0, PLAY_PAUSE_FADE_DURATION);
    this._howler?.once("fade", () => {
      this._howler?.pause();
      this._setPlaying(false);
    });
  }
  // endregion

  // region 外部方法
  /**
   * 将播放器信息存入localStorage
   */
  saveSelfToLocalStorage() {
    let player = {};
    for (let [key, value] of Object.entries(this)) {
      if (excludeSaveKeys.includes(key)) continue;
      player[key] = value;
    }
    localStorage.setItem("player", JSON.stringify(player));
  }

  /**
   * 设置或替换当前的播放列表
   */
  replacePlaylist(trackIdList, sourceId, sourceType, autoPlayTrackId = "first") {
    this._isPersonalFM = false;
    if (!this._enabled) this._enabled = true;
    this.list = trackIdList;
    this.current = 0;
    this._playlistSource = {
      id: sourceId,
      type: sourceType,
    };
    if (this.shuffle) this._shuffleTheList(autoPlayTrackId);
    if (autoPlayTrackId === "first") {
      this._replaceCurrentTrack(this.list[0]);
    } else {
      this.current = trackIdList.indexOf(autoPlayTrackId);
      this._replaceCurrentTrack(autoPlayTrackId);
    }
  }

  /**
   * 播放当前选择的列表
   */
  playMusicListById(playlistId, trackId = "first", noCache = false) {
    getPlaylistDetail(playlistId, noCache).then((data) => {
      let trackIds = data.playlist.trackIds.map((t) => t.id);
      this.replacePlaylist(trackIds, playlistId, "playlist", trackId);
    });
  }

  /**
   * 播放或暂停
   */
  playOrPause() {
    if (this._howler?.playing()) {
      this.pause();
    } else {
      this.play();
    }
  }

  /**
   * 切换到列表中的下一首
   */
  playNextTrack() {
    if (this.isPersonalFM) {
      this.playNextFMTrack();
      return true;
    }

    const [trackId, index] = this._getNextTrack();
    if (trackId === undefined) {
      this._howler?.stop();
      this._setPlaying(false);
      return false;
    }
    this.current = index;
    this._replaceCurrentTrack(trackId);
    return true;
  }

  /**
   * 播放电台的下一首
   */
  playNextFMTrack() {}

  /**
   * 切换到列表的上一首
   */
  playPrevTrack() {
    const [trackId, index] = this._getPrevTrack();
    if (trackId === undefined) {
      return false;
    }

    this.current = index;
    this._replaceCurrentTrack(trackId, trackId, UNPLAYABLE_CONDITION.PLAY_PREV_TRACK);
    return true;
  }
  // endregion
}
