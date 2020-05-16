<template>
    <div>
        <header-bar title="关注中心" :border="false" :back="-1" :isIos="iosShow"></header-bar>
        <van-tabs v-model="active" @change="onChange">
            <van-tab title="商品">
                <van-list v-model="goods.loading" :finished="goods.finished" finished-text="没有更多了" :immediate-check="false" @load="onLoad">
                    <van-card
                        @click="goto(item.goods_id, 0)"
                        v-for="(item, index) in goods.list"
                        :key="index"
                        class="border-bottom-1"
                        :price="item.sku.price"
                        :desc="item.sku.name"
                        :title="item.goods.name"
                        :thumb="item.goods.master_image"
                    >
                    </van-card>
                </van-list>
                <common-no-data :show="goods.count == 0"></common-no-data>
            </van-tab>
            <van-tab title="店铺">
                <van-list v-model="shops.loading" :finished="shops.finished" finished-text="没有更多了" :immediate-check="false" @load="onLoad">
                    <van-cell v-for="(item, index) in shops.list" :key="index" :title="item.shop.name" :to="'/shop/' + item.shop.id" is-link>
                        <img :src="item.shop.logo" class="mr-2" width="50" height="50" slot="icon" alt="" srcset="" />
                        <!-- <div slot="label">
                                <van-swipe :loop="false" :width="300" :height="150">
                                    <van-swipe-item>1</van-swipe-item>
                                    <van-swipe-item>2</van-swipe-item>
                                    <van-swipe-item>3</van-swipe-item>
                                    <van-swipe-item>4</van-swipe-item>
                                </van-swipe>
                            </div> -->
                    </van-cell>
                </van-list>
                <common-no-data :show="shops.count == 0"></common-no-data>
            </van-tab>
        </van-tabs>
    </div>
</template>

<script>
import HeaderBar from "../../components/common/HeaderBar";
import CommonNoData from "../../components/NoData";
export default {
    components: {
        HeaderBar,
        CommonNoData,
    },
    methods: {
        onChange(index) {
            switch (this.active) {
                case 0:
                    if (this.goods.count == 0) {
                        this.getGoods({
                            page: this.goods.page,
                        });
                    }
                    break;
                case 1:
                    if (this.shops.count == 0) {
                        this.getShops({
                            page: this.shops.page,
                        });
                    }
                    break;
            }
        },
        onLoad() {
            switch (this.active) {
                case 0:
                    this.getGoods({
                        page: (this.goods.page += 1),
                    });
                    break;
                case 1:
                    this.getShops({
                        page: (this.shops.page += 1),
                    });
                    break;
            }
        },
        getGoods(params) {
            this.$apps.http
                .get("/userAttentionGoods/index", params)
                .then((result) => {
                    if (result.code == 1) {
                        this.goods.page += 1;
                        this.goods.count = result.data.count;
                        this.goods.limit = result.data.limit;
                        this.$set(this.goods, "list", this.goods.list.concat(result.data.list));
                        this.$set(this.goods, "loading", false);
                        if (this.isFinished(this.goods.count, this.goods.page, this.goods.limit)) {
                            this.$set(this.goods, "finished", true);
                        }
                    }
                })
                .catch((err) => {});
        },
        getShops(params) {
            params.p = params.p ? parseInt(params.p) : 1;
            this.$apps.http
                .get("/userAttentionShop/index", params)
                .then((result) => {
                    if (result.code == 1) {
                        this.shops.page += 1;
                        this.shops.count = result.data.count;
                        this.shops.limit = result.data.limit;
                        this.$set(this.shops, "list", this.shops.list.concat(result.data.list));
                        this.$set(this.shops, "loading", false);
                        if (this.isFinished(this.shops.count, this.shops.page, this.shops.limit)) {
                            this.$set(this.shops, "finished", true);
                        }
                    }
                })
                .catch((err) => {});
        },
        isFinished(cnt, page, limit) {
            return page >= cnt / limit;
        },
        goto(id, type) {
            this.$router.push("/goods/" + id);
        },
    },
    data() {
        return {
            iosShow: false,
            heights: 0,
            active: 0,
            loading: false,
            finished: false,
            goods: {
                list: [],
                page: 1,
                limit: 10,
                count: 0,
                loading: true,
                finished: false,
            },
            shops: {
                list: [],
                page: 1,
                limit: 10,
                count: 0,
                loading: true,
                finished: false,
            },
        };
    },
    created() {
        this.active = this.$route.params.type ? parseInt(this.$route.params.type) : 0;
        if (this.active == 0) {
            this.getGoods({ page: this.goods.page });
        } else {
            this.getShops({ page: this.goods.page });
        }
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
};
</script>

<style lang="less" scoped></style>
