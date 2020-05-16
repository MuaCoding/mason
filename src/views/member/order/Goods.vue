<template>
    <div class="page">
        <header-bar title="售后商品" :border="false" :back="-1"></header-bar>

        <div class="wrapper" v-if="list">
            <van-panel
                :title="list.shop.name"
                :icon="list.shop.logo"
                class="panel-item"
                :key="item.id"
                v-for="item in list.goods"
                :status="item.status_name"
                :class="{ 'panel-primary': item.status == 20, 'panel-success': item.status == 80, 'panel-gray': item.status == 90 }"
            >
                <div class="prod-item" @click="goto({ no: item.id }, 'detail')">
                    <van-image lazy-load radius="6px" width="5.25rem" height="5.25rem" :src="item.goods_master_image" />
                    <div class="prod-content">
                        <p>单号：{{ item.refund_no }}</p>
                        <p>名称：{{ item.goods_name }}</p>
                        <p></p>
                        <div class="desc-bar text-secondary">
                            <span>
                                金额：<span class="text-primary strong">¥ {{ item.goods_sku_price }}</span></span
                            ><span class="text-right">x {{ item.buy_num }}</span>
                        </div>
                    </div>
                </div>
                <div class="button-group" slot="footer">
                    <!-- <van-button plain size="mini" type="info" :to="'/member/comment/' + item.id">立即评价</van-button> -->
                    <van-button plain size="mini" type="info" :to="'/member/order/form/' + item.id + '/' + storeId + '/' + 2">退货退款</van-button>
                    <van-button plain size="mini" type="info" :to="'/member/order/form/' + item.id + '/' + storeId + '/' + 1">换货维修</van-button>
                </div>
            </van-panel>
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
