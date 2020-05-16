<template>
    <div class="loading" v-if="loadingStatus">
        <van-loading type="spinner" color="#60656e" size="24" vertical>{{ msg }}</van-loading>
    </div>
</template>

<script>
import { Loading } from "vant";
export default {
    data() {
        return {};
    },
    components: {
        Loading
    },
    props: {
        msg: {
            type: String,
            default: ""
        },
        loading: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        loadingStatus() {
            return this.$store.state.isLoading;
        }
    }
};
</script>

<style lang="less" scoped>
.loading {
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    z-index: 100;
}
</style>
