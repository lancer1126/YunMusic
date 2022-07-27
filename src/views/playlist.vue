<template>
  <div class="playlist">
    <div v-if="show">
      <div v-if="!checkSpecialList && isLikeSongPage" class="playlist-info">
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
        </div>
      </div>
    </div>
    <div v-else class="empty-content">No Content</div>
  </div>
</template>

<script>
import { specialPlaylist } from "@/utils/staticData";
import Cover from "@/components/Cover";
import { mapState } from "vuex";
import NProgress from "nprogress";
import { getPlaylistDetail } from "@/api/playlist";

export default {
  name: "Playlist",
  components: { Cover },
  data() {
    return {
      show: false,
      isLikeSongPage: false,
      loadMore: false,
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
    };
  },
  computed: {
    ...mapState(["userData"]),
    checkSpecialList() {
      return specialPlaylist[this.playlist.id] === undefined;
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
      this.show = true;
      getPlaylistDetail(this.id, true)
        .then((data) => {
          this.playlist = data.playlist;
          this.tracks = data.playlist.tracks;
          this.lastLoadedTrackIndex = data.playlist.tracks.length - 1;
          NProgress.done();
          return data;
        })
        .then(() => {
          if (this.tracks.length === 0) {
            this.show = false;
          } else {
            if (this.playlist.trackCount > this.tracks.length) {
              this.loadMore = true;
              this.loadMoreData();
            }
          }
        });
    },
    loadMoreData() {
      // todo loadMore
      return null;
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
  }
}
</style>
