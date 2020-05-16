<template>
    <div :class="'three-col ' + class1" :style="boxStyle">
        <slot name="title">
            <template v-if="title_bg">
                <div :style="titleStyle">
                    <div class="text-center topic-title-bg text-white" :style="'background: url(' + title_bg + ') no-repeat center center;background-size: 100% 100%;'">
                        {{title}}
                    </div>
                </div>
            </template>
            <template v-else>
                <div :style="titleStyle" class="title-style-0 strong text-21 ml-2">
                    <span class="title-style-0-border-left-3"></span>{{title}}
                </div>
            </template>
        </slot>
        <div style="padding-right:10px">
            <waterfall :col='3' :style="contentStyle" :data="data">
                <template >
                    <router-link :to="'/goods/' + item.id" v-for="(item, index) in data" :key="index" class="goods-item d-block" style="margin-bottom: 10px; margin-left: 10px">
                        <div class="goods-item-images" style="">
                            <van-image class="goods-van-images" style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;" width="100%" height="100%" fit="contain" 
                            lazy-load :src="item.master_image|imageView2(clientW)"></van-image>
                            <div v-if="item.nums <= 0" class="text-center goods-no-stock"></div>
                        </div>
                        <div class="three-col-goods-item-info">
                            <div class="fs-10 text-66 goods-item-title m-0">{{ item.name }}</div>
                            <div class="text-99 three-col-goods-item-info-origin-price">
                                <del class="d-inline-block fs-10 align-bottom" style="width:50%">￥{{item.activity_sku.original_price}}</del>
                            </div>
                            <div class="text-99">
                                <strong class="d-inline-block text-danger fs-10">￥{{item.activity_sku.activity_price}}</strong>
                            </div>
                        </div>
                    </router-link>
                </template>
            </waterfall>
        </div>
        <!-- <van-list :finished="finished" @load="onLoad" v-model="loading" :immediate-check="false"> -->
            <!-- <Waterfall :style="contentStyle" :maxCol="3" :minCol="3" align="left" class="mt-2">
                <WaterfallItem :width="w" v-for="(item, index) in data" :key="index" :style="'margin-left: 10px;'">
                    <router-link :to="'/goods/' + item.id" class="goods-item" style="margin-bottom: 10px">
                        <div class="goods-item-images" style="">
                            <van-image class="goods-van-images" style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;" width="100%" height="100%" fit="contain" 
                            lazy-load :src="item.master_image|imageView2(clientW)"></van-image>
                            <div v-if="item.nums <= 0" class="text-center goods-no-stock"></div>
                        </div>
                        <div class="three-col-goods-item-info">
                            <div class="fs-10 text-66 goods-item-title m-0">{{ item.name }}</div>
                            <div class="text-99 three-col-goods-item-info-origin-price">
                                <del class="d-inline-block 10 align-bottom" style="width:50%">￥{{item.activity_sku.price}}</del>
                            </div>
                            <div class="text-99">
                                <strong class="d-inline-block text-danger fs-10">￥{{item.activity_sku.activity_price}}</strong>
                            </div>
                        </div>
                    </router-link>
                </WaterfallItem>
            </Waterfall> -->
            <!-- <div slot="finished" class="p-3">
                <van-divider>没有更多内容</van-divider>
            </div>
        </van-list> -->
    </div>
</template>

<script>
    // import {Waterfall, WaterfallItem} from 'vue2-waterfall';
    export default {
        components: {},
        props: {
            data: {
                type: Array,
                default: []
            },
            title: {
                type: String,
                default: ''
            },
            title_bg: {
                type: String,
                default: ''
            },
            title_style: {
                type: Number,
                default: 0
            },
            more_url: {
                type: String,
                default: ''
            },
            class1: {
                type: String,
                default: ''
            },
            boxStyle: {
                type: Object,
                default: function() {
                    return {'padding': '0 5px'}
                }
            },
            titleStyle: {
                type: Object,
                default: function() {
                    return {"margin-top": "18px"}
                }
            },
            contentStyle: {
                type: Object,
                default: function() {
                    return {'margin-top': '18px'}
                }
            }
        },
        data() {
            return {
                finished: false,
                loading: false,
                clientW: 0,
                totalPage: 0,
                list: [],
                filter: {},
                w: 0,
                page: 1
            }
        },
        methods: {
            onLoad() {
                this.getData()
            },
            getData() {
                try {
                    let params = {
                        page: this.page ? this.page : 1,
                        q: this.filter.q ? this.filter.q : '',
                        min_price: this.filter.min_price ? this.filter.min_price : '',
                        max_price: this.filter.max_price ? this.filter.max_price : '',
                        order: this.filter.order ? this.filter.order : '',
                        shop_id: this.filter.shop_id ? this.filter.shop_id : '',
                        cid: this.filter.cid ? this.filter.cid : '',
                        scid: this.filter.scid ? this.filter.scid : '',
                        rank: this.filter.rank ? this.filter.rank : ''
                    }
                    this.$apps.http.get(this.url, params).then((result) => {
                        if (result.code == 1) {

                            let goods = result.data.list

                            let goodsTmp1   = [], goodsTmp2   = []

                            for (let i in goods) {
                                let tmp =  goods[i].min_price.toFixed(2).split('.')
                                goods[i].prices = tmp
                            }

                            if (this.page > 1) {
                                this.list = this.list.concat(goods)
                            } else {
                                this.list = goods
                            }
                            let _ = this
                            this.totalPage = Math.ceil(result.data.count / result.data.size)
                            if ((this.max > 0 && result.data.page == this.max) || ((result.data.page * result.data.size) > result.data.count)) {
                                this.finished = true
                            }
                            this.page = this.page + 1
                            this.loading = false
                        }
                    }).catch((err) => {
                        console.log(err)
                    });
                } catch (err) {
                    console.log(err)
                }
            }
        },
        created () {
            this.clientW = document.body.clientWidth;
            this.w = parseFloat((this.clientW - 20) / 3);
        },
        filters: {
            formatScore: function(value, amount) {
                return parseFloat(value * amount).toFixed(2);
            },
            formatPrice(value) {
                return value.toFixed(2)
            },
            imageView2(value, w) {
                w = parseInt(w / 2)
                return value + '?imageView2/1/w/'+w+'/h/'+w+'/interlace/1'
            }
        }
    }
</script>

<style lang="scss">
.three-col .goods-item-info {
    padding: 0.25rem;
}
.three-col .van-divider {
    margin: 0 !important;
}
.three-col .goods-item .goods-item-images img {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
}
.three-col .goods-item {
    box-shadow: 1px 3px 3px #f3f3f3;
}
.three-col-goods-item-info {
    padding: 8px 4px;
}
.three-col-goods-item-info-origin-price {
    margin-top: 4px;
    margin-bottom: -4px;
}
</style>