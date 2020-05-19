<template>
    <div class="page page-no-radius">
        <div :style="{ height: heights + 'px' }" v-if="iosShow" class="headIos"></div>
        <header-bar title="申诉" :border="false" :back="-1" :isIos="iosShow" :heights="heights"></header-bar>
        <van-cell-group class="apply">
            <van-cell :border="true">
                <template #title><span class=" text-secondary-dark">申诉类型</span></template></van-cell
            >
            <van-cell :title="currType" is-link value="请选择" @click="selectRefundType" />
            <van-action-sheet v-model="isShow" @select="onSelect" title="申诉类型" cancel-text="关闭" :border="true">
                <van-cell-group>
                    <van-cell v-for="item in list.appeal_type_list" :key="item.value" :border="true" @click="onSelect(item)">
                        <template #title>
                            <span class="text-secondary-dark">{{ item.title }}</span>
                        </template>
                        <template #right-icon>
                            <van-icon v-show="form.type == item.value" name="success" color="#FB616E" size="1rem" />
                        </template>
                    </van-cell>
                </van-cell-group>
            </van-action-sheet>
        </van-cell-group>
        <van-cell-group>
            <van-cell :border="false">
                <template #title><span class=" text-secondary-dark">申诉原因</span></template></van-cell
            >
            <van-field type="textarea" autosize rows="4" v-model="form.remark" placeholder="请填写详细换货或维修说明…" />
        </van-cell-group>
        <van-cell-group :border="false">
            <van-cell :border="false">
                <template #title><span class="text-secondary-dark">添加图片</span><span class="text-gray">（最多上传6张）</span></template></van-cell
            >
            <!-- 图片上传组件 -->
            <uploader-image @upload="uploadHandle" @delete="deleteHandle"></uploader-image>
        </van-cell-group>
        <div class="p-5 bg-white ">
            <van-button block :loading="loading" color="linear-gradient(315deg,rgba(251,88,112,1) 0%,rgba(251,143,96,1) 100%)" @click="submitAction()"
                >确认申诉</van-button
            >
        </div>
    </div>
</template>

<script>
import HeaderBar from "../../../components/common/HeaderBar";
import UploaderImage from "../../../components/common/UploaderImage";
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
                order_shop_id: "",
                imagesUrl: [],
            },
            list: {},
            isShow: false,
            currType: "",
            orderId: null,
            loading: false,
        };
    },
    created() {
        this.fetchData();
    },
    mounted() {
        this.$nextTick(() => {
            let content = document.querySelector(".apply");

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
    methods: {
        fetchData() {
            this.$store.dispatch("SET_LOADING", 1);
            this.orderId = this.$route.params.id;
            this.$apps.http
                .get("/Refund.Buyer/goods_detail", { order_goods_id: this.$route.params.prodId })
                .then((res) => {
                    if (res.code == 1) {
                        this.list = res.data;
                    }
                })
                .catch((err) => {});
        },
        //删除图片
        deleteHandle(index) {
            this.form.imagesUrl.splice(index, 1);
        },
        //新增图片
        uploadHandle(url) {
            this.form.imagesUrl[this.form.imagesUrl.length] = url;
        },
        onSelect(item) {
            this.form.type = item.value;
            this.currType = item.title;
            this.isShow = false;
        },
        selectRefundType() {
            this.isShow = true;
        },
        // 申请售后数据提交
        submitAction() {
            if (this.form.type == null || this.form.type === "" || typeof this.form.type == "undefined") {
                this.$toast("请选择申诉类型");
                return;
            } else if (this.form.remark == null || this.form.remark === "" || typeof this.form.remark == "undefined") {
                this.$toast("请填写申诉详细原因");
                return;
            } else if (this.form.imagesUrl.length == 0) {
                this.$toast("请上传凭证");
                return;
            }
            this.loading = true;
            const formdata = {
                id: this.orderId,
                // order_goods_id: this.orderId,
                appeal_type: this.form.type,
                remark: this.form.remark,
                voucher_images: this.form.imagesUrl.toString(),
            };
            let t = this;
            this.$apps.http
                .post("/Refund.Buyer/appeal", formdata)
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
        },
    },
};
</script>

<style lang="less" scoped></style>
