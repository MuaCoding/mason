<template>
    <div class="mall-header">
        <div class="back-btn">
            <van-icon name="arrow-left" />
        </div>
        <div class="header-title">{{ title }}</div>
        <div class="header-search"></div>
        <div class=""></div>
        <!-- <van-nav-bar
            :title="title"
            :class="styles"
            :border="border"
            @click-left="onClickLeft(back)"
            @click-right="onClickRight"
            :fixed="fixed"
            :left-arrow="leftArrow"
        >
            <div slot="title">
                <slot name="nav-title">{{ title }}</slot>
            </div>
            <div slot="right">
                <slot name="nav-right"></slot>
            </div>
        </van-nav-bar> -->
    </div>
</template>

<script>
export default {
    components: {},
    props: {
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
};
</script>

<style lang="less" scoped>
.mall-header {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2.9375rem;
    display: flex;

    .van-nav-bar {
        top: constant(safe-area-inset-top);
        top: env(safe-area-inset-top);
    }
    .header-title {
        display: table;
        width: 100%;
        margin-right: auto;
        margin-left: auto;
        table-layout: fixed;
        width: auto;
    }
}
</style>
