<template>
    <div class="page bg-f4">
        <header-bar title="发布评论" :border="true" :back="-1"></header-bar>
        <van-cell-group class="discuss-wrap">
            <van-cell :border="false">
                <template #title
                    ><van-image lazy-load radius="6px" width="3.25rem" height="3.25rem" src="https://img.yzcdn.cn/vant/t-thirt.jpg" />
                    <span class="strong text-secondary ml-2">白熊个人店</span>
                </template>
                <template #right-icon>
                    <van-rate v-model="rate" :color="switchColor" :size="16" void-icon="star-o" void-color="#D8D8D8" />
                </template>
            </van-cell>
            <!-- 评论详情 -->
            <van-cell :border="false"
                ><template #title><span class="text-secondary strong">发布评论详情</span></template>
            </van-cell>
            <van-field placeholder="请理性对当前商品进行评价" type="textarea"></van-field>
        </van-cell-group>
        <!-- 上传评价图片 -->
        <van-cell-group class="mt-1">
            <van-cell :border="false">
                <template #title
                    ><span class="text-secondary-dark strong">添加图片</span><span class="text-gray">（最多上传6张）</span></template
                ></van-cell
            >
            <div class="p-3"><van-uploader preview-size="75px" v-model="imagesList" multiple :max-count="6" /></div>
            <van-cell :border="false">
                <template #title><van-checkbox checked-color="#ffd21e" v-model="checked">匿名评价</van-checkbox></template></van-cell
            >
        </van-cell-group>
        <!-- 评分 -->
        <van-cell-group class="mt-1">
            <van-cell :border="true">
                <template #title><span class="text-secondary strong">店铺评分</span></template></van-cell
            >
            <van-cell :border="false">
                <template #title>
                    <span class="text-secondary">物流评分</span>
                </template>
                <template #right-icon>
                    <van-rate v-model="rate" :color="switchColor" :size="24" void-icon="star-o" void-color="#D8D8D8" />
                </template>
            </van-cell>
            <van-cell :border="false">
                <template #title>
                    <span class="text-secondary">服务态度</span>
                </template>
                <template #right-icon>
                    <van-rate v-model="rate" :color="switchColor" :size="24" void-icon="star-o" void-color="#D8D8D8" />
                </template>
            </van-cell>
            <van-cell :border="false">
                <template #title>
                    <span class="text-secondary">商品描述</span>
                </template>
                <template #right-icon>
                    <van-rate v-model="rate" :color="switchColor" :size="24" void-icon="star-o" void-color="#D8D8D8" />
                </template>
            </van-cell>
        </van-cell-group>
        <div class="p-5 bg-white ">
            <van-button block color="linear-gradient(315deg,rgba(251,88,112,1) 0%,rgba(251,143,96,1) 100%)">发布评论</van-button>
        </div>
    </div>
</template>

<script>
import HeaderBar from "../../../components/common/HeaderBar";
export default {
    components: {
        HeaderBar,
    },
    data() {
        return {
            loading: false,
            finished: true,
            list: [],
            no: "",
            checked: false,
            rate: 2,
            fileList: [],
            switchColor: "linear-gradient(140deg,rgba(254,193,36,1) 0%,rgba(251,168,35,1) 100%)"
        };
    },
    methods: {
        onLoad() {}
    }
    
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
