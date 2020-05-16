<template>
    <div class="page page-no-radius">
        <header-bar title="发布追评" :border="true" :isIos="iosShow"  :back="-1"></header-bar>
        <van-cell-group class="discuss-wrap" v-if="list">
            <van-cell :border="false">
                <van-image round lazy-load width="2.5rem" height="2.5rem" :src="list.shop.logo || '/'" />
                <div class="content">
                    <div class="top-bar">
                        <span class="strong text-secondary fs-12">{{ list.goods.name }}</span>
                        <div>
                            <van-rate
                                v-model="list.shop.fraction"
                                readonly
                                allow-half
                                color="linear-gradient(140deg,rgba(254,193,36,1) 0%,rgba(251,168,35,1) 100%)"
                                :size="12"
                                void-icon="star-o"
                                void-color="#D8D8D8"
                            />
                        </div>
                    </div>
                </div>
            </van-cell>
            <div class="prod-list px-3">
                <div class="prod-item" @click="goto({ no: item.id }, 'detail')">
                    <van-image radius="6px" width="4.25rem" height="4.25rem" :src="list.goods.master_image" />
                    <div class="prod-content">
                        <p class="text-secondary-dark">名称：{{ list.goods.name }}</p>
                        <p>
                            ¥<span class="text-primary fs-14 strong"> {{ list.goods.min_price | NumberFormat(list.goods.min_price) }}</span>
                        </p>
                        <div class="desc-bar text-secondary">
                            <span>{{ list.goods.goods_sku_name }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </van-cell-group>
        <!-- 追评 -->
        <van-cell-group>
            <van-cell :border="false"
                ><template #title><span class="text-secondary-dark strong">发布追加评论</span></template>
            </van-cell>
            <van-field
                autosize
                rows="4"
                placeholder="已经用了一段时间了，已经用了一段时间了，有更多产品使用心得，分享给想买的他们吧！"
                v-model="form.remark"
                type="textarea"
            ></van-field>
        </van-cell-group>
        <van-cell-group :border="false">
            <van-cell :border="false">
                <template #title
                    ><span class="text-secondary-dark strong">添加图片</span><span class="text-gray">（最多上传6张）</span></template
                ></van-cell
            >
            <!-- 图片上传组件 -->
            <uploader-image @upload="uploadHandle" @delete="deleteHandle"></uploader-image>
        </van-cell-group>
        <div class="p-5">
            <van-button block :loading="loading" color="linear-gradient(315deg,rgba(251,88,112,1) 0%,rgba(251,143,96,1) 100%)" @click="reviewAction"
                >发布追评</van-button
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
            form: {
                amount: "",
                remark: "",
                order_goods_id: "",
                type: null,
                order_shop_id: "",
                imagesUrl: [],
            },
            list: null,
            id: null,
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
            this.id = this.$route.params.id;
            this.$apps.http
                .get("/GoodsComment/detail", { id: this.id })
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
        // 提交追评
        reviewAction() {
            if (this.form.remark == null || this.form.remark == "" || typeof this.form.remark == "undefined") {
                this.$toast("请输入需要评价的内容详情");
                return;
            }
            // else if (this.form.imagesUrl.length == 0) {
            //     this.$toast("请上传凭证");
            //     return;
            // }

            const formdata = {
                id: this.$route.params.id,
                content: this.form.remark,
                images: this.form.imagesUrl.toString(),
            };

            this.loading = true;

            this.$apps.http
                .post("/User/addComment", formdata)
                .then((res) => {
                    this.loading = false;
                    if (res.code == 1) {
                        this.$toast(res.msg);
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
.page {
    .van-cell {
        .van-cell__value {
            display: flex;
            .van-image {
                min-width: 40px;
                min-height: 40px;
            }
        }
    }
}
</style>
