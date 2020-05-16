<template>
    <div class="header-bar">
        <div :style="{ height: h + 'px' }" v-show="isIos" class="headIos"></div>
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
    </div>
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
/* 
* 解决iOS头部top 被重置的问题
*/
.van-nav-bar[data-top="20"] {
    top: 20px;
}
.van-nav-bar[data-top="42"] {
    top: 42px;
}
.van-nav-bar[data-top="44"] {
    top: 44px;
}

/* end */

.header-bar {
    height: 2.9375rem;
    /deep/.van-nav-bar {
        // z-index: 4;
        // top: constant(safe-area-inset-top);
        // top: env(safe-area-inset-top);
    }
    .IosHeight {
        top: 20px;
    }
    .headIos {
        position: fixed;
        width: 100%;
        top: 0;
        left: 0;
        z-index: 200;
        background: #fff;
    }

    /deep/ .van-nav-bar--fixed {
        position: fixed;
        background: #fff;
        z-index: 999;
        // padding-top: 0 !important;
        // top: 20px;
    }
}
</style>
