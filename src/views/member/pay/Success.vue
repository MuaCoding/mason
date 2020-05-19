<template>
    <div>
        <div :style="{ height: heights + 'px' }" v-if="iosShow" class="headIos"></div>
        <header-bar title="付款成功" :border="true" :isIos="iosShow" :back="2" :heights="heights"></header-bar>

        <div class="p-5 text-center address" :data-top="height">
            <van-icon class="text-success" size="4rem" name="passed" />
            <div class="mt-2 text-66 fs-14">
                付款成功
            </div>
        </div>

        <div class="mt-3 text-center">
            <van-button to="/" type="primary" size="small">回到首页</van-button>
            <van-button @click="goto()" type="info" size="small" style="margin-left: 20px">查看订单</van-button>
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
            height: 67,
        };
    },
    components: {
        HeaderBar,
        Button,
        Icon,
    },
    created() {},
    methods: {
        goto() {
            this.$router.replace("/member/order/2");
            this.$store.dispatch(
                "SET_LOCALSTORAGE",
                JSON.stringify({
                    name: "ORDERBAR",
                    value: 2,
                })
            );
        },
    },
    mounted() {
        this.$nextTick(() => {
            if (!this.$apps.isAndroid()) {
                let head = document.querySelector(".van-nav-bar--fixed");
                let content = document.querySelector(".address");
                this.heights = window.ios != undefined ? window.ios.statusHeight() : 20;
                if (this.heights > 40) {
                    this.heights = 0;
                    this.iosShow = false;
                    content.style.marginTop = 47 + "px";
                    return;
                } else {
                    head.style.top = Number(this.heights) + "px";
                    this.height = Number(this.heights) + 47;
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
