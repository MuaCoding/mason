<template>
    <div :class="'one-col ' + class1" :style="boxStyle">
        <slot name="title">
            <template v-if="title_bg">
                <div>
                    <div class="text-center topic-title-bg text-white" :style="'background: url(' + title_bg + ') no-repeat center center;background-size: 100% 100%;'">
                        {{title}}
                    </div>
                </div>
            </template>
            <template v-else>
                <div :style="titleStyle" class="title-style-0 strong text-21">
                    <span class="title-style-0-border-left-3"></span>{{title}}
                </div>
            </template>
        </slot>
        <div :style="contentStyle">
            <van-card v-for="(item, index) in data" :key="index" @click="go(item.id)" class="rounded-5 goods-item">
                <div slot="title" class="fs-14 one-col-goods-title van-multi-ellipsis--l2">
                    {{item.name}}
                </div>
                <div slot="thumb" style="height: 70px; width: 70px">
                    <van-image fit="cover" radius="0" width="70" height="70" :src="item.master_image" />
                </div>
                <div slot="tags" class="one-col-goods-info">
                    <div class="fs-10 text-9e line-height-8">
                        <del>原价:{{item.activity_sku.original_price}}</del>
                    </div>
                    <div>
                        <van-row>
                            <van-col span="8" class="fs-14 text-danger strong" style="margin-top: 4px">
                                ￥{{item.activity_sku.activity_price}}
                            </van-col>
                            <van-col span="16" class="text-right">
                                <span class="align-bottom text-66 d-inline-block fs-10 one-col-num">剩余数量{{item.activity_sku.activity_nums}}</span><van-image class="align-bottom" width="59" src="/img/topic/go-buy.png" />
                            </van-col>
                        </van-row>
                    </div>
                </div>
            </van-card>
        </div>
    </div>
</template>

<script>
    export default {
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
                    return {'padding': '0 15px'}
                }
            },
            titleStyle: {
                type: Object,
                default: function() {
                    return {}
                }
            },
            contentStyle: {
                type: Object,
                default: function() {
                    return {'margin-top': '10px'}
                }
            }
        },
        methods: {
            go(id) {
                this.$router.push('/goods/' + id)
            }
        },
        created () {
        },
    }
</script>

<style lang="scss">
.one-col .van-card{
    padding: 15px 8px;
    border-radius: 5px;
}
.one-col .van-card__content{
    min-height: 70px !important;
}
.one-col .van-card__thumb {
    height: 70px;
    width: 70px;
}
.one-col-goods-info {
    position: absolute;
    width: 100%;
    bottom: 0;
}
.one-col .goods-item {
    box-shadow: 1px 3px 3px #f3f3f3;
}
.one-col .van-image__img{
    border-radius: 0 !important;
}
.one-col .one-col-goods-title {
    color: #212121;
    line-height: 16px;
}
.one-col-num {
    margin-bottom: -3px;
}
</style>