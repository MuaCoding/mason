<template>
    <div>
        <van-panel
            title="买家申请售后"
            class="panel-item"
            v-for="item in list"
            :key="item.id"
            :status="item.status_name"
            :class="{
                'panel-primary': item.status == 20,
                'panel-info': item.status == 0 || item.status == 30 || item.status == 40 || item.status == 60,
                'panel-success': item.status == 10 || item.status == 70,
                'panel-gray': item.status == 80 || item.status == 90,
            }"
        >
            <div class="prod-item" @click="goto({ id: item.id }, 'detail')">
                <van-image lazy-load radius="6px" width="4.25rem" height="4.25rem" :src="item.goods_master_image" />
                <div class="prod-content">
                    <p>售后单号：{{ item.service_no }}</p>
                    <p>名称：{{ item.goods_name }}</p>
                    <div class="desc-bar text-secondary">
                        <span
                            >金额：<span class="text-primary">¥ {{ item.price | NumberFormat(item.price) }}</span></span
                        ><span class="text-right">x {{ item.buy_num }}</span>
                    </div>
                </div>
            </div>
            <!-- 底部按钮 -->
            <van-cell slot="footer" :title="item.update_time" value="查看详情" is-link :to="'/member/service/detail/' + item.id"> </van-cell>
        </van-panel>
    </div>
</template>

<script>
// import ButtonGroup from "./ButtonGroup";
export default {
    components: {},
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
            states: {
                0: "待卖家确认",
                10: "卖家确认退款",
                20: "卖家拒绝退款",
                30: "买家已回寄商品",
                40: "卖家确认收货",
                60: "卖家同意退货退款",
                70: "卖家拒绝退货退款",
                80: "退款已完成",
                90: "退款已取消",
            },
        };
    },
    created() {},
    mounted() {
        // this.refsHeight = document.querySelector('.goods-list-4').clientHeight
    },
    methods: {
        onLoad() {
            // this.queryOrder(true);
        },
        goto(item, route) {
            this.$router.push("/member/service/" + route + "/" + item.id);
        },
    },

    watch: {},
    deactivated() {},
    updated() {},
};
</script>

<style lang="less" scoped></style>
