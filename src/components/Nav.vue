<template>
    <div class="common-nav" style="margin-bottom: 46px">
        <van-nav-bar
            :title="title"
            :class="styles"
            :border="border"
            @click-left="onClickLeft"
            @click-right="onClickRight"
            :fixed="fixed"
            :left-arrow="leftArrow"
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
    import { NavBar } from 'vant'
    export default {
        components: {
            NavBar,
        },
        props: {
            title: {
                type: String,
                default: '慧生活'
            },
            styles: {
                type: String,
                default: ''
            },
            border: {
                type: Boolean,
                default: true
            },
            leftText: {
                type: String,
                default: '返回'
            },
            rightText: {
                default: ''
            },
            fixed: {
                type: Boolean,
                default: true
            },
            leftArrow: {
                type: Boolean,
                default: true
            }
        },
        methods: {
            onClickLeft() {
                localStorage.setItem('is_back', 1);
                if (window.history.length <= 1) {
                    this.$route.push('/')
                }
                this.$router.go(-1)
            },
            onClickRight() {

            }
        },
    }
</script>

<style lang="less" scoped>

</style>