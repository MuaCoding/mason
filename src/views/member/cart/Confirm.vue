<template>
    <div style="background: #F7F7F7; min-height: 100%">
        <div :style="{ height: heights + 'px' }" v-if="iosShow" class="headIos"></div>
        <header-bar title="确认订单" :border="false" :isIos="iosShow" :back="-1" :heights="heights"></header-bar>
        <div class="address" :data-top="height">
            <van-cell-group>
                <van-cell to="/member/address?choose=1" icon="location-o" :title="address.title || '添加收货地址'" is-link>
                    <div slot="label">{{ address.detail || "" }}{{ address.info || "" }}</div>
                </van-cell>
            </van-cell-group>
        </div>

        <div class="mt-2" v-if="need_use_real_message == 1">
            <van-field v-model="xm" name="真实姓名" label="真实姓名" placeholder="请输入真实姓名" />
            <van-field v-model="id_number" name="身份证号码" label="身份证号码" placeholder="请输入身份证号码" />
        </div>
        <div class="px-3 fs-12 text-danger mt-2" v-if="need_use_real_message == 1">
            <div :class="show_tips ? '' : 'van-ellipsis'">
                1、根据中华人民共和国海关总署第147号令规定：个人物品类进出境快件报关时，应海关要求需提供收件人的真实身份证姓名与号码，身份证必须对应真实收件人。一旦提交通过将进入海关系统，快速清关。
            </div>
            <div :class="show_tips ? '' : 'd-none'">
                2、购买境外直邮产品如无法提供真实身份证姓名与号码，将无法清关，造成订单滞留。
            </div>
            <div @click="show_tips = show_tips ? false : true" class="text-right text-66 mt-2">
                {{ !show_tips ? "展开" : "收起" }}
            </div>
        </div>
        <div class="cart-confirm-container" style="margin-bottom: 60px">
            <div class="shop-list van-hairline--bottom" v-for="(item, index) in carts" :key="index">
                <van-cell-group class="mt-2">
                    <van-cell :to="'/shop/' + item[0].shop.id" :title="item[0].shop.name" is-link></van-cell>
                </van-cell-group>
                <div>
                    <van-card
                        class="van-hairline--bottom"
                        v-for="(good, goods) in item"
                        :key="goods"
                        :desc="good.sku.name"
                        :num="good.num"
                        :thumb="good.goods.master_image"
                    >
                        <!-- <div slot="num">{{good.num}}</div> -->
                        <div slot="title">
                            <!-- <img
                                v-if="item[0].shop.is_self == 1"
                                src="../../../assets/ziying.png"
                                height="14"
                                class="mr-1 align-middle"
                                alt=""
                                srcset=""
                            /> -->
                            <span class="align-middle">{{ good.goods.name }}</span>
                        </div>
                        <span slot="price" class="strong"
                            >￥{{ good.sku.activity_is == 1 && good.sku.activity_nums > 0 ? good.sku.activity_price : good.sku.price }}</span
                        >
                        <div slot="bottom" class="text-danger fs-10">
                            <span class="align-middle mr-2" style="padding: 2px;border: solid 1px #dc3545;border-radius: 3px;">
                                <!-- 赠 {{good.goods.award_multiple|formatAward(good.num, good.sku.price)}} -->
                                赠 {{ good.reward_total_score }}
                                <img height="12" class="align-middle" src="/img/envelope.png" />
                            </span>
                            <span
                                v-if="good.sku.buy_score > 0"
                                class="align-middle"
                                style="padding: 2px;border: solid 1px #dc3545;border-radius: 3px;"
                                >购物分抵￥{{ good.sku.buy_score }}</span
                            >
                        </div>
                    </van-card>
                </div>
                <!-- <div v-if="index === 0">
                    <van-field v-model="remark['shop_' + item[0].shop.id]" label="备注信息" show-word-limit
                    type="textarea" placeholder="请输入备注信息"></van-field>
                </div> -->
            </div>
            <van-cell-group class="mt-2">
                <van-cell center>
                    <div slot="title">
                        <!-- 使用{{total_score|buyScore}}购物分抵扣￥{{total_score|buyScore}} -->
                        <!-- 使用购物积分 -->
                        <span class="align-middle fs-12">可用购物分: {{ buy_score | buyScore }}</span>
                        <van-icon @click="showBuyScoreTips" class="align-middle text-99" name="warning-o" />
                    </div>
                    <!-- <div slot="label">
                        
                    </div> -->
                    <van-switch
                        size="1.2em"
                        class="use_buy_score align-middle"
                        v-model="use_score"
                        :inactive-value="false"
                        @change="switchBuyScore"
                        active-color="#FB5870"
                    ></van-switch>
                </van-cell>
                <!-- <van-switch-cell v-model="buy_score" :inactive-value="0" active-color="#FB5870">
                    
                </van-switch-cell> -->
            </van-cell-group>
            <div class="px-3 fs-10 text-danger mt-2">购物分抵扣部分不参与红包赠送</div>
            <van-cell-group class="mt-2 fs-12">
                <van-cell style="padding: 10px 16px 0 16px" :border="false" class="fs-12">
                    <span class="fs-12" slot="title">商品金额</span>
                    <div class="text-33 strong fs-12">￥{{ goods_amount | formatPrice }}</div>
                </van-cell>
                <van-cell style="padding: 0 16px" v-show="use_score" :border="false" class="fs-12">
                    <span class="fs-12" slot="title">购物分抵扣</span>
                    <div class="text-danger">-￥{{ total_score | formatScorePrice(buy_score, total_score, goods_amount) }}</div>
                </van-cell>
                <van-cell style="padding: 0 16px 10px 16px" :border="false" class="fs-12">
                    <span class="fs-12" slot="title">运费</span>
                    <div class="text-danger">+￥{{ express_amount | formatPrice }}</div>
                </van-cell>
            </van-cell-group>
            <common-no-data :show="carts.length === 0"></common-no-data>
        </div>
        <van-submit-bar :price="amount * 100" button-text="提交订单" @submit="onSubmit" :disabled="isDisabled" :loading="isLoading">
            <!-- <div class="pl-2"><span class="mr-1">合计:</span><span class="fs-10 text-danger">￥</span><span class="fs-14 text-danger strong">{{amount}}</span></div> -->
        </van-submit-bar>

        <van-dialog v-model="showDialog" :show-confirm-button="false">
            <div slot="title" class="strong text-33">购物分使用规则</div>
            <div class="px-3 fs-14 text-66">
                <p>1、标注购物分抵扣的商品可以使用；</p>
                <p>2、购物分不够抵扣的部分由现金支付。</p>
                <p class="px-3 py-3">
                    <van-button @click="showDialog = false" type="primary" size="large" color="linear-gradient(to right, #FB8F60, #FB5870)"
                        >我知道了</van-button
                    >
                </p>
            </div>
        </van-dialog>
    </div>
</template>

<script>
import HeaderBar from "../../../components/common/HeaderBar";
import CommonNoData from "../../../components/NoData";
import { Cell, CellGroup, Button, Card, SubmitBar, Checkbox, Field, Toast, Icon, Dialog, Stepper } from "vant";
export default {
    components: {
        HeaderBar,
        Cell,
        CellGroup,
        Button,
        Card,
        SubmitBar,
        Checkbox,
        Field,
        Toast,
        CommonNoData,
        Icon,
        Dialog,
        Stepper,
    },
    data() {
        return {
            iosShow: false,
            heights: 0,
            height: 0,
            ids: "",
            carts: [],
            amount: 0.0,
            remark: [],
            address: {
                province: {},
                city: {},
                distrcit: {},
            },
            isLoading: false,
            isDisabled: false,
            buy_score: 0,
            total_score: 0,
            use_score: false,
            goods_amount: 0.0,
            express_amount: 0.0,
            sku_ids: "",
            nums: "",
            showDialog: false,
            xm: "",
            id_number: "",
            show_tips: false,
            need_use_real_message: 0,
        };
    },
    methods: {
        showBuyScoreTips() {
            this.showDialog = true;
        },
        onSubmit() {
            if (this.need_use_real_message == 1) {
                if (!this.xm) {
                    Toast("姓名不能为空");
                    return false;
                }
                if (!this.id_number) {
                    Toast("身份证号码不能为空");
                    return false;
                }
            }
            this.isLoading = true;
            this.isDisabled = true;
            this.$apps.http
                .post("/order/create", {
                    cart_ids: this.ids,
                    address_id: this.address.id,
                    open_pay_buy_score: this.use_score ? 1 : 0,
                    xm: this.xm,
                    id_number: this.id_number,
                })
                .then((res) => {
                    if (res.code === 1) {
                        let _ = this;
                        Toast.success(res.msg);
                        setTimeout(function() {
                            _.$router.replace("/member/pay/multi1?id=" + res.data.id);
                            // _.$router.push('/pay/multi/' + res.no)
                        }, 2000);
                    } else {
                        Toast.fail(res.msg);
                        this.isLoading = false;
                        this.isDisabled = false;
                    }
                })
                .catch((err) => {
                    this.isLoading = false;
                    this.isDisabled = false;
                });
        },
        getAddr(addr_id) {
            if (addr_id) {
                this.$apps.http
                    .get("/userAddress/detail", {
                        id: addr_id,
                    })
                    .then((res) => {
                        if (res.code === 1) {
                            this.address = res.data;
                            try {
                                this.address.detail = res.data.province.name + res.data.city.name + res.data.district.name;
                                this.address.title = res.data.name + "," + res.data.mobile;
                                this.cupExpressAmount(res.data.city_id);
                            } catch (err) {}
                        }
                        this.$apps.session.set("addr_id", null);
                    })
                    .catch((err) => {});
            } else {
                this.$apps.http
                    .get("/userAddress/default", {})
                    .then((res) => {
                        if (res.code === 1) {
                            this.address = res.data;
                            try {
                                this.address.detail = res.data.province.name + res.data.city.name + res.data.district.name;
                                this.address.title = res.data.name + "," + res.data.mobile;
                                this.cupExpressAmount(res.data.city_id);
                            } catch (err) {}
                        }
                    })
                    .catch((err) => {});
            }
        },
        cupExpressAmount(city_id) {
            this.$apps.http
                .post("/GoodsExpressTpl/count", {
                    city_id: city_id,
                    sku_ids: this.sku_ids.substr(0, this.sku_ids.length - 1),
                    nums: this.nums.substr(0, this.nums.length - 1),
                })
                .then((res) => {
                    if (res.code === 1) {
                        this.express_amount = res.data.count;
                        this.amount += parseFloat(res.data.count);
                    }
                })
                .catch((err) => {});
        },
        switchBuyScore(val) {
            if (val && this.buy_score <= 0) {
                Toast("购物分不足");
                this.use_score = false;
                return false;
            }

            if (val && this.total_score <= 0) {
                Toast("当前订单不可使用购物分");
                this.use_score = false;
                return false;
            }

            let amount = parseFloat(this.buy_score) < parseFloat(this.total_score) ? parseFloat(this.buy_score) : parseFloat(this.total_score);
            if (val) {
                this.amount = parseFloat(this.amount - amount).toFixed(2);
            } else {
                this.amount = parseFloat(parseFloat(this.amount) + parseFloat(amount)).toFixed(2);
            }
        },
        formatActivity(d) {
            if (d.sku.activity_is == 1 && d.sku.activity_nums > 0) {
                //  如果够数量
                if (d.sku.activity_nums >= d.num) {
                    // if (d.sku.activity_buy_max == 0 || d.sku.activity_buy_max >= d.num) {  //  如果不限购
                    d.total_price = parseFloat(d.num * parseFloat(d.sku.activity_price)).toFixed(2);
                    // } else {    //  如果限购，那么我们就需要紧
                    //     let z_num = d.num - d.sku.activity_buy_max
                    //     let z_total_price = parseFloat(d.sku.activity_buy_max * parseFloat(d.sku.activity_price))
                    //     let a_total_price = parseFloat(z_num * parseFloat(d.sku.price))
                    //     d.total_price = parseFloat(z_total_price + a_total_price).toFixed(2)
                    // }
                } else {
                    //  活动数量不够的时候
                    // if (d.sku.activity_buy_max == 0) {  //  不限购
                    let z_num = d.num - d.sku.activity_nums;
                    let z_total_price = parseFloat(d.sku.activity_nums * parseFloat(d.sku.activity_price));
                    let a_total_price = parseFloat(z_num * parseFloat(d.sku.price));
                    d.total_price = parseFloat(z_total_price + a_total_price).toFixed(2);
                    // } else {
                    //     //  如果剩余数量大于限购数量，那么取限购数量，否则取剩余数量
                    //     let num = d.sku.activity_nums > d.sku.activity_buy_max ? d.sku.activity_buy_max : d.sku.activity_nums
                    //     let z_num = d.num - num
                    //     //  非活动价格
                    //     let z_total_price = parseFloat(num * parseFloat(d.sku.activity_price))
                    //     //  活动价格
                    //     let a_total_price = parseFloat(z_num * parseFloat(d.sku.price))
                    //     d.total_price = parseFloat(z_total_price + a_total_price).toFixed(2)
                    // }
                }
            } else {
                d.total_price = parseFloat(d.num * d.sku.price).toFixed(2);
            }
            d.reward_total_score = parseFloat(parseFloat(d.total_price) * parseFloat(d.goods.award_multiple)).toFixed(2);
            d.total_score = parseFloat(parseFloat(d.sku.buy_score) * parseFloat(d.goods.award_multiple) * d.num).toFixed(2);
            return d;
        },
    },
    created() {
        
        this.ids = this.$route.query.ids;
        if (this.ids) {
            this.$apps.http
                .get("/goodsCart", {
                    ids: this.ids,
                })
                .then((result) => {
                    if (result.code === 1) {
                        this.carts = result.data;
                        this.need_use_real_message = result.need_use_real_message;
                        let data = result.data;
                        if (data.length === 0) {
                            this.isDisabled = true;
                        } else {
                            for (let i in data) {
                                for (let j in data[i]) {
                                    data[i][j] = this.formatActivity(data[i][j]);
                                    // this.amount += parseFloat((data[i][j].sku.price * data[i][j].num).toFixed(2))
                                    this.amount += parseFloat(data[i][j].total_price);
                                    // this.goods_amount += parseFloat((data[i][j].sku.price * data[i][j].num).toFixed(2))
                                    this.goods_amount += parseFloat(data[i][j].total_price);
                                    // this.total_score += parseFloat(data[i][j].sku.buy_score * data[i][j].num)
                                    this.total_score += parseFloat(data[i][j].total_score);
                                    this.sku_ids += data[i][j].sku.id + ",";
                                    this.nums += data[i][j].num + ",";
                                }
                                this.remark["shop_" + data[i][0].shop.id] = "";
                            }
                            let addr_id = parseInt(this.$apps.session.get("addr_id"));
                            this.getAddr(addr_id);
                        }
                    }
                })
                .catch((err) => {
                    console.error(err);
                });

            this.$apps.http
                .get("/user/account", {})
                .then((res) => {
                    if (res.code === 1) {
                        res.data.accounts.filter((s) => {
                            if (s.symbol == "shp") {
                                this.buy_score = s.balance;
                            }
                        });
                    }
                })
                .catch((err) => {});
        }
    },
    mounted() {
        this.$nextTick(() => {
            let content = document.querySelector(".address");
            if (!this.$apps.isAndroid()) {
                let head = document.querySelector(".van-nav-bar--fixed");

                this.heights = window.ios != undefined ? window.ios.statusHeight() : 20;
                if (this.heights > 40) {
                    this.iosShow = false;
                    this.heights = 0;
                    content.style.paddingTop = 47 + "px";
                    this.height = 47;
                    return;
                } else {
                    head.style.top = Number(this.heights) + "px";
                    this.height = Number(this.heights) + 47;
                    // content.style.paddingTop = Number(this.heights) + 47 + "px";
                    this.iosShow = true;
                }
            } else {
                this.heights = 0;
                this.height = 47;
                content.style.marginTop = 47 + "px";
                this.iosShow = false;
            }
        });
    },
    filters: {
        formatAward(val, num, price) {
            return parseFloat(val * num * price, 2).toFixed(2);
        },
        buyScore(val) {
            return parseFloat(val).toFixed(2);
        },
        formatPrice(val) {
            return parseFloat(val).toFixed(2);
        },
        formatScorePrice(val, buy_score, total_score, goods_amount) {
            let score1 = parseFloat(buy_score) < parseFloat(total_score) ? parseFloat(buy_score).toFixed(2) : parseFloat(val).toFixed(2);
            return parseFloat(goods_amount) > score1 ? score1 : parseFloat(goods_amount).toFixed(2);
        },
    },
    watch: {
        height(val) {
            return val;
        },
    },
};
</script>

<style lang="less">
// .use_buy_score .van-switch__node {
//     width: 0.6em !important;
//     height: 0.6em !important;
// }
// .van-switch, .van-switch__node {
//     height: 0.60em !important;
// }
// .van-switch {
//     width: 1.6em;
// }
</style>
