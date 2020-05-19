<template>
    <div class="page">
        <div :style="{ height: heights + 'px' }" v-if="iosShow" class="headIos"></div>
        <header-bar title="退款管理" :border="true" :isIos="iosShow" :back="1" :heights="heights"></header-bar>
        <van-tabs v-model="active" :border="false" @change="onChange">
            <van-tab title="所有退款">
                <van-list v-model="possess.loading" :finished="possess.finished" finished-text="没有更多了" @load="onLoad">
                    <refund-list :active="active" :list="possess.list"></refund-list>
                </van-list>
            </van-tab>
            <van-tab title="买家操作"
                ><van-list v-model="buyer.loading" :finished="buyer.finished" finished-text="没有更多了" @load="onLoad">
                    <refund-list :active="active" :list="buyer.list"></refund-list>
                </van-list>
            </van-tab>
            <van-tab title="商家操作"
                ><van-list v-model="seller.loading" :finished="seller.finished" finished-text="没有更多了" @load="onLoad">
                    <refund-list :active="active" :list="seller.list"></refund-list>
                </van-list>
            </van-tab>
            <van-tab title="已取消"
                ><van-list v-model="cancel.loading" :finished="cancel.finished" finished-text="没有更多了" @load="onLoad">
                    <refund-list :active="active" :list="cancel.list"></refund-list>
                </van-list>
            </van-tab>
            <van-tab title="已完成"
                ><van-list v-model="fulfil.loading" :finished="fulfil.finished" finished-text="没有更多了" @load="onLoad">
                    <refund-list :active="active" :list="fulfil.list"></refund-list>
                </van-list>
            </van-tab>
        </van-tabs>
    </div>
</template>

<script>
import HeaderBar from "../../../components/common/HeaderBar";
import CommonNoData from "../../../components/NoData";
import RefundList from "../../../components/refund/RefundList.vue";
import { mapGetters, mapActions } from "vuex";
export default {
    components: {
        HeaderBar,
        RefundList,
    },
    data() {
        return {
            iosShow: false,
            heights: 0,
            active: 0,
            possess: {
                list: [],
                finished: false,
                loading: false,
                current: 0,
                page: 1,
                size: 20,
            },
            buyer: {
                list: [],
                finished: false,
                loading: false,
                current: 0,
                page: 1,
                size: 20,
            },
            seller: {
                list: [],
                finished: false,
                loading: false,
                current: 0,
                page: 1,
                size: 20,
            },
            cancel: {
                list: [],
                finished: false,
                loading: false,
                current: 0,
                page: 1,
                size: 20,
            },
            fulfil: {
                list: [],
                finished: false,
                loading: false,
                current: 0,
                page: 1,
                size: 20,
            },
            states: {
                0: "待支付",
                10: "待发货",
                20: "待收货",
                30: "已完成",
                40: "已取消",
            },
        };
    },
    created() {
        this.GET_REFUNDBAR && (this.flag = !this.flag);
        if (this.flag) {
            this.active = Number(this.GET_REFUNDBAR);
        } else {
            (this.active = Number(this.$route.params.state)) &&
                this.$store.dispatch(
                    "SET_LOCALSTORAGE",
                    JSON.stringify({
                        name: "REFUNDBAR",
                        value: this.active,
                    })
                );
        }
        this.onChange(this.active);
    },
    mounted() {
        this.$nextTick(() => {
            let content = document.querySelector(".van-tabs");
            if (!this.$apps.isAndroid()) {
                let head = document.querySelector(".van-nav-bar--fixed");

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
    methods: {
        onLoad() {
            let page = 0;
            switch (this.active) {
                case 0:
                    page = this.possess.current + 1;
                    break;
                case 1:
                    page = this.buyer.current + 1;
                    break;
                case 2:
                    page = this.seller.current + 1;
                    break;
                case 3:
                    page = this.cancel.current + 1;
                    break;
                case 4:
                    page = this.fulfil.current + 1;
                    break;
            }
            this.fetchData(this.active, page);
        },
        fetchData(key, page) {
            page = parseInt(page) ? parseInt(page) : 1;
            try {
                const formdata = {
                    page: page,
                    limit: this.possess.size,
                    state: this.active,
                };
                this.$apps.http
                    .get("/Refund.Buyer/index", formdata)
                    .then((result) => {
                        if (result.code === 1) {
                            switch (key) {
                                case 0:
                                    if (result.data.list.length == 0) this.possess.finished = true;
                                    if (result.data.page == 1) {
                                        this.$set(this.possess, "list", result.data.list);
                                    } else {
                                        this.$set(this.possess, "list", this.possess.list.concat(result.data.list));
                                    }
                                    this.possess.current = result.data.page;
                                    this.possess.loading = false;
                                    break;
                                case 1:
                                    if (result.data.list.length == 0) this.buyer.finished = true;
                                    if (result.data.page == 1) {
                                        this.$set(this.buyer, "list", result.data.list);
                                    } else {
                                        this.$set(this.buyer, "list", this.buyer.list.concat(result.data.list));
                                    }
                                    this.buyer.current = result.data.page;
                                    this.buyer.loading = false;
                                    break;
                                case 2:
                                    if (this.seller.list.length >= result.data.count) this.seller.finished = true;
                                    if (result.data.page == 1) {
                                        this.$set(this.seller, "list", result.data.list);
                                    } else {
                                        this.$set(this.seller, "list", this.seller.list.concat(result.data.list));
                                    }
                                    this.seller.current = result.data.page;
                                    this.seller.loading = false;
                                    break;
                                case 3:
                                    if (this.cancel.list.length >= result.data.count) this.cancel.finished = true;
                                    if (result.data.page == 1) {
                                        this.$set(this.cancel, "list", result.data.list);
                                    } else {
                                        this.$set(this.cancel, "list", this.cancel.list.concat(result.data.list));
                                    }
                                    this.cancel.current = result.data.page;
                                    this.cancel.loading = false;
                                    break;
                                case 4:
                                    if (this.fulfil.list.length >= result.data.count) this.fulfil.finished = true;
                                    if (result.data.page == 1) {
                                        this.$set(this.fulfil, "list", result.data.list);
                                    } else {
                                        this.$set(this.fulfil, "list", this.fulfil.list.concat(result.data.list));
                                    }
                                    this.fulfil.current = result.data.page;
                                    this.fulfil.loading = false;
                                    break;
                            }
                        }
                    })
                    .catch((err) => {});
            } catch (err) {
                console.log(err);
            }
        },
        onChange(index, page) {
            this.SET_LOCALSTORAGE(JSON.stringify({ name: "REFUNDBAR", value: this.active }));
            page = parseInt(page) ? parseInt(page) : 1;
            this.fetchData(this.active, page);
        },
        goto(item, route) {
            this.$router.push("/member/refund/" + route + "/" + item.no);
        },
        ...mapActions(["SET_LOCALSTORAGE"]),
    },
    computed: {
        ...mapGetters(["GET_REFUNDBAR"]),
    },
};
</script>

<style lang="less" scoped></style>
