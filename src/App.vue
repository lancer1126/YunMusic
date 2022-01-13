<template>
  <div id="app" :class="{ 'user-select-none': userSelectNone }">
    <NavBar v-show="showNavBar" ref="scrollbar" />
  </div>
</template>

<script>
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
    showNavBar() {
      return this.$route.name !== "lastfmCallback";
    },
  },
};
</script>

<style scoped></style>
