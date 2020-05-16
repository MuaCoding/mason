import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/welcome/Index.vue";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "welcome_index",
        component: Home,
        meta: { keepAlive: true }, // 缓存
    },
    {
        path: "/confirm",
        name: "confirm",
        component: () => import("../views/member/cart/Confirm.vue"),
        meta: { keepAlive: false }, // 缓存
    },
    {
        path: "/search",
        name: "search",
        component: () => import("../views/welcome/sesrch/Index.vue"),
        meta: { keepAlive: false }, // 缓存
    },
    {
        path: "/search/goods",
        name: "searchGoods",
        component: () => import("../views/welcome/sesrch/Goods.vue"),
        meta: { keepAlive: false }, // 缓存
    },
    {
        path: "/shop/:id",
        name: "shop",
        component: () => import("../views/welcome/shop/Index.vue"),
        meta: { keepAlive: false }, // 缓存
    },
    {
        path: "/auth",
        name: "auth",
        component: () => import("../views/welcome/Auth.vue"),
        meta: { keepAlive: false }, // 缓存
    },
    {
        path: "/pull",
        name: "pullNew",
        component: () => import("../views/pullNew/PullNew.vue"),
        meta: { keepAlive: false }, // o元购拉新
    },
    {
        path: "/member/logistics/:no/:id/:type",
        name: "logistics",
        component: () => import("../views/member/Logistics.vue"),
        meta: { keepAlive: false }, // 缓存
    },
    {
        path: "/member/address",
        name: "address",
        component: () => import("../views/member/address/Index.vue"),
        meta: { keepAlive: false }, // 缓存
    },
    {
        path: "/member/address/form/:id?",
        name: "addressForm",
        component: () => import("../views/member/address/Form.vue"),
        meta: { keepAlive: false }, // 缓存
    },
    {
        path: "/member/attention/:type",
        name: "attention",
        component: () => import("../views/member/Attention.vue"),
        meta: { keepAlive: false }, // 缓存
    },
    {
        path: "/member/comment",
        name: "comment",
        component: () => import("../views/member/comment/Index.vue"),
        meta: { keepAlive: false }, // 缓存
    },
    {
        path: "/member/comment/edit/:id/:no",
        name: "commentEdit",
        component: () => import("../views/member/comment/Edit.vue"),
        meta: { keepAlive: false }, // 缓存
    },
    {
        //  评论
        path: "/member/comment/discuss/:no",
        name: "commentDiscuss",
        component: () => import("../views/member/comment/Discuss.vue"),
        meta: { keepAlive: false }, // 缓存
    },
    {
        //  追加评论
        path: "/member/comment/review/:id",
        name: "commentReview",
        component: () => import("../views/member/comment/Review.vue"),
        meta: { keepAlive: false }, // 缓存
    },
    {
        path: "/member/order/:state?",
        name: "order",
        component: () => import("../views/member/order/Index.vue"),
        meta: { keepAlive: false }, // 缓存
    },
    {
        path: "/member/order/detail/:no",
        name: "orderDetail",
        component: () => import("../views/member/order/Detail.vue"),
        meta: { keepAlive: false }, // 缓存
    },
    {
        path: "/member/order/comment/:id",
        name: "orderComment",
        component: () => import("../views/member/order/Comment.vue"),
        meta: { keepAlive: false }, // 缓存
    },
    {
        path: "/member/order/goods/:id",
        name: "orderGoods",
        component: () => import("../views/member/order/Goods.vue"),
        meta: { keepAlive: false }, // 缓存
    },
    {
        path: "/member/order/valuation/:id",
        name: "orderValuation",
        component: () => import("../views/member/order/Valuation.vue"),
        meta: { keepAlive: false }, // 缓存
    },
    {
        path: "/member/order/form/:id/:onId",
        name: "orderForm",
        component: () => import("../views/member/order/Form.vue"),
        meta: { keepAlive: false }, // 缓存
    },
    {
        //   提交申请售后信息
        path: "/member/order/complain/:prod/:store",
        name: "orderComplain",
        component: () => import("../views/member/order/Complain.vue"),
        meta: { keepAlive: false }, // 缓存
    },
    {
        //   提交退货退款信息
        path: "/member/order/apply/:id/:type",
        name: "orderApply",
        component: () => import("../views/member/order/Apply.vue"),
        meta: { keepAlive: false }, // 缓存
    },
    {
        path: "/member/pay/single/:no",
        name: "paySingle",
        component: () => import("../views/member/pay/Single.vue"),
        meta: { keepAlive: false }, // 缓存
    },
    {
        path: "/member/pay/single1",
        name: "paySingle1",
        component: () => import("../views/member/pay/Single1.vue"),
        meta: { keepAlive: false }, // 缓存
    },
    {
        path: "/member/pay/multi/:no",
        name: "payMulti",
        component: () => import("../views/member/pay/Multi.vue"),
        meta: { keepAlive: false }, // 缓存
    },
    {
        path: "/member/pay/multi1",
        name: "payMulti1",
        component: () => import("../views/member/pay/Multi1.vue"),
        meta: { keepAlive: false }, // 缓存
    },
    {
        path: "/pay/success/:no",
        name: "paySuccess",
        component: () => import("../views/member/pay/Success.vue"),
        meta: { keepAlive: false }, // 缓存
    },
    {
        path: "/pay/fail/:no",
        name: "payFail",
        component: () => import("../views/member/pay/Fail.vue"),
        meta: { keepAlive: false }, // 缓存
    },
    {
        path: "/member/refund/:state?",
        name: "refund",
        component: () => import("../views/member/refund/Index.vue"),
        meta: { keepAlive: false }, // 缓存
    },
    {
        //
        path: "/member/refund/apply/:id",
        name: "refundApply",
        component: () => import("../views/member/refund/Apply.vue"),
        meta: { keepAlive: false }, // 缓存
    },
    {
        //申诉
        path: "/member/refund/complain/:id/:prodId",
        name: "refundComplain",
        component: () => import("../views/member/refund/Complain.vue"),
        meta: { keepAlive: false }, // 缓存
    },
    {
        //回寄商品
        path: "/member/refund/foster/:id",
        name: "refundFoster",
        component: () => import("../views/member/refund/Foster.vue"),
        meta: { keepAlive: false }, // 缓存
    },
    {
        path: "/member/refund/detail/:id",
        name: "refundDetail",
        component: () => import("../views/member/refund/Detail.vue"),
        meta: { keepAlive: false }, // 缓存
    },
    {
        path: "/member/refund/edit/:no",
        name: "refundEdit",
        component: () => import("../views/member/refund/Edit.vue"),
        meta: { keepAlive: false }, // 缓存
    },
    {
        path: "/member/refund/goods/:id",
        name: "refundGoods",
        component: () => import("../views/member/refund/Goods.vue"),
        meta: { keepAlive: false }, // 缓存
    },
    {
        path: "/member/service/:state?",
        name: "service",
        component: () => import("../views/member/service/Index.vue"),
        meta: { keepAlive: false }, // 缓存
    },
    {
        path: "/member/service/detail/:id",
        name: "serviceDetail",
        component: () => import("../views/member/service/Detail.vue"),
        meta: { keepAlive: false }, // 缓存
    },
    {
        path: "/member/service/complain/:id/:prodId",
        name: "serviceComplain",
        component: () => import("../views/member/service/Complain.vue"),
        meta: { keepAlive: false }, // 缓存
    },
    {
        path: "/member/service/foster/:id",
        name: "serviceFoster",
        component: () => import("../views/member/service/Foster.vue"),
        meta: { keepAlive: false }, // 缓存
    },
    {
        path: "/goods/:id/:invite?",
        name: "goods",
        component: () => import("../views/welcome/goods/Index.vue"),
        meta: { keepAlive: false }, // 缓存
    },

    {
        path: "/help",
        name: "Help",
        component: () => import("../views/welcome/Help.vue"),
        meta: { keepAlive: false }, // 缓存
    },
    {
        path: "/payResult/:no",
        name: "payResult",
        component: () => import("../views/member/pay/PayResult.vue"),
        meta: { keepAlive: false }, // 缓存
    },
    {
        path: "/share",
        name: "Share",
        component: () => import("../views/welcome/Share.vue"),
        meta: { keepAlive: false }, // 缓存
    },
    {
        path: "/topic/active1/:id",
        name: "Active1",
        component: () => import("../views/welcome/topic/Active1.vue"),
        meta: { keepAlive: false }, // 缓存
    },
    {
        path: "/topic/active2/:id/:index?",
        name: "Active2",
        component: () => import("../views/welcome/topic/Active2.vue"),
        meta: { keepAlive: false }, // 缓存
    },
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes,
});

router.beforeEach((to, from, next) => {
    next();

    /**
     * 1.判断该路由是否需要登录权限
     * 2.判断登录信息是否过期
     */
    // set_title(to.meta.title); //设置窗口页标题

    // let flag;
    // try {
    //     var a = store.state.token.split(".")[1],
    //         h = new Date(1e3 * JSON.parse(Base64.decode(a)).exp);
    //     flag = h > new Date();
    // } catch (t) {
    //     flag = !1;
    // }

    // if (!flag && to.path !== "/login" && "/logout" !== to.path) {
    //     // 判断该路由是否需要登录权限
    //     iView.LoadingBar.finish();
    //     iView.Modal.error({
    //         title: "错误信息",
    //         content: "您的用户状态已失效，请前往登录页面重新登录",
    //         onOk: function() {
    //             router.push({
    //                 path: "/login",
    //             });
    //         },
    //     });
    // }
});

router.afterEach((to, from) => {
    // ...

    window.scrollTo(0, 0);
});

export default router;
