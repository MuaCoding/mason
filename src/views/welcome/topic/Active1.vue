<template>
    <div>
        <header-bar :title="title || '活动主题'" :isIos="iosShow" :back="-1"></header-bar>
        <div class="p-5 text-center" v-if="loading">
            <van-loading />
        </div>
        <div v-else style="background: #F8F8F8">
            <div class="" style="padding-left: 15px; padding-right: 15px; padding-top: 8px">
                <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
                    <van-swipe-item v-for="(img, i) in data.master_image" :key="i">
                        <van-image fit="cover" :radius="5" :src="img" />
                    </van-swipe-item>
                </van-swipe>
                <!-- <div class="topic2-active-banner">
                    <van-image fit="cover" :radius="5" :src="data.master_image" /> -->
                <!-- <van-image fit="fill" :radius="5" src="https://img.greendg.cn/FuY9NZYJZKl0l_atG4IXQBppYOPI" /> -->
                <!-- </div> -->
            </div>
            <div v-for="(item, index) in data.module" :key="index">
                <one-row
                    :title_bg="data.module_title_bg_image"
                    style="background: #F8F8F8"
                    v-if="item.goods_show_type == 'row1'"
                    :title="item.name"
                    :data="item.goods"
                ></one-row>
                <one-col
                    :title_bg="data.module_title_bg_image"
                    style="background: #F8F8F8; margin-top: 18px"
                    v-if="item.goods_show_type == 'col1'"
                    :title="item.name"
                    :data="item.goods"
                ></one-col>
                <two-col
                    :title_bg="data.module_title_bg_image"
                    style="background: #F8F8F8"
                    v-if="item.goods_show_type == 'col2'"
                    :title="item.name"
                    :data="item.goods"
                ></two-col>
                <three-col
                    :title_bg="data.module_title_bg_image"
                    style="background: #F8F8F8"
                    v-if="item.goods_show_type == 'col3'"
                    :title="item.name"
                    :data="item.goods"
                ></three-col>
            </div>
            <div class="topic-divider-box">
                <van-divider class="fs-12" :style="{ color: '#9E9E9E', borderColor: '#9E9E9E' }">没有更多内容</van-divider>
            </div>
        </div>
    </div>
</template>

<script>
import OneRow from "../../../components/topic/OneRow";
import ThreeCol from "../../../components/topic/ThreeCol";
import OneCol from "../../../components/topic/OneCol";
import TwoCol from "../../../components/topic/TwoCol";
import HeaderBar from "../../../components/common/HeaderBar";
export default {
    components: {
        OneRow,
        ThreeCol,
        HeaderBar,
        OneCol,
        TwoCol,
    },
    data() {
        return {
            iosShow: false,
            heights: 0,
            id: "",
            index: 0,
            actives: [],
            activeGoods: [],
            title: "",
            data: {},
            loading: true,
            clientWidth: 375,
        };
    },
    methods: {},
    created() {
        this.id = parseInt(this.$route.params.id);
        this.clientWidth = document.body.clientWidth;
        if (this.id > 0) {
            this.$apps.http.get("/Activity/goods_list", { id: this.id }).then((res) => {
                if (res.code === 1) {
                    this.title = res.data.title;
                    this.data = res.data;
                }
                this.loading = false;
            });
        } else {
            this.$router.push("/");
        }
    },

    mounted() {
        this.$nextTick(() => {
            //  && window.ios != undefined
            if (!this.$apps.isAndroid()) {
                let nav = document.querySelector(".van-nav-bar--fixed");
                let content = document.querySelector(".active-box");

                this.heights = window.ios != undefined ? window.ios.statusHeight() : 20;
                if (this.heights > 40) {
                    this.heights = 0;
                    this.iosShow = false;
                    return;
                } else {
                    nav.style.top = this.heights + "px";
                    content.style.marginTop = this.heights + "px";
                    this.iosShow = true;
                }
            } else {
                this.heights = 0;
                this.iosShow = false;
            }
        });
    },
    filters: {
        imageView2(value, w, h) {
            h = h ? h : w;
            return value + "?imageView2/1/w/" + w + "/h/" + h + "/interlace/1";
        },
    },
};
</script>

<style lang="scss" scoped></style>
