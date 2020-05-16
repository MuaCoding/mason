<template>
    <div class="page">
        <header-bar title="售后详情" :border="false" :back="-1" :isIos="iosShow"></header-bar>
        <div class="wrapper list-group">
            <h3>{{ list.status_name }}</h3>
            <!-- 管理详情状态 -->
            <van-cell-group>
                <van-cell :border="false">
                    <template #title
                        ><i
                            class="icon"
                            :class="{
                                'icon-wait': list.status == 0 || list.status == 40 || list.status == 30 || list.status == 60,
                                'icon-done': list.status == 10 || list.status == 70,
                                'icon-cancel': list.status == 20 || list.status == 80 || list.status == 90,
                            }"
                        ></i
                        ><span class="strong text-secondary-dark ml-4">{{ list.status_name }}</span></template
                    ></van-cell
                >
            </van-cell-group>
            <!-- 商品 -->
            <van-panel class="panel-item panel-gray panel-title" title="订单单号" :status="list.order_shop_no" v-if="list.shop">
                <div class="prod-item" @click="goto({ id: item.id }, 'detail')">
                    <van-image lazy-load radius="6px" width="4.25rem" height="4.25rem" :src="list.goods_master_image" />
                    <div class="prod-content">
                        <p>{{ list.goods_name }}</p>
                        <p>
                            ¥ <span class="fs-14 text-primary strong">{{ list.price | NumberFormat(list.price) }}</span>
                        </p>
                        <div class="desc-bar text-secondary fs-12">
                            <span>{{ list.goods_sku_name }}</span
                            ><span class="text-right">x {{ list.buy_num }}</span>
                        </div>
                    </div>
                </div>
            </van-panel>
            <!-- 申请时间 -->
            <van-cell-group>
                <van-cell :value="list.create_time" :border="false">
                    <template #title><span class="text-secondary-dark">申请日期</span></template>
                </van-cell>
            </van-cell-group>
            <!-- 换货或维修原因 -->
            <van-cell-group>
                <van-cell :border="true">
                    <div class="desc-bar">
                        <span class="fs-14">换货或维修原因</span>
                        <label class="text-warning">{{ list.type_name }}</label>
                    </div>
                </van-cell>
                <van-cell :border="false" title="换货或维修说明"> </van-cell>
                <van-field class="" autosize rows="4" type="textarea" readonly v-model="list.remark" />
            </van-cell-group>
            <!-- 上传凭证 -->
            <van-cell-group>
                <van-cell :border="true">
                    <template #title><span class=" text-secondary-dark">上传凭证</span><span class="text-secondary">（最多上传6张）</span></template>
                </van-cell>
                <van-row class="images">
                    <van-col class="images-item" span="8" v-for="(item, index) in list.voucher_images" :key="index">
                        <van-image width="100%" height="18vw" lazy-load :src="item" @click="imagePreview(list.voucher_images, index)" />
                    </van-col>
                </van-row>
            </van-cell-group>

            <!-- 卖家收货信息 -->
            <van-cell-group v-if="(list.status != 0 || list.status != 20 || list.status != 80) && list.seller_address">
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
            <!-- 快递信息 -->
            <van-cell-group v-if="list.status == 30 || list.status == 40 || list.status == 60 || list.status == 70">
                <van-cell title="物流信息" value="查看物流" is-link :to="'/member/logistics/' + list.express.express_no + '/' + list.id + '/' + 1">
                </van-cell>
            </van-cell-group>
            <!-- 联系商家 -->
            <van-cell-group>
                <!-- <van-cell :label="list.express_time" v-if="list.express && (list.status == 30 || list.status == 70)">
                    <template #title>
                        <p>
                            <i class="icon icon-express"></i><span class="text-secondary-dark ml-4">{{ list.express.express }}</span>
                        </p></template
                    >
                    <template #right-icon>
                        <van-icon name="arrow" style="display: flex;align-items: center;" />
                    </template>
                </van-cell> -->
                <van-cell icon="phone-o">
                    <template #title> <i class="icon icon-phone"></i><span class="text-secondary-dark">联系商家</span></template>
                    <template #default>
                        <van-button
                            color="#A0A9B5"
                            plain
                            size="mini"
                            :to="'/member/service/complain/' + list.id + '/' + list.order_goods_id"
                            v-if="list.status == 20"
                            >申诉</van-button
                        >
                        <!-- 重新申请售后 -->
                        <van-button
                            type="danger"
                            plain
                            size="mini"
                            :to="'/member/order/form/' + list.order_shop_id + '/' + 0"
                            v-if="list.status == 20 && list.is_can_sold_service == 1"
                            >重新申请</van-button
                        >
                        <van-button type="danger" plain size="mini" @click="confirmHandle" v-if="list.status == 60">确认收货</van-button>
                        <van-button type="danger" plain size="mini" v-if="list.status == 0 || list.status == 30" @click="cancelHandle"
                            >取消售后</van-button
                        >
                        <!-- <van-button type="danger" plain size="mini" v-if="list.status == 70">删除订单</van-button> -->
                    </template>
                </van-cell>
                <van-collapse v-model="activeNames" :border="false" icon="arrow" v-if="list.status == 70">
                    <van-collapse-item title="售后日志" name="1">
                        <van-cell v-for="item in list.log" :key="item.id" :title="item.title" :value="item.create_time" :label="item.remark" />
                    </van-collapse-item>
                </van-collapse>
            </van-cell-group>

            <van-notice-bar v-if="list.status == 10" class="mt-2" :scrollable="false" background="#FFEAED" color="#FB5C70">
                温馨提示：请于5天内寄回商品并提交回寄申请
            </van-notice-bar>
            <div class="p-5" v-if="list.status == 10">
                <van-button
                    block
                    color="linear-gradient(315deg,rgba(251,88,112,1) 0%,rgba(251,143,96,1) 100%)"
                    :to="'/member/service/foster/' + list.id"
                    >填写回寄商品信息</van-button
                >
                <p class="text-center text-gray fs-12">5天内未寄出商品将自动取消</p>
            </div>
        </div>
    </div>
</template>

<script>
import HeaderBar from "../../../components/common/HeaderBar";
import { ImagePreview } from "vant";
export default {
    components: {
        HeaderBar,
        ImagePreview,
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
                0: "提交售后申请",
                10: "卖家同意换货/维修",
                20: "卖家拒绝换货/维修",
                30: "待卖家确认收货",
                40: "卖家确认收货",
                50: "买家提交申诉",
                60: "待买家确认收货",
                70: "买家确认收货",
                80: "已取消售后",
            },
        };
    },
    created() {
        this.$nextTick(function() {
            this.fetchData();
        });
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
                .get("/SoldService.Order/detail", { id: this.prodId, user_type: 1 })
                .then((res) => {
                    if (res.code == 1) {
                        this.list = res.data;
                    }
                })
                .catch((err) => {});
        },
        // 取消售后
        cancelHandle() {
            let t = this;
            this.$dialog
                .confirm({
                    message: "确定取消售后？",
                })
                .then(() => {
                    this.$apps.http
                        .get("/SoldService.Order/cancel", { id: this.list.id })
                        .then((res) => {
                            if (res.code == 1) {
                                this.$toast(res.msg);
                                setTimeout(function() {
                                    t.$router.replace("/member/service/3");
                                    t.$store.dispatch(
                                        "SET_LOCALSTORAGE",
                                        JSON.stringify({
                                            name: "SERVICEBAR",
                                            value: 3,
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
        // 售后确认收货
        confirmHandle() {
            let t = this;
            this.$dialog
                .confirm({
                    title: "收货确认",
                    message: "确认收货后，当前售后订单将完成，请确保已收到货物！",
                })
                .then(() => {
                    this.$store.dispatch("SET_LOADING", 1);
                    this.$apps.http
                        .post("/SoldService.Order/confirm_received", {
                            id: this.list.id,
                            user_type: 1,
                        })
                        .then((result) => {
                            this.$toast.clear;
                            if (result.code == 1) {
                                this.$toast.success("确认收货成功");
                                let _ = this;
                                setTimeout(function() {
                                    t.$router.replace("/member/service/4");
                                    t.$store.dispatch(
                                        "SET_LOCALSTORAGE",
                                        JSON.stringify({
                                            name: "SERVICEBAR",
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
        imagePreview(image, index) {
            console.log(image);
            ImagePreview({
                images: image,
                closeable: true,
                lazyLoad: true,
                startPosition: index,
            });
        },
    },
};
</script>

<style lang="less" scoped>
.list-group {
    h3 {
        margin: 0;
        color: @brand-gray-dark;
        margin-bottom: 1rem;
    }
    // 信息列表
    .van-cell-group {
        .images {
            display: flex;
            padding: 1rem;
            margin-left: -0.25rem;
            margin-right: -0.25rem;

            .images-item {
                padding-left: 0.25rem;
                padding-right: 0.25rem;
                margin-bottom: 0.5rem;
            }
        }
        .van-cell {
            .desc-bar {
                display: flex;
                justify-content: space-between;

                span {
                    flex: 1;
                    width: 100rem;

                    .text-ellipsis(1);
                }
                .time {
                    margin-left: 0.5rem;
                    text-align: right;
                }
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
                    &.icon-done {
                        position: absolute;
                        background-image: url("../../../assets/images/refund/icon-done@2x.png");
                        background-image: image-set(
                            url("../../../assets/images/refund/icon-done.png") 2x,
                            url("../../../assets/images/refund/icon-done@2x.png") 3x
                        );
                        background-repeat: no-repeat;
                        background-size: 100% 100%;
                        width: 1.6rem;
                        height: 1.6rem;
                    }
                    &.icon-cancel {
                        position: absolute;
                        background-image: url("../../../assets/images/refund/icon-cancel@2x.png");
                        background-image: image-set(
                            url("../../../assets/images/refund/icon-cancel.png") 2x,
                            url("../../../assets/images/refund/icon-cancel@2x.png") 3x
                        );
                        background-repeat: no-repeat;
                        background-size: 100% 100%;
                        width: 1.6rem;
                        height: 1.6rem;
                    }
                    &.icon-wait {
                        position: absolute;
                        background-image: url("../../../assets/images/refund/icon-wait@2x.png");
                        background-image: image-set(
                            url("../../../assets/images/refund/icon-wait.png") 2x,
                            url("../../../assets/images/refund/icon-wait@2x.png") 3x
                        );
                        background-repeat: no-repeat;
                        background-size: 100% 100%;
                        width: 1.6rem;
                        height: 1.6rem;
                    }
                    &.icon-express {
                        position: absolute;
                        top: 0.35rem;
                        background-image: url("../../../assets/images/refund/icon-express@2x.png");
                        background-image: image-set(
                            url("../../../assets/images/refund/icon-express.png") 2x,
                            url("../../../assets/images/refund/icon-express@2x.png") 3x
                        );
                        background-repeat: no-repeat;
                        background-size: 100% 100%;
                        width: 1.6rem;
                        height: 1rem;
                    }
                }
            }
            .take-title {
                display: inline-block;
                width: 80px;
                font-size: 0.75rem;
                text-align: justify;
                text-align-last: justify;
                color: #a0a9b5;
            }
        }
    }
}
</style>
