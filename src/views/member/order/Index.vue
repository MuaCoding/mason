<template>
    <div class="page">
        <div :style="{ height: heights + 'px' }" v-if="iosShow" class="headIos"></div>
        <header-bar title="我的订单" :border="true" :isIos="iosShow" :back="1" :heights="heights"></header-bar>
        <van-tabs v-model="active" @change="onChange" :border="false">
            <van-tab title="全部">
                <van-list v-model="orders.loading" :finished="orders.finished" finished-text="没有更多了" @load="onLoad">
                    <order-list :list="orders.list" v-on:refresh="fetchData(state, 1)"></order-list>
                </van-list>
            </van-tab>
            <van-tab title="待付款">
                <van-list v-model="orders1.loading" :finished="orders1.finished" finished-text="没有更多了" @load="onLoad" :immediate-check="true">
                    <order-list :list="orders1.list" v-on:refresh="fetchData(state, 1)"></order-list>
                </van-list>
            </van-tab>
            <van-tab title="待发货">
                <van-list v-model="orders2.loading" :finished="orders2.finished" finished-text="没有更多了" @load="onLoad" :immediate-check="false">
                    <order-list :list="orders2.list" v-on:refresh="fetchData(state, 1)"></order-list>
                </van-list>
            </van-tab>
            <van-tab title="待收货">
                <van-list v-model="orders3.loading" :finished="orders3.finished" finished-text="没有更多了" @load="onLoad" :immediate-check="false">
                    <order-list :list="orders3.list" v-on:refresh="fetchData(state, 1)"></order-list>
                </van-list>
            </van-tab>
            <van-tab title="已完成">
                <van-list v-model="orders4.loading" :finished="orders4.finished" finished-text="没有更多了" @load="onLoad" :immediate-check="false">
                    <order-list :list="orders4.list" v-on:refresh="fetchData(state, 1)"></order-list>
                </van-list>
            </van-tab>
            <!-- <van-tab title="待评价">内容 4</van-tab>
            <van-tab title="已评价">内容 4</van-tab> -->
        </van-tabs>
    </div>
</template>

<script>
import HeaderBar from "../../../components/common/HeaderBar";
import OrderList from "../../../components/order/OrderList";
import { mapGetters, mapActions } from "vuex";
export default {
    components: {
        HeaderBar,
        OrderList,
    },
    data() {
        return {
            iosShow: false,
            heights: 0,
            active: 0,
            loading: false,
            finished: false,
            flag: false,
            state: 0,
            orders: {
                list: [],
                finished: false,
                loading: false,
                page: 0,
            },
            orders1: {
                list: [],
                finished: false,
                loading: false,
                page: 0,
            },
            orders2: {
                list: [],
                finished: false,
                loading: false,
                page: 0,
            },
            orders3: {
                list: [],
                finished: false,
                loading: false,
                page: 0,
            },
            orders4: {
                list: [],
                finished: false,
                loading: false,
                page: 0,
            },
            states: {
                0: "待支付",
                10: "待发货",
                20: "待收货",
                30: "已完成",
                40: "已取消",
            },
            mapping: ["", 0, 10, 20, 30],
        };
    },
    methods: {
        onLoad() {
            let page;
            switch (this.active) {
                case 0:
                    page = this.orders.page + 1;
                    break;
                case 1:
                    page = this.orders1.page + 1;
                    break;
                case 2:
                    page = this.orders2.page + 1;
                    break;
                case 3:
                    page = this.orders3.page + 1;
                    break;
                case 4:
                    page = this.orders4.page + 1;
                    break;
            }
            this.onChange(this.active, page);
        },
        goto(item, route) {
            this.$router.push("/member/order/" + route + "/" + item.no);
        },
        fetchData(state, page) {
            // let index = this.mapping[index];
            this.$apps.http
                .get("/order", { status: state, page: page })
                .then((result) => {
                    if (result.code == 1) {
                        switch (state) {
                            case "":
                                this.$set(this.orders, "finished", !this.hasNext(result.data.count, result.data.page, result.data.limit));
                                if (result.data.page == 1) {
                                    this.$set(this.orders, "list", result.data.list);
                                } else {
                                    this.$set(this.orders, "list", this.orders.list.concat(result.data.list));
                                }
                                this.orders.count = result.data.count;
                                this.orders.limit = result.data.limit;
                                this.orders.page = result.data.page;
                                this.$set(this.orders, "loading", false);
                                break;
                            case 0:
                                this.$set(this.orders1, "finished", !this.hasNext(result.data.count, result.data.page, result.data.limit));
                                if (result.data.page == 1) {
                                    this.$set(this.orders1, "list", result.data.list);
                                } else {
                                    this.$set(this.orders1, "list", this.orders1.list.concat(result.data.list));
                                }
                                this.orders1.count = result.data.count;
                                this.orders1.limit = result.data.limit;
                                this.orders1.page = result.data.page;
                                this.$set(this.orders1, "loading", false);
                                break;
                            case 10:
                                this.$set(this.orders2, "finished", !this.hasNext(result.data.count, result.data.page, result.data.limit));
                                if (result.data.page == 1) {
                                    this.$set(this.orders2, "list", result.data.list);
                                } else {
                                    this.$set(this.orders2, "list", this.orders2.list.concat(result.data.list));
                                }
                                this.orders2.count = result.data.count;
                                this.orders2.limit = result.data.limit;
                                this.orders2.page = result.data.page;
                                this.$set(this.orders2, "loading", false);
                                break;
                            case 20:
                                this.$set(this.orders3, "finished", !this.hasNext(result.data.count, result.data.page, result.data.limit));
                                if (result.data.page == 1) {
                                    this.$set(this.orders3, "list", result.data.list);
                                } else {
                                    this.$set(this.orders3, "list", this.orders3.list.concat(result.data.list));
                                }
                                this.orders3.count = result.data.count;
                                this.orders3.limit = result.data.limit;
                                this.orders3.page = result.data.page;
                                this.$set(this.orders3, "loading", false);
                                break;
                            case 30:
                                this.$set(this.orders4, "finished", !this.hasNext(result.data.count, result.data.page, result.data.limit));
                                if (result.data.page == 1) {
                                    this.$set(this.orders4, "list", result.data.list);
                                } else {
                                    this.$set(this.orders4, "list", this.orders4.list.concat(result.data.list));
                                }
                                this.orders4.count = result.data.count;
                                this.orders4.limit = result.data.limit;
                                this.orders4.page = result.data.page;
                                this.$set(this.orders4, "loading", false);
                                break;
                        }
                    }
                })
                .catch((err) => {});
        },
        ...mapActions(["SET_LOCALSTORAGE"]),
        onChange(index, page) {
            this.state = this.mapping[index];
            //存储ORDERBAR
            this.SET_LOCALSTORAGE(JSON.stringify({ name: "ORDERBAR", value: this.active }));
            page = parseInt(page) ? parseInt(page) : 1;
            this.fetchData(this.mapping[index], page);
        },
        hasNext(cnt, p, limit) {
            limit = parseInt(limit) > 0 ? parseInt(limit) : 10;
            return parseInt(cnt) > parseInt(p * limit);
        },
    },
    mounted() {
        this.$nextTick(() => {
            let content = document.querySelector(".van-tabs");
            if (!this.$apps.isAndroid()) {
                let head = document.querySelector(".van-nav-bar");

                this.heights = window.ios != undefined ? window.ios.statusHeight() : 20;
                if (this.heights > 40) {
                    this.heights = 0;
                    this.iosShow = false;
                    content.style.paddingTop = 47 + "px";
                    return;
                } else {
                    head.style.top = Number(this.heights) + "px";
                    content.style.paddingTop = Number(this.heights) + 47 + "px";
                    this.iosShow = true;
                }
            } else {
                this.heights = 0;
                content.style.paddingTop = 47 + "px";
                this.iosShow = false;
            }
        });
    },
    created() {
        this.GET_ORDERBAR && (this.flag = !this.flag);
        if (this.flag) {
            this.active = Number(this.GET_ORDERBAR);
        } else {
            (this.active = Number(this.$route.params.state)) &&
                this.$store.dispatch(
                    "SET_LOCALSTORAGE",
                    JSON.stringify({
                        name: "ORDERBAR",
                        value: this.active,
                    })
                );
        }
        this.onChange(this.active);
    },
    computed: {
        ...mapGetters(["GET_ORDERBAR"]),
    },
};
</script>

<style lang="less" scoped></style>
