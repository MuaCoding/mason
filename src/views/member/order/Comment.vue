<template>
    <div class="page page-no-radius">
        <div :style="{ height: heights + 'px' }" v-if="iosShow" class="headIos"></div>
        <header-bar title="发布评论" :border="true" :isIos="iosShow" :back="-1" :heights="heights"></header-bar>
        <van-cell-group class="prod-list">
            <div class="prod-item px-3">
                <van-image radius="6px" width="4.25rem" height="4.25rem" :src="list.goods_master_image || '/'" />
                <div class="prod-content">
                    <p class="text-secondary-dark">名称：{{ list.goods_name }}</p>
                    <p>
                        ¥<span class="text-primary fs-14 strong"> {{ list.goods_sku_price }}</span>
                    </p>
                    <div class="desc-bar text-secondary">
                        <span>{{ list.goods_sku_name }}</span>
                    </div>
                </div>
            </div>
            <!-- 评论详情 -->
            <van-cell :border="false"
                ><template #title><span class="text-secondary strong">发布评论详情</span></template>
            </van-cell>
            <van-field placeholder="请输入需要评价的内容详情…" autosize rows="4" v-model="form.remark" type="textarea"></van-field>
        </van-cell-group>
        <!-- 上传评价图片 -->
        <van-cell-group>
            <van-cell :border="false">
                <template #title
                    ><span class="text-secondary-dark strong">添加图片</span><span class="text-gray">（最多上传6张）</span></template
                ></van-cell
            >
            <!-- 图片上传组件 -->
            <uploader-image @upload="uploadHandle" @delete="deleteHandle"></uploader-image>

            <van-cell :border="false">
                <template #title><van-checkbox checked-color="#FB616E" v-model="form.checked">匿名评价</van-checkbox></template></van-cell
            >
        </van-cell-group>
        <!-- 评分 -->
        <van-cell-group>
            <van-cell :border="true">
                <template #title><span class="text-secondary strong">评分</span></template></van-cell
            >
            <van-cell :border="false">
                <template #title>
                    <span class="text-secondary">物流评分</span>
                </template>
                <template #right-icon>
                    <van-rate v-model="form.logistics" :size="22" void-icon="star-o" void-color="#D8D8D8" />
                </template>
            </van-cell>
            <van-cell :border="false">
                <template #title>
                    <span class="text-secondary">服务态度</span>
                </template>
                <template #right-icon>
                    <van-rate v-model="form.service" :size="22" void-icon="star-o" void-color="#D8D8D8" />
                </template>
            </van-cell>
            <van-cell :border="false">
                <template #title>
                    <span class="text-secondary">商品描述</span>
                </template>
                <template #right-icon>
                    <van-rate v-model="form.product" :size="22" void-icon="star-o" void-color="#D8D8D8" />
                </template>
            </van-cell>
        </van-cell-group>
        <div class="p-5 bg-white">
            <van-button block :loading="loading" color="linear-gradient(315deg,rgba(251,88,112,1) 0%,rgba(251,143,96,1) 100%)" @click="submitAction"
                >发布评论</van-button
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
            loading: false,
            orderId: null,
            list: {},
            form: {
                amount: "",
                remark: "",
                order_goods_id: "",
                type: null,
                checked: 0,
                order_shop_id: "",
                imagesUrl: [],
                logistics: 0,
                service: 0,
                product: 0,
            },
        };
    },
    created() {
        this.fetchData();
    },
    mounted() {
        this.$nextTick(() => {
            let content = document.querySelector(".prod-list");
            if (!this.$apps.isAndroid()) {
                let head = document.querySelector(".van-nav-bar");

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
                .get("/Order/goods_detail", { order_goods_id: this.$route.params.id })
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
        // 申请售后数据提交
        submitAction() {
            if (this.form.remark == null || this.form.remark === "" || typeof this.form.remark == "undefined") {
                this.$toast("请输入需要评价的内容详情");
                return;
            } else if (this.form.logistics == 0) {
                this.$toast("请对物流进行评价");
                return;
            } else if (this.form.service == 0) {
                this.$toast("请对服务态度进行评价");
                return;
            } else if (this.form.product == 0) {
                this.$toast("请对商品进行评价");
                return;
            }

            let t = this;
            this.loading = true;
            const formdata = {
                order_goods_id: this.orderId,
                is_anonymous: this.form.checked,
                content: this.form.remark,
                service_score: this.form.service,
                logistics_score: this.form.logistics,
                descript_score: this.form.product,
                images: this.form.imagesUrl.toString(),
            };
            this.$apps.http
                .post("/GoodsComment/create", formdata)
                .then((res) => {
                    this.loading = false;
                    if (res.code == 1) {
                        this.$toast(res.msg);
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
                        this.$toast(res.msg);
                    }
                })
                .catch((err) => {});
        },
    },
};
</script>

<style lang="less" scoped>
.discuss-wrap {
    .van-cell {
        .van-cell__title {
            display: flex;
            width: 5rem;
            align-items: flex-start;

            span {
                flex: 1;
                line-height: 1rem;
                .text-ellipsis(2);
            }
        }
    }
}
</style>
