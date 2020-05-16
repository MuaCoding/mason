<template>
    <div class="page page-no-radius">
        <header-bar title="申请退款" :border="false" :isIos="iosShow" :back="-1"></header-bar>
        <van-cell-group class="prod-list px-3">
            <div class="prod-item" @click="goto">
                <van-image lazy-load radius="6px" width="4.25rem" height="4.25rem" :src="list.master_image" />
                <div class="prod-content">
                    <p>{{ list.goods_name }}</p>
                    <p>
                        ¥ <span class="fs-14 text-primary strong">{{ list.goods_sku_price | NumberFormat(list.goods_sku_price) }}</span>
                    </p>
                    <div class="desc-bar text-secondary">
                        <span> {{ list.goods_sku_name }}</span
                        ><span class="text-right">x {{ list.can_refund_goods_num }}</span>
                    </div>
                </div>
            </div>
        </van-cell-group>

        <van-cell-group>
            <van-cell :border="true" v-show="refundType == 1" title="货物状态" is-link :value="form.currStatus || '请选择'" @click="selectHandle(0)">
            </van-cell>
            <van-cell title="退款原因" is-link :value="form.currType" @click="selectHandle(1)" />
            <!-- 货物状态 -->
            <van-action-sheet v-model="isActive" title="货物状态" cancel-text="关闭" :border="true" @cancel="onCancel">
                <van-cell-group class="type-list">
                    <van-cell v-for="item in list.received_state" :key="item.id" :border="true" @click="onSelect(item, 0)">
                        <template #title>
                            <span class="text-secondary-dark">{{ item.name }}</span>
                        </template>
                        <template #right-icon>
                            <van-icon v-show="form.status == item.id" name="success" color="#FB616E" size="1rem" />
                        </template>
                    </van-cell>
                </van-cell-group>
            </van-action-sheet>
            <!-- 退款原因 -->
            <van-action-sheet v-model="isShow" title="退款原因" cancel-text="关闭" :border="true" @cancel="onCancel">
                <van-cell-group class="type-list">
                    <van-cell v-for="item in list.type_list" :key="item.value" :border="true" @click="onSelect(item, 1)">
                        <template #title>
                            <span class="text-secondary-dark">{{ item.title }}</span>
                        </template>
                        <template #right-icon>
                            <van-icon v-show="form.type == item.value" name="success" color="#FB616E" size="1rem" />
                        </template>
                    </van-cell>
                </van-cell-group>
            </van-action-sheet>
            <!-- 退款金额 -->
            <van-cell :label="'可修改,最多￥' + list.can_refund_money + '，含发货邮费 ￥' + list.can_refund_express_money">
                <!-- 使用 title 插槽来自定义标题 -->
                <template #title>
                    <label class="text-secondary"
                        >退款金额：<span class="strong text-primary fs-14">￥{{ list.can_refund_money }}</span></label
                    >
                </template>
            </van-cell>
        </van-cell-group>
        <van-cell-group>
            <van-cell :border="false">
                <template #title><span class=" text-secondary-dark">退款说明</span></template></van-cell
            >
            <van-field type="textarea" autosize rows="4" v-model="form.remark" placeholder="请填写详细退款原因…" />
        </van-cell-group>

        <van-cell-group>
            <van-cell :border="true" title="退款明细"></van-cell>

            <van-row class="mt-2">
                <van-col span="12"
                    ><div class="input-item van-cell">
                        <span class="van-cell__title">数量：</span
                        ><van-stepper
                            class="p-1"
                            v-model="form.number"
                            min="1"
                            :max="list.can_refund_goods_num"
                            @blur="blurAction"
                            @plus="plusAction"
                            @minus="minusAction"
                        /></div
                ></van-col>
                <van-col span="12">
                    <van-field class="input-item" :border="false" readonly v-model="form.express" type="number" label="运费金额：" />
                </van-col>
            </van-row>
            <van-cell :border="false" class="pb-0">
                <template #title>
                    <span class="take-title text-secondary">商品金额：</span>
                    <span class="fs-14 text-secondary-light"
                        >¥
                        {{
                            (Number(list.goods_sku_price) * Number(form.number)) | NumberFormat(Number(list.goods_sku_price) * Number(form.number))
                        }}</span
                    >
                </template>
            </van-cell>
            <van-cell :border="false">
                <template #title>
                    <span class="take-title text-secondary">购 物 分：</span>
                    <span class="fs-12 text-secondary-light">¥ {{ form.score }} </span>
                </template>
            </van-cell>
            <van-cell class="pt-0">
                <template #title>
                    <span class="take-title text-secondary">总计金额：</span>
                    <span class="fs-14 text-primary strong"
                        >¥
                        {{
                            (Number(list.goods_sku_price) * Number(form.number) + Number(form.express) - Number(form.score))
                                | NumberFormat(Number(list.goods_sku_price) * Number(form.number) + Number(form.express) - Number(form.score))
                        }}</span
                    >
                </template>
            </van-cell>
        </van-cell-group>

        <van-cell-group :border="false">
            <van-cell :border="false">
                <template #title><span class="text-secondary-dark">上传凭证</span><span class="text-gray">（最多上传6张）</span></template></van-cell
            >
            <!-- 图片上传组件 -->
            <uploader-image @upload="uploadHandle" @delete="deleteHandle"></uploader-image>
        </van-cell-group>
        <div class="p-5 bg-white ">
            <van-button block :loading="loading" color="linear-gradient(315deg,rgba(251,88,112,1) 0%,rgba(251,143,96,1) 100%)" @click="submitAction()"
                >确认提交</van-button
            >
        </div>
    </div>
</template>

<script>
import HeaderBar from "../../../components/common/HeaderBar";
import UploaderImage from "../../../components/common/UploaderImage";
import { ToFixed } from "../../../utils/utils.js";
export default {
    components: {
        HeaderBar,
        UploaderImage,
    },
    data() {
        return {
            iosShow: false,
            heights: 0,
            form: {
                amount: "",
                remark: "",
                order_goods_id: "",
                type: null,
                status: null,
                order_shop_id: "",
                imagesUrl: [],
                currStatus: "请选择",
                currType: "请选择",
                score: null, //积分
                prodId: null,
                goodId: null, //售后商品id
                type: null, //退款/退货退款类型
                number: 1, //商品数量
                express: 0, // 运费
            },
            list: {},
            fee: null,
            refundType: null,
            isShow: false, //
            isActive: false,
            loading: false,
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
        goto() {
            this.$router.push("/goods/" + this.list.id);
            // :to="'/goods/' + (item.sku.activity_is == 1 ? item.sku.goods_id : item.id)"
        },
        fetchData() {
            this.$store.dispatch("SET_LOADING", 1);
            let t = this;
            t.form.goodId = t.$route.params.id;
            t.refundType = t.$route.params.type; //退款类型  0：申请退款（未发货） 1：退货退款（已发货）
            t.$apps.http
                .get("/Refund.Buyer/goods_detail", { order_goods_id: this.form.goodId })
                .then((res) => {
                    if (res.code == 1) {
                        t.list = res.data;
                        t.form.number = res.data.can_refund_goods_num;
                        // t.form.express = t.list.can_refund_express_money / t.list.can_refund_goods_num;
                        t.fetchChCarge(); //获取运费/积分
                    }
                })
                .catch((err) => {});
        },
        //获取运费/积分
        fetchChCarge() {
            this.$store.dispatch("SET_LOADING", 1);
            let t = this;
            const formdata = {
                order_goods_id: this.form.goodId,
                refund_num: this.form.number,
            };
            t.$apps.http
                .get("/Refund.Buyer/express_fee", formdata)
                .then((res) => {
                    if (res.code == 1) {
                        this.fee = res.data;
                        t.form.score = res.data.refund_score;
                        t.form.express = res.data.express_fee;
                    }
                })
                .catch((err) => {});
        },
        blurAction() {
            this.fetchChCarge();
            // this.form.express = ToFixed((this.list.can_refund_express_money / this.list.can_refund_goods_num) * this.form.number, 2);
        },
        plusAction() {
            this.form.number++;
            this.fetchChCarge();
            // this.form.express = ToFixed((this.list.can_refund_express_money / this.list.can_refund_goods_num) * (this.form.number + 1), 2);
        },
        minusAction() {
            this.form.number--;
            this.fetchChCarge();
            // this.form.express = ToFixed((this.list.can_refund_express_money / this.list.can_refund_goods_num) * (this.form.number - 1), 2);
        },
        //删除图片
        deleteHandle(index) {
            this.form.imagesUrl.splice(index, 1);
        },
        //新增图片
        uploadHandle(url) {
            console.log(url);
            this.form.imagesUrl[this.form.imagesUrl.length] = url;
        },
        onSelect(item, key) {
            key == 0
                ? ((this.form.status = item.id), (this.form.currStatus = item.name), (this.isActive = false))
                : ((this.form.type = item.value), (this.form.currType = item.title), (this.isShow = false));

            console.log(this.form.type);
        },
        onCancel() {},
        selectHandle(key) {
            key == 0 ? (this.isActive = true) : (this.isShow = true);
        },
        // 申请售后数据提交
        submitAction() {
            if (this.refundType == 1 && (this.form.status == null || this.form.status === "" || typeof this.form.status == "undefined")) {
                this.$toast("请选择货物状态");
                return;
            }

            if (this.form.type == null || this.form.type === "" || typeof this.form.type == "undefined") {
                this.$toast("请选择退款原因");
                return;
            } else if (this.form.remark == null || this.form.remark === "" || typeof this.form.remark == "undefined") {
                this.$toast("请填写详细退款原因");
                return;
            } else if (this.form.imagesUrl.length == 0) {
                this.$toast("请上传凭证");
                return;
            }
            let t = this;
            const formdata = {
                order_goods_id: this.form.goodId,
                type: this.refundType,
                refund_reason_type: this.form.type, //退款原因类型
                remark: this.form.remark,
                refund_amount: this.fee.refund_amount, //退款总金额Number(list.can_refund_goods_money) * Number(form.number) + Number(form.express) - Number(form.score)
                goods_amount: this.fee.goods_amount, //
                express_amount: this.fee.express_fee, // 运费
                score: this.fee.refund_score, //积分
                refund_num: parseFloat(this.form.number), //退款商品数量
                voucher_images: this.form.imagesUrl.toString(),
            };
            this.refundType == 1 ? (formdata.received_state = this.form.status) : (formdata.received_state = 0);

            this.$dialog
                .confirm({
                    title: "退款申请",
                    message: "尊敬顾客您好，您正在申请退款，提交后，货款将原路退回感谢您的支持，祝您购物愉快！",
                })
                .then(() => {
                    this.$toast.loading({
                        message: "确认中...",
                        forbidClick: true,
                    });
                    this.loading = true;

                    this.$apps.http
                        .post("/Refund.Buyer/apply", formdata)
                        .then((res) => {
                            this.loading = false;
                            if (res.code == 1) {
                                this.$toast(res.msg);
                                setTimeout(() => {
                                    t.$router.replace("/member/refund/2");
                                    t.$store.dispatch(
                                        "SET_LOCALSTORAGE",
                                        JSON.stringify({
                                            name: "REFUNDBAR",
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
    },
};
</script>

<style lang="less" scoped>
.take-title {
    display: inline-block;
    width: 80px;
    font-size: 0.75rem;
    text-align: justify;
    text-align-last: justify;
}

.van-cell-group {
    .input-item {
        align-items: center;
        /deep/.van-field__label {
            width: 75px;
        }
        /deep/.van-cell__value {
            padding: 5px 6px;
            border-radius: 4px;
            border: 1px solid rgba(160, 169, 181, 1);
        }
    }
}
</style>
