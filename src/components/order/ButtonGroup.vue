<template>
    <div class="button-group">
        <!-- 待付款 -->
        <template v-if="order.status == 0">
            <van-button size="mini" plain type="default" color="#A0A9B5" @click="cancelHandle">取消订单</van-button>
            <van-button size="mini" plain type="danger" :disabled="order.current_time_seconds == 0" :to="'/member/pay/single1?id=' + order.id"
                >立即付款</van-button
            >
            <!-- <van-button size="mini" plain type="default" @click="deleteHandle">删除订单</van-button> -->
        </template>
        <!-- 待发货 -->
        <template v-if="order.status == 10">
            <van-button
                plain
                size="mini"
                v-show="order.is_can_refund == 0 && order.yet_rebate == 0"
                color="#A0A9B5"
                :to="'/member/order/form/' + order.id + '/' + order.status"
                >退款</van-button
            >
            <van-button plain size="mini" color="#FB5C70" @click="remindHandle">提醒发货</van-button>
        </template>
        <!-- 待收货 -->
        <template v-if="order.status == 20">
            <van-button size="mini" plain :to="'/member/logistics/' + order.express_no + '/' + order.id + '/' + 2" type="warning"
                >查看物流</van-button
            >
            <van-button
                plain
                size="mini"
                type="info"
                :to="'/member/order/form/' + order.id + '/' + order.status"
                v-show="order.yet_rebate == 0 && order.is_can_refund == 0"
                >退货退款</van-button
            >

            <!-- 禁用取红包 -->
            <van-button plain size="mini" color="#A0A9B5" disabled>领取红包</van-button>
            <van-button plain size="mini" type="primary" @click="takeHandle">确认收货</van-button>
        </template>
        <!-- 已完成 -->
        <template v-if="order.status == 30">
            <van-button plain size="mini" color="#A0A9B5" @click="deleteHandle">删除订单</van-button>
            <van-button plain size="mini" type="info" @click="againHandle(order)">再次购买</van-button>

            <van-button
                plain
                size="mini"
                type="info"
                :to="'/member/order/form/' + order.id + '/' + 0"
                v-show="order.yet_rebate == 1 && order.is_can_sold_service == 1"
                >申请售后</van-button
            >
            <!-- 可领取 -->
            <van-button plain size="mini" v-if="order.yet_rebate == 0 && order.is_can_refund == 0" color="#FF8594" @click="drawHandle"
                >领取红包</van-button
            >
            <van-button
                plain
                size="mini"
                type="info"
                :to="'/member/order/form/' + order.id + '/' + order.status"
                v-show="order.yet_rebate == 0 && order.is_can_refund == 0"
                >退货退款</van-button
            >
            <van-button plain size="mini" type="primary" v-show="order.is_can_comment == 1" :to="'/member/order/valuation/' + order.id"
                >立即评价</van-button
            >
        </template>
        <!-- 已取消 -->
        <template v-if="order.status == 40">
            <van-button plain size="mini" color="#A0A9B5" @click="deleteHandle">删除订单</van-button>
        </template>
        <!-- <van-button plain size="mini" type="info" :to="'/member/order/detail/' + order.id" >查看详情</van-button> -->
    </div>
</template>

<script>
export default {
    name: "ButtonGroup",
    components: {},
    props: {
        order: {
            type: Object,
            default: {
                status: -1,
            },
        },
        index: {
            type: Number,
            default: -1,
        },
        active: {
            type: Number,
            default: -1,
        },
    },
    data() {
        return {
            isComment: 1,
        };
    },
    created() {
        for (let i in this.order.goods) {
            if (this.order.goods[i].is_comment == 0) {
                this.isComment = 0;
                break;
            }
        }
    },
    methods: {
        // 取消订单
        cancelHandle() {
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
                            order_shop_id: this.order.id,
                        })
                        .then((result) => {
                            this.$toast.clear;
                            if (result.code == 1) {
                                this.$toast.success(result.msg);
                                this.order.status = 40;
                                this.$emit("refresh");
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
                            order_shop_id: this.order.id,
                        })
                        .then((result) => {
                            this.$toast.clear;
                            if (result.code == 1) {
                                t.$toast.success(result.msg);
                                setTimeout(() => {
                                    t.$router.push("/member/order/4");
                                    t.$store.dispatch(
                                        "SET_LOCALSTORAGE",
                                        JSON.stringify({
                                            name: "ORDERBAR",
                                            value: 4,
                                        })
                                    );
                                }, 2000);
                                t.$toast.clear;
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
        // 删除订单
        deleteHandle() {
            this.$dialog
                .confirm({
                    title: "删除订单确认",
                    message: "尊敬Mason顾客您好，删除订单后，此订单将不再显示，请谨慎操作，感谢您的支持，祝您购物愉快！",
                })
                .then(() => {
                    this.$toast.loading({
                        message: "确认中...",
                        forbidClick: true,
                    });
                    this.$apps.http
                        .post("/Order/delete", {
                            id: this.order.id,
                        })
                        .then((result) => {
                            this.$toast.clear;
                            if (result.code == 1) {
                                this.$toast.success(result.msg);
                                this.$emit("refresh");
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
            this.$dialog
                .confirm({
                    message: "是否提醒商家发货？",
                })

                .then(() => {
                    this.$store.dispatch("SET_LOADING", 1);
                    this.$apps.http
                        .get("/Order/remind_send", { order_shop_id: this.order.id })
                        .then((res) => {
                            if (res.code == 1) {
                                this.$toast(res.msg);
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
                        .get("/OrderShop/get_award", { id: this.order.id })
                        .then((res) => {
                            if (res.code == 1) {
                                this.$toast(res.msg);
                                this.$emit("refresh");
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
        // 再次购买
        againHandle(item) {
            let result = [];
            item.goods.forEach((e) => {
                result.push(e.id);
            });
            console.log(item);
            this.$router.push("/confirm?ids=" + result.toString());
        },
    },
};
</script>

<style lang="less" scoped></style>
