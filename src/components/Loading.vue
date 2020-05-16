<template>
    <div class="common-loading">
        <div class="mt-5 pt-5 text-center">
            <van-loading>{{ msg }}</van-loading>
        </div>
    </div>
</template>

<script>
import { Loading } from "vant";
export default {
    components: {
        Loading
    },
    props: {
        msg: {
            type: String,
            default: ""
        }
    }
};
</script>

<style lang="less" scoped></style>
