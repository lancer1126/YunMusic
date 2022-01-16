<template>
  <div v-show="show" class="home">
    <div class="index-row">
      <div class="title">
        {{ $t("home.recommendPlaylist") }}
        <router-link to="/explore?category=推荐歌单">
          {{ $t("home.seeMore") }}
        </router-link>
      </div>
      <CoverRow
        :type="'playList'"
        :items="recommendPlaylist.items"
        sub-text="copywriter"
      />
    </div>
  </div>
</template>

<script>
import { recommendPlaylist } from "@/api/playlist";
import CoverRow from "@/components/CoverRow";
import NProgress from "nprogress";
export default {
  components: { CoverRow },
  data() {
    return {
      show: true,
      recommendPlaylist: { items: [] },
    };
  },
  activated() {
    this.loadData();
  },
  methods: {
    loadData() {
      setTimeout(() => {
        if (!this.show) NProgress.start();
      }, 1000);

      recommendPlaylist({
        limit: 10,
      }).then((data) => {
        this.recommendPlaylist.items = data.result;
        NProgress.done();
        this.show = true;
      });

      return null;
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
