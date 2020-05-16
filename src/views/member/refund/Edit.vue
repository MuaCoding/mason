<template>
    <div>
        <header-bar title="修改退款" :border="false" :back="-1"></header-bar>
        <van-cell-group>
            <van-cell icon="star" title="官方旗舰店" :border="false" is-link></van-cell>
            <div>
                <van-card num="2" price="2.00" desc="描述信息" title="商品标题" thumb="https://img.yzcdn.cn/vant/t-thirt.jpg">
                    <div slot="tags">
                        <van-tag plain type="danger">标签</van-tag>
                        <van-tag plain type="danger">标签</van-tag>
                    </div>
                </van-card>
            </div>
        </van-cell-group>
        <van-cell-group class="mt-3">
            <van-cell title="退款方式" is-link :value="refundTypeText" @click="selectRefundType" />
            <van-action-sheet v-model="showSelectRefundType" :actions="refundTypes" @select="onSelect" cancel-text="取消" />
            <van-field
                error-message="本次最多可申请 2000.00 元退款金额"
                type="number"
                label="申请退款金额"
                v-model="form.amount"
                placeholder="请输入申请退款金额"
            />
            <van-field
                error-message="本次最多可申请 1 件"
                v-show="form.type === 2"
                type="number"
                label="申请退货数量"
                v-model="form.num"
                placeholder="请输入申请退货数量"
            />
            <van-field
                error-message="本次最多可申请 2000.00 元退运费金额"
                type="number"
                label="退运费金额"
                v-model="form.express_amount"
                placeholder="请输入需要退的运费金额"
            />
            <van-field show-word-limit maxlength="255" type="textarea" label="申请退款理由" v-model="form.remark" placeholder="请输入申请退款理由" />
        </van-cell-group>
        <div class="p-3">
            <div class="mb-2 text-66 fs-14">上传凭证</div>
            <van-uploader v-model="imagesList" multiple :max-count="5" />
        </div>
    </div>
</template>

<script>
import HeaderBar from "../../../components/common/HeaderBar";
import { Field, Uploader, Button, CellGroup, ActionSheet, Cell } from "vant";
export default {
    components: {
        HeaderBar,
        Field,
        Uploader,
        Button,
        CellGroup,
        ActionSheet,
        Cell
    },
    data() {
        return {
            form: {
                amount: "",
                remark: "",
                images: "",
                type: 1,
                express_amount: "",
                num: ""
            },
            imagesList: [],
            showSelectRefundType: false,
            refundTypes: [
                { name: "仅退款", subname: "仅退款不需要将商品邮寄给商家", type: 1 },
                { name: "退货退款", subname: "退货退款需要将商品邮寄给商家", type: 2 }
            ],
            refundTypeText: "仅退款"
        };
    },
    methods: {
        onSelect(item, index) {
            this.form.type = item.type;
            this.refundTypeText = item.name;
            this.showSelectRefundType = false;
        },
        selectRefundType() {
            this.showSelectRefundType = true;
        }
    },
    created() {}
};
</script>

<style lang="less" scoped></style>
