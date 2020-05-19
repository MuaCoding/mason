<template>
    <div class="page">
        <div :style="{ height: heights + 'px' }" v-if="iosShow" class="headIos"></div>
        <header-bar title="评价" :border="false" :isIos="iosShow" :back="-1" :heights="heights"></header-bar>
        <div class="wrapper valuation">
            <div v-if="list">
                <van-panel
                    :title="list.shop.name"
                    :icon="list.shop.logo"
                    class="panel-item"
                    v-for="item in list.goods"
                    :key="item.id"
                    v-show="item.is_comment === 0"
                    :status="item.status_name"
                    :class="{ 'panel-primary': item.status == 20, 'panel-success': item.status == 80, 'panel-gray': item.status == 90 }"
                >
                    <div class="prod-item" @click="goto({ no: item.id }, 'detail')">
                        <van-image lazy-load radius="6px" width="5.25rem" height="5.25rem" :src="item.goods_master_image" />
                        <div class="prod-content">
                            <p>单号：{{ item.order_shop_no }}</p>
                            <p>名称：{{ item.goods_name }}</p>
                            <div class="desc-bar text-secondary">
                                <span>
                                    金额：<span class="text-primary strong">¥ {{ item.goods_sku_price }}</span></span
                                ><span class="text-right">x {{ item.buy_num }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="button-group" slot="footer">
                        <van-button plain size="mini" type="info" :to="'/member/order/comment/' + item.id">立即评价</van-button>
                    </div>
                </van-panel>
            </div>
        </div>
    </div>
</template>

<script>
import HeaderBar from "../../../components/common/HeaderBar";
import CommonNoData from "../../../components/NoData";
import ButtonGroup from "../../../components/order/ButtonGroup";
export default {
    components: {
        HeaderBar,
        CommonNoData,
        ButtonGroup,
    },
    data() {
        return {
            iosShow: false,
            heights: 0,
            storeId: null,
            active: 0,
            loading: false,
            finished: false,
            list: null,
        };
    },
    created() {
        this.fetchData();
    },
    mounted() {
        this.$nextTick(() => {
            let content = document.querySelector(".wrapper");
            if (!this.$apps.isAndroid()) {
                let head = document.querySelector(".van-nav-bar--fixed");

                this.heights = window.ios != undefined ? window.ios.statusHeight() : 20;
                if (this.heights > 40) {
                    this.heights = 0;
                    this.iosShow = false;
                    content.style.marginTop = 47 + "px";
                    return;
                } else {
                    head.style.top = Number(this.heights) + "px";
                    content.style.marginTop = Number(this.heights) + 47 + "px";
                    this.iosShow = true;
                }
            } else {
                this.heights = 0;
                content.style.marginTop = 47 + "px";
                this.iosShow = false;
            }
        });
    },
    methods: {
        fetchData() {
            this.$store.dispatch("SET_LOADING", 1);
            this.storeId = this.$route.params.id;
            this.$apps.http
                .get("/SoldService.Order/goods", { order_shop_id: this.storeId })
                .then((res) => {
                    if (res.code == 1) {
                        this.list = res.data;
                    }
                })
                .catch((err) => {});
        },
        goto(item, route) {
            this.$router.push("/member/refund/" + route + "/" + item.no);
        },
    },
};
</script>

<style lang="less" scoped></style>
