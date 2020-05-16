<template>
    <div>
        <header-bar title="店铺" :border="active != 1" :isIos="iosShow" :back="-1">
            <!-- <van-icon name="like-o" slot="nav-right"></van-icon> -->
        </header-bar>
        <div v-show="active === 0">
            <van-cell-group :border="false">
                <van-cell>
                    <img slot="icon" width="50" height="50" class="mr-2" :src="data.logo" alt="" srcset="" />
                    <div slot="title">{{ data.name }}</div>
                    <div slot="label">
                        <span class="align-middle">综合体验</span>
                        <van-rate
                            class="ml-2 align-middle"
                            size="12"
                            icon="star"
                            :color="switchColor"
                            readonly
                            void-color="#eee"
                            void-icon="star"
                            v-model="data.fraction"
                        ></van-rate>
                        <!-- <span class="align-middle ml-2">粉丝·0</span> -->
                    </div>
                    <div slot="right-icon" @click="clickFav">
                        <van-icon :color="isFav == 1 ? switchColor : ''" class="align-middle" :name="isFav == 1 ? 'like' : 'like-o'"></van-icon
                        ><span class="ml-1 align-middle">关注商家</span>
                    </div>
                </van-cell>
            </van-cell-group>
            <van-swipe :autoplay="3000" :height="150" :width="clientWidth">
                <van-swipe-item @click="swipeItemGoTo(item)" v-for="(item, index) in images" :key="index">
                    <van-image style="width: 100%" lazy-load fit="fill" :src="item.image"></van-image>
                </van-swipe-item>
            </van-swipe>
            <goods-list-4 style="padding-bottom: 50px" :max="2" :filter="{ shop_id: shop_id }"></goods-list-4>
        </div>
        <div v-if="active === 1">
            <van-row>
                <van-col span="20">
                    <van-dropdown-menu style="height: 40px">
                        <van-dropdown-item @change="onChange" v-model="value1" :options="option1" />
                        <van-dropdown-item @change="onChange" v-model="value2" :options="option2" />
                    </van-dropdown-menu>
                </van-col>
                <van-col
                    span="4"
                    class="text-center van-hairline--top van-hairline--bottom van-hairline--left"
                    style="height: 40px; line-height: 45px"
                >
                    <van-icon @click="showFilter = true" name="filter-o"></van-icon>
                </van-col>
            </van-row>

            <goods-list-4 style="padding-bottom: 50px" :filter="params" :firstLoad="true"></goods-list-4>
        </div>
        <div v-show="active === 2">
            <van-tree-select
                v-show="categorys.length > 0"
                :items="categorys"
                :active-id.sync="activeId"
                :main-active-index.sync="activeId"
                :height="clientHeight - 96"
                @click-nav="chooseCategory"
            >
                <div class="p-2" slot="content">
                    <van-grid v-show="activeId === key" v-for="(cate, key) in categorys" :key="key" :column-num="3" :border="false">
                        <van-grid-item @click="chooseCate(item.id)" class="van-ellipsis" v-for="(item, index) in cate.child" :key="index">
                            <img width="60" height="60" v-lazy="item.icon" slot="icon" />
                            <!-- <van-image width="60" height="60" lazy-load slot="icon" :src="item.icon" /> -->
                            <span class="fs-10 text-66 van-ellipsis" slot="text">{{ item.name }}</span>
                        </van-grid-item>
                    </van-grid>
                </div>
            </van-tree-select>
        </div>
        <div v-show="active === 3">
            <div class="text-center mt-5 pt-5">
                <van-image width="80" height="80" lazy-load round :src="data.logo" />
            </div>
            <div class="p-3 mt-5" v-show="data.contect_mobile">
                <van-button size="large" :url="'tel:' + data.contect_mobile" type="primary" round icon="phone-o">拨打手机</van-button>
            </div>
            <div class="p-3" v-show="data.contect_tel">
                <van-button size="large" :url="'tel:' + data.contect_tel" type="info" round icon="phone-circle-o">拨打电话</van-button>
            </div>
        </div>
        <div>
            <van-tabbar v-model="active" active-color="#FB5870" @change="changeTabbar">
                <van-tabbar-item icon="home-o">店铺首页</van-tabbar-item>
                <van-tabbar-item icon="goods-collect-o">所有商品</van-tabbar-item>
                <van-tabbar-item icon="apps-o">店铺类目</van-tabbar-item>
                <van-tabbar-item icon="service-o">联系商家</van-tabbar-item>
            </van-tabbar>
        </div>
        <van-popup v-model="showFilter" position="right" :style="{ height: '100%', width: '80%' }">
            <div>
                <div>
                    <div class="fs-14 text-33 mt-3" style="padding-left: 16px">价格区间</div>
                    <van-field v-model="filterData.min_price" label="最低价" type="number" placeholder="请输入最低价"></van-field>
                    <van-field v-model="filterData.max_price" label="最高价" type="number" placeholder="请输入最高价"></van-field>
                </div>
                <div class="mt-5 p-3 filter-btns">
                    <van-row gutter="20">
                        <van-col span="12">
                            <van-button @click="btnFilterReset" size="large" type="danger">重置</van-button>
                        </van-col>
                        <van-col span="12">
                            <van-button @click="btnFilter" class="ml-3" size="large" type="primary">筛选</van-button>
                        </van-col>
                    </van-row>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
import HeaderBar from "../../../components/common/HeaderBar";
import GoodsList4 from "../../../components/GoodsList2";
import {
    Tabbar,
    TabbarItem,
    DropdownMenu,
    DropdownItem,
    Cell,
    CellGroup,
    Icon,
    Rate,
    Row,
    Col,
    Grid,
    GridItem,
    Lazyload,
    Image,
    Popup,
    Field,
    Button,
    Toast,
} from "vant";
export default {
    components: {
        HeaderBar,
        Tabbar,
        TabbarItem,
        DropdownMenu,
        DropdownItem,
        Cell,
        CellGroup,
        Icon,
        Rate,
        Row,
        Col,
        Grid,
        GridItem,
        Lazyload,
        Image,
        Popup,
        Field,
        Button,
        Toast,
        GoodsList4,
    },
    data() {
        return {
            iosShow: false,
            heights: 0,
            rate: 4.8,
            switchColor: "#ee0a24",
            activeId: 0,
            activeIndex: 0,
            showFilter: false,
            filterData: {},
            images: [],
            active: 0,
            value1: "",
            value2: "",
            option1: [{ text: "全部商品", value: "" }],
            option2: [
                { text: "默认排序", value: "" },
                { text: "最新上架", value: "new" },
                { text: "销量排序", value: "sales" },
                { text: "价格低至高", value: "price_asc" },
                { text: "价格高至低", value: "price_desc" },
                { text: "奖励低至高", value: "score_asc" },
                { text: "奖励高至低", value: "score_desc" },
            ],
            shop_id: 0,
            clientWidth: 375,
            clientHeight: 667,
            categorys: [],
            params: {},
            data: {},
            isFav: 0,
        };
    },
    methods: {
        changeTabbar(index) {
            if (index == 1) this.$set(this.params, "scid", "");
        },
        chooseCategory(item, index) {},
        chooseCate(id) {
            this.active = 1;
            this.$set(this.params, "scid", id);
        },
        onChange(value) {
            this.$set(this.params, "order", value);
        },
        btnFilterReset() {
            this.$set(this.params, "min_price", "");
            this.$set(this.params, "max_price", "");
            this.$set(this.filterData, "min_price", "");
            this.$set(this.filterData, "max_price", "");
        },
        btnFilter() {
            this.$set(this.params, "min_price", this.filterData.min_price);
            this.$set(this.params, "max_price", this.filterData.max_price);
            this.showFilter = false;
        },
        clickFav() {
            this.$toast.loading("请求中...");
            let url = this.isFav == 1 ? "/userAttentionShop/cancel" : "/userAttentionShop/create";
            this.$apps.http
                .post(url, { shop_id: this.shop_id })
                .then((res) => {
                    if (res.code === 1) {
                        this.$toast.success(res.msg);
                        this.isFav = this.isFav == 1 ? 0 : 1;
                    } else {
                        this.$toast.fail(res.msg);
                    }
                })
                .catch((err) => {
                    this.$toast.fail("网络错误");
                    this.$toast.clear();
                });
        },
        swipeItemGoTo(item) {
            if (item.goods_id != "") {
                this.$router.push("/goods/" + item.goods_id);
                return;
            }
            if (item.url != "") {
                window.location.href = item.url;
            }
        },
    },
    created() {
        this.shop_id = this.$route.params.id;
        this.params.shop_id = this.shop_id;
        if (this.shop_id) {
            this.$apps.http
                .get("/shopGoodsCategory", { shop_id: this.shop_id })
                .then((result) => {
                    if (result.code === 1) {
                        let data = result.data;
                        for (let i in data) {
                            data[i].text = data[i].name;
                        }
                        this.categorys = data;

                        if (this.$apps.isLogin()) {
                            this.$apps.http
                                .get("/userAttentionShop/has", { shop_id: this.shop_id })
                                .then((res) => {
                                    if (res.code === 1) {
                                        this.isFav = res.data.has;
                                    }
                                })
                                .catch((err) => {});
                        }
                    }
                })
                .catch((err) => {});

            this.$apps.http
                .get("/Shop.Index/detail", { shop_id: this.shop_id })
                .then((result) => {
                    if (result.code === 1) {
                        this.data = result.data;
                    }
                })
                .catch((err) => {});
        }

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
    },
    mounted() {
        this.$nextTick(() => {
            if (!this.$apps.isAndroidApp() && window.ios != undefined) {
                let head = document.querySelector(".van-nav-bar--fixed");
                let headerBar = document.querySelector(".header-bar");
                this.heights = window.ios != undefined ? window.ios.statusHeight() : 20;
                if (this.heights > 40) {
                    return;
                } else {
                    let tab = document.querySelector(".wrapper");
                    // let ordeftabs = document.querySelector(".index-tab");
                    head.style.top = Number(this.heights) + "px";
                    headerBar.style.marginBottom = Number(this.heights) + "px";
                    this.iosShow = true;
                }
            } else {
                this.heights = 0;
                this.iosShow = false;
            }
        });
    },
};
</script>

<style lang="less">
.van-dropdown-menu {
    height: 40px;
}
.van-search__content {
    background: #ffffff !important;
}
.van-search__action {
    color: #666666;
}
.filter-btns {
    position: absolute;
    width: 100%;
    bottom: 0;
}
.filter-btns .van-button--large {
    height: 40px;
    line-height: 38px;
}
</style>
