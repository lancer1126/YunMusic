<template>
  <svg-icon icon-class="explicit" :style="svgStyle"></svg-icon>
</template>

<script>
export default {
  name: "ExplicitSymbol",
  props: {
    size: {
      type: Number,
      default: 16,
    },
  },
  data() {
    return {
      svgStyle: {},
    };
  },
  created() {
    this.svgStyle = {
      height: this.size + "px",
      width: this.size + "px",
    };
  },
};
</script>

<style lang="scss" scoped></style>
