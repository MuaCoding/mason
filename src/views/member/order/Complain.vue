<template>
    <div class="page  page-no-radius">
        <header-bar title="提交售后申请" :border="false" :isIos="iosShow" :back="-1"></header-bar>
        <van-cell-group class="prod-list px-3">
            <div class="prod-item">
                <van-image lazy-load radius="6px" width="4.25rem" height="4.25rem" :src="list.master_image" />
                <div class="prod-content">
                    <p>{{ list.goods_name }}</p>
                    <p>
                        ¥ <span class="fs-14 text-primary strong">{{ list.goods_sku_price }}</span>
                    </p>
                    <div class="desc-bar text-secondary">
                        <span> {{ list.goods_sku_name }}</span
                        ><span class="text-right">x {{ list.can_refund_goods_num }}</span>
                    </div>
                </div>
            </div>
        </van-cell-group>

        <van-cell-group>
            <van-cell :border="true">
                <template #title><span class="text-secondary-dark">换货或维修原因</span></template></van-cell
            >
            <van-cell :title="currType" is-link value="请选择" @click="selectRefundType" />

            <van-action-sheet v-model="isShow" @select="onSelect" title="换货或维修原因" cancel-text="关闭" :border="true">
                <van-cell-group class="type-list">
                    <van-cell v-for="item in list.sold_service_type_list" :key="item.value" :border="true" @click="onSelect(item)">
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
                <template #title><span class=" text-secondary-dark">换货或维修原因</span></template></van-cell
            >
            <van-field type="textarea" autosize rows="4" v-model="form.remark" placeholder="请填写详细换货或维修说明…" />
        </van-cell-group>
        <van-cell-group :border="false">
            <van-cell :border="false">
                <template #title><span class="text-secondary-dark">上传凭证</span><span class="text-gray">（最多上传6张）</span></template></van-cell
            >
            <!-- 图片上传组件 -->
            <uploader-image @upload="uploadHandle" @delete="deleteHandle"></uploader-image>
        </van-cell-group>
        <div class="p-5 bg-white">
            <van-button block :loading="loading" color="linear-gradient(315deg,rgba(251,88,112,1) 0%,rgba(251,143,96,1) 100%)" @click="submitAction()"
                >确认提交</van-button
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
            prodId: null,
            storeId: null,
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
        fetchData() {
            this.$store.dispatch("SET_LOADING", 1);
            let t = this;
            t.prodId = t.$route.params.prod;
            t.storeId = t.$route.params.store;
            t.$apps.http
                .get("/Refund.Buyer/goods_detail", { order_goods_id: this.prodId })
                .then((res) => {
                    if (res.code == 1) {
                        t.list = res.data;
                        t.currType = res.data.sold_service_type_list[0].title;
                        t.form.type = res.data.sold_service_type_list[0].value;
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
        selectRefundType() {
            this.isShow = true;
        },
        onSelect(item) {
            this.form.type = item.value;
            this.currType = item.title;
            this.isShow = false;
        },
        // 申请售后数据提交
        submitAction() {
            if (this.form.type == null || this.form.type === "" || typeof this.form.type == "undefined") {
                this.$toast("请选择换货或维修原因");
                return;
            } else if (this.form.remark == null || this.form.remark === "" || typeof this.form.remark == "undefined") {
                this.$toast("请填写换货或维修详细原因");
                return;
            } else if (this.form.imagesUrl.length == 0) {
                this.$toast("请上传凭证");
                return;
            }
            this.loading = true;
            const formdata = {
                order_shop_id: this.storeId,
                order_goods_id: this.prodId,
                type: this.form.type,
                remark: this.form.remark,
                voucher_images: this.form.imagesUrl.toString(),
            };
            let t = this;
            this.$apps.http
                .post("/SoldService.Order/apply", formdata)
                .then((res) => {
                    this.loading = false;
                    if (res.code == 1) {
                        this.$toast(res.msg);
                        // 返回售后商家操作
                        setTimeout(() => {
                            t.$router.replace("/member/service/2");
                            t.$store.dispatch(
                                "SET_LOCALSTORAGE",
                                JSON.stringify({
                                    name: "SERVICEBAR",
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
