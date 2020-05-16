<template>
    <div class="page">
        <header-bar title="退款详情" :border="false" :isIos="iosShow" :class="'bg-nav-bar'" :back="-1"></header-bar>
        <div class="wrapper refund-wrap">
            <h3>{{ list.status_name }}</h3>
            <!-- 管理详情状态 -->
            <van-cell-group>
                <van-cell :border="false">
                    <template #title
                        ><i
                            class="icon"
                            :class="{
                                'icon-wait': list.status == 0 || list.status == 40 || list.status == 30 || list.status == 100,
                                'icon-done': list.status == 10 || list.status == 80 || list.status == 60,
                                'icon-cancel': list.status == 20 || list.status == 70 || list.status == 90,
                            }"
                        ></i
                        ><span class="strong text-secondary-dark ml-4">{{ states[list.status] }}</span></template
                    >
                </van-cell>
            </van-cell-group>
            <!-- 退款商品信息 -->
            <van-panel class="panel-item panel-gray panel-title" title="订单单号" :status="list.order_shop_no" v-if="list.shop">
                <div class="prod-item" @click="goto({ id: list.id }, 'detail')">
                    <van-image lazy-load radius="6px" width="4.25rem" height="4.25rem" :src="list.goods_master_image" />
                    <div class="prod-content">
                        <p>{{ list.goods_name }}</p>
                        <p>
                            ¥ <span class="fs-14 text-primary strong">{{ list.price | NumberFormat(list.price) }}</span>
                        </p>
                        <div class="desc-bar text-secondary">
                            <span class=""> {{ list.goods_sku_name }}</span
                            ><span class="text-right">x {{ list.refund_num }}</span>
                        </div>
                    </div>
                </div>
            </van-panel>
            <!-- 退款信息 -->
            <!--  0 20 70-->
            <van-notice-bar
                class="mt-2"
                :scrollable="false"
                background="#FFEAED"
                color="#FB5C70"
                v-if="(list.status == 0 || list.status == 20 || list.status == 70) && list.reason"
            >
                {{ list.reason }}
            </van-notice-bar>
            <van-cell-group v-if="list.status == 0 || list.status == 10 || list.status == 20 || list.status == 70 || list.status == 90">
                <van-cell title="退款信息"></van-cell>
                <van-cell title="申请退款">
                    <template #right-icon>
                        <span>￥{{ list.goods_amount | NumberFormat(list.goods_amount) }}</span>
                    </template>
                </van-cell>
                <van-cell title="申请运费">
                    <template #right-icon>
                        <span>￥{{ list.express_amount | NumberFormat(list.express_amount) }}</span>
                    </template>
                </van-cell>
                <van-cell title="共计总费用">
                    <template #right-icon>
                        <span class="strong text-primary fs-14">￥{{ list.refund_amount | NumberFormat(list.refund_amount) }}</span>
                    </template>
                </van-cell>
            </van-cell-group>
            <!-- 退款信息 -->
            <van-cell-group v-if="list.status == 80">
                <van-cell title="退款信息"></van-cell>
                <van-cell title="申请退款">
                    <template #right-icon>
                        <span>￥{{ list.goods_amount | NumberFormat(list.goods_amount) }}</span>
                    </template>
                </van-cell>
                <van-cell title="申请运费">
                    <template #right-icon>
                        <span>￥{{ list.express_amount | NumberFormat(list.express_amount) }}</span>
                    </template>
                </van-cell>
                <van-cell title="共计总费用">
                    <template #right-icon>
                        <span class="strong text-primary fs-14">￥{{ list.refund_amount | NumberFormat(list.refund_amount) }}</span>
                    </template>
                </van-cell>
                <van-cell title="退款原因" :value="list.type_name"></van-cell>
                <van-cell title="申请时间" :value="list.create_time"></van-cell>
                <van-cell title="退款单号" :value="list.refund_no"></van-cell>
            </van-cell-group>
            <!-- 快递信息 -->
            <van-cell-group>
                <van-cell v-if="list.status == 80">
                    <template #title>
                        <label class="text-secondary"
                            ><span class="strong text-primary fs-14">￥{{ list.refund_amount | NumberFormat(list.refund_amount) }}</span>
                            元将会原路退回</label
                        >
                    </template>
                </van-cell>
                <van-cell
                    v-if="
                        (list.status == 30 || list.status == 40 || list.status == 80 || list.status == 100) &&
                            list.type == 1 &&
                            list.received_state == 2
                    "
                    title="物流信息"
                    value="查看物流"
                    is-link
                    :to="'/member/logistics/' + list.express_no + '/' + list.id + '/' + 0"
                >
                </van-cell>
            </van-cell-group>

            <!-- <van-cell-group v-if="list.status == 80 || list.status == 30">
                <van-cell v-if="list.status == 80">
                    <template #title>
                        <label class="text-secondary"
                            ><span class="strong text-primary fs-14">￥{{ list.refund_amount }}</span> 元将会原路退回</label
                        >
                    </template>
                </van-cell>

                <van-cell :label="list.express_time">
                    <template #title>
                        <p>
                            <i class="icon icon-express"></i><span class="text-secondary-dark ml-4">{{ list.express }}</span>
                        </p></template
                    >
                    <template #right-icon>
                        <van-icon name="arrow" style="display: flex;align-items: center;" />
                    </template>
                </van-cell>
            </van-cell-group> -->
            <!-- 退款日志 -->
            <van-cell-group>
                <van-cell icon="phone-o">
                    <template #title> <i class="icon icon-phone"></i><span class="text-secondary-dark">联系商家</span></template>
                    <!-- 使用 title 插槽来自定义标题 -->
                    <template #default>
                        <van-button
                            type="danger"
                            plain
                            size="mini"
                            v-if="list.status == 0 || list.status == 10 || list.status == 30 || list.status == 40"
                            @click="cancelHandle"
                            >取消申请</van-button
                        >
                        <van-button
                            type="default"
                            plain
                            size="mini"
                            v-if="list.status == 20 || list.status == 70"
                            :to="'/member/refund/complain/' + list.id + '/' + list.order_goods_id"
                            >申诉</van-button
                        >
                        <!-- 重新申请退款 list.status == 20(卖家拒绝退款)：只显示退款 90只显示退款 70：显示退款，退货退款-->
                        <van-button
                            type="danger"
                            plain
                            size="mini"
                            v-if="
                                list.is_can_refund == 0 &&
                                    (list.goods_refund_status == 0 || list.goods_refund_status == 1 || list.goods_refund_status == 2) &&
                                    (list.status == 20 || list.status == 70 || list.status == 90)
                            "
                            :to="'/member/order/form/' + list.order_shop_id + '/' + (list.status == 20 ? 10 : list.status)"
                            >重新申请</van-button
                        >
                        <!-- <van-button type="danger" plain size="mini" v-if="list.status == 80 || list.status == 90" @click="deleteHandle"
                            >删除退款</van-button
                        > -->
                    </template>
                </van-cell>
                <van-collapse v-model="activeNames" :border="false" icon="arrow" v-if="list.status == 80">
                    <van-collapse-item title="退款日志" name="1">
                        <van-cell v-for="item in list.log" :key="item.id" :title="item.title" :value="item.create_time" :label="item.remark" />
                    </van-collapse-item>
                </van-collapse>
            </van-cell-group>
            <!-- 卖家收货信息 -->
            <van-cell-group v-if="(list.status == 30 || list.status == 40 || list.status == 60) && list.seller_address">
                <van-collapse v-model="takeName">
                    <van-collapse-item title="卖家收货信息" name="1">
                        <van-cell>
                            <template #title>
                                <span class="take-title">卖家收货人：</span>
                                <span class="fs-12 text-secondary">{{ list.seller_address.name }}</span>
                            </template>
                        </van-cell>
                        <van-cell>
                            <template #title>
                                <span class="take-title">联系号码：</span>
                                <span class="fs-12 text-secondary">{{ list.seller_address.mobile }}</span>
                            </template>
                        </van-cell>
                        <van-cell>
                            <template #title>
                                <span class="take-title">收货地址：</span>
                                <span class="fs-12 text-secondary">{{
                                    list.seller_address.province.name + list.seller_address.city.name + list.seller_address.district.name
                                }}</span>
                            </template>
                        </van-cell>
                        <van-cell>
                            <template #title>
                                <span class="take-title">详细地址：</span>
                                <span class="fs-12 text-secondary">{{ list.seller_address.info }}</span>
                            </template>
                        </van-cell>
                    </van-collapse-item>
                </van-collapse>
            </van-cell-group>
            <van-notice-bar class="mt-2" :scrollable="false" background="#FFEAED" color="#FB5C70" v-if="list.status == 60">
                温馨提示：请于5天内寄回商品并提交回寄申请
            </van-notice-bar>
            <div class="p-5" v-if="list.status == 60">
                <van-button
                    block
                    color="linear-gradient(315deg,rgba(251,88,112,1) 0%,rgba(251,143,96,1) 100%)"
                    :to="'/member/refund/foster/' + list.id"
                    >填写回寄商品信息</van-button
                >
                <p class="text-center text-gray fs-12">5天内未寄出商品将自动取消</p>
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
            prodId: "",
            activeNames: ["1"],
            takeName: ["1"],
            list: {},
            states: {
                0: "待卖家确认退款",
                10: "卖家同意退款",
                20: "卖家拒绝退款",
                30: "买家已回寄商品",
                40: "卖家确认收货",
                60: "卖家同意退货退款",
                70: "卖家拒绝退货退款",
                80: "退款完成",
                90: "退款已取消",
                100: "退款中",
            },
        };
    },
    created() {
        this.fetchData();
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
    methods: {
        fetchData() {
            this.$store.dispatch("SET_LOADING", 1);
            this.prodId = this.$route.params.id;
            this.$apps.http
                .get("/Refund.Buyer/detail", { id: this.prodId })
                .then((res) => {
                    if (res.code == 1) {
                        this.list = res.data;
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
                    message: "您确定要取消当前退款",
                })
                .then(() => {
                    this.$toast.loading({
                        message: "取消中...",
                        forbidClick: true,
                    });
                    this.$apps.http
                        .post("/Refund.Buyer/cancel", {
                            id: this.list.id,
                        })
                        .then((result) => {
                            this.$toast.clear;
                            if (result.code === 1) {
                                this.$toast.success(result.msg);
                                // this.list.status = 40;
                                setTimeout(() => {
                                    t.$router.replace("/member/refund/3");
                                    t.$store.dispatch(
                                        "SET_LOCALSTORAGE",
                                        JSON.stringify({
                                            name: "REFUNDBAR",
                                            value: 3,
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
        // 删除退款
        deleteHandle() {
            // this.$dialog
            //     .confirm({
            //         title: "取消确认",
            //         message: "您确定要删除当前退款"
            //     })
            //     .then(() => {
            //         this.$toast.loading({
            //             message: "取消中...",
            //             forbidClick: true
            //         });
            //         this.$apps.http
            //             .post("/Refund.Buyer/cancel", {
            //                 id: this.list.id
            //             })
            //             .then(result => {
            //                 this.$toast.clear;
            //                 if (result.code === 1) {
            //                     this.$toast.success(result.msg);
            //                 } else {
            //                     this.$toast.fail(result.msg);
            //                 }
            //             })
            //             .catch(err => {
            //                 this.$toast.fail("网络错误");
            //             });
            //     })
            //     .catch(() => {
            //     });
        },
    },
};
</script>

<style lang="less" scoped>
.refund-wrap {
    h3 {
        margin: 0;
        color: @brand-gray-dark;
        margin-bottom: 1rem;
    }
    // 信息列表
    .van-cell-group {
        .van-cell {
            align-items: unset;

            .van-cell__title {
                p {
                    margin: 0;
                    position: relative;
                }
            }

            .take-title {
                display: inline-block;
                width: 80px;
                color: #a0a9b5;
                font-size: 0.75rem;
                text-align: justify;
                text-align-last: justify;
            }
        }
    }
}
</style>
