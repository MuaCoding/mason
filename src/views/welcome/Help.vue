<template>
    <div>
        <header-bar title="帮助中心" :border="false" :back="-1"></header-bar>
        <van-tabs v-model="active">
            <van-tab title="会员">
                <common-no-data :show="true"></common-no-data>
                <!--
                <van-list
                v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad"
                >
                
                    <div>
                        <van-cell-group :border="false">
                        <van-cell title="RO23465432165" is-link :border="false" value="退款状态"></van-cell>
                        </van-cell-group>
                        <div>
                            <van-card
                                class="van-hairline--top"
                                @click="goto({no: 1}, 'detail')"
                                num="2"
                                price="2.00"
                                desc="描述信息"  
                                title="商品标题"
                                thumb="https://img.yzcdn.cn/vant/t-thirt.jpg"
                                >
                                <div slot="tags">
                                    <van-tag plain type="danger">标签</van-tag>
                                    <van-tag plain type="danger">标签</van-tag>
                                </div>
                                <div slot="footer">
                                    <van-button size="mini">按钮</van-button>
                                    <van-button size="mini">按钮</van-button>
                                </div>
                            </van-card>
                        </div>
                    </div>
                    <div class="p-1 bg-f6"></div>
                    <div>
                        <van-cell-group :border="false">
                        <van-cell title="RO23465432165" is-link :border="false" value="退款状态"></van-cell>
                        </van-cell-group>
                        <div>
                            <van-card
                                class="van-hairline--top"
                                @click="goto({no: 1}, 'detail')"
                                num="2"
                                price="2.00"
                                desc="描述信息"  
                                title="商品标题"
                                thumb="https://img.yzcdn.cn/vant/t-thirt.jpg"
                                >
                                <div slot="tags">
                                    <van-tag plain type="danger">标签</van-tag>
                                    <van-tag plain type="danger">标签</van-tag>
                                </div>
                                <div slot="footer">
                                    <van-button size="mini">按钮</van-button>
                                    <van-button size="mini">按钮</van-button>
                                </div>
                            </van-card>
                        </div>
                    </div>
                </van-list>-->
            </van-tab>
            <van-tab title="商家"><common-no-data :show="true"></common-no-data></van-tab>
            <van-tab title="付款"><common-no-data :show="true"></common-no-data></van-tab>
            <van-tab title="物流"><common-no-data :show="true"></common-no-data></van-tab>
        </van-tabs>
    </div>
</template>

<script>
    import HeaderBar from "../../components/common/HeaderBar";
    import CommonNoData from '../../components/NoData'
    import { Tab, Tabs, List, Cell, CellGroup, Card } from 'vant'
    export default {
        components: {
            HeaderBar, Tab, Tabs, List, Cell, CellGroup, Card, CommonNoData
        },
        data() {
            return {
                active: 0,
                loading: false,
                finished: false
            }
        },
        methods: {
            onLoad() {
                // this.loading = false
            },
            goto(item, route) {
                this.$router.push('/member/refund/'+route+'/' + item.no)
            }
        },
        created () {
            let active = this.$route.params.state;
            this.active = active ? parseInt(active) : ''
        },
    }
</script>

<style lang="less" scoped>

</style>