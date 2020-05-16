<template>
    <div>
        <header-bar title="付款成功" :border="true" :isIos="iosShow" :back="-1"></header-bar>

        <div class="p-5 text-center">
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
            if (!this.$apps.isAndroidApp() && window.ios != undefined) {
                let head = document.querySelector(".van-nav-bar--fixed");
                let headerBar = document.querySelector(".header-bar");
                this.heights = window.ios != undefined ? window.ios.statusHeight() : 20;
                if (this.heights > 40) {
                    return;
                } else {
                    let tab = document.querySelector(".wrapper");
                    // let ordeftabs = document.querySelector(".index-tab");
                    head.style.top = Number(this.heights) + "px";
                    headerBar.style.marginBottom = Number(this.heights) + "px";
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
