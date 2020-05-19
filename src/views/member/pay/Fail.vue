<template>
    <div>
        <div :style="{ height: heights + 'px' }" v-if="iosShow" class="headIos"></div>
        <header-bar title="付款失败" :border="true" :isIos="iosShow" :back="-1" :heights="heights"></header-bar>

        <div class="p-5 text-center">
            <van-icon class="text-danger" size="4rem" name="close" />
            <div class="mt-2 text-66 fs-14">
                付款失败
            </div>
        </div>

        <div class="mt-3 text-center">
            <van-button to="/" type="primary" size="small">回到首页</van-button>
            <van-button to="/member/order" type="info" size="small" style="margin-left: 20px">查看订单</van-button>
        </div>
    </div>
</template>

<script>
import HeaderBar from "../../../components/common/HeaderBar";
import { Button, Icon } from "vant";
export default {
    data() {
        return {
            iosShow: false,
            heights: 0,
        };
    },
    components: {
        HeaderBar,
        Button,
        Icon,
    },
    mounted() {
        this.$nextTick(() => {
            if (!this.$apps.isAndroid()) {
                let head = document.querySelector(".van-nav-bar--fixed");
                let content = document.querySelector(".text-center");
                this.heights = window.ios != undefined ? window.ios.statusHeight() : 20;
                if (this.heights > 40) {
                    this.heights = 0;
                    this.iosShow = false;
                    content.style.marginTop = 47 + "px";
                    return;
                } else {
                    head.style.top = Number(this.heights) + "px";
                    content.style.marginTop = Number(this.heights) + 47 + "px";
                    this.iosShow = true;
                }
            } else {
                this.heights = 0;
                this.iosShow = false;
            }
        });
    },
};
</script>

<style lang="less" scoped></style>
