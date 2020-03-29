import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      redirect: "/index"
    },
    {
      path: "/index",
      name: "index",
      meta: {
        title: "首页"
      },
      component: () => import("@/views/index/index.vue")
    },
    {
      path: "/complain",
      name: "complain",
      meta: {
        title: "申诉"
      },
      component: () => import("@/views/complain/complain.vue")
    }
  ]
});

router.beforeEach((to, from, next) => {
  next();
});

// router.afterEach(route => {});

export default router;
