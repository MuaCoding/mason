<template>
    <div class="page page-no-radius">
        <header-bar title="我的评论" :border="true" :back="-1" :isIos="iosShow"></header-bar>
        <comment-list></comment-list>
    </div>
</template>

<script>
import HeaderBar from "../../../components/common/HeaderBar";
import CommentList from "../../../components/comment/CommentList";
import CommonNoData from "../../../components/NoData";
export default {
    components: {
        HeaderBar,
        CommentList,
        CommonNoData,
    },
    data() {
        return {
            iosShow: false,
            heights: 0,
            loading: false,
            finished: true,
            list: [],
        };
    },
    methods: {
        onLoad() {},
    },
    created() {
        // this.$apps.http.;
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
