<template>
    <div class="page">
        <div :style="{ height: heights + 'px' }" v-if="iosShow" class="headIos"></div>
        <header-bar title="订单详情" :border="true" :isIos="iosShow" :back="-1" :heights="heights"></header-bar>

        <div class="wrapper refund-wrap" style="padding-bottom: 100px">
            <!-- 标题 -->
            <h3>{{ states[data.status] }}</h3>
            <!-- 管理详情状态 -->
            <van-cell-group>
                <van-cell :border="false" value-class="text-primary">
                    <template #title
                        ><i
                            class="icon"
                            :class="{
                                'icon-wait': data.status == 0 || data.status == 10,
                                'icon-done': data.status == 30,
                                'icon-take': data.status == 20,
                                'icon-cancel': data.status == 40,
                            }"
                        ></i
                        ><span class="strong text-secondary-dark ml-4">{{ states[data.status] }}</span></template
                    >
                    <template #default>
                        <van-count-down
                            class="text-primary"
                            v-if="data.current_time_seconds > 0"
                            :time="data.current_time_seconds * 1000"
                            format="mm:ss:SS"
                            :millisecond="true"
                        />
                        <span v-else>支付已过期</span>
                    </template>
                </van-cell>
            </van-cell-group>
            <van-cell-group :border="false">
                <!-- 收件人地址 -->
                <van-cell title-class="strong fs-14 ellipsis">
                    <template slot="title"
                        ><span class="">{{ data.address.address_all }}</span></template
                    >
                    <template slot="label">
                        <span>{{ data.address.address_contact_name }}</span
                        ><span class="ml-3">{{ data.address.address_contact_mobile }}</span>
                    </template>
                </van-cell>
                <!-- 快递信息 -->
                <van-cell
                    title="物流信息"
                    value="查看物流"
                    is-link
                    :to="'/member/logistics/' + data.express_no + '/' + data.id + '/' + 2"
                    v-if="data.status == 30"
                >
                </van-cell>
            </van-cell-group>
            <!-- 商品信息 -->
            <van-panel class="panel-item panel-gray panel-title" title="订单编号" :status="data.shop_no">
                <div class="prod-item" v-for="item in data.goods" :key="item.id">
                    <van-image lazy-load radius="6px" width="4.25rem" height="4.25rem" :src="item.goods_master_image" />
                    <div class="prod-content">
                        <p>{{ item.goods_name }}</p>
                        <p>
                            ¥ <span class="fs-14 text-primary strong">{{ item.goods_money }}</span>
                        </p>
                        <div class="desc-bar text-secondary">
                            <span class=""> {{ item.goods_sku_name }}</span
                            ><span class="text-right">x {{ item.buy_num }}</span>
                        </div>
                    </div>
                </div>
            </van-panel>

            <van-cell-group>
                <van-cell title="订单信息" :border="false" title-class="strong text-secondary-dark"></van-cell>
                <van-notice-bar background="#FFEAED" :scrollable="false"> 订单备注: {{ data.remark || "暂无备注" }} </van-notice-bar>
                <van-cell title="订单编号" :value="data.shop_no"></van-cell>
                <van-cell title="下单时间" :value="data.create_time"></van-cell>
                <van-cell title="订单金额" :value="data.all_money | NumberFormat(data.all_money)"></van-cell>
                <van-cell title="商品金额" :value="data.goods_money | NumberFormat(data.goods_money)"></van-cell>
                <van-cell title="物流运费" :value="data.express_money | NumberFormat(data.express_money)"></van-cell>
                <van-cell title="优惠金额" :value="'0.00'"></van-cell>
                <van-cell title="使用购物分" :value="data.use_buy_score | NumberFormat(data.use_buy_score)"></van-cell>
                <van-cell title="赠送红包" :value="parseFloat(data.award_hongbao) | NumberFormat(parseFloat(data.award_hongbao))"></van-cell>
            </van-cell-group>
            <!-- 付款信息 -->
            <van-cell-group v-if="data.is_pay">
                <van-cell title="付款信息" title-class="strong text-secondary-dark"></van-cell>
                <van-cell title="付款时间" :value="data.pay_time"></van-cell>
                <van-cell title="付款金额" :value="data.pay_money"></van-cell>
                <van-cell title="付款方式" :value="'MASON支付'"></van-cell>
                <van-cell title="付款单号" :value="data.pay_no"></van-cell>
                <van-cell title="付款总金额" v-show="data.status == 30">
                    <span class="text-primary strong fs-14"> {{ data.all_money | NumberFormat(data.all_money) }}</span>
                </van-cell>
            </van-cell-group>

            <div class="button-bar">
                <div class="text-bar" v-if="data.status == 0 || data.status == 10 || data.status == 20">
                    <span>订单总金额：</span>
                    <span
                        >¥ <span class="text-primary strong fs-14">{{ data.all_money | NumberFormat(data.all_money) }}</span></span
                    >
                </div>
                <van-button
                    v-if="data.status == 30 && data.is_can_comment == 1"
                    color="linear-gradient(133deg,rgba(247,232,216,1) 0%,rgba(209,180,152,1) 100%)"
                    size="mini"
                    :hairline="true"
                    :to="'/member/order/valuation/' + data.id"
                    >立即评价</van-button
                >
                <template v-if="data.status == 10">
                    <van-button
                        plain
                        size="mini"
                        v-show="data.is_can_refund == 0 && data.yet_rebate == 0"
                        color="#A0A9B5"
                        :to="'/member/order/form/' + data.id + '/' + data.status"
                        >退款</van-button
                    >
                    <van-button plain size="mini" color="#FB5C70" @click="remindHandle">提醒发货</van-button>
                </template>
                <van-button v-if="data.status == 0" color="#A0A9B5" plain size="mini" :hairline="true" @click="cancelHandle()">取消订单</van-button>
                <van-button v-if="data.status == 30 || data.status == 40" color="#A0A9B5" plain size="mini" :hairline="true" @click="deleteHandle()"
                    >删除订单</van-button
                >
                <van-button
                    v-if="data.status == 30 && data.yet_rebate == 1 && data.is_can_sold_service == 1"
                    color="linear-gradient(141deg,rgba(255,213,106,1) 0%,rgba(251,168,35,1) 100%)"
                    size="mini"
                    :hairline="true"
                    :to="'/member/order/form/' + data.id + '/' + 0"
                    >申请售后</van-button
                >
                <van-button
                    v-if="(data.status == 20 || data.status == 30) && data.yet_rebate == 0 && data.is_can_refund == 0"
                    color="linear-gradient(141deg,rgba(255,213,106,1) 0%,rgba(251,168,35,1) 100%)"
                    size="mini"
                    :hairline="true"
                    :to="'/member/order/form/' + data.id + '/' + data.status"
                    >退货退款</van-button
                >

                <van-button
                    v-if="data.status == 30"
                    color="linear-gradient(225deg,rgba(251,88,112,1) 0%,rgba(251,143,96,1) 100%)"
                    size="mini"
                    :hairline="true"
                    @click="againHandle(data)"
                    >再次购买</van-button
                >
                <van-button
                    v-if="data.status == 20"
                    color="linear-gradient(225deg,rgba(251,88,112,1) 0%,rgba(251,143,96,1) 100%)"
                    size="mini"
                    :hairline="true"
                    @click="takeHandle"
                    >确认收货</van-button
                >
                <van-button v-if="data.status == 20" color="#A0A9B5" size="mini">领取红包</van-button>
                <van-button
                    v-if="data.status == 30 && data.yet_rebate == 0 && data.refund_status == 0"
                    color="linear-gradient(225deg,rgba(251,88,112,1) 0%,rgba(251,143,96,1) 100%)"
                    size="mini"
                    @click="drawHandle"
                    >领取红包</van-button
                >
                <van-button
                    v-if="data.status == 0"
                    color="linear-gradient(225deg,rgba(251,88,112,1) 0%,rgba(251,143,96,1) 100%)"
                    size="mini"
                    :hairline="true"
                    :disabled="data.current_time_seconds == 0"
                    :to="'/member/pay/single1?id=' + data.id"
                    @click="goPay(data.id)"
                    >立即支付</van-button
                >
            </div>
        </div>
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
            id: "",
            data: {
                shop: {},
                goods: [],
                address: {},
                scores: 0.0,
                express_company: {},
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
    methods: {
        goto(id) {
            this.$router.push({
                path: "/goods/" + id,
            });
        },
        fetchData() {
            this.$store.dispatch("SET_LOADING", 1);
            this.id = this.$route.params.no;
            this.$apps.http
                .get("/order/detail", { order_shop_id: this.id })
                .then((result) => {
                    if (result.code === 1) {
                        this.data = result.data;
                        let goods = this.data.goods,
                            scores = 0.0;
                        try {
                            for (let i in goods) {
                                scores += parseFloat(parseFloat(goods[i].goods_award_score).toFixed(2));
                            }
                            this.$set(this.data, "scores", scores.toFixed(2));
                        } catch (err) {
                            console.log(err);
                        }
                    }
                })
                .catch((err) => {});
        },
        // 取消订单
        cancelHandle() {
            let t = this;
            this.$dialog
                .confirm({
                    title: "取消确认",
                    message: "尊敬Mason顾客您好，您正在进行取消订单，感谢您的支持，祝您购物愉快！",
                })
                .then(() => {
                    this.$toast.loading({
                        message: "取消中...",
                        forbidClick: true,
                    });
                    this.$apps.http
                        .post("/order/cancel", {
                            order_shop_id: this.id,
                        })
                        .then((result) => {
                            this.$toast.clear;
                            if (result.code === 1) {
                                this.$toast.success(result.msg);
                                setTimeout(() => {
                                    t.$router.replace("/member/order/1");
                                    t.$store.dispatch(
                                        "SET_LOCALSTORAGE",
                                        JSON.stringify({
                                            name: "ORDERBAR",
                                            value: 1,
                                        })
                                    );
                                }, 2000);
                                this.$toast.clear;
                            } else {
                                this.$toast.fail(result.msg);
                            }
                        })
                        .catch((err) => {
                            this.$toast.fail("网络错误");
                        });
                })
                .catch(() => {
                    // on cancel
                });
        },
        //领取红包
        drawHandle() {
            this.$dialog
                .confirm({
                    title: "领取红包",
                    message: "领取红包后，此订单将不在支持退货 退款服务，请谨慎操作哦！",
                })

                .then(() => {
                    this.$store.dispatch("SET_LOADING", 1);
                    this.$apps.http
                        .get("/OrderShop/get_award", { id: this.id })
                        .then((res) => {
                            if (res.code === 1) {
                                this.$toast(res.msg);
                                this.fetchData();
                            } else {
                                this.$toast(res.msg);
                            }
                        })
                        .catch((err) => {});
                })
                .catch(() => {
                    // on cancel
                });
        },
        // 删除订单
        deleteHandle() {
            let t = this;
            this.$dialog
                .confirm({
                    title: "删除订单",
                    message: "尊敬Mason顾客您好，删除订单后，此订单将不再显示，请谨慎操作，感谢您的支持，祝您购物愉快！",
                })

                .then(() => {
                    this.$store.dispatch("SET_LOADING", 1);
                    this.$apps.http
                        .get("/order/delete", { id: this.id })
                        .then((res) => {
                            if (res.code === 1) {
                                this.$toast(res.msg);
                                setTimeout(function() {
                                    t.data.status == 30
                                        ? (t.$router.replace("/member/order/3"),
                                          t.$store.dispatch(
                                              "SET_LOCALSTORAGE",
                                              JSON.stringify({
                                                  name: "ORDERBAR",
                                                  value: 3,
                                              })
                                          ))
                                        : (t.$router.replace("/member/order/3"),
                                          t.$store.dispatch(
                                              "SET_LOCALSTORAGE",
                                              JSON.stringify({
                                                  name: "ORDERBAR",
                                                  value: 0,
                                              })
                                          ));
                                }, 2000);
                                this.$toast.clear;
                                //
                            } else {
                                this.$toast(res.msg);
                            }
                        })
                        .catch((err) => {});
                })
                .catch(() => {
                    // on cancel
                });
        },
        // 确认收货
        takeHandle() {
            let t = this;
            this.$dialog
                .confirm({
                    title: "收货确认",
                    message: "确认收货后当前订单商品可申请退款操作。",
                })
                .then(() => {
                    this.$toast.loading({
                        message: "确认中...",
                        forbidClick: true,
                    });
                    this.$apps.http
                        .post("/order/confirm", {
                            order_shop_id: this.id,
                        })
                        .then((result) => {
                            this.$toast.clear;
                            if (result.code === 1) {
                                this.$toast.success(result.msg);
                                setTimeout(() => {
                                    t.$router.replace("/member/order/4");
                                    t.$store.dispatch(
                                        "SET_LOCALSTORAGE",
                                        JSON.stringify({
                                            name: "ORDERBAR",
                                            value: 4,
                                        })
                                    );
                                }, 2000);
                                this.$toast.clear;
                            } else {
                                this.$toast.fail(result.msg);
                            }
                        })
                        .catch((err) => {
                            this.$toast.fail("网络错误");
                        });
                })
                .catch(() => {
                    // on cancel
                });
        },
        // 提醒发货
        remindHandle() {
            let t = this;
            this.$dialog
                .confirm({
                    message: "是否提醒商家发货？",
                })

                .then(() => {
                    this.$store.dispatch("SET_LOADING", 1);
                    this.$apps.http
                        .get("/Order/remind_send", { order_shop_id: this.data.id })
                        .then((res) => {
                            if (res.code === 1) {
                                this.$toast(res.msg);
                                setTimeout(() => {
                                    t.$router.replace("/member/order/2");
                                    t.$store.dispatch(
                                        "SET_LOCALSTORAGE",
                                        JSON.stringify({
                                            name: "ORDERBAR",
                                            value: 2,
                                        })
                                    );
                                }, 2000);
                                this.$toast.clear;
                            } else {
                                this.$toast(res.msg);
                            }
                        })
                        .catch((err) => {});
                })
                .catch(() => {
                    // on cancel
                });
        },
        reviewHandle() {},
        applyHandle() {},
        againHandle(item) {
            console.log(item);
            let result = [];
            item.goods.forEach((e) => {
                result.push(e.id);
            });
            console.log(item);
            this.$router.push("/confirm?ids=" + result.toString());
        },
    },
    created() {
        this.fetchData();
    },
    mounted() {
        this.$nextTick(() => {
            if (!this.$apps.isAndroid()) {
                let head = document.querySelector(".van-nav-bar--fixed");
                let content = document.querySelector(".refund-wrap");

                this.heights = window.ios != undefined ? window.ios.statusHeight() : 20;
                if (this.heights > 40) {
                    this.iosShow = false;
                    this.heights = 0;
                    content.style.marginTop = 47 + "px";
                    return;
                } else {
                    head.style.top = Number(this.heights) + "px";
                    content.style.marginTop = Number(this.heights) + 47 + "px";
                    this.iosShow = true;
                }
            } else {
                this.heights = 0;
                this.iosShow = false;
            }
        });
    },
    filters: {
        formatMeidou: function(value, score) {
            return value ? parseFloat(parseFloat(value) - parseFloat(score)).toFixed(2) : "0.00";
        },
    },
};
</script>

<style lang="less" scoped>
.wrapper {
    h3 {
        margin: 0;
        color: @brand-gray-dark;
        margin-bottom: 1rem;
    }
}
.page {
    .refund-wrap {
        .panel-title {
            .van-cell {
                .van-panel__header-value {
                    flex: 2;
                }
            }
        }
    }
}
.button-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 10px 16px;
    font-size: 14px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px -4px 12px 0px rgba(0, 0, 0, 0.06);
    .van-button {
        height: 24px;
        padding: 0 5px;
        line-height: 22px;
        & + .van-button {
            margin-left: 10px;

            &:first-child {
                margin-left: 0px;
            }
        }
    }
    .text-bar {
        flex: 1;
        font-size: 0.75rem;
        text-align: left;
    }
}
</style>
