<template>
    <van-nav-bar
        :title="title"
        :class="styles"
        :border="border"
        @click-left="onClickLeft(back)"
        @click-right="onClickRight"
        :fixed="fixed"
        :left-arrow="leftArrow"
        :data-top="h"
    >
        <!-- <div slot="left">
                <slot name="nav-title"></slot>
            </div> -->
        <div slot="title">
            <slot name="nav-title">{{ title }}</slot>
        </div>
        <div slot="right">
            <slot name="nav-right"></slot>
        </div>
    </van-nav-bar>
</template>

<script>
export default {
    components: {},
    props: {
        isIos: {
            type: Boolean,
            default: true,
        },
        heights: {
            default: 20,
        },
        title: {
            type: String,
            default: "慧生活",
        },
        route: {
            type: String,
            default: "/member",
        },
        styles: {
            type: String,
            default: "",
        },
        back: {
            type: Number,
            default: "",
        },
        border: {
            type: Boolean,
            default: true,
        },
        leftText: {
            type: String,
            default: "返回",
        },
        rightText: {
            default: "",
        },
        fixed: {
            type: Boolean,
            default: true,
        },
        leftArrow: {
            type: Boolean,
            default: true,
        },
    },
    methods: {
        onClickLeft(back) {
            if (back == 1) {
                sessionStorage.setItem("tabbar", 3);
                this.$router.replace("/");
            } else if (back == "2") {
                this.$router.replace("/member/order/2");
                this.$store.dispatch(
                    "SET_LOCALSTORAGE",
                    JSON.stringify({
                        name: "ORDERBAR",
                        value: 2,
                    })
                );
                console.log(2)
            } else {
                localStorage.setItem("is_back", 1);
                if (window.history.length <= 1) {
                    this.$router.push("/");
                }
                this.$router.go(-1);
            }
        },
        onClickRight() {},
    },
    mounted() {},
    data() {
        return {
            h: 0,
        };
    },
    watch: {
        heights(val) {
            this.h = val;
        },
    },
};
</script>

<style lang="less">
/* end */
</style>
