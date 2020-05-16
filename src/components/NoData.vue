<template>
    <div class="common-no-data" v-show="show">
        <div class="text-center mt-5 pt-5">
            <p><span class="icon iconfont icon-meiyoushuju text-99" style="font-size: 32px"></span></p>
            <p class="fs-14 text-99">{{ msg }}</p>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        show: {
            type: Boolean,
            default: false
        },
        msg: {
            type: String,
            default: "暂无数据"
        }
    }
};
</script>

<style lang="less" scoped></style>
