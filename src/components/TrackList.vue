<template>
  <div>
    <div :style="listStyles">
      <TrackItem
        v-for="(track, index) in tracks"
        :key="itemKey === 'id' ? track.id : `${track.id}${index}`"
        :track-prop="track"
        :highlight-playing="highlightPlaying"
      />
    </div>
  </div>
</template>

<script>
import TrackItem from "@/components/TrackItem";
export default {
  name: "TrackList",
  components: { TrackItem },
  props: {
    tracks: {
      type: Array,
      default: () => {
        return [];
      },
    },
    type: {
      type: String,
      default: "tracklist",
    },
    itemKey: {
      type: String,
      default: "id",
    },
    highlightPlaying: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      listStyles: {},
      rightClickedTrack: {
        id: 0,
        name: "",
        ar: [{ name: "" }],
        al: { picUrl: "" },
      },
    };
  },
  created() {
    if (this.type === "tracklist") {
      this.listStyles = {
        display: "grid",
        gap: "4px",
        gridTemplateColumns: `repeat(${this.columnNumber}, 1fr)`,
      };
    }
  },
};
</script>

<style scoped></style>
