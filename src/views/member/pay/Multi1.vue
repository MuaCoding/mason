<template>
    <div>
        <div :style="{ height: heights + 'px' }" v-if="iosShow" class="headIos"></div>
        <header-bar title="订单支付" :isIos="iosShow" :back="-1" :heights="heights"></header-bar>

        <div class="py-5 text-center address text-danger fs-14" :data-top="height">
            ￥<span class="fs-24">{{ data.prices[0] || "0" }}</span
            >.{{ data.prices[1] || "00" }}
        </div>

        <van-cell-group>
            <van-cell @click="changePayType(index)" center v-for="(item, index) in payments.paytype" :key="index">
                <img width="50" height="50" :src="item.icon" class="mr-2" slot="icon" alt="" srcset="" />
                <div slot="title">
                    {{ item.name }}<span class="ml-2 text-danger fs-12">{{ item.balance }}</span>
                </div>
                <div slot="label">限额：{{ item.min_amount }} - {{ item.max_amount }}</div>
                <div slot="right-icon">
                    <van-icon size="24" :color="checked_index === index ? checked : un_checked" name="success" />
                </div>
            </van-cell>
        </van-cell-group>

        <div class="mt-5 p-3">
            <van-button
                @click="onPay"
                color="linear-gradient(to right, #FB8F60, #FB5870)"
                :disabled="payBtnDisabled"
                :loading="payBtnLoading"
                type="primary"
                size="large"
                >确认支付￥{{ data.need_pay_money }}</van-button
            >
        </div>

        <van-popup
            v-model="payFormShow"
            position="bottom"
            closeable
            close-icon="arrow-left"
            :style="{ 'min-height': '20%' }"
            close-icon-position="top-left"
            :close-on-click-overlay="false"
            round
        >
            <div>
                <div class="text-center" style="padding: 14px 0">输入安全密码</div>
                <div v-if="checked_index == 0" class="p-2 text-center">
                    ￥{{ data.need_pay_money }} = <strong>{{ cny2usd }} USDT</strong>
                </div>
                <div style="margin-bottom: 230px">
                    <van-password-input :value="form.password" :focused="showKeyboard" @focus="showKeyboard = true" />
                    <div v-if="user.info.trade_password ? false : true" class="px-3 mt-1 text-danger fs-12">
                        请在MASON APP用户中心-安全设置-设置安全密码中设置安全密码
                    </div>
                </div>

                <van-number-keyboard :show="true" @input="onInput" @delete="onDelete" />
            </div>
        </van-popup>
    </div>
</template>

<script>
import HeaderBar from "../../../components/common/HeaderBar";
import wx from "weixin-jsapi";
import { Cell, CellGroup, Button, Popup, Field, Icon, PasswordInput, NumberKeyboard, Toast } from "vant";
export default {
    components: {
        HeaderBar,
        Cell,
        CellGroup,
        Button,
        Popup,
        Field,
        Icon,
        PasswordInput,
        NumberKeyboard,
        Toast,
    },
    data() {
        return {
            iosShow: false,
            heights: 0,
            height: 67,
            payBtnDisabled: true,
            payBtnLoading: true,
            payFormShow: false,
            id: 0,
            data: {
                shops: [],
                prices: [],
            },
            shop_num: 0,
            un_checked: "#f0f0f0",
            checked: "#07c160",
            checked_index: 0,
            form: {
                password: "",
            },
            showKeyboard: true,
            payments: [],
            user: {
                info: {},
            },
            paying: false,
            cny2usd: 0.0,
            buy_score: 0.0,
        };
    },
    methods: {
        onPay() {
            if (this.payments.paytype[this.checked_index].id == 3 || this.payments.paytype[this.checked_index].id == 2) {
                this.onSubmitPay(true);
            } else {
                this.payFormShow = true;
            }
            return false;
            this.payBtnDisabled = true;
            this.payBtnLoading = true;
            this.$apps.http
                .get("/order/pay_type", {})
                .then((res) => {
                    if (res.code === 1) {
                        this.payments = res.data;
                        this.payFormShow = true;
                    } else {
                        Toast.fail(res.msg);
                    }
                    this.payBtnDisabled = false;
                    this.payBtnLoading = false;
                })
                .catch((err) => {
                    this.payBtnDisabled = false;
                    this.payBtnLoading = false;
                });
        },
        onSubmitPay(isAliPay) {
            if (!isAliPay) {
                Toast.loading({
                    message: "支付中...",
                    forbidClick: true,
                    loadingType: "spinner",
                    duration: 0,
                });
            }

            this.payBtnDisabled = true;
            this.payBtnLoading = true;
            this.$apps.http
                .post("/order/pay_all", {
                    order_id: this.data.id,
                    pay_password: this.form.password,
                    paytype: this.payments.paytype[this.checked_index].id,
                    is_wechat: this.isWechat() ? sessionStorage.getItem("wx_openid") : 0,
                })
                .then((res) => {
                    this.paying = false;
                    Toast.clear();
                    if (res.code === 1) {
                        if (isAliPay) {
                            switch (this.payments.paytype[this.checked_index].id) {
                                case 2: //  微信
                                    // window.location.href = res.data.form
                                    if (this.isWechat()) {
                                        try {
                                            this.weChatPay(res.data);
                                        } catch (err) {
                                            console.error("err", err);
                                        }
                                    } else {
                                        let div1 = document.createElement("div");
                                        div1.innerHTML = '<a style="display: none" href="' + res.data.form + '">' + res.data.form + "</a>";
                                        let scirpt = document.createElement("script");
                                        scirpt.innerHTML = 'location.href="' + res.data.form + '"';
                                        document.body.appendChild(div1);
                                        document.body.appendChild(scirpt);
                                    }
                                    break;
                                case 3: //  支付宝
                                    let div = document.createElement("div");
                                    /* 此处form就是后台返回接收到的数据 */
                                    div.innerHTML = res.data.form;
                                    document.body.appendChild(div);
                                    document.forms[0].submit();
                                    break;
                            }
                        } else {
                            Toast.success(res.msg);
                            let _ = this;
                            setTimeout(function() {
                                _.$router.replace("/pay/success/" + _.data.id);
                            }, 2000);
                        }
                    } else {
                        Toast.fail(res.msg);
                        this.payBtnDisabled = false;
                        this.payBtnLoading = false;
                        this.form.password = "";
                    }
                })
                .catch((err) => {
                    this.payBtnDisabled = false;
                    this.payBtnLoading = false;
                });
        },
        changePayType(index) {
            this.checked_index = index;
        },
        onInput(key) {
            this.form.password = (this.form.password + key).slice(0, 6);
            if (this.form.password.length == 6) {
                this.paying = true;
                this.onSubmitPay(false);
            }
        },
        onDelete() {
            if (this.paying) return false;
            this.form.password = this.form.password.slice(0, this.form.password.length - 1);
        },
        isWechat() {
            return /micromessenger/.test(navigator.userAgent.toLowerCase());
        },
        weChatPay(data) {
            let _ = this;
            wx.config({
                debug: data.debug,
                appId: data.appId,
                timestamp: data.timestamp,
                nonceStr: data.nonceStr,
                signature: data.signature,
                jsApiList: ["chooseWXPay"],
            });
            wx.ready(function() {
                wx.checkJsApi({
                    jsApiList: ["chooseWXPay"],
                    success: (res) => {
                        /*
                            appId:data.appId,
                            timestamp: data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                            nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 
                            package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                            signType: data.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                            paySign: data.paySign, // 支付签名
                            */

                        let pay = data.pay;
                        wx.chooseWXPay({
                            appId: pay.appId,
                            nonceStr: pay.nonceStr,
                            package: pay.package,
                            signType: pay.signType,
                            paySign: pay.paySign,
                            timestamp: pay.timeStamp,
                            success: (res) => {
                                // if (res.code == 1) {
                                _.$router.replace("/payResult/" + _.data.order_no);
                                // } else {
                                //     Toast(res.msg)
                                // }
                            },
                            fail: (err) => {
                                console.log("wxpay err", err);
                                _.payBtnDisabled = false;
                                _.payBtnLoading = false;
                                Toast("支付失败");
                            },
                            cancel: (cancel) => {
                                _.payBtnDisabled = false;
                                _.payBtnLoading = false;
                                Toast("支付取消");
                            },
                        });
                    },
                    fail: (err) => {
                        console.error("wxpay", err);
                        _.payBtnDisabled = false;
                        _.payBtnLoading = false;
                    },
                });
            });
        },
    },
    created() {
        this.id = this.$route.params.no;
        this.id = this.$route.query.id;
        if (this.id) {
            this.$apps.http
                .get("/order/info", {
                    order_id: this.id,
                })
                .then((result) => {
                    if (result.code === 1) {
                        this.data = result.data;
                        this.shop_num = result.data.shops.length;

                        if (this.data.use_buy_score > 0) {
                            this.$apps.http
                                .get("/user/account", {})
                                .then((acc) => {
                                    if (acc.code === 1) {
                                        acc.data.accounts.filter((s) => {
                                            if (s.symbol == "shp") {
                                                this.buy_score = s.balance;
                                                this.data.need_pay_money =
                                                    parseFloat(s.balance) > parseFloat(this.data.use_buy_score)
                                                        ? (parseFloat(this.data.need_pay_money) - parseFloat(this.data.use_buy_score)).toFixed(2)
                                                        : (parseFloat(this.data.need_pay_money) - parseFloat(s.balance)).toFixed(2);
                                                let tmp = this.data.need_pay_money.split(".");
                                                this.$set(this.data, "prices", tmp);
                                            }
                                        });
                                    }
                                })
                                .catch((err) => {});
                        } else {
                            let tmp = this.data.need_pay_money.split(".");
                            this.$set(this.data, "prices", tmp);
                        }

                        this.$apps.http
                            .get("/order/pay_type", {})
                            .then((res) => {
                                if (res.code === 1) {
                                    let types = res.data;
                                    if (this.isWechat()) {
                                        types.paytype = types.paytype.filter(function(val) {
                                            return val.id != 3;
                                        });
                                    }

                                    this.payments = types;
                                    this.cny2usd = parseFloat(this.data.need_pay_money / res.data.usdt2cny).toFixed(2);
                                    // this.payFormShow = true
                                } else {
                                    Toast.fail(res.msg);
                                }
                                this.payBtnDisabled = false;
                                this.payBtnLoading = false;
                            })
                            .catch((err) => {
                                // this.payBtnDisabled = false
                                // this.payBtnLoading = false
                            });
                    }
                })
                .catch((err) => {});
        }
        this.$apps.http
            .post("/user/info")
            .then((res) => {
                if (res.code === 1) {
                    this.user = res.data;
                }
            })
            .catch((err) => {});
    },
    mounted() {
        this.$nextTick(() => {
            if (!this.$apps.isAndroid()) {
                let head = document.querySelector(".van-nav-bar--fixed");
                let content = document.querySelector(".text-center");
                this.heights = window.ios != undefined ? window.ios.statusHeight() : 20;
                if (this.heights > 40) {
                    this.heights = 0;
                    this.iosShow = false;
                    content.style.marginTop = 47 + "px";
                    return;
                } else {
                    head.style.top = Number(this.heights) + "px";
                    this.height = content.style.marginTop = Number(this.heights) + 47;
                    content.style.marginTop = Number(this.heights) + 47 + "px";
                    this.iosShow = true;
                }
            } else {
                this.heights = 0;
                this.iosShow = false;
            }
        });
    },
    watch: {
        height(val) {
            return val;
        },
    },
};
</script>

<style lang="less" scoped></style>
