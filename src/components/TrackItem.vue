<template>
  <div
    class="track"
    :class="trackClass"
    :style="trackStyle"
    :title="track.reason"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <img v-if="!isAlbum" :src="checkImgUrl" loading="lazy" :class="{ hover: focus }" alt="" @click="goToAlbum" />
    <div class="title-artist">
      <div class="title">{{ track.name }}</div>
      <div v-if="!isAlbum" class="artist">
        <ArtistInline :artists="checkArtists" />
      </div>
    </div>

    <div v-if="isShowAlbumName" class="album">
      <router-link v-if="album && album.id" :to="`/album/${album.id}`">{{ album.name }}</router-link>
    </div>

    <div class="actions">
      <button v-if="isShowLikeButton" @click="likeSong">
        <svg-icon icon-class="heart" :style="{ visibility: focus && !isLiked ? 'visible' : 'hidden' }" />
        <svg-icon v-show="isLiked" icon-class="heart-solid" />
      </button>
    </div>

    <div v-if="isShowTrackTime" class="time">{{ track.dt | formatTime }}</div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ArtistInline from "@/components/ArtistInline";
import { isNil } from "lodash";

export default {
  name: "TrackItem",
  components: { ArtistInline },
  props: {
    trackProp: {
      type: Object,
      default: () => {
        return {};
      },
    },
    highlightPlaying: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      hover: false,
      trackStyle: {},
    };
  },
  computed: {
    ...mapState(["settings"]),
    trackClass() {
      let trackClass = [this.type];
      if (!this.playable) trackClass.push("disable");
      if (this.isPlaying && this.highlightPlaying) trackClass.push("playing");
      if (this.focus) trackClass.push("focus");
      return trackClass;
    },
    track() {
      return this.type === "cloudDisk" ? this.trackProp.simpleSong : this.trackProp;
    },
    album() {
      return this.track.album || this.track.al || this.track?.simpleSong?.al;
    },
    type() {
      return this.$parent.type;
    },
    playable() {
      return this.track?.privilege?.pl > 0 || this.track?.playable;
    },
    focus() {
      return this.hover && this.$parent.rightClickedTrack.id === 0;
    },
    isAlbum() {
      return this.tyoe === "album";
    },
    isLiked() {
      // todo 判断是否已收藏
      return false;
    },
    isPlaying() {
      return this.$store.state.player.currentTrack.id === this.track.id;
    },
    isShowAlbumName() {
      return this.type !== "album" && this.type !== "tracklist";
    },
    isShowLikeButton() {
      return this.type !== "tracklist" && this.type !== "cloudDisk" && this.playable;
    },
    isShowTrackTime() {
      return this.type !== "tracklist";
    },
    checkImgUrl() {
      let image =
        this.track?.al?.picUrl ??
        this.track?.album?.picUrl ??
        "https://p2.music.126.net/UeTuwE7pvjBpypWLudqukA==/3132508627578625.jpg";
      return image + "?param=224y224";
    },
    checkArtists() {
      const { ar, artists } = this.track;
      if (!isNil(ar)) return ar;
      if (!isNil(artists)) return artists;
      return [];
    },
  },
  methods: {
    goToAlbum() {
      // todo 点击图片跳转到专辑页
    },
    likeSong() {
      // todo 收藏此歌曲到列表
    },
  },
};
</script>

<style lang="scss" scoped>
button {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  background: transparent;
  border-radius: 25%;
  transition: transform 0.2s;
  .svg-icon {
    height: 16px;
    width: 16px;
    color: var(--color-primary);
  }
  &:hover {
    transform: scale(1.12);
  }
  &:active {
    transform: scale(0.96);
  }
}

.track {
  display: flex;
  align-items: center;
  padding: 8px;
  border-radius: 12px;
  user-select: none;
  img {
    border-radius: 8px;
    height: 46px;
    width: 46px;
    margin-right: 20px;
    border: 1px solid rgba(0, 0, 0, 0.04);
    cursor: pointer;
  }

  .title-artist {
    flex: 1;
    display: flex;
    flex-direction: column;
    .title {
      font-size: 18px;
      font-weight: 600;
      color: var(--color-text);
      cursor: default;
      padding-right: 16px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      word-break: break-all;
    }
    .artist {
      margin-top: 2px;
      font-size: 13px;
      opacity: 0.68;
      color: var(--color-text);
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      a {
        span {
          margin-right: 3px;
          opacity: 0.8;
        }
        &:hover {
          text-decoration: underline;
          cursor: pointer;
        }
      }
    }
  }

  .album {
    flex: 1;
    display: flex;
    font-size: 15px;
    opacity: 0.88;
    color: var(--color-text);
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  .time,
  .count {
    font-size: 16px;
    width: 50px;
    cursor: default;
    display: flex;
    justify-content: flex-end;
    margin-right: 10px;
    font-variant-numeric: tabular-nums;
    opacity: 0.88;
    color: var(--color-text);
  }
}

.track.disable {
  img {
    filter: grayscale(1) opacity(0.6);
  }
  .title,
  .artist,
  .album,
  .time,
  .no,
  .featured {
    opacity: 0.28 !important;
  }
  &:hover {
    background: none;
  }
}

.track.focus {
  transition: all 0.3s;
  background: var(--color-secondary-bg);
}

.track.album {
  height: 32px;
}

.actions {
  width: 80px;
  display: flex;
  justify-content: flex-end;
}
</style>
