<template>
  <div id="app" :class="{ 'user-select-none': userSelectNone }">
    <ScrollBar v-show="true" ref="scrollBar" />
    <NavBar v-show="showNavBar" ref="navBar" />

    <!-- 页面主体部分-->
    <main ref="main" :style="{ overflow: enableScrolling ? 'auto' : 'hidden' }" @scroll="handleScroll">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </main>

    <!-- 底部播放栏 -->
    <transition name="slide-up">
      <Player v-if="enablePlayer" v-show="showPlayer" ref="player" />
    </transition>
  </div>
</template>

<script>
import { mapState } from "vuex";
import NavBar from "./components/NavBar";
import Player from "@/components/Player";
import ScrollBar from "@/components/ScrollBar";

export default {
  name: "App",
  components: {
    ScrollBar,
    Player,
    NavBar,
  },
  data() {
    return {
      userSelectNone: false,
    };
  },
  computed: {
    ...mapState(["enableScrolling", "player", "showLyrics"]),
    showNavBar() {
      return this.$route.name !== "lastfmCallback";
    },
    enablePlayer() {
      return this.player.enabled && this.$route.name !== "lastfmCallback";
    },
    showPlayer() {
      return ["mv", "loginUsername", "login", "loginAccount", "lastfmCallback"].includes(this.$route.name) === false;
    },
  },
  created() {
    window.addEventListener("keydown", this.handleKeydown);
    this.fetchData();
  },
  methods: {
    handleScroll() {
      this.$refs.scrollBar.handleScroll();
    },
    handleKeydown(e) {
      if (e.code === "Space") {
        if (e.target.tagName === "INPUT") return false;
        if (this.$route.name === "mv") return false;
        e.preventDefault();
      }
    },
    fetchData() {
      return null;
    },
  },
};
</script>

<style lang="scss">
#app {
  width: 100%;
  transition: all 0.4s;
}

main {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  overflow: auto;
  padding: 64px 10vw 96px 10vw;
  box-sizing: border-box;
}

@media (max-width: 1336px) {
  main {
    padding: 64px 5vw 96px 5vw;
  }
}

main::-webkit-scrollbar {
  width: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.4s;
}
.slide-up-enter,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>
