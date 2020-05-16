import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./registerServiceWorker";
import Vant from "vant";
import "vant/lib/index.css";
import apps from "./assets/apps.js";
import { Locale, Lazyload } from "vant";
import enUS from "vant/lib/locale/lang/en-US";
import zhCN from "vant/lib/locale/lang/zh-CN";
import zhTW from "vant/lib/locale/lang/zh-TW";
import messages from "./assets/locale";
import VueI18n from "vue-i18n";
import waterfall from "vue-waterfall2";
import VueClipboard from "vue-clipboard2";

import * as filters from "./filters/filters";
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key]);
});

Vue.use(Vant);
Vue.use(Lazyload);
Vue.use(VueI18n);
Vue.use(waterfall);
Vue.use(VueClipboard);

Vue.config.productionTip = false;

Vue.prototype.$apps = apps;

let lang = navigator.language || navigator.userLanguage;
// lang = 'en-US'

// switch (lang) {
//   case 'zh-CN':
//     Locale.use('zh-CN', zhCN);
//     break;
//   case 'zh-TW':
//   case 'zh-HK':
//     Locale.use('zh-TW', zhTW);
//     break;
//   default:
//     Locale.use('en-US', enUS)
// }
Locale.use("zh-CN", zhCN);
const i18n = new VueI18n({
    //定义默认语言
    locale: lang,
    messages
});

// Vue.directive("binding", {
//     bind: function(el, binding, vnode) {
//         console.log(binding)
//     },
// });

localStorage.setItem("lang", lang);
//  设置是否返回
localStorage.setItem("is_back", 0);

new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount("#app");
