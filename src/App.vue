<template>
  <div id="app" :class="{ 'user-select-none': userSelectNone }">
    <NavBar v-show="showNavBar" ref="navBar" />

    <!-- 页面主体部分-->
    <main
      ref="main"
      :style="{ overflow: enableScrolling ? 'auto' : 'hidden' }"
      @scroll="handleScroll"
    >
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </main>
  </div>
</template>

<script>
import { mapState } from "vuex";
import NavBar from "./components/NavBar";

export default {
  name: "App",
  components: {
    NavBar,
  },
  data() {
    return {
      isElectron: process.env.IS_ELECTRON,
      userSelectNone: false,
    };
  },
  computed: {
    ...mapState(["enableScrolling"]),
    showNavBar() {
      return this.$route.name !== "lastfmCallback";
    },
  },
  methods: {
    handleScroll() {
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
  width: 0px;
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
