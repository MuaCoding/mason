import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        //loading状态
        isLoading: !1,
        tabBarValue: sessionStorage.getItem("ORDERBAR"),
        refundBarValue: sessionStorage.getItem("REFUNDBAR"),
        serviceBarValue: sessionStorage.getItem("SERVICEBAR"),
        fromApp: sessionStorage.getItem("FROMAPP"),
        ORDERBAR: "ORDERBAR",
        REFUNDBAR: "REFUNDBAR",
        SERVICEBAR: "SERVICEBAR",
        FROMAPP: "FROMAPP",
    },
    getters: {
        GET_ORDERBAR: (state) => {
            return state.tabBarValue;
        },
        GET_REFUNDBAR: (state) => {
            return state.refundBarValue;
        },
        GET_SERVICEBAR: (state) => {
            return state.serviceBarValue;
        },
        GET_FROMAPP: (state) => {
            return state.fromApp;
        },
    },
    mutations: {
        SET_LOADING(state) {
            state.isLoading = !state.isLoading;
        },
        SET_LOCALSTORAGE(state, value) {
            if (typeof JSON.parse(value) == "object") {
                let payload = JSON.parse(value);
                sessionStorage.setItem(payload.name, payload.value);
            }
            state.tabBarValue = sessionStorage.getItem(state.ORDERBAR);
            state.refundBarValue = sessionStorage.getItem(state.REFUNDBAR);
            state.serviceBarValue = sessionStorage.getItem(state.SERVICEBAR);
            state.fromApp = sessionStorage.getItem(state.FROMAPP);
        },
        REMOVE_LOCALSTORAGE() {
            sessionStorage.removeItem(ORDERBAR);
        },
    },
    actions: {
        SET_LOADING({ commit }) {
            commit("SET_LOADING", true);
        },
        SET_LOCALSTORAGE({ commit }, value) {
            commit("SET_LOCALSTORAGE", value);
        },
        REMOVE_LOCALSTORAGE({ commit }) {
            commit("REMOVE_LOCALSTORAGE");
        },
    },
    modules: {},
});
