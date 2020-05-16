<template>
    <div>
        <header-bar title="售后主页" :border="false" :back="-1"></header-bar>
        <!-- <order-list :active="active" :list="result"></order-list> -->
        <div class="prod-list p-3">
            <div class="review-item" v-for="item in list" :key="item.id">
                <div class="prod-item" @click="goto({ id: item.id }, 'detail')">
                    <van-image lazy-load radius="6px" width="5.25rem" height="5.25rem" :src="item.goods_master_image" />
                    <div class="prod-content">
                        <p>名称：{{ item.goods_name }}</p>
                        <p>
                            金额：<span class="text-primary">¥{{ item.goods_money }}</span>
                        </p>
                    </div>
                </div>
                <!-- 底部按钮 -->
                <div class="button-group px-3 pb-3">
                    <van-button plain size="mini" type="info" :to="'/member/comment/' + item.id">立即评价</van-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import HeaderBar from "../../../components/common/HeaderBar";
import CommonNoData from "../../../components/NoData";
import ButtonGroup from "../../../components/order/ButtonGroup";
import { Tab, Tabs, List, Cell, CellGroup, Card, Image } from "vant";
export default {
    components: {
        HeaderBar,
        Tab,
        Tabs,
        List,
        Cell,
        CellGroup,
        Card,
        CommonNoData,
        ButtonGroup,
        Image
    },
    data() {
        return {
            storeId: null,
            active: 0,
            loading: false,
            finished: false,
            list: []
        };
    },
    created() {
        this.fetchData();
    },
    methods: {
        fetchData() {
            let t = this;
            t.storeId = t.$route.params.id;
            t.$apps.http
                .get("/SoldService.Order/goods", { order_shop_id: this.storeId })
                .then(res => {
                    if (res.code === 1) {
                        t.list = res.data[0].goods;
                        console.log(t.list);
                    }
                })
                .catch(err => {});
        },
        goto(item, route) {
            this.$router.push("/member/refund/" + route + "/" + item.no);
        }
    }
};
</script>

<style lang="less" scoped>
.button-group {
    text-align: right;
    button {
        & + button {
            margin-left: 0.5rem;
        }
    }
}

.prod-list {
    .review-item {
        padding: 0;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 10px 20px 8px rgba(119, 83, 83, 0.07);
        border-radius: 8px;
        & + .review-item {
            margin-top: 0.875rem;
        }
    }
}
</style>
