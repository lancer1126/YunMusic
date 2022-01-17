import Vue from "vue";
import Vuex from "vuex";
import state from "./state";
import mutations from "@/store/mutations";
import Player from "@/utils/Player";

Vue.use(Vuex);
const options = {
  state,
  mutations,
};

const store = new Vuex.Store(options);

let player = new Player();
player = new Proxy(player, {
  set(target, prop, value) {
    target[prop] = value;
    if (prop === "_howler") return true;
    target.saveSelfToLocalStorage();
    return true;
  },
});

store.state.player = player;

export default store;
