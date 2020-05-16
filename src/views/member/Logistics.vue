<template>
    <div class="page page-no-radius">
        <header-bar title="物流信息" :border="false" :back="-1" :isIos="iosShow"></header-bar>
        <template v-if="data.expressRes && data.address">
            <van-cell-group>
                <van-cell>
                    <van-image slot="icon" class="mr-2" round width="50" height="50" :src="data.expressRes.logo" />
                    <div slot="title">{{ data.expressRes.expName }}</div>

                    <div slot="label">官方电话 {{ data.expressRes.expPhone }}</div>
                </van-cell>
            </van-cell-group>
            <div class="text-99 fs-12 p-2">{{ data.expressRes.expName }} {{ data.expressRes.number }}</div>

            <van-cell-group>
                <van-cell icon="location-o">
                    <div slot="title">{{ data.address.name || "" }},{{ data.address.mobile || "" }}</div>
                    <div slot="label">
                        {{ data.address.province.name + data.address.city.name + data.address.district.name + data.address.info || "" }}
                    </div>
                </van-cell>
            </van-cell-group>

            <van-cell-group>
                <van-steps direction="vertical" :active="0">
                    <van-step v-for="(item, index) in data.expressRes.list" :key="index">
                        <div class="fs-14 text-66">{{ item.status }}</div>
                        <div class="fs-12 text-99">{{ item.time }}</div>
                    </van-step>
                </van-steps>
            </van-cell-group>
        </template>
        <van-cell-group v-if="(!data.expressRes || !data.address) && data.shop">
            <van-cell>
                <van-image slot="icon" class="mr-2" width="75" height="75" :src="data.shop.logo" />
                <div slot="title">物流状态：更新中</div>
                <div slot="label">物流单号：{{ no }}</div>
                <div slot="label">商家电话：{{ data.shop.contect_mobile }}</div>
            </van-cell>
        </van-cell-group>
        <common-no-data :show="flag"></common-no-data>
    </div>
</template>

<script>
import HeaderBar from "../../components/common/HeaderBar";
import CommonNoData from "../../components/NoData";
export default {
    components: {
        HeaderBar,
        CommonNoData,
    },
    data() {
        return {
            iosShow: false,
            heights: 0,
            order: [],
            express: {},
            no: "",
            id: "",
            type: null,
            data: {},
            flag: false,
        };
    },
    methods: {
        fetchExpress() {
            this.$apps.http
                .get("/Order/service_express", {
                    express_no: this.no,
                    type: this.type,
                    id: this.id,
                })
                .then((result) => {
                    if (result.code == 1) {
                        this.data = result.data;
                        !result.data.expressRes || !result.data.address ? (this.flag = true) : "";
                    }
                })
                .catch((err) => {});
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
    created() {
        // 后期整合订单/售后/退款物流接口
        this.no = this.$route.params.no;
        this.id = this.$route.params.id;
        this.type = this.$route.params.type;
        this.fetchExpress();
    },
};
</script>

<style lang="less" scoped></style>
