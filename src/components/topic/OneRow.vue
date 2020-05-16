<template>
    <div :class="'one-row ' + class1" :style="boxStyle">
        <slot name="title">
            <template v-if="title_bg">
                <div :style="titleStyle">
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
        <scroll-horizontally1 :style="contentStyle" background="#F8F8F8" :data="data"></scroll-horizontally1>
    </div>
</template>

<script>
    import ScrollHorizontally1 from '../../components/common/ScrollHorizontally1'
    export default {
        components: {
            ScrollHorizontally1,
        },
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
                    return {'padding-left': '15px', 'padding-right': "15px"}
                }
            },
            titleStyle: {
                type: Object,
                default: function() {
                    return {"margin-top": "15px"}
                }
            },
            contentStyle: {
                type: Object,
                default: function() {
                    return {'margin-top': '15px'}
                }
            }
        },
        data() {
            return {
                clientW: 0,
                w: 0
            }
        },
        created () {
            this.clientW = document.body.clientWidth;
            this.w = parseFloat((this.clientW - 35) / 4);
            this.w += ((this.w/2)/3) + 1
        },
        mounted () {
            // document.querySelector(".one-row-swipe .van-swipe__track").width = 'auto';
        },
        filters: {
            filterImages(value, w) {
                w = parseInt(w * 2)
                return value + '?imageView2/1/w/'+w+'/h/'+w+'/interlace/1'
            }
        }
    }
</script>

<style lang="scss">
.topic1-goods-list .van-tabs__wrap{
    height: auto !important;
}
.topic1-goods-list .van-tab {
    line-height: normal;
}
.topic1-list {

}
.title-style-0 {
    color: #212121;
    font-size: 17px;
    // padding: 0 8px;
    // border-left: solid 3px #D53329;
}
.title-style-0-border-left-3 {
    border-left: solid 3px #D53329;
    padding-left: 8px;
}
.one-row .one-row-goods-images {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
}
.one-row .van-tab {
    padding: 0 !important;
}
.one-row-goods-item {
    margin-right: 5px;
    border-radius: 6px;
    box-shadow: 1px 3px 3px #f3f3f3;
    margin-bottom: 5px;
}
.one-row .van-tabs__nav--line {
    padding-bottom: 0 !important;
}
.one-row-goods-item .van-image img {
    border-radius: 6px 6px 0 0;
}
</style>