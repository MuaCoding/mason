<template>
    <div>
        <div :style="{ height: heights + 'px' }" v-if="iosShow && active != 3" class="headIos"></div>
        <van-nav-bar
            :fixed="true"
            class="index-search-nav"
            left-arrow
            style="z-index: 100"
            @click-left="onBack"
            v-show="active == 0 || active == 1"
            :border="true"
        >
            <div slot="title" @click="gotoSearch" class="index-search-nav-title">
                <div style="border: #f6f6f6 solid 1px; height: 30px; line-height: 30px; border-radius: 15px; background: #f6f6f6;">
                    <van-icon name="search" class="align-middle" color="#999999"></van-icon>
                    <span class="text-99 fs-12">请输入你想要搜索的关键词</span>
                </div>
            </div>
            <div slot="right"></div>
        </van-nav-bar>

        <van-nav-bar v-show="active == 2" class="index-search-nav cart-nav" :title="title" :border="true" :fixed="true">
            <van-icon slot="left" @click="onBack" name="arrow-left"></van-icon>
            <van-icon slot="right" @click="editCart" :name="editCartIcon"></van-icon>
        </van-nav-bar>

        <!-- 首页 -->
        <div class="tab-0" style="padding-top: 47px" v-show="active == 0">
            <van-swipe :autoplay="3000" :height="150" :width="clientWidth">
                <van-swipe-item @click="swipeItemGoTo(item)" v-for="(item, index) in images" :key="index">
                    <!-- <img v-lazy="image"/> -->
                    <!-- <img style="width: 100%" :src="item.image" alt=""> -->
                    <van-image style="width: 100%" fit="fill" :src="item.image | imageView2(clientWidth * 2, 300)"></van-image>
                </van-swipe-item>
            </van-swipe>
            <van-grid :column-num="5" :border="false">
                <van-grid-item
                    class="van-ellipsis"
                    v-for="(item, index) in index_cate"
                    :key="index"
                    :to="{ path: '/search/goods', query: { cid: item.id } }"
                >
                    <van-image width="40" height="40" lazy-load fit="fill" slot="icon" :src="item.image | imageView2(150)"></van-image>
                    <span class="fs-10 text-66 van-ellipsis" slot="text">{{ item.name }}</span>
                </van-grid-item>
            </van-grid>
            <!-- 免费领好物 -->
            <div class="free-box" v-if="index_cate.length > 0">
                <div class="free-cover" @click="$router.push('/pull?' + 1)"></div>
            </div>
            <!-- 活动主题一 -->
            <template v-if="actives">
                <div v-for="(item, index) in actives" :key="index">
                    <div v-if="index == 'theme1' && item.length > 0" class="pb-2 topic1-list">
                        <van-tabs
                            @change="onChangeTheme1"
                            style="padding-bottom: 0"
                            v-model="activeActives"
                            :border="false"
                            :line-width="0"
                            :line-height="0"
                            color="#616161"
                            title-active-color="#212121"
                            sticky
                        >
                            <van-tab v-for="(m, i) in item" :key="i">
                                <div slot="title" :class="activeActives == i ? 'strong fs-14' : 'fs-12'">
                                    {{ m.title }}
                                </div>
                                <div style="padding-left: 15px" v-if="activeGoods[i]">
                                    <scroll-horizontally :data="activeGoods[i].sku_list" :more_url="'/topic/active1/' + m.id"></scroll-horizontally>
                                </div>
                                <div class="text-center py-3" v-else>
                                    <van-loading />
                                </div>
                            </van-tab>
                            <van-tab :disabled="true"></van-tab>
                            <van-tab :disabled="true"></van-tab>
                        </van-tabs>
                    </div>
                    <div v-else-if="index == 'theme2' && item.length > 0" style="padding: 0 15px 15px 15px">
                        <van-row class="topic-theme2-container rounded-5 mt-3">
                            <van-col span="12" v-for="(m, i) in item" :key="i" class="topic-theme2-item" style="padding: 8px">
                                <router-link class="d-block" :to="'/topic/active2/' + m.id + '/' + i">
                                    <div class="fs-14 line-height-12">
                                        <strong>{{ m.title }}</strong>
                                    </div>
                                    <div>
                                        <van-row class="mt-1">
                                            <van-col
                                                class="text-center"
                                                style="height: 60px; height: 60px"
                                                span="12"
                                                v-for="(img, im) in m.list_images"
                                                :key="im"
                                            >
                                                <van-image fit="cover" width="60" height="60" :src="img | imageView2(100)" />
                                            </van-col>
                                        </van-row>
                                    </div>
                                </router-link>
                            </van-col>
                        </van-row>
                    </div>
                </div>
            </template>
            <goods-list-4 :max="5" :filter="{ order: 'rank_asc,sale_nums_desc,id_desc' }" style="padding-bottom: 40px"></goods-list-4>
        </div>
        <!-- 类目 -->
        <div class="tab-1" style="padding-top: 47px" v-show="active === 1">
            <common-loading style="background: #fff" v-show="categorys.length === 0" msg="加载中..."></common-loading>
            <van-tree-select
                v-show="categorys.length > 0"
                :items="categorys"
                :active-id.sync="activeId"
                :main-active-index.sync="activeId"
                :height="clientHeight - 96"
                @click-nav="chooseCategory"
            >
                <div class="p-2" id="tree-container" :class="'tree-aa'" slot="content">
                    <div v-for="(item, index) in categorys" :key="index" :id="'tree-container-' + index">
                        <!--ref="tree"-->
                        <template v-if="activeId == index">
                            <div v-for="(item1, index1) in item.child" :key="index1">
                                <div>{{ item1.name }}</div>
                                <van-grid :column-num="3" :border="false">
                                    <van-grid-item
                                        class="van-ellipsis"
                                        v-for="(item2, index2) in item1.child"
                                        :key="index2"
                                        :to="{ path: '/search/goods', query: { cid: item2.id } }"
                                    >
                                        <!-- <img width="60" height="60" v-lazy="item2.image|imageView2" slot="icon" /> -->
                                        <van-image width="60" height="60" lazy-load slot="icon" :src="item2.image | imageView2(150)" />
                                        <span class="fs-10 text-66 van-ellipsis" slot="text">{{ item2.name }}</span>
                                    </van-grid-item>
                                </van-grid>
                            </div>
                        </template>
                    </div>
                </div>
            </van-tree-select>
        </div>
        <!-- 购物车 -->
        <div class="tab-2 mt-nav" style="padding-bottom: 100px" v-show="active === 2">
            <!-- <van-checkbox-group v-model="cartCheckboxAll" ref="checkboxGroups"> -->
            <div class="cart-list">
                <div class="cart-shop-item" v-for="(item, index) in carts" :key="index">
                    <!-- <van-checkbox-group v-model="selectedCartShops[index]" ref="checkboxGroup"> -->
                    <van-cell-group :border="false">
                        <van-cell>
                            <div slot="icon">
                                <span class="d-inline-block mr-1 align-middle">
                                    <van-checkbox
                                        checked-color="#ee0a24"
                                        v-model="shopIsSelected[index]"
                                        :data-index="index"
                                        @change="changeCartShop"
                                        @click="selectedCartShop(index, shopIsSelected[index])"
                                        icon-size="16"
                                    ></van-checkbox
                                ></span>
                                <!-- <span class="d-inline-block mr-1 align-middle"><van-image width="20" height="20" :src="item[0].shop.logo" /></span> -->
                                <router-link class="align-middle text-33" slot="title" :to="'/shop/' + item[0].shop.id">{{
                                    item[0].shop.name
                                }}</router-link>
                            </div>
                        </van-cell>
                    </van-cell-group>
                    <div class="cart-goods-list" v-for="(good, goods) in item" :key="goods">
                        <div class="cart-goods-item van-hairline--top">
                            <van-row class="cart-goods-card" gutter="0">
                                <van-col span="1"></van-col>
                                <!-- @click="onChangeCartGoods(good, index, goods)"  -->
                                <van-col span="2" class="text-center">
                                    <van-checkbox
                                        checked-color="#ee0a24"
                                        v-model="good.isSelected"
                                        @click="goodsIsSeleted(index, goods, good.isSelected)"
                                        :name="+index + ',' + goods"
                                        class="cart-goods-checkbox"
                                        icon-size="16"
                                    ></van-checkbox>
                                </van-col>
                                <van-col span="21">
                                    <van-card
                                        style="margin-top: 0"
                                        :num="good.num"
                                        :price="good.sku.activity_is == 1 ? good.sku.activity_price : good.sku.price"
                                        :desc="good.sku.name"
                                        :title="good.goods.name"
                                        :thumb="good.goods.master_image"
                                    >
                                        <!-- <div slot="tags">
                                                    <van-tag plain type="danger">标签</van-tag>
                                                    <van-tag plain type="danger">标签</van-tag>
                                                </div> -->
                                        <div slot="num">
                                            <span v-show="editCartShow">
                                                <van-stepper v-model="good.num" min="1" :max="good.sku.nums" @change="onChangeCartGoodNum(good)" />
                                            </span>
                                            <span class="text-99" v-show="!editCartShow"> x {{ good.num }} </span>
                                        </div>
                                        <div slot="footer" class="mt-2" v-show="editCartShow">
                                            <van-button @click="onDeleteCartGood(good, index, goods)" type="danger" size="mini">删除</van-button>
                                        </div>
                                        <div slot="bottom" v-if="good.sku.buy_score > 0">
                                            <span class="fs-10 buy-score-span">购物分抵￥{{ good.sku.buy_score | formatBuyScore(good.num) }}</span>
                                        </div>
                                    </van-card>
                                </van-col>
                            </van-row>
                        </div>
                    </div>
                    <!-- </van-checkbox-group> -->
                    <div class="bg-f6 p-1"></div>
                </div>
            </div>
            <common-no-data :show="carts.length === 0"></common-no-data>
            <van-submit-bar
                style="bottom: 50px;"
                :price="totalSku.price * 100"
                button-text="去结算"
                @submit="onSubmit"
                :disabled="subDisabled"
                :loading="subLoading"
            >
                <van-checkbox
                    checked-color="#ee0a24"
                    :disabled="carts.length === 0"
                    class="ml-3"
                    @change="checkAllShop"
                    @click="checkAllShopClick"
                    v-model="cart_checked"
                    >全选</van-checkbox
                >
                <!-- <span slot="tip">
                        你的收货地址不支持同城送, <span>修改地址</span>
                    </span> -->
            </van-submit-bar>
            <!-- </van-checkbox-group> -->
        </div>
        <!-- 用户中心 -->
        <div class="tab-3 mb-5 pb-3 bg-f6" v-if="active === 3">
            <section class="member-header special">
                <van-nav-bar class="index-search-nav" :border="false" :fixed="false">
                    <van-icon slot="left" @click="onBack" name="arrow-left"></van-icon>
                </van-nav-bar>
                <div class="member-background mt-5">
                    <div class="text-center avatar">
                        <van-image width="60" height="60" round :src="user.avatar || '/img/avatar.png'" />
                    </div>
                    <h5 class="text-center text-secondary m-0">
                        {{ user.login_name || "请登录" }}
                    </h5>
                    <van-grid :column-num="3">
                        <van-grid-item to="/member/address">
                            <i class="icon icon-addr"></i>
                            <span class="fs-12 text-secondary">收货地址</span>
                        </van-grid-item>
                        <van-grid-item to="/member/attention/0">
                            <i class="icon icon-prod"></i>
                            <span class="fs-12 text-secondary">收藏商品</span>
                        </van-grid-item>
                        <van-grid-item to="/member/attention/1">
                            <i class="icon icon-store"></i>
                            <span class="fs-12 text-secondary">收藏店铺</span>
                        </van-grid-item>
                    </van-grid>
                </div>
            </section>

            <section class="navigation">
                <div class="navigation-item">
                    <van-cell title="我的订单" class="rounded-6" value="查看全部" is-link :border="false" @click="goto('order', 0)" />
                    <van-grid>
                        <van-grid-item @click="goto('order', 1)" :info="orderStatistics.order['0']">
                            <i class="badge" v-show="orderStatistics.order['0'] > 0">{{ outOfNum(orderStatistics.order["0"], 99) }}</i>
                            <i class="icon icon-payment"></i>
                            <span class="fs-12 text-secondary-dark">待付款</span>
                        </van-grid-item>
                        <van-grid-item @click="goto('order', 2)" :info="orderStatistics.order['10']">
                            <i class="badge" v-show="orderStatistics.order['10'] > 0">{{ outOfNum(orderStatistics.order["10"], 99) }}</i>
                            <i class="icon icon-deliver"></i>
                            <span class="fs-12 text-secondary-dark">待发货</span>
                        </van-grid-item>
                        <van-grid-item @click="goto('order', 3)" :info="orderStatistics.order['20']">
                            <i class="badge" v-show="orderStatistics.order['20'] > 0">{{ outOfNum(orderStatistics.order["20"], 99) }}</i>
                            <i class="icon icon-take"></i>
                            <span class="fs-12 text-secondary-dark">待收货</span>
                        </van-grid-item>
                        <van-grid-item @click="goto('order', 4)">
                            <i class="badge" v-show="orderStatistics.order['30'] > 0">{{ outOfNum(orderStatistics.order["30"], 99) }}</i>
                            <i class="icon icon-done"></i>
                            <span class="fs-12 text-secondary-dark">已完成</span>
                        </van-grid-item>
                    </van-grid>
                </div>
                <div class="navigation-item">
                    <van-cell title="我的退款" class="rounded-6" value="查看全部" is-link :border="false" @click="goto('refund', 0)" />
                    <van-grid>
                        <van-grid-item @click="goto('refund', 1)">
                            <i class="badge" v-show="orderStatistics.refund_count.buyer_op_count > 0">{{
                                outOfNum(orderStatistics.refund_count.buyer_op_count, 99)
                            }}</i>
                            <i class="icon icon-buyer"></i>
                            <span class="fs-12 text-secondary-dark">买家操作</span>
                        </van-grid-item>
                        <van-grid-item @click="goto('refund', 2)">
                            <i class="badge" v-show="orderStatistics.refund_count.seller_op_count > 0">{{
                                outOfNum(orderStatistics.refund_count.seller_op_count, 99)
                            }}</i>
                            <i class="icon icon-business"></i>
                            <span class="fs-12 text-secondary-dark">商家操作</span>
                        </van-grid-item>
                        <van-grid-item @click="goto('refund', 3)">
                            <i class="icon icon-cancel"></i>
                            <span class="fs-12 text-secondary-dark">已取消</span>
                        </van-grid-item>
                        <van-grid-item @click="goto('refund', 4)">
                            <i class="icon icon-done"></i>
                            <span class="fs-12 text-secondary-dark">已完成</span>
                        </van-grid-item>
                    </van-grid>
                </div>
                <div class="navigation-item">
                    <van-cell title="我的售后" class="rounded-6" value="查看全部" is-link :border="false" @click="goto('service', 0)" />
                    <van-grid>
                        <van-grid-item @click="goto('service', 1)">
                            <i class="badge" v-show="orderStatistics.service_count.buyer_op_count > 0">{{
                                outOfNum(orderStatistics.service_count.buyer_op_count, 99)
                            }}</i>
                            <i class="icon icon-buyer"></i>
                            <span class="fs-12 text-secondary-dark">买家操作</span>
                        </van-grid-item>
                        <van-grid-item @click="goto('service', 2)">
                            <i class="badge" v-show="orderStatistics.service_count.seller_op_count > 0">{{
                                outOfNum(orderStatistics.service_count.seller_op_count, 99)
                            }}</i>
                            <i class="icon icon-business"></i>
                            <span class="fs-12 text-secondary-dark">商家操作</span>
                        </van-grid-item>
                        <van-grid-item @click="goto('service', 3)">
                            <i class="icon icon-cancel"></i>
                            <span class="fs-12 text-secondary-dark">已取消</span>
                        </van-grid-item>
                        <van-grid-item @click="goto('service', 4)">
                            <i class="icon icon-done"></i>
                            <span class="fs-12 text-secondary-dark">已完成</span>
                        </van-grid-item>
                    </van-grid>
                </div>
                <div class="navigation-item">
                    <van-cell title="我的评论" class="rounded-6" is-link to="/member/comment"> </van-cell>
                </div>
            </section>
            <div v-if="is_wechat > -1" class="p-3">
                <van-button @click="logout" block type="default" class="text-66">退出登录</van-button>
            </div>

            <!-- <van-cell-group class="mt-3">
                <van-cell title="我的评价" icon="flower-o" is-link to="/member/comment"> </van-cell>
                <van-cell icon="service-o" title="帮助中心" is-link to="/help" />
            </van-cell-group> -->
        </div>

        <van-tabbar v-model="active" active-color="#FB5870" @change="changeTabbar">
            <van-tabbar-item icon="home-o">首页</van-tabbar-item>
            <van-tabbar-item icon="apps-o">类目</van-tabbar-item>
            <van-tabbar-item icon="cart-o">购物车</van-tabbar-item>
            <van-tabbar-item icon="user-circle-o">我的</van-tabbar-item>
        </van-tabbar>

        <!--广告弹窗-->
        <van-dialog :show-confirm-button="false" class="index-ad-dialog" v-model="indexAd" :show-cancel-button="false">
            <div class="index-ad-content">
                <div>
                    <van-image @click="adRoute" class="w-100 align-middle" :src="ad.image" />
                </div>
                <div class="text-center index-ad-content-close p-3">
                    <van-icon @click="indexAd = false" class="text-white" size="30" name="cross" />
                </div>
            </div>
        </van-dialog>
    </div>
</template>

<script>
import {
    Button,
    Tabbar,
    TabbarItem,
    Grid,
    GridItem,
    Cell,
    CellGroup,
    TreeSelect,
    NavBar,
    Card,
    SubmitBar,
    Swipe,
    SwipeItem,
    Checkbox,
    CheckboxGroup,
    Icon,
    Row,
    Col,
    Stepper,
    Toast,
    Dialog,
    Image,
} from "vant";
import GoodsList4 from "../../components/GoodsList2";
import CommonNoData from "../../components/NoData";
import CommonLoading from "../../components/Loading";
import ScrollHorizontally from "../../components/common/ScrollHorizontally";
import MallHeader from "../../components/common/MallHeader";
// import { outOfNum } from "../../utils/utils";
import { Detect, DetectAgent } from "../../utils/utils";
import { mapActions } from "vuex";
export default {
    components: {
        MallHeader,
        Button,
        Tabbar,
        TabbarItem,
        Grid,
        GridItem,
        Cell,
        CellGroup,
        TreeSelect,
        NavBar,
        CommonLoading,
        Card,
        SubmitBar,
        Swipe,
        SwipeItem,
        Checkbox,
        CheckboxGroup,
        Icon,
        Row,
        Col,
        Stepper,
        Dialog,
        CommonNoData,
        GoodsList4,
        ScrollHorizontally,
    },
    data() {
        return {
            iosShow: false,
            heights: 0,
            active: 0,
            title: "MASON",
            cart_checked: false,
            activeId: 0,
            images: [],
            clientWidth: 375,
            clientHeight: 667,
            cartCheckboxAll: [],
            index_cate: [],
            categorys: [],
            user: {},
            carts: {},
            editCartShow: false,
            editCartIcon: "edit",
            selectedCartShops: [],
            cartTotalAmount: 0.0,
            totalSku: {
                sku: [],
                price: 0.0,
                score: 0.0,
                ids: [],
            },
            subDisabled: true,
            subLoading: false,
            cartShops: [],
            orderStatistics: {
                order: {},
                service_count: {},
                refund_count: {},
            },
            scrollTop: 0,
            shopIsSelected: [],
            is_wechat: false,
            is_login: false,
            indexAd: false,
            ad: {},
            actives: [],
            activeActives: 0,
            activeGoods: [],
            flag: false, //判断是否在app中
            current: {
                // 判断路由
                order: "ORDERBAR",
                refund: "REFUNDBAR",
                service: "SERVICEBAR",
            },
        };
    },
    methods: {
        onBack() {
            if (Detect() == "android") {
                try {
                    window.android.closeActivity();
                } catch (error) {
                    this.$toast("Android error", error);
                }
            } else if (Detect() == "ios") {
                try {
                    window.ios.closeActivity();
                } catch (error) {
                    this.$toast("IOS error", error);
                }
            }
        },
        // 数字处理
        outOfNum(val, maxNum) {
            val = val ? val - 0 : 0;
            if (val > maxNum) {
                return `${maxNum}+`;
            } else {
                return val;
            }
        },
        ...mapActions(["SET_LOCALSTORAGE"]),
        // 路由跳转
        goto(router, key) {
            this.$router.push("/member/" + router + "/" + key);
            this.SET_LOCALSTORAGE(JSON.stringify({ name: this.current[router], value: key }));
        },
        onChangeCartGoods(item, index, index1) {},
        checkAllShopClick(index, val) {},
        changeCartShop(val, index) {
            // console.log(val, index)
        },
        selectedCartShop(index, val) {
            let data = this.carts[index];
            for (let i in data) {
                data[i].isSelected = !val;
            }
            this.$set(this.carts, index, data);
        },
        checkAllShop(val) {
            let data = this.carts,
                shopIsSelected = [],
                value = val;
            for (let i in data) {
                shopIsSelected[i] = value;
                for (let j in data[i]) {
                    data[i][j].isSelected = value;
                }
            }
            this.carts = data;
            this.shopIsSelected = shopIsSelected;
        },
        goodsIsSeleted(index, index1, val) {
            let data = this.carts[index],
                isSelected = true;
            data[index1].isSelected = !val;
            for (let i in data) {
                if (data[i].isSelected == false) isSelected = false;
            }
            this.$set(this.shopIsSelected, index, isSelected);
            this.$set(this.carts, index, data);
        },
        setShopUnSelected() {
            let d = this.carts,
                isSelected = [];
            for (let i in d) {
                isSelected[i] = false;
                for (let j in d[i]) {
                    d[i][j].isSelected = false;
                }
            }
            this.carts = d;
            this.shopIsSelected = isSelected;
            this.cart_checked = false;
        },
        onChangeCartGoodNum(item) {
            this.$apps.http
                .post("/goodsCart/operate", {
                    id: item.id,
                    num: item.num,
                })
                .then((res) => {
                    if (res.code !== 1) {
                        this.$toast.fail(res.msg);
                    } else {
                        this.calc2();
                    }
                })
                .catch((err) => {});
        },
        onDeleteCartGood(item, index, index1) {
            Dialog.confirm({
                title: "删除提醒",
                message: "您真的要删除当前商品吗",
            })
                .then(() => {
                    this.$apps.http
                        .post("/goodsCart/operate", {
                            id: item.id,
                            num: 0,
                        })
                        .then((res) => {
                            if (res.code === 1) {
                                if (this.carts[index].length === 1) {
                                    this.carts.splice(index, 1);
                                } else {
                                    this.carts[index].splice(index1, 1);
                                }
                            } else {
                                this.$toast.fail(res.msg);
                            }
                        })
                        .catch((err) => {});
                })
                .catch(() => {
                    // on cancel
                });
        },
        onSubmit() {
            let ids = this.totalSku.ids.join(",");
            this.$router.push("/confirm?ids=" + ids);
        },
        changeTabbar(index) {
            switch (index) {
                case 0:
                    //  首页常规数据
                    this.setShopUnSelected();
                    break;
                case 1:
                    this.setShopUnSelected();
                    let hash_key = "cache_hash_key",
                        data_key = "cache_data_key",
                        tree_active_id = 0;
                    let hash = localStorage.getItem(hash_key),
                        cache_data = localStorage.getItem(data_key);

                    tree_active_id = sessionStorage.getItem("tree_active_id") ? parseInt(sessionStorage.getItem("tree_active_id")) : 0;

                    if (cache_data) {
                        this.categorys = JSON.parse(cache_data);
                        // this.treeBox = document.querySelector(".van-tree-select__content")
                    }
                    this.activeId = tree_active_id;
                    //  缓存数据
                    this.$apps.http
                        .get("/goodsCategory/index_check", { hash: hash })
                        .then((res) => {
                            if (res.code === 1) {
                                if (res.data.need_update === 1 || !cache_data) {
                                    //  取出购物车
                                    this.getCategory();
                                } else {
                                    // this.categorys = JSON.parse(cache_data)
                                }
                                // this.activeId = tree_active_id
                            } else {
                                // this.categorys = JSON.parse(cache_data)
                                // this.activeId = tree_active_id
                            }
                        })
                        .catch((err) => {
                            // this.categorys = JSON.parse(cache_data)
                            // this.activeId = tree_active_id
                        });

                    break;
                case 2:
                    // this.selectedCartShops = []
                    // this.cart_checked = false
                    this.$apps.http
                        .get("/goodsCart", {})
                        .then((res) => {
                            if (res.code === 1) {
                                let data = res.data;
                                for (let i in data) {
                                    // data[i].isSelected = false
                                    for (let j in data[i]) {
                                        // data[i][j].isSelected = data[i][j].is_select ? true : false
                                        data[i][j].isSelected = false;
                                    }
                                }
                                this.carts = data;
                                // console.log(this.carts)
                                // for (let i = 0; i < this.$refs.checkboxGroup.length; i++) {
                                //     if (this.$refs.checkboxGroup[i])
                                //         this.$refs.checkboxGroup[i].toggleAll(false)
                                // }
                            }
                        })
                        .catch((err) => {});

                    break;
                case 3:
                    this.setShopUnSelected();
                    //  取出用户信息
                    if (Object.keys(this.user).length === 0) {
                        this.$apps.http
                            .post("/user/info")
                            .then((res) => {
                                if (res.code === 1) {
                                    this.user = res.data;
                                }
                            })
                            .catch((err) => {
                                console.error(err);
                            });
                    }
                    this.$apps.http
                        .get("/orderShop/statistics", {})
                        .then((res) => {
                            if (res.code === 1) {
                                this.orderStatistics = res.data;
                            }
                        })
                        .catch((err) => {});
                    break;
            }
            sessionStorage.setItem("tabbar", index);
        },
        getCategory() {
            let hash_key = "cache_hash_key",
                data_key = "cache_data_key";

            // if (this.categorys.length <= 0) {
            this.$apps.http
                .get("/goodsCategory")
                .then((res) => {
                    if (res.code == 1) {
                        let data = res.data;
                        for (let i in data) {
                            data[i].text = data[i].name;
                        }
                        localStorage.setItem(data_key, JSON.stringify(data));
                        localStorage.setItem(hash_key, res.hash);
                        this.categorys = data;
                    }
                })
                .catch((err) => {
                    this.categorys = JSON.parse(localStorage.getItem(data_key));
                });
            // }
        },
        gotoSearch() {
            this.$router.push("/search");
        },
        chooseCategory(index) {
            //  滚动条得上的顶部
            this.scrollTop = 0;
            this.treeBox.scrollTop = 0;
            this.activeId = index;
            sessionStorage.setItem("tree_active_id", index);
        },
        editCart() {
            this.editCartShow = this.editCartShow ? false : true;
            this.editCartIcon = "success";
            if (!this.editCartShow) {
                this.editCartIcon = "edit";
            }
        },
        calc() {
            let selected = {
                    sku: [],
                    price: 0.0,
                    score: 0.0,
                    ids: [],
                },
                amount = parseFloat(0);
            for (let i in this.selectedCartShops) {
                if (this.selectedCartShops[i]) {
                    for (let j in this.selectedCartShops[i]) {
                        if (this.selectedCartShops[i][j]) {
                            let tmp = this.selectedCartShops[i][j].split(",");
                            if (tmp && tmp.length == 2) {
                                let sku = this.formatActivity(this.carts[tmp[0]][tmp[1]]);
                                selected.sku.push(sku);
                                // selected.price += parseFloat((sku.sku.price * sku.num).toFixed(2));
                                selected.price += parseFloat(sku.total_price);

                                selected.score = parseFloat(0.0).toFixed(2);
                                selected.ids.push(sku.id);
                            }
                        }
                    }
                }
            }
            this.subDisabled = selected.ids.length > 0 ? false : true;
            this.totalSku = selected;
        },
        calc2() {
            let selected = {
                    sku: [],
                    price: 0.0,
                    score: 0.0,
                    ids: [],
                },
                amount = parseFloat(0);
            let d = this.carts;
            for (let i in d) {
                for (let j in d[i]) {
                    if (d[i][j].isSelected) {
                        let sku = this.formatActivity(d[i][j]);
                        selected.sku.push(sku);
                        // selected.price += parseFloat((sku.sku.price * sku.num).toFixed(2));
                        selected.price += parseFloat(sku.total_price);
                        selected.score = parseFloat(0.0).toFixed(2);
                        selected.ids.push(sku.id);
                    }
                }
            }
            this.subDisabled = selected.ids.length > 0 ? false : true;
            this.totalSku = selected;
        },
        swipeItemGoTo(item) {
            this.$apps.http.post("/Banner/statistics", { banner_id: item.id }).then((res) => {});
            if (item.goods_id != "") {
                this.$router.push("/goods/" + item.goods_id);
                return;
            }
            if (item.url != "") {
                window.location.href = item.url;
            }
        },
        handleScroll() {
            this.scrollTop = this.treeBox.scrollTop;
        },
        logout() {
            localStorage.removeItem("sessionid");
            this.$apps.session.rm("sessionid");
            this.$toast.success("登出成功");
            let redirect = encodeURI(process.env.VUE_APP_BASE_URL + "auth");
            let url = process.env.VUE_APP_ERP_BASE_URL + "login?url=" + redirect;
            setTimeout((res) => {
                window.location.href = url;
            }, 2000);
        },
        adRoute() {
            if (this.ad.link) {
                window.location.href = this.ad.link;
            }
        },
        validateAd(ad) {
            try {
                const oDate = new Date();
                const cacheKey = "ad" + oDate.getFullYear().toString() + oDate.getMonth() + oDate.getDate() + ad.id.toString();
                let cnt = localStorage.getItem(cacheKey) ? parseInt(localStorage.getItem(cacheKey)) : 0;
                if (cnt < ad.show_times) {
                    cnt += 1;
                    localStorage.setItem(cacheKey, cnt);
                    return true;
                }
                return false;
            } catch (err) {
                console.log(err);
            }
        },
        getActives() {
            this.$apps.http.get("/Activity/index", {}).then((res) => {
                if (res.code === 1) {
                    this.actives = res.data;
                    if (this.actives.theme1.length > 0) {
                        this.getActivesGoods(this.actives.theme1[0].id, 0);
                    }
                }
            });
        },
        getActivesGoods(id, index) {
            this.$apps.http.get("/Activity/goods_list2", { id: id }).then((res) => {
                if (res.code === 1) {
                    this.$set(this.activeGoods, index, res.data);
                }
            });
        },
        onChangeTheme1(index) {
            if (!this.activeGoods[index]) {
                this.getActivesGoods(this.actives.theme1[index].id, index);
            }
        },
        getAd() {
            sessionStorage.removeItem("wait_show_ad");
            this.$apps.http.get("/home/ad", {}).then((res) => {
                if (res.code == 1 && res.has_data != 0) {
                    this.ad = res.data;
                    if (this.validateAd(this.ad)) this.indexAd = true;
                }
            });
        },
        formatActivity(d) {
            if (d.sku.activity_is == 1 && d.sku.activity_nums > 0) {
                //  如果够数量
                if (d.sku.activity_nums >= d.num) {
                    d.total_price = parseFloat(d.num * parseFloat(d.sku.activity_price)).toFixed(2);
                } else {
                    let z_num = d.num - d.sku.activity_nums;
                    let z_total_price = parseFloat(d.sku.activity_nums * parseFloat(d.sku.activity_price));
                    let a_total_price = parseFloat(z_num * parseFloat(d.sku.price));
                    d.total_price = parseFloat(z_total_price + a_total_price).toFixed(2);
                }
            } else {
                d.total_price = parseFloat(d.num * d.sku.price).toFixed(2);
            }
            d.total_score = parseFloat(parseFloat(d.total_price) * parseFloat(d.goods.award_multiple)).toFixed();
            return d;
        },
    },
    created() {
        //  else {
        this.clientWidth = document.documentElement.clientWidth;
        this.clientHeight = document.documentElement.clientHeight;

        if (this.images.length <= 0) {
            //获取banner
            this.$apps.http
                .get("/banner/index")
                .then((result) => {
                    if (result.code == 1) {
                        this.images = result.data;
                    }
                })
                .catch((err) => {});
        }

        if (this.index_cate.length <= 0) {
            //  获取金刚区
            this.$apps.http
                .get("/goodsCategory/home_list")
                .then((result) => {
                    if (result.code == 1) {
                        this.index_cate = result.data;
                    }
                })
                .catch((err) => {});
        }
        if (this.actives.length <= 0) {
            this.getActives();
        }

        this.$nextTick(() => {
            if (!this.$apps.isAndroidApp() && window.ios != undefined) {
                let head = document.querySelector(".index-search-nav");
                let nav = document.querySelector(".van-nav-bar--fixed");
                let cartNav = document.querySelector(".cart-nav");

                this.heights = window.ios != undefined ? window.ios.statusHeight() : 20;
                if (this.heights > 40) {
                } else {
                    let tab0 = document.querySelector(".tab-0"),
                        tab1 = document.querySelector(".tab-1"),
                        tab2 = document.querySelector(".tab-2");
                    nav.style.top = this.heights + "px";
                    cartNav.style.top = this.heights + "px";
                    tab0.style.paddingTop = Number(this.heights) + Number(head.offsetHeight) + "px";
                    tab1.style.paddingTop = Number(this.heights) + Number(head.offsetHeight) + "px";
                    tab2.style.paddingTop = Number(this.heights) + "px";
                    this.iosShow = true;
                }
            } else {
                this.heights = 0;
                this.iosShow = false;
            }
        });
    },
    watch: {
        selectedCartShops(newValue, oldValue) {
            this.calc();
        },
        cart_checked(n, o) {
            // console.log(n, o)
        },
        carts: {
            deep: true,
            handler(newVal, oldVal) {
                // let cart_checked = true
                // for (let i in newVal) {
                //     for (let j in newVal[i]) {
                //         if (newVal[i][j].isSelected == false) {
                //             cart_checked = false
                //             break
                //         }
                //     }
                // }
                // this.cart_checked = cart_checked
                this.calc2();
            },
        },
    },
    filters: {
        formatBuyScore: function(value, num) {
            return parseFloat(parseFloat(value) * parseInt(num)).toFixed(2);
        },
        imageView2(value, w, h) {
            h = h ? h : w;
            return value + "?imageView2/1/w/" + w + "/h/" + h + "/interlace/1";
        },
    },
    activated() {
        let active = parseInt(this.$route.query.active);
        if (!active) {
            active = sessionStorage.getItem("tabbar");
        }

        this.active = active ? parseInt(active) : 0;
        if (sessionStorage.getItem("wait_show_ad")) {
            // this.getAd()
        }
        this.changeTabbar(this.active);
        this.treeBox.scrollTop = this.scrollTop;
        this.is_wechat = this.$apps.isWeChat();
        this.is_login = this.$apps.isLogin();
    },
    mounted() {
        this.treeBox = document.querySelector(".van-tree-select__content");
        this.treeBox.addEventListener("scroll", this.handleScroll, true);
        let redirect = this.$apps.session.get("redirect");
        if (redirect) {
            sessionStorage.setItem("wait_show_ad", 1);
            this.$apps.session.rm("redirect");
            this.$router.push(redirect);
        } else {
            //  获取广告
            this.getAd();
        }
    },
    deactivated() {
        this.setShopUnSelected();
    },
};
</script>

<style lang="less">
.badge {
    position: absolute;
    right: 2.4em;
    top: 1.2rem;
    min-width: 16px;
    padding: 0 3px;
    color: #fff;
    font-size: 12px;
    line-height: 14px;
    text-align: center;
    background-color: #ee0a24;
    border: 1px solid #fff;
    border-radius: 16px;
    transform: translate(50%, -50%);
    transform-origin: 100%;
}
.member-header {
    position: relative;
    padding: 0 1rem;
    &.special {
        > .van-nav-bar {
            background-color: transparent;
            .van-nav-bar__left {
                left: -1rem;
                .van-icon {
                    color: #fff;
                }
            }
        }
    }
    &.special {
        background-image: url("../../assets/images/member/NavigationBar@2x.png");
        background-image: image-set(
            url("../../assets/images/member/NavigationBar@2x.png") 2x,
            url("../../assets/images/member/NavigationBar@3x.png") 3x
        );
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }
    .member-background {
        background: linear-gradient(133deg, rgba(255, 252, 238, 1) 0%, rgba(255, 215, 164, 1) 100%);
        box-shadow: 0px 10px 20px 8px rgba(229, 189, 153, 0.22);
        border-radius: 6px;
        .avatar {
            position: relative;
            top: -30px;

            > .van-image {
                border: 2px solid rgba(255, 255, 255, 1);
                background-color: rgba(255, 255, 255, 1);
            }
        }
        > h5 {
            margin-top: -1.5rem;
        }
        .icon {
            width: 2rem;
            height: 2rem;

            &.icon-addr {
                background-image: url("../../assets/images/member/addr@2x.png");
                background-image: image-set(url("../../assets/images/member/addr@2x.png") 2x, url("../../assets/images/member/addr@3x.png") 3x);
                background-repeat: no-repeat;
                background-size: 100% 100%;
            }
            &.icon-prod {
                background-image: url("../../assets/images/member/prod@2x.png");
                background-image: image-set(url("../../assets/images/member/prod@2x.png") 2x, url("../../assets/images/member/prod@3x.png") 3x);
                background-repeat: no-repeat;
                background-size: 100% 100%;
            }
            &.icon-store {
                background-image: url("../../assets/images/member/store@2x.png");
                background-image: image-set(url("../../assets/images/member/store@2x.png") 2x, url("../../assets/images/member/store@3x.png") 3x);
                background-repeat: no-repeat;
                background-size: 100% 100%;
            }
        }
    }
}

.member-nav .van-nav-bar__title {
    color: #ffffff;
}

.navigation {
    padding: 1.375rem 1rem;
    .navigation-item {
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 7px 20px 0px rgba(119, 83, 83, 0.06);
        border-radius: 6px;

        & + .navigation-item {
            margin-top: 1.375rem;
        }
        .van-cell--borderless::after {
            display: block;
        }
        .van-cell:not(:last-child)::after {
            right: 16px;
        }

        .van-cell__value {
            font-size: 0.75rem;
            color: #a0a9b5;
        }
        .van-cell__right-icon {
            font-size: 0.75rem;
        }

        .icon {
            width: 2rem;
            height: 2rem;

            &.icon-payment {
                background-image: url("../../assets/images/member/payment@2x.png");
                background-image: image-set(url("../../assets/images/member/payment@2x.png") 2x, url("../../assets/images/member/payment@3x.png") 3x);
                background-repeat: no-repeat;
                background-size: 100% 100%;
            }
            &.icon-deliver {
                background-image: url("../../assets/images/member/deliver@2x.png");
                background-image: image-set(url("../../assets/images/member/deliver@2x.png") 2x, url("../../assets/images/member/deliver@3x.png") 3x);
                background-repeat: no-repeat;
                background-size: 100% 100%;
            }
            &.icon-take {
                background-image: url("../../assets/images/member/take@2x.png");
                background-image: image-set(url("../../assets/images/member/take@2x.png") 2x, url("../../assets/images/member/take@3x.png") 3x);
                background-repeat: no-repeat;
                background-size: 100% 100%;
            }
            &.icon-done {
                background-image: url("../../assets/images/member/done@2x.png");
                background-image: image-set(url("../../assets/images/member/done@2x.png") 2x, url("../../assets/images/member/done@3x.png") 3x);
                background-repeat: no-repeat;
                background-size: 100% 100%;
            }
            &.icon-buyer {
                background-image: url("../../assets/images/member/buyer@2x.png");
                background-image: image-set(url("../../assets/images/member/buyer@2x.png") 2x, url("../../assets/images/member/buyer@3x.png") 3x);
                background-repeat: no-repeat;
                background-size: 100% 100%;
            }
            &.icon-business {
                background-image: url("../../assets/images/member/business@2x.png");
                background-image: image-set(
                    url("../../assets/images/member/business@2x.png") 2x,
                    url("../../assets/images/member/business@3x.png") 3x
                );
                background-repeat: no-repeat;
                background-size: 100% 100%;
            }
            &.icon-cancel {
                background-image: url("../../assets/images/member/cancel@2x.png");
                background-image: image-set(url("../../assets/images/member/cancel@2x.png") 2x, url("../../assets/images/member/cancel@3x.png") 3x);
                background-repeat: no-repeat;
                background-size: 100% 100%;
            }
        }
    }
}

.free-box {
    padding: 0.5rem 1rem;
    .free-cover {
        width: 100%;
        height: 5rem;
        background-image: url("../../assets/images/pull/free.png");
        background-image: image-set(url("../../assets/images/pull/free.png") 2x, url("../../assets/images/pull/free@2x.png") 3x);
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }
}
.van-tree-select__nav,
.van-tree-select__content {
    padding-bottom: 20px;
}
.van-nav-bar .van-icon {
    color: #666666;
    font-size: 1.2rem;
}
.index-search-nav {
    .van-nav-bar__title {
        max-width: 100%;
    }
}
.index-search-nav-title {
    padding: 0.5rem 0.5rem 0.5rem 2.8125rem;
}
.cart-goods-checkbox {
    width: 24px;
    height: 90px;
    line-height: 90px;
}
.cart-goods-checkbox .van-checkbox__icon {
    margin: 0 auto;
}
.cart-goods-card .van-card {
    padding: 8px;
}

.index-ad-dialog {
    border-radius: 0;
    width: 70%;
}
.index-ad-content,
.index-ad-dialog,
.index-ad-content-close,
.index-ad-dialog .van-dialog__content {
    background-color: rgba(255, 255, 255, 0) !important;
}
.active-goods {
    display: inline-block;
}
.topic1-goods-list .van-tabs__wrap {
    height: auto !important;
}
.topic1-goods-list .van-tab {
    line-height: normal;
}

.active-theme-2 {
    background: #f5f7f8;
    border-radius: 10px;
}
.active-theme-2 .van-grid-item .van-grid-item__content {
    border: solid 1px #e3e3e3;
}
.topic-theme2-container {
    background: #f5f7f8;
    border: solid 1px #e3e3e3;
}
.topic-theme2-container strong {
    color: #212121;
}
.topic-theme2-item:nth-child(even) {
    border-left: solid 1px #e3e3e3;
}
.topic-theme2-item:nth-child(1) {
    border-top-left-radius: 5px;
}
.topic-theme2-item:nth-child(2) {
    border-top-right-radius: 5px;
}
.topic-theme2-item {
    border-top: solid 1px #e3e3e3;
    margin-top: -1px;
}
</style>
