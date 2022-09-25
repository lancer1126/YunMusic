<template>
  <div>
    <div :style="listStyles">
      <TrackItem
        v-for="(track, index) in tracks"
        :key="itemKey === 'id' ? track.id : `${track.id}${index}`"
        :track-prop="track"
        :highlight-playing="highlightPlaying"
        @dblclick.native="playThisList(track.id || track.songId)"
      />
    </div>
  </div>
</template>

<script>
import TrackItem from "@/components/TrackItem";
import { mapState } from "vuex";
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
    dbclickTrackFunc: {
      type: String,
      default: "default",
    },
    id: {
      type: Number,
      default: 0,
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
  computed: {
    ...mapState(["player"]),
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
  methods: {
    playThisList(trackId) {
      if (this.dbclickTrackFunc === "default") {
        this.playTrackListDefault(trackId);
      }
    },
    playTrackListDefault(trackId) {
      if (this.type === "playlist") {
        this.player.playPlaylistById(this.id, trackId);
      }
    },
  },
};
</script>

<style scoped></style>
