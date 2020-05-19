<template>
    <div class="page page-no-radius">
        <div :style="{ height: heights + 'px' }" v-if="iosShow" class="headIos"></div>
        <header-bar :title="title" :isIos="iosShow" :border="true" :back="-1" :heights="heights"></header-bar>
        <section class="form">
            <van-cell-group class="m-3">
                <van-cell :border="false">
                    <template #title
                        ><i class="icon icon-mold"></i
                        ><span class="strong text-secondary-dark ml-4">{{ list.service_type == 1 ? "申请售后" : "请选择退款类型" }}</span></template
                    ></van-cell
                >
            </van-cell-group>

            <van-cell-group class="prod-list px-3">
                <div class="prod-item" v-for="item in list.goods" :key="item.id">
                    <van-checkbox checked-color="#ee0a24" v-model="item.checked" @click="checkedHandle(item)" icon-size="16"></van-checkbox>
                    <van-image lazy-load radius="6px" width="4.25rem" height="4.25rem" :src="item.goods_master_image || '/'" />
                    <div class="prod-content">
                        <p>{{ item.goods_name }}</p>
                        <p>
                            ¥ <span class="fs-14 text-primary strong">{{ item.goods_sku_price }}</span>
                        </p>
                        <div class="desc-bar text-secondary">
                            <span> {{ item.goods_sku_name }}</span
                            ><span class="text-right">x {{ item.can_refund_goods_num }}</span>
                        </div>
                    </div>
                </div>
            </van-cell-group>

            <!--  -->
            <van-cell-group>
                <!-- service_type 判断售后or退货退款 -->
                <!-- yet_rebate 是否已结算 1：只能售后-->
                <!--  onId 判断只退款or退货退款or售后-->
                <van-cell
                    label="商品存在质量问题，联系卖家协商"
                    is-link
                    @click="goto(list.service_type, 2)"
                    v-show="list.service_type == 1 && onId == 0"
                >
                    <template #title>
                        <p><i class="icon icon-exchange"></i><span class="text-secondary-dark ml-4">换货或维修</span></p></template
                    >
                </van-cell>
                <!--  -->
                <template v-if="onId == 20 || onId == 30 || onId == 70">
                    <van-cell
                        label="没有收到货，或与卖家协商同意不用退货只退款"
                        is-link
                        v-show="list.service_type == 0"
                        @click="goto(list.service_type, 0)"
                    >
                        <template #title>
                            <p><i class="icon icon-drawback"></i><span class="text-secondary-dark ml-4">我要退款（无需退货）</span></p></template
                        >
                    </van-cell>
                    <van-cell label="已收到货，需要退还收到的货物" is-link v-show="list.service_type == 0" @click="goto(list.service_type, 1)">
                        <template #title>
                            <p><i class="icon icon-retreat"></i><span class="text-secondary-dark  ml-4">我要退货退款</span></p></template
                        >
                    </van-cell>
                </template>

                <template v-if="onId == 10 || onId == 90">
                    <van-cell
                        label="没有收到货，或与卖家协商同意不用退货只退款"
                        is-link
                        v-show="list.service_type == 0"
                        @click="goto(list.service_type, 0)"
                    >
                        <template #title>
                            <p><i class="icon icon-drawback"></i><span class="text-secondary-dark ml-4">我要退款（无需退货）</span></p></template
                        >
                    </van-cell>
                </template>
            </van-cell-group>
        </section>
    </div>
</template>

<script>
import HeaderBar from "../../../components/common/HeaderBar";
export default {
    components: {
        HeaderBar,
    },
    data() {
        return {
            iosShow: false,
            heights: 0,
            prodId: null,
            storeId: null,
            goodId: null,
            onId: null, //
            type: "null",
            title: null,
            checked: false,
            list: {},
        };
    },
    created() {
        // this.prodId = this.$route.params.id;
        // this.storeId = this.$route.params.store;
        // this.type = this.$route.params.type; //申请售后/退货退款
        this.fetchData();
    },
    methods: {
        goto(key, value) {
            if (this.goodId == null || this.goodId == "" || typeof this.goodId == "undefined") {
                this.$toast("请选择需要服务的商品");
            } else {
                if (key == 0) {
                    this.$router.push("/member/order/apply/" + this.goodId + "/" + value);
                } else {
                    this.$router.push("/member/order/complain/" + this.goodId + "/" + value);
                }
            }
        },
        fetchData() {
            this.$store.dispatch("SET_LOADING", 1);
            this.prodId = this.$route.params.id; //退款退货/维修 商品订单号
            this.onId = this.$route.params.onId; // 是否直接退款
            this.$apps.http
                .get("/Order/goods_list", { order_shop_id: this.prodId })
                .then((res) => {
                    if (res.code == 1) {
                        res.data.goods.forEach((item) => {
                            item.checked = false;
                        });
                        this.list = res.data;
                        this.list.service_type == 1 ? (this.title = "申请售后") : (this.title = "请选择退款类型");
                    }
                })
                .catch((err) => {});
        },
        checkedHandle(item) {
            this.list.goods.forEach((item) => {
                item.checked = false;
            });
            item.checked = !item.checked;
            this.goodId = item.id;
        },
    },
    mounted() {
        this.$nextTick(() => {
            let content = document.querySelector(".form");
            if (!this.$apps.isAndroid()) {
                let head = document.querySelector(".van-nav-bar--fixed");

                this.heights = window.ios != undefined ? window.ios.statusHeight() : 20;
                if (this.heights > 40) {
                    this.heights = 0;
                    this.iosShow = false;
                    content.style.marginTop = 47 + "px";
                    return;
                } else {
                    head.style.top = Number(this.heights) + "px";
                    content.style.marginTop = Number(this.heights) + 47 + "px";
                    this.iosShow = true;
                }
            } else {
                this.heights = 0;
                content.style.marginTop = 47 + "px";
                this.iosShow = false;
            }
        });
    },
};
</script>

<style lang="less" scoped>
.form {
    padding-top: 0.1rem;
    // 信息列表
    .van-cell-group {
        .van-cell {
            align-items: center;
            &:not(:last-child)::after {
                right: 16px;
            }

            .van-cell__title {
                p {
                    margin: 0;
                    position: relative;
                }
                .icon {
                    position: relative;
                    width: 1rem;
                    height: 1rem;
                    &.icon-mold {
                        position: absolute;
                        background-image: url("../../../assets/images/refund/icon-mold@2x.png");
                        background-image: image-set(
                            url("../../../assets/images/refund/icon-mold.png") 2x,
                            url("../../../assets/images/refund/icon-mold@2x.png") 3x
                        );
                        background-repeat: no-repeat;
                        background-size: 100% 100%;
                        width: 1.6rem;
                        height: 1.6rem;
                    }
                    &.icon-retreat {
                        background-image: url("../../../assets/images/refund/icon-retreat@2x.png");
                        background-image: image-set(
                            url("../../../assets/images/refund/icon-retreat.png") 2x,
                            url("../../../assets/images/refund/icon-retreat@2x.png") 3x
                        );
                        background-repeat: no-repeat;
                        background-size: 100% 100%;
                        position: absolute;
                        width: 1.35rem;
                        height: 1.35rem;
                    }
                    &.icon-drawback {
                        background-image: url("../../../assets/images/refund/icon-drawback@2x.png");
                        background-image: image-set(
                            url("../../../assets/images/refund/icon-drawback.png") 2x,
                            url("../../../assets/images/refund/icon-drawback@2x.png") 3x
                        );
                        background-repeat: no-repeat;
                        background-size: 100% 100%;
                        position: absolute;
                        width: 1.35rem;
                        height: 1.35rem;
                    }
                    &.icon-exchange {
                        background-image: url("../../../assets/images/refund/icon-exchange@2x.png");
                        background-image: image-set(
                            url("../../../assets/images/refund/icon-exchange.png") 2x,
                            url("../../../assets/images/refund/icon-exchange@2x.png") 3x
                        );
                        background-repeat: no-repeat;
                        background-size: 100% 100%;
                        position: absolute;
                        width: 1.35rem;
                        height: 1.35rem;
                    }
                }

                .van-cell__label {
                    margin-left: 2rem;
                }
            }
        }

        .prod-item {
            .van-checkbox {
                margin-right: 10px;
            }
        }
    }
}
</style>
