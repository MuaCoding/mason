<template>
    <div :class="'two-col ' + class1" :style="boxStyle">
        <slot name="title">
            <template v-if="title_bg">
                <div class="" :style="titleStyle">
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
            <waterfall :col='2' :style="contentStyle" :data="data">
                <template >
                    <router-link :to="'/goods/' + item.id" v-for="(item, index) in data" :key="index" class="goods-item d-block" style="margin-bottom: 10px; margin-left: 10px">
                        <div class="goods-item-images">
                            <van-image class="twe-col-goods-van-images" style="position: absolute;top: 0;left: 0;" fit="contain" 
                            lazy-load :src="item.master_image|imageView2(clientW)"></van-image>
                            <div v-if="item.nums <= 0" class="text-center goods-no-stock"></div>
                        </div>
                        <div class="twe-col-goods-item-info">
                            <div class="fs-12 text-66 goods-item-title m-0">{{ item.name }}</div>
                            <div class="text-99 fs-10 mt8px">
                                <del>原价:￥{{item.activity_sku.original_price}}</del>
                            </div>
                            <van-row>
                                <van-col span="12" style="color: #FF6966">
                                    <strong>￥{{item.activity_sku.activity_price}}</strong>
                                </van-col>
                                <van-col span="12">
                                    <div class="text-right text-66 fs-10" style="line-height: 24px">
                                        已售:{{item.sale_nums}}件
                                    </div>
                                </van-col>
                            </van-row>
                        </div>
                    </router-link>
                </template>
            </waterfall>
        </div>
        <!-- <Waterfall style="width: 355px" :resizable="true" :style="contentStyle" :maxCol="2" :minCol="2" :percent="[1, 1]" :gutterWidth="10" align="left">
            <WaterfallItem v-for="(item, index) in data" :key="index" :style="'margin-bottom: 10px; margin-left: 10px;width: 167.5px'">
                <router-link :to="'/goods/' + item.id" class="goods-item d-block">
                    <div class="goods-item-images">
                        <van-image class="twe-col-goods-van-images" style="position: absolute;top: 0;left: 0;" fit="contain" 
                        lazy-load :src="item.master_image|imageView2(clientW)"></van-image>
                        <div v-if="item.nums <= 0" class="text-center goods-no-stock"></div>
                    </div>
                    <div class="twe-col-goods-item-info">
                        <div class="fs-12 text-66 goods-item-title m-0">{{ item.name }}-{{w}}</div>
                        <div class="text-99 10 mt8px">
                            <del>原价:￥{{item.activity_sku.price}}</del>
                        </div>
                        <van-row>
                            <van-col span="12" style="color: #FF6966">
                                <strong>￥{{item.activity_sku.activity_price}}</strong>
                            </van-col>
                            <van-col span="12">
                                <div class="text-right text-66 fs-10" style="line-height: 24px">
                                    已售:{{item.sale_nums}}件
                                </div>
                            </van-col>
                        </van-row>
                    </div>
                </router-link>
            </WaterfallItem>
        </Waterfall> -->
    </div>
</template>

<script>
    // import {Waterfall, WaterfallItem} from 'vue2-waterfall'
    
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
                    return {'margin-top': '10px'}
                }
            },
            isShow: {
                type: Boolean,
                default: false
            },
            activeIndex: {
                type: Number,
                default: 0
            },
            tw: {
                type: Number,
                default: 0
            }
        },
        methods: {
            getWidth() {
                this.clientW = document.body.clientWidth;
                this.w = parseFloat((this.clientW - 20) / 2)
            }
        },
        data() {
            return {
                clientW: 0,
                w: 0
            }
        },
        created () {
            this.getWidth()
        },
        filters: {
            formatScore: function(value, amount) {
                return parseFloat(value * amount).toFixed(2);
            },
            formatPrice(value) {
                return value.toFixed(2)
            },
            imageView2(value, w) {
                return value + '?imageView2/1/w/'+w+'/h/'+w+'/interlace/1'
            }
        },
        activated() {
            console.log('activated')
        },
        watch: {
            isShow(newValue, oldValue) {
                // console.log('newValue', newValue, this.activeIndex)
                // if (newValue == true) this.getWidth()
                this.getWidth()
            }
        },
    }
</script>

<style lang="scss" scoped>
.twe-col-goods-item-images {
    // width: 100%;
}
.two-col .goods-item {
    box-shadow: 1px 3px 3px #f3f3f3;
}
.twe-col-goods-item-info {
    padding: 8px 4px 4px 4px;
}
</style>