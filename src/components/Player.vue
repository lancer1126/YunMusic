<template>
  <div class="player" @click="toggleLyrics">
    <div
      class="progress-bar"
      :class="{
        nyancat: settings.nyancatStyle,
        'nyancat-stop': settings.nyancatStyle && !player.playing,
      }"
      @click.stop
    >
      <vue-slider
        v-model="player.progress"
        :min="0"
        :max="player.currentTrackDuration"
        :interval="1"
        :drag-on-click="true"
        :duration="0"
        :dot-size="12"
        :height="2"
        :tooltip-formatter="formatTrackTime"
        :lazy="true"
        :silent="true"
      ></vue-slider>
    </div>

    <!-- 控制按钮区域 -->
    <div class="controls">
      <div class="playing">
        <div class="container" @click.stop>
          <img
            :src="currentTrack.al && currentTrack.al.picUrl"
            @click="goToAlbum"
          />
          <div class="track-info" :title="audioSource">
            <div
              :class="['name', { 'has-list': hasList }]"
              @click="hasList && goToList"
            >
              {{ currentTrack.name }}
            </div>
            <div class="artist">
              <span
                v-for="(ar, index) in currentTrack.ar"
                :key="ar.id"
                @click="ar.id && goToArtist(ar.id)"
              >
                <span :class="{ ar: ar.id }">{{ ar.name }}</span>
                <span v-if="index !== currentTrack.ar.length - 1">, </span>
              </span>
            </div>
          </div>
          <div class="like-button">
            <button-icon
              :title="$t('player.like')"
              @click.native="likeATrack(player.currentTrack.id)"
            >
              <svg-icon
                v-show="!player.isCurrentTrackLiked"
                icon-class="heart"
              ></svg-icon>
              <svg-icon
                v-show="player.isCurrentTrackLiked"
                icon-class="heart-solid"
              ></svg-icon>
            </button-icon>
          </div>
        </div>
        <div class="blank"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import VueSlider from "vue-slider-component";
import "@/assets/css/slider.css";
import ButtonIcon from "@/components/ButtonIcon";

export default {
  name: "Player",
  components: {
    ButtonIcon,
    VueSlider,
  },
  computed: {
    ...mapState(["settings", "player", "data"]),
    currentTrack() {
      return this.player.currentTrack;
    },
    audioSource() {
      return this.player._howler?._src.includes("kuwo.cn")
        ? "音源来自酷我音乐"
        : "";
    },
  },
  methods: {
    ...mapMutations(["toggleLyrics", "likeATrack"]),
    formatTrackTime(value) {
      if (!value) return "";
      let min = ~~((value / 60) % 60);
      let sec = (~~(value % 60)).toString().padStart(2, "0");
      return `${min}:${sec}`;
    },
    goToAlbum() {
      return null;
    },
    hasList() {
      return null;
    },
    goToList() {
      return null;
    },
    goToArtist(id) {
      return id;
    },
  },
};
</script>

<style lang="scss" scoped>
.player {
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 64px;
  backdrop-filter: saturate(180%) blur(30px);
  // background-color: rgba(255, 255, 255, 0.86);
  background-color: var(--color-navbar-bg);
  z-index: 100;
}

@supports (-moz-appearance: none) {
  .player {
    background-color: var(--color-body-bg);
  }
}

.progress-bar {
  margin-top: -6px;
  margin-bottom: -6px;
  width: 100%;
}

.controls {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  height: 100%;
  padding: {
    right: 10vw;
    left: 10vw;
  }
}

@media (max-width: 1336px) {
  .controls {
    padding: 0 5vw;
  }
}

.blank {
  flex-grow: 1;
}

.playing {
  display: flex;
}

.playing .container {
  display: flex;
  align-items: center;
  img {
    height: 46px;
    border-radius: 5px;
    box-shadow: 0 6px 8px -2px rgba(0, 0, 0, 0.16);
    cursor: pointer;
    user-select: none;
  }
  .track-info {
    height: 46px;
    margin-left: 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .name {
      font-weight: 600;
      font-size: 16px;
      opacity: 0.88;
      color: var(--color-text);
      margin-bottom: 4px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      word-break: break-all;
    }
    .has-list {
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
    .artist {
      font-size: 12px;
      opacity: 0.58;
      color: var(--color-text);
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      word-break: break-all;
      span.ar {
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}

.middle-control-buttons {
  display: flex;
}

.middle-control-buttons .container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 8px;
  .button-icon {
    margin: 0 8px;
  }
  .play {
    height: 42px;
    width: 42px;
    .svg-icon {
      width: 24px;
      height: 24px;
    }
  }
}

.right-control-buttons {
  display: flex;
}

.right-control-buttons .container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .expand {
    margin-left: 24px;
    .svg-icon {
      height: 24px;
      width: 24px;
    }
  }
  .active .svg-icon {
    color: var(--color-primary);
  }
  .volume-control {
    margin-left: 4px;
    display: flex;
    align-items: center;
    .volume-bar {
      width: 84px;
    }
  }
}

.like-button {
  margin-left: 16px;
}

.button-icon.disabled {
  cursor: default;
  opacity: 0.38;
  &:hover {
    background: none;
  }
  &:active {
    transform: unset;
  }
}
</style>
