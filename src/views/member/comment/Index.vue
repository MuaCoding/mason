<template>
    <div class="page page-no-radius">
        <div :style="{ height: heights + 'px' }" v-if="iosShow" class="headIos"></div>
        <header-bar title="我的评论" :border="true" :back="-1" :isIos="iosShow" :heights="heights"></header-bar>
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
            let content = document.querySelector(".list-group");

            if (!this.$apps.isAndroid()) {
                let head = document.querySelector(".van-nav-bar");
                this.heights = window.ios != undefined ? window.ios.statusHeight() : 20;
                if (this.heights > 40) {
                    this.iosShow = false;
                    this.heights = 0;
                    content.style.paddingTop = 47 + "px";
                    return;
                } else {
                    head.style.top = Number(this.heights) + "px";
                    content.style.paddingTop = Number(this.heights) + 47 + "px";
                    this.iosShow = true;
                }
            } else {
                content.style.paddingTop = 47 + "px";
                this.heights = 0;
                this.iosShow = false;
            }
        });
    },
};
</script>

<style lang="less" scoped></style>
