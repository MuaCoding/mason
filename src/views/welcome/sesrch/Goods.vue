<template>
    <div>
        <header-bar class="search-search-nav" :border="false" :isIos="iosShow" :back="-1">
            <div slot="nav-title" @click="goto('/search')" class="index-search-nav-title" style="padding: 8px">
                <div style="border: #f6f6f6 solid 1px; height: 30px; line-height: 30px; border-radius: 15px; background: #f6f6f6">
                    <van-icon class="text-66" name="search"></van-icon> <span class="text-99 fs-12">{{ params.q }}</span>
                </div>
            </div>
            <van-icon :info="cart_num" @click="goto('/')" slot="nav-right" name="cart-o" />
        </header-bar>

        <van-row class="row-box">
            <van-col span="20">
                <van-dropdown-menu style="height: 40px">
                    <van-dropdown-item @change="onChange" v-model="value1" :options="option1" />
                    <van-dropdown-item @change="onChange" v-model="value2" :options="option2" />
                </van-dropdown-menu>
            </van-col>
            <van-col span="4" class="text-center van-hairline--top van-hairline--bottom van-hairline--left" style="height: 40px; line-height: 45px">
                <van-icon @click="showFilter = true" name="filter-o"></van-icon>
            </van-col>
        </van-row>
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
        <goods-list-4 :filter="params" :firstLoad="true"></goods-list-4>
    </div>
</template>

<script>
import GoodsList4 from "../../../components/GoodsList2";
import HeaderBar from "../../../components/common/HeaderBar";
import { Search, DropdownMenu, DropdownItem, Row, Col, Popup, Field, Button } from "vant";
export default {
    components: {
        Search,
        DropdownMenu,
        DropdownItem,
        Row,
        Col,
        HeaderBar,
        Popup,
        Field,
        Button,
        GoodsList4,
    },
    data() {
        return {
            iosShow: false,
            heights: 0,
            loading: true,
            finished: false,
            value1: "",
            value2: "",
            value3: "a",
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
            showFilter: false,
            cart_num: 0,
            params: {},
            filterData: {},
        };
    },
    methods: {
        goto(route) {
            this.$apps.session.set("tabbar", 2);
            this.$router.push(route);
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
    },
    created() {
        let q = this.$route.query.q;
        this.params.q = q ? (q.length > 20 ? q.substring(0, 20) + "..." : q) : "";
        if (this.$apps.isLogin()) {
            this.$apps.http
                .get("/goodsCart/has_nums", {})
                .then((res) => {
                    if (res.code === 1) {
                        this.cart_num = res.data.nums;
                    }
                })
                .catch((err) => {});
        }
        this.params.cid = this.$route.query.cid;
    },
    mounted() {
        this.$nextTick(() => {
            if (!this.$apps.isAndroidApp() && window.ios != undefined) {
                let head = document.querySelector(".van-nav-bar--fixed");
                this.heights = window.ios != undefined ? window.ios.statusHeight() : 20;
                if (this.heights > 40) {
                } else {
                    let content = document.querySelector(".row-box");
                    head.style.top = Number(this.heights) + "px";
                    content.style.paddingTop = Number(this.heights) + "px";
                    this.iosShow = true;
                }
            } else {
                this.heights = 0;
                this.iosShow = false;
            }
            console.log(this.iosShow);
        });
    },
    watch: {
        params: {
            deep: true,
            handler(newValue, oldValue) {},
        },
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
// .van-loading--circular {
//     background: #f6f6f6
// }
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
