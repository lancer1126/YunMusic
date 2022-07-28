<template>
  <button :style="buttonStyle" :class="color">
    <svg-icon v-if="iconClass !== null" :icon-class="iconClass" />
    <slot></slot>
  </button>
</template>

<script>
import SvgIcon from "@/components/SvgIcon";

export default {
  name: "ButtonTwoTone",
  components: {
    SvgIcon,
  },
  props: {
    iconClass: {
      type: String,
      default: null,
    },
    color: {
      type: String,
      default: "blue",
    },
    horizontalPadding: {
      type: Number,
      default: 16,
    },
    iconButton: {
      type: Boolean,
      default: false,
    },
    textColor: {
      type: String,
      default: "",
    },
    shape: {
      type: String,
      default: "square",
    },
    backgroundColor: {
      type: String,
      default: "",
    },
  },
  computed: {
    buttonStyle() {
      let styles = {
        borderRadius: this.shape === "round" ? "50%" : "8px",
        padding: `8px ${this.horizontalPadding}px`,
        width: this.shape === "round" ? "38px" : "auto",
      };
      if (this.backgroundColor !== "") styles.backgroundColor = this.backgroundColor;
      if (this.textColor !== "") styles.color = this.textColor;
      return styles;
    },
  },
};
</script>

<style lang="scss" scoped>
button {
  height: 40px;
  min-width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  line-height: 18px;
  font-weight: 600;
  background-color: var(--color-primary-bg);
  color: var(--color-primary);
  margin-right: 12px;
  transition: 0.2s;
  user-select: none;
  .svg-icon {
    width: 16px;
    height: 16px;
  }
  &:hover {
    transform: scale(1.08);
  }
  &:active {
    transform: scale(0.94);
  }
}
button.grey {
  background-color: var(--color-secondary-bg);
  color: var(--color-text);
  opacity: 0.78;
}
button.transparent {
  background-color: transparent;
}
</style>
