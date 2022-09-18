<template>
  <div class="playlist">
    <div v-if="show">
      <div v-if="!inSpecialList && !isLikeSongPage" class="playlist-info">
        <Cover
          :id="playlist.id"
          :image-url="playlist.coverImgUrl | resizeImage(1024)"
          :always-show-shadow="true"
          :click-cover-to-play="true"
          :fixed-size="288"
          :cover-hover="false"
          :play-button-size="18"
          type="playlist"
        />
        <div class="info">
          <div class="title">{{ playlist.name }}</div>
          <div class="artist">
            By
            <a :href="`https://music.163.com/#/user/home?id=${playlist.creator.userId}`" target="_blank">
              {{ playlist.creator.nickname }}
            </a>
          </div>
          <div class="date-and-count">
            {{ $t("playlist.updatedAt") }}-{{ playlist.updateTime | formatDate }} -{{ playlist.trackCount }}
            {{ $t("common.songs") }}
          </div>
          <div class="description">{{ playlist.description }}</div>
          <div class="buttons">
            <ButtonTwoTone icon-class="play" @click.native="playById()">{{ $t("common.play") }}</ButtonTwoTone>
            <ButtonTwoTone
              v-if="playlist.creator.userId !== userData.user.userId"
              :horizontal-padding="0"
              :color="playlist.subscribed ? 'blue' : 'grey'"
              :text-color="playlist.subscribed ? '#335eea' : ''"
              :icon-class="playlist.subscribed ? 'heart-solid' : 'heart'"
              :background-color="playlist.subscribed ? 'var(--color-secondary-bg)' : ''"
              @click.native="likePlaylist"
            />
            <ButtonTwoTone
              icon-class="more"
              color="grey"
              :icon-button="true"
              :horizontal-padding="0"
              @click.native="openMenu"
            />
          </div>
        </div>
      </div>

      <TrackList :id="playlist.id" :tracks="filteredTracks" type="playlist" />
    </div>
    <div v-if="showEmpty" class="empty-content">No Content</div>
  </div>
</template>

<script>
import { specialPlaylist } from "@/utils/staticData";
import Cover from "@/components/Cover";
import { mapState } from "vuex";
import NProgress from "nprogress";
import { getTrackDetail } from "@/api/track";
import { getPlaylistDetail } from "@/api/playlist";
import ButtonTwoTone from "@/components/ButtonTwoTone";
import TrackList from "@/components/TrackList";

export default {
  name: "Playlist",
  components: { TrackList, ButtonTwoTone, Cover },
  data() {
    return {
      show: false,
      showEmpty: false,
      isLikeSongPage: false,
      loadingMore: false,
      hasMore: false,
      playlist: {
        id: 0,
        coverImgUrl: "",
        creator: {
          userId: "",
        },
        trackIds: [],
      },
      tracks: [],
      lastLoadedTrackIndex: 9,
      searchKeyWords: "",
    };
  },
  computed: {
    ...mapState(["userData"]),
    inSpecialList() {
      return specialPlaylist[this.playlist.id] !== undefined;
    },
    filteredTracks() {
      // 若进行了歌单内搜索，则只显示搜索内的列表
      return this.tracks.filter(
        (t) =>
          (t.name && t.name.toLowerCase().includes(this.searchKeyWords.toLowerCase())) ||
          (t.al.name && t.al.name.toLowerCase().includes(this.searchKeyWords.toLowerCase())) ||
          t.ar.find((artist) => artist.name && artist.name.toLowerCase().includes(this.searchKeyWords.toLowerCase()))
      );
    },
  },
  created() {
    let id = this.$route.name === "likeSongs" ? this.userData.likedSongPlaylistID : this.$route.params.id;
    this.loadData(id);
    NProgress.start();
  },
  methods: {
    loadData(id) {
      this.id = id;
      getPlaylistDetail(this.id, true)
        .then((data) => {
          this.show = true;
          this.playlist = data.playlist;
          this.tracks = data.playlist.tracks;
          this.lastLoadedTrackIndex = data.playlist.tracks.length - 1;
          NProgress.done();
          return data;
        })
        .then(() => {
          if (this.playlist.trackCount > this.tracks.length) {
            this.loadingMore = true;
            this.loadMoreTracks();
          }
        })
        .finally(() => {
          if (this.tracks.length === 0) {
            this.showEmpty = true;
            NProgress.done();
          }
        });
    },
    loadMoreTracks(loadNum = 100) {
      let trackIds = this.playlist.trackIds.filter((t, index) => {
        if (index > this.lastLoadedTrackIndex && index <= this.lastLoadedTrackIndex + loadNum) {
          return t;
        }
      });

      trackIds = trackIds.map((t) => t.id);
      getTrackDetail(trackIds.join(",")).then((data) => {
        this.tracks.push(...data.songs);
        this.lastLoadedTrackIndex += trackIds.length;
        this.loadingMore = false;
        this.hasMore = this.lastLoadedTrackIndex + 1 < this.playlist.trackIds.length;
      });
    },
    playById() {
      let trackIds = this.playlist.trackIds.map((t) => t.id);
      this.$store.state.player.replacePlaylist(trackIds);
    },
    likePlaylist() {
      // todo 关注某个歌单
    },
    openMenu() {
      // todo 打开菜单
    },
  },
};
</script>

<style lang="scss" scoped>
.playlist {
  margin-top: 32px;
}
.empty-content {
  position: relative;
  margin-top: 180px;
  text-align: center;
  font-weight: 500;
  font-size: 50px;
  color: #a4a4a6;
}
.playlist-info {
  display: flex;
  margin-bottom: 72px;
  position: relative;
  .info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    margin-left: 56px;
    .title {
      font-size: 36px;
      font-weight: 700;
      color: var(--color-text);
    }
    .artist {
      font-size: 18px;
      opacity: 0.88;
      color: var(--color-text);
      margin-top: 24px;
    }
    .date-and-count {
      font-size: 14px;
      opacity: 0.68;
      color: var(--color-text);
      margin-top: 5px;
    }
    .description {
      font-size: 14px;
      opacity: 0.68;
      color: var(--color-text);
      margin-top: 18px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
      cursor: pointer;
      &:hover {
        transition: opacity 0.3s;
        opacity: 0.88;
      }
    }
    .buttons {
      margin-top: 36px;
      display: flex;
      button {
        margin-right: 16px;
      }
    }
  }
}
</style>
