<template>
  <div v-show="show" class="home">
    <div class="index-row">
      <div class="title">
        {{ $t("home.recommendPlaylist") }}
        <router-link to="/explore?category=playlist">
          {{ $t("home.seeMore") }}
        </router-link>
      </div>
      <CoverRow :type="'playList'" :items="recommendPlaylist.items" sub-text="copywriter" />
    </div>
    <div class="index-row">
      <div class="title">For You</div>
      <div class="for-you-row">
        <DailyTracksCard ref="DailyTracksCard" />
        <FMCard />
      </div>
    </div>
    <div class="index-row">
      <div class="title">{{ $t("home.recommendArtist") }}</div>
      <CoverRow type="artist" :column-number="6" :items="recommendArtistList.items" />
    </div>
    <div class="index-row">
      <div class="title">
        {{ $t("home.charts") }}
        <router-link to="/explore?category=topList">{{ $t("home.seeMore") }}</router-link>
      </div>
      <CoverRow type="playlist" :items="topList.items" sub-text="updateFrequency" />
    </div>
    <div class="index-row">
      <div class="title">
        {{ $t("home.newAlbum") }}
        <router-link to="/new-album">{{ $t("home.seeMore") }}</router-link>
      </div>
      <CoverRow type="album" :items="albumList.items" sub-text="artist" />
    </div>
  </div>
</template>

<script>
import { getTopCharts, recommendPlaylist } from "@/api/playlist";
import { getArtistByType } from "@/api/artist";
import { getShuffledItems } from "@/utils/common";
import { getNewAlbums } from "@/api/album";
import CoverRow from "@/components/CoverRow";
import NProgress from "nprogress";
import DailyTracksCard from "@/components/DailyTracksCard";
import FMCard from "@/components/FMCard";

export default {
  name: "Home",
  components: { FMCard, DailyTracksCard, CoverRow },
  data() {
    return {
      show: true,
      topList: {
        ids: [],
        items: [],
      },
      albumList: {
        items: [],
      },
      recommendPlaylist: { items: [] },
      recommendArtistList: {
        items: [],
        indexes: [],
      },
    };
  },
  activated() {
    this.loadData();
    // this.$parent.$refs.scrollbar.restorePosition();
  },
  methods: {
    loadData() {
      setTimeout(() => {
        if (!this.show) NProgress.start();
      }, 1000);

      this.getPlayList();
      this.getArtistList();
      this.getTopChartList();
      this.getAlbumList();
    },
    getPlayList() {
      recommendPlaylist({
        limit: 10,
      }).then((data) => {
        this.recommendPlaylist.items = data.result;
        NProgress.done();
        this.show = true;
      });
    },
    getArtistList() {
      getArtistByType().then((data) => {
        let indexes = [];
        while (indexes.length < 6) {
          let temp = ~~(Math.random() * 100);
          if (!indexes.includes(temp)) indexes.push(temp);
        }
        this.recommendArtistList.indexes = indexes;
        this.recommendArtistList.items = data.list.artists.filter((e, index) => indexes.includes(index));
      });
    },
    getTopChartList() {
      getTopCharts().then((data) => {
        this.topList.items = getShuffledItems(data.list, 5);
      });
    },
    getAlbumList() {
      getNewAlbums({
        area: "ALL",
        limit: 10,
      }).then((data) => {
        this.albumList.items = data.albums;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.index-row {
  margin-top: 54px;
}
.index-row.first-row {
  margin-top: 32px;
}
.playlists {
  display: flex;
  flex-wrap: wrap;
  margin: {
    right: -12px;
    left: -12px;
  }
  .index-playlist {
    margin: 12px 12px 24px 12px;
  }
}

.title {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 20px;
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text);
  a {
    font-size: 13px;
    font-weight: 600;
    opacity: 0.68;
  }
}

footer {
  display: flex;
  justify-content: center;
  margin-top: 48px;
}

.for-you-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 78px;
}
</style>
