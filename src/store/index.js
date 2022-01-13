import Vue from "vue";
import Vuex from "vuex";
import state from "./state";

Vue.use(Vuex);
const options = {
  state,
};

const store = new Vuex.Store(options);

export default store;
