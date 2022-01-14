import Vue from "vue";
import Vuex from "vuex";
import state from "./state";
import mutations from "@/store/mutations";

Vue.use(Vuex);
const options = {
  state,
  mutations,
};

const store = new Vuex.Store(options);

export default store;
