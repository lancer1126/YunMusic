<template>
  <div>
    <div class="title">{{ $t("explore.explore") }}</div>

    <div class="buttons">
      <div
        v-for="category in settings.enabledPlaylistCategories"
        :key="category"
        class="button"
        :class="{ active: category === activeCategory && !showAllCat }"
        @click="toCategoryRoute(category)"
      >
        {{ category }}
      </div>
      <div class="button more" :class="{ active: showAllCat }" @click="showAllCat = !showAllCat">
        <svg-icon icon-class="more" />
      </div>
    </div>

    <div v-show="showAllCat" class="panel">
      <div v-for="parentCate in parentCats" :key="parentCate" class="big-cat">
        <div class="name">{{ parentCate }}</div>
        <div class="cats">
          <div
            v-for="subCate in getSubCategory(parentCate)"
            :key="subCate.name"
            class="cat"
            :class="{ active: settings.enabledPlaylistCategories.includes(subCate.name) }"
            @click="toggleSubCat(subCate.name)"
          >
            <span>{{ subCate.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="playlists">
      <CoverRow type="playlist" :items="playlists" :sub-text="subText" :show-play-count="activeCategory === '排行榜'" />
    </div>
  </div>
</template>

<script>
import { playlistCategories } from "@/utils/staticData";
import { getRecPlaylist } from "@/utils/playlistUtil";
import { highQualityPlaylist, topPlaylist, getTopCharts } from "@/api/playlist";
import { mapState } from "vuex";
import SvgIcon from "@/components/SvgIcon";
import CoverRow from "@/components/CoverRow";
import NProgress from "nprogress";

export default {
  name: "Explore",
  components: {
    SvgIcon,
    CoverRow,
  },
  beforeRouteUpdate(to, from, next) {
    this.showLoadMoreButton = false;
    this.hasMore = true;
    this.playlists = [];
    this.offset = 1;
    this.activeCategory = to.query.category;
    this.getPlayList();
    next();
  },
  data() {
    return {
      offset: 1,
      activeCategory: "全部",
      show: false,
      showAllCat: false,
      loadingMore: false,
      hasMore: false,
      showLoadMoreButton: false,
      playlists: [],
      parentCats: ["语种", "风格", "场景", "情感", "主题"],
    };
  },
  computed: {
    ...mapState(["settings"]),
    subText() {
      if (this.activeCategory === "排行榜") return "updateFrequency";
      if (this.activeCategory === "推荐歌单") return "copywriter";
      return "none";
    },
  },
  activated() {
    this.loadData();
  },
  methods: {
    toCategoryRoute(category) {
      this.showAllCat = false;
      this.$router.push({ name: "explore", query: { category } });
    },
    getSubCategory(parentCate) {
      return playlistCategories.filter((c) => c.bigCat === parentCate);
    },
    toggleSubCat(subCateName) {
      //todo
      return subCateName;
    },
    loadData() {
      if (!this.show) {
        NProgress.start();
      }
      const param = this.$route.query.category;
      this.activeCategory = param === undefined ? "全部" : param;
      this.getPlayList();
    },
    getPlayList() {
      this.loadingMore = true;
      switch (this.activeCategory) {
        case "推荐歌单":
          return this.getRecommendPlayList();
        case "精品歌单":
          return this.getHighQualityPlaylist();
        case "排行榜":
          return this.getTopChartList();
        default:
          return this.getListByCategory();
      }
    },
    getRecommendPlayList() {
      getRecPlaylist(100).then((data) => {
        this.playlists = [];
        this.updatePlaylists(data.result);
      });
    },
    getHighQualityPlaylist() {
      let tempList = this.playlists;
      let before = tempList.length !== 0 ? tempList[tempList.length - 1].updateTime : 0;
      highQualityPlaylist({ limit: 50, before }).then((data) => {
        this.updatePlaylists(data.playlists);
        this.hasMore = data.more;
      });
    },
    getTopChartList() {
      getTopCharts().then((data) => {
        this.playlists = [];
        this.updatePlaylists(data.list);
      });
    },
    getListByCategory() {
      const params = {
        cat: this.activeCategory,
        offset: this.playlists.length,
      };
      topPlaylist(params).then((data) => {
        this.updatePlaylists(data.playlists);
        this.hasMore = data.more;
      });
    },
    updatePlaylists(lists) {
      this.playlists.push(...lists);
      this.show = true;
      this.loadingMore = false;
      this.showLoadMoreButton = true;
      NProgress.done();
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  color: var(--color-text);
  font-size: 56px;
  font-weight: 550;
  margin-top: 38px;
  margin-bottom: 38px;
}

.buttons {
  display: flex;
  flex-wrap: wrap;
}

.button {
  user-select: none;
  cursor: pointer;
  padding: 8px 16px;
  margin: 10px 16px 6px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  font-size: 18px;
  border-radius: 10px;
  background-color: var(--color-secondary-bg);
  color: var(--color-secondary);
  transition: 0.2s;

  &:hover {
    background-color: var(--color-primary-bg);
    color: var(--color-primary);
  }
}

.button.active {
  background-color: var(--color-primary-bg);
  color: var(--color-primary);
}

.button.more {
  .svg-icon {
    height: 24px;
    width: 24px;
  }
}

.panel {
  margin-top: 10px;
  background: var(--color-secondary-bg);
  border-radius: 10px;
  padding: 8px;
  color: var(--color-text);

  .big-cat {
    display: flex;
    margin-bottom: 32px;
  }
  .name {
    font-size: 24px;
    font-weight: 700;
    opacity: 0.68;
    margin-left: 24px;
    min-width: 54px;
    height: 26px;
    margin-top: 8px;
  }
  .cats {
    margin-left: 24px;
    display: flex;
    flex-wrap: wrap;
  }
  .cat {
    user-select: none;
    margin: 4px 0 0 0;
    display: flex;
    align-items: center;
    font-weight: 500;
    font-size: 16px;
    transition: 0.2s;
    min-width: 98px;

    span {
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      padding: 6px 12px;
      height: 26px;
      border-radius: 10px;
      opacity: 0.88;
      &:hover {
        opacity: 1;
        background-color: var(--color-primary-bg);
        color: var(--color-primary);
      }
    }
  }
  .cat.active {
    color: var(--color-primary);
  }
}

.playlists {
  margin-top: 24px;
}
</style>
