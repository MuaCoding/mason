<template>
    <div>
        <van-panel
            :title="item.status == 80 || item.status == 90 ? states[item.status] : '买家申请退款'"
            class="panel-item"
            v-for="item in list"
            :key="item.id"
            :status="item.status_name"
            :class="{
                'panel-primary': item.status == 20,
                'panel-info': item.status == 0 || item.status == 30 || item.status == 40,
                'panel-success': item.status == 10 || item.status == 60 || item.status == 80,
                'panel-gray': item.status == 90
            }"
        >
            <div class="prod-item" @click="goto({ id: item.id }, 'detail')">
                <van-image lazy-load radius="6px" width="4.25rem" height="4.25rem" :src="item.goods_master_image" />
                <div class="prod-content">
                    <p>退款单号：{{ item.refund_no }}</p>
                    <p>名称：{{ item.goods_name }}</p>
                    <div class="desc-bar text-secondary">
                        <span
                            >金额：<span class="text-primary">¥ {{ item.price | NumberFormat(item.price) }}</span></span
                        ><span class="text-right">x {{ item.refund_num }}</span>
                    </div>
                </div>
            </div>
            <!-- 底部按钮 -->
            <van-cell slot="footer" :title="item.create_time" value="查看详情" is-link :to="'/member/refund/detail/' + item.id"> </van-cell>
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
            default: "/detail"
        },
        active: {
            type: Number,
            default: 0
        },
        list: {
            type: Array,
            default: []
        },
        immediate: {
            type: Boolean,
            default: true
        }
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
                80: "退款完成",
                90: "退款已取消",
                100: "退款中"
            }
        };
    },
    created() {
        // this.fetchData(true);
    },
    methods: {
        onLoad() {},
        goto(item, route) {
            this.$router.push("/member/refund/" + route + "/" + item.id);
        }
    },

    watch: {},
    mounted() {
        // this.refsHeight = document.querySelector('.goods-list-4').clientHeight
    },
    deactivated() {
        // clearInterval(this.interVal)
    },
    updated() {
        // this.loading = false
    }
};
</script>

<style lang="less" scoped></style>
