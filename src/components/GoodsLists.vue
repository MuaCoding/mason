<template>
    <div class="goods-list-2">
        <!-- <vue-waterfall-easy :imgsArr="list" @scrollReachBottom="onLoad" :srcKey="'master_image'">

        </vue-waterfall-easy> -->
    </div>
</template>

<script>
    // import vueWaterfallEasy from 'vue-waterfall-easy'
    export default {
        components: {
            // vueWaterfallEasy,
        },
        props: {
            url: {
                type: String,
                default: '/search/goods'
            },
            max: {
                type: Number,
                default: 0
            },
            filter: {
                type: Object,
                default: {}
            },
            immediate: {
                type: Boolean,
                default: true
            }
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
                totalPage: 0
            }
        },
        methods: {
            onLoad() {
                this.getData(true)
            },
            getData(isConcat) {
                try {
                    if (this.isRequest) return false
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
                    this.isRequest = true
                    this.$apps.http.get(this.url, params).then((result) => {
                        if (result.code === 1) {

                            let goods = result.data.list

                            let goodsTmp1   = [], goodsTmp2   = []

                            for (let i in goods) {
                                let tmp =  goods[i].min_price.toFixed(2).split('.')
                                goods[i].prices = tmp

                                // if (i%2 == 0) {
                                //     goodsTmp2.push(goods[i])
                                // } else {
                                //     goodsTmp1.push(goods[i])
                                // }
                            }

                            // goods = goodsTmp2.concat(goodsTmp1)

                            if (isConcat) {
                                this.list = this.list.concat(goods)
                            } else {
                                this.list = goods
                            }
                            this.loading = false;
                            //(this.max > 0 && result.data.page == this.max) || 
                            this.totalPage = Math.ceil(result.data.count / result.data.size)
                            if ((this.max > 0 && result.data.page == this.max) || ((result.data.page * result.data.size) > result.data.count)) {
                                this.finished = true
                            }
                            ++this.page
                        }
                        this.isRequest = false
                    }).catch((err) => {
                        console.log(err)
                    });
                } catch (err) {
                    console.log(err)
                }
            }
        },
        watch: {
            filter: {
                deep: true,
                handler(newValue, oldValue) {
                    this.page = 1
                    this.getData(false)
                }
            }
        },
        filters: {
            formatScore: function(value, amount) {
                return parseFloat(value * amount).toFixed(2);
            },
            formatPrice(value) {
                return value.toFixed(2)
            }
        }
    }
</script>

<style>
.goods-item .goods-item-images img {
    width: 100%;
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
}
.goods-item-info {
    padding: 0.75rem
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
    position:relative;width:100%;height:0;padding-top: 100%;
}
.goods-van-images {
    position: absolute;top: 0;left: 0;width: 100%;height: 100%;
}
.goods-no-stock {
    position: absolute;top: 0; padding: 0; margin: 0; width:100%;height:100%; left: 0; 
    z-index:1;background: url(https://img.greendg.cn/202002/25/uNo2A6Cl.png) no-repeat center center; background-color: rgba(0, 0, 0, 0.3);border-top-left-radius: 10px;
    border-top-right-radius: 10px;background-size: 60%;
}
.buy-score-span {
    padding: 2px 5px; color: #FF6835; background: #FFEFEA; -webkit-transform-origin-x: 0;
}
</style>