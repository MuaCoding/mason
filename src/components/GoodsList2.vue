<template>
    <div class="goods-list-4">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" :immediate-check="immediate" @load="onLoad">
            <Waterfall :gutterWidth="0" :gutterHeight="10" :fixWidth="clientW" :resizable="true" :maxCol="2" :minCol="1" align="left">
                <WaterfallItem :width="w" style="margin-right: 10px" v-for="(item, index) in list" :key="index">
                    <router-link :to="'/goods/' + (item.sku.activity_is == 1 ? item.sku.goods_id : item.id)" class="goods-item">
                        <div class="goods-item-images" style="">
                            <van-image
                                class="goods-van-images"
                                style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;"
                                width="100%"
                                height="100%"
                                fit="contain"
                                lazy-load
                                :src="item.master_image | imageView2(clientW)"
                            ></van-image>
                            <div v-if="item.nums <= 0" class="text-center goods-no-stock"></div>
                        </div>
                        <div class="goods-item-info">
                            <h4 class="fs-12 text-66 goods-item-title m-0">
                                <!-- <img
                                    v-if="item.is_self === 1"
                                    src="../assets/ziying.png"
                                    height="14"
                                    class="mr-1 align-middle"
                                    alt=""
                                    srcset=""
                                /> -->
                                <span class="align-middle">{{ item.name }}</span>
                            </h4>
                            <div class="goods-item-price fs-14 text-danger strong mt-1">
                                <template v-if="item.sku.activity_is == 1 && item.sku.activity_nums > 0">
                                    <span class="fs-12" style="font-size: 10px">￥</span>{{ item.promotion_prices[0]
                                    }}<span class="fs-12" style="font-size: 10px">.{{ item.promotion_prices[1] }}</span>
                                    <del class="fs-12 text-99 ml-1">￥{{ item.sku.original_price }}</del>
                                </template>
                                <template v-else>
                                    <span class="fs-12" style="font-size: 10px">￥</span>{{ item.prices[0]
                                    }}<span class="fs-12" style="font-size: 10px">.{{ item.prices[1] }}</span>
                                </template>
                            </div>
                            <div class="goods-item-price py-1 fs-10" v-if="item.buy_score > 0">
                                <span class="fs-10 buy-score-span">购物分抵￥{{ item.buy_score }}</span>
                            </div>
                            <div class="goods-item-price fs-10 text-danger text-99">
                                <span class="float-right align-middle" style="margin-right: -15px">{{ item.sale_nums }}人付款</span>
                                <img height="10" class="align-middle mr-1" src="/img/envelope.png" /><span class="align-middle"
                                    >赠{{ item.award_multiple | formatScore(item.sku.price) }}</span
                                >
                            </div>
                        </div>
                    </router-link>
                </WaterfallItem>
            </Waterfall>
        </van-list>
    </div>
</template>

<script>
import { Waterfall, WaterfallItem } from "vue2-waterfall";
export default {
    components: {
        Waterfall,
        WaterfallItem,
    },
    props: {
        url: {
            type: String,
            default: "/search/goods",
        },
        max: {
            type: Number,
            default: 0,
        },
        filter: {
            type: Object,
            default: {},
        },
        immediate: {
            type: Boolean,
            default: true,
        },
        firstLoad: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            list: [],
            loading: false,
            finished: false,
            count: 0,
            size: 20,
            page: 1,
            isRequest: false,
            fallFinished: false,
            refsHeight: 0,
            clientW: 0,
            totalPage: 0,
            interVal: "",
            w_filter: "",
            w: 0,
        };
    },
    methods: {
        onLoad() {
            if (this.page > 1 || this.firstLoad) this.getData(true);
        },
        getData(isConcat) {
            try {
                if (this.isRequest) return false;
                let params = {
                    page: this.page ? this.page : 1,
                    q: this.filter.q ? this.filter.q : "",
                    min_price: this.filter.min_price ? this.filter.min_price : "",
                    max_price: this.filter.max_price ? this.filter.max_price : "",
                    order: this.filter.order ? this.filter.order : "",
                    shop_id: this.filter.shop_id ? this.filter.shop_id : "",
                    cid: this.filter.cid ? this.filter.cid : "",
                    scid: this.filter.scid ? this.filter.scid : "",
                    rank: this.filter.rank ? this.filter.rank : "",
                    is_zero_buy: this.filter.is_zero_buy ? this.filter.is_zero_buy : "",
                };
                this.isRequest = true;
                this.$apps.http
                    .get(this.url, params)
                    .then((result) => {
                        if (result.code === 1) {
                            let goods = result.data.list;

                            let goodsTmp1 = [],
                                goodsTmp2 = [];

                            for (let i in goods) {
                                let original_price = goods[i].sku.original_price;
                                let tmp = parseFloat(original_price)
                                    .toFixed(2)
                                    .split(".");
                                goods[i].prices = tmp;
                                goods[i].promotion_prices = goods[i].sku.activity_price.split(".");
                            }
                            // goods = goodsTmp2.concat(goodsTmp1)

                            if (isConcat) {
                                this.list = this.list.concat(goods);
                            } else {
                                this.list = goods;
                            }
                            let _ = this;
                            this.totalPage = Math.ceil(result.data.count / result.data.size);
                            if ((this.max > 0 && result.data.page == this.max) || result.data.page * result.data.size > result.data.count) {
                                this.finished = true;
                            }
                            ++this.page;
                            this.loading = false;
                        }
                        this.isRequest = false;
                    })
                    .catch((err) => {
                        this.isRequest = false;
                        console.log(err);
                    });
            } catch (err) {
                console.log(err);
            }
        },
    },
    created() {
        this.clientW = document.body.clientWidth;
        this.w = parseFloat((this.clientW - 10) / 2);
    },
    watch: {
        filter: {
            deep: true,
            handler(newValue, oldValue) {
                let tmp = JSON.stringify(newValue);
                // console.log(newValue, oldValue)
                //  防止多次请求
                // console.log(tmp != this.w_filte)
                if (tmp != this.w_filter || this.firstLoad) {
                    this.w_filter = tmp;
                    this.page = 1;
                    this.getData(false);
                }
            },
        },
        refsHeight(newVal, oldVal) {
            // console.log(newVal, oldVal)
        },
    },
    filters: {
        formatScore: function(value, amount) {
            return parseFloat(value * amount).toFixed(2);
        },
        formatPrice(value) {
            return value.toFixed(2);
        },
        imageView2(value, w) {
            return value + "?imageView2/1/w/" + w + "/h/" + w + "/interlace/1";
        },
    },
    mounted() {
        // this.refsHeight = document.querySelector('.goods-list-4').clientHeight
    },
    deactivated() {
        // clearInterval(this.interVal)
    },
    updated() {
        // this.loading = false
    },
};
</script>

<style>
.goods-list-4 {
    background: #f7f7f7;
    /* margin-bottom: 40px; */
    padding: 10px 0 10px 10px;
}
.goods-item {
    display: block;
    background: #ffffff;
    /* border-top-left-radius: 10px;
    border-top-right-radius: 10px; */
    border-radius: 0.5rem;
}
.goods-item .goods-item-images img {
    width: 100%;
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
}
.goods-item-info {
    padding: 0.75rem;
}
.goods-item-title {
    line-height: 1.07rem;
    -webkit-line-clamp: 2;
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
}
.goods-item-images {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 100%;
}
.goods-van-images {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
.goods-no-stock {
    position: absolute;
    top: 0;
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100%;
    left: 0;
    z-index: 1;
    background: url(https://img.greendg.cn/202002/25/uNo2A6Cl.png) no-repeat center center;
    background-color: rgba(0, 0, 0, 0.3);
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    background-size: 60%;
}
.buy-score-span {
    padding: 2px 5px;
    color: #ff6835;
    background: #ffefea;
    -webkit-transform-origin-x: 0;
}
.waterfall {
    max-width: 100% !important;
}
.waterfall-box {
    /* width: 50% !important; */
}
</style>
