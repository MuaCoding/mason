<template>
    <div>
        <van-panel
            class="panel-item"
            :title="item.shop.name"
            :icon="item.shop.logo"
            v-for="item in list"
            :key="item.id"
            :status="states[item.status]"
            :class="{ 'panel-success': item.status == 30, 'panel-gray': item.status == 40 }"
            v-show="item.goods.length != 0"
        >
            <div class="prod-item" @click="goto({ no: item.id }, 'detail')" v-for="prod in item.goods" :key="prod.id">
                <van-image radius="6px" width="4.25rem" lazy-load height="4.25rem" :src="prod.goods_master_image" />
                <div class="prod-content">
                    <p>订单单号：{{ item.shop_no }}</p>
                    <p>名称：{{ prod.goods_name }}</p>
                    <div class="desc-bar text-secondary">
                        <span
                            >金额：<span class="text-primary">¥ {{ prod.goods_money | NumberFormat(prod.goods_money) }}</span></span
                        ><span class="text-right">x {{ prod.buy_num }}</span>
                    </div>
                    <p>商品可使用的购物分：{{ prod.express_money }}</p>
                    <p>物流运费：{{ prod.express_money }}</p>
                </div>
            </div>
            <!-- 底部按钮 -->
            <button-group slot="footer" :order="item" v-bind="$attrs" v-on="$listeners"></button-group>
        </van-panel>
    </div>
</template>

<script>
import ButtonGroup from "./ButtonGroup";
export default {
    components: {
        ButtonGroup,
    },
    props: {
        url: {
            type: String,
            default: "/detail",
        },
        active: {
            type: Number,
            default: 0,
        },
        list: {
            type: Array,
            default: [],
        },
        immediate: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            orders: { list: [], finished: false, loading: false, page: 0 },
            loading: false,
            finished: false,
            count: 0,
            size: 20,
            page: 1,
            isRequest: false,
            fallFinished: false,
            refsHeight: 0,
            clientW: 0,
            totalPage: 0,
            interVal: "",
            states: {
                0: "待支付",
                10: "待发货",
                20: "待收货",
                30: "已完成",
                40: "已取消",
            },
        };
    },
    methods: {
        onLoad() {},
        queryOrder(isConcat) {},
        goto(item, route) {
            this.$router.push("/member/order/" + route + "/" + item.no);
        },
    },
    created() {
        // this.clientW = document.body.clientWidth;
    },
    computed: {},
    watch: {},
    mounted() {
        // this.refsHeight = document.querySelector('.goods-list-4').clientHeight
    },
    deactivated() {
        // clearInterval(this.interVal)
    },
    updated() {
        // this.loading = false
    },
};
</script>

<style lang="less" scoped></style>
