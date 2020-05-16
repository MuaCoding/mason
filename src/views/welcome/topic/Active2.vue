<template>
    <div>
        <div :style="{ height: heights + 'px' }" v-if="iosShow"></div>
        <header-bar :styles="'zindex-1001;'" :isIos="iosShow" :title="title || '活动主题'" :heights="heights" :back="-1"></header-bar>
        <div style="background: #F8F8F8;" class="active-box">
            <van-tabs
                sticky
                :line-width="29"
                @change="changeActives"
                v-model="activeIndex"
                :border="false"
                title-active-color="#D53329"
                title-inactive-color="#9E9E9E"
                background="#F8F8F8"
                v-if="actives.length > 0"
            >
                <van-tab :title="item.title" v-for="(item, index) in actives" :key="index">
                    <div class="p-5 text-center" v-if="loading">
                        <van-loading />
                    </div>
                    <div v-else>
                        <div style="padding: 0 15px; margin-top: 8px">
                            <!-- <div class="topic2-active-banner mt-1">
                                <van-image fit="cover" :radius="5" :src="actives[index].master_image" />
                            </div> -->
                            <van-swipe v-if="activeIndex === index" ref="swipes" class="my-swipe" :autoplay="3000" indicator-color="white">
                                <van-swipe-item v-for="(img, i) in swipes" :key="i">
                                    <van-image fit="cover" :radius="5" :src="img" />
                                </van-swipe-item>
                            </van-swipe>
                        </div>
                        <template v-if="activeGoods[index]">
                            <div v-for="(item, i) in activeGoods[index].module" :key="i">
                                <one-row
                                    v-if="item.goods_show_type == 'row1'"
                                    :titleStyle="{ 'margin-top': '18px' }"
                                    :contentStyle="{ 'margin-top': '8px' }"
                                    style="background: #F8F8F8"
                                    :title="item.name"
                                    :data="item.goods"
                                ></one-row>
                                <one-col
                                    v-if="item.goods_show_type == 'col1'"
                                    :titleStyle="{ 'margin-top': '18px' }"
                                    :contentStyle="{ 'margin-top': '8px' }"
                                    style="background: #F8F8F8"
                                    :title="item.name"
                                    :data="item.goods"
                                ></one-col>
                                <three-col
                                    v-if="item.goods_show_type == 'col3'"
                                    :titleStyle="{ 'margin-top': '18px' }"
                                    :contentStyle="{ 'margin-top': '8px' }"
                                    :title="item.name"
                                    :data="item.goods"
                                ></three-col>
                                <two-col
                                    v-if="item.goods_show_type == 'col2'"
                                    :titleStyle="{ 'margin-top': '18px' }"
                                    :contentStyle="{ 'margin-top': '8px' }"
                                    :title="item.name"
                                    :data="item.goods"
                                ></two-col>
                            </div>
                        </template>
                    </div>
                </van-tab>
            </van-tabs>
            <div class="topic-divider-box">
                <van-divider class="fs-12" :style="{ color: '#9E9E9E', borderColor: '#9E9E9E' }">没有更多内容</van-divider>
            </div>
        </div>
        <div class="text-center p-5 bg-white" v-if="actives.length == 0">
            <van-loading />
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
            activeIndex: 0,
            actives: [],
            activeGoods: [],
            title: "",
            data: {},
            loading: true,
            clientWidth: 375,
            swipes: [],
        };
    },
    methods: {
        getActiveGoods(id, index) {
            if (!this.activeGoods[index]) {
                this.loading = true;
                this.$apps.http.get("/Activity/goods_list", { id: id }).then((res) => {
                    if (res.code === 1) {
                        this.title = res.data.title;
                        this.swipes = res.data.master_image;
                        this.$set(this.activeGoods, index, res.data);
                    }
                    this.loading = false;
                });
            }
        },
        changeActives(index) {
            this.$waterfall.forceUpdate();
            this.activeIndex = index;
            this.title = this.actives[index].title;
            this.swipes = this.actives[index].master_image;
            // this.$swipes.forceUpdate()
            console.log(this.swipes);
            this.getActiveGoods(this.actives[index].id, index);
        },
    },
    created() {
        this.clientWidth = document.body.clientWidth;
        this.id = this.$route.params.id;
        this.activeIndex = parseInt(this.$route.params.index) ? parseInt(this.$route.params.index) : 0;
        this.$apps.http.get("/Activity/index", {}).then((res) => {
            if (res.code === 1) {
                this.actives = res.data.theme2;
                this.getActiveGoods(this.id, this.activeIndex);
            }
        });
    },
    mounted() {
        let header = document.querySelector(".header-bar");
        let nav = document.querySelector(".van-nav-bar--fixed");
        let content = document.querySelector(".active-box");

        this.heights = window.ios != undefined ? window.ios.statusHeight() : 20;
        if (this.heights > 40) {
            
        } else {
            nav.style.top = this.heights + "px";
            console.log(nav.style.top);
            this.heights + "px";
            // header.style.marginBottom = this.heights + "px";
            this.iosShow = true;
        }
        // setTimeout(()=>{
        // // if (!this.$apps.isAndroidApp()) {

        //     // } else {
        //     //     this.heights = 0;
        //     //     this.iosShow = false;
        //     // }
        // },1)

        // this.$nextTick(() => {
        //     // debugger
        //     //  && window.ios != undefined

        // });
    },
    filters: {
        imageView2(value, w) {
            return value + "?imageView2/1/w/" + w + "/h/" + w + "/interlace/1";
        },
    },
};
</script>

<style lang="scss">
.topic1-goods-list .van-tabs__wrap {
    height: auto !important;
}
.topic1-goods-list .van-tab {
    line-height: normal;
}
</style>
