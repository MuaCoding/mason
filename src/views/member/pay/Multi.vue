<template>
    <div>
        <header-bar title="合并付款" :border="false" :back="-1"></header-bar>
        <van-cell-group>
            <van-cell title="订单编号" :value="data.order_no||'...'"></van-cell>
            <van-cell title="收款方" :value="(data.shops[0]||'...') +'等 '+ (shop_num||0) + ' 个商家'"></van-cell>
            <van-cell title="认购商品" :value="'共 '+(data.goods_style||0)+' 款 '+(data.goods_nums||0)+' 件商品'">
            </van-cell>
            <van-cell title="付款金额">
                <span class="text-danger fs-14">{{ data.need_pay_money||'0.00' }}</span>
            </van-cell>
        </van-cell-group>
        <div class="mt-5 p-3">
            <van-button @click="onPay" :disabled="payBtnDisabled" :loading="payBtnLoading" type="primary" size="large">立即支付</van-button>
        </div>
        <van-popup
            v-model="payFormShow"
            position="bottom"
            closeable
            :style="{ 'min-height': '20%' }"
            >
            <div class="text-center text-66 fs-14 p-3">订单支付</div>
            <van-cell-group class="">
                <van-cell @click="changePayType(index)" v-for="(item, index) in payments.paytype" :key="index">
                    <img width="50" height="50" class="mr-2" :src="item.icon" slot="icon" alt="" srcset="">
                    <div slot="title">{{ item.name }}<span class="ml-2 text-danger fs-12">{{ item.balance }}</span></div>
                    <div slot="label">限额：{{ item.min_amount }} - {{ item.max_amount }}</div>
                    <div slot="right-icon">
                        <van-icon size="24" :color="checked_index === index ? checked : un_checked" name="success" />
                    </div>
                </van-cell>
            </van-cell-group>
            <van-cell-group class="mt-3">
                <van-field label="安全密码" :disabled="user.info.trade_password ? false : true" type="password" :loading="payBtnLoading" v-model="form.password" maxlength="6" 
                :placeholder="user.info.trade_password ? '请输入6位数字安全密码' : '请在APP中设置安全密码'" />
                <div v-if="user.info.trade_password ? false : true" class="px-3 pb-3 mt-1 text-danger fs-12">请在MASON APP用户中心-安全设置-设置安全密码中设置安全密码</div>
            </van-cell-group>
            <!-- <div class="mt-3">
                <van-password-input
                    :value="form.password"
                    info="安全密码为 6 位数字"
                    :focused="showKeyboard"
                    @focus="showKeyboard = true"
                />
            </div> -->
            <div class="p-3 mt-3">
                <van-button @click="onSubmitPay" :disabled="payBtnDisabled || (user.info.trade_password ? false : true)" :loading="payBtnLoading" type="primary" size="large">确认付款</van-button>
            </div>
        </van-popup>
    </div>
</template>

<script>
    import HeaderBar from '../../../components/common/HeaderBar'
    import { Cell, CellGroup, Button, Popup, Field, Icon, PasswordInput, NumberKeyboard, Toast } from 'vant'
    export default {
        components: {
            HeaderBar, Cell, CellGroup, Button, Popup, Field, Icon, PasswordInput, NumberKeyboard, Toast
        },
        data() {
            return {
                payBtnDisabled: false,
                payBtnLoading: false,
                payFormShow: false,
                id: 0,
                data: {
                    shops: []
                },
                shop_num: 0,
                un_checked: '#f0f0f0',
                checked: '#07c160',
                checked_index: 0,
                form: {
                    password: ''
                },
                showKeyboard: true,
                payments: [],
                user: {
                    info: {}
                }
            }
        },
        methods: {
            onPay() {
                this.payBtnDisabled = true
                this.payBtnLoading = true
                this.$apps.http.get('/order/pay_type', {}).then(res => {
                    if (res.code === 1) {
                        this.payments = res.data
                        this.payFormShow = true
                    } else {
                        Toast.fail(res.msg)
                    }
                    this.payBtnDisabled = false
                    this.payBtnLoading = false
                }).catch(err => {
                    this.payBtnDisabled = false
                    this.payBtnLoading = false
                })
            },
            onSubmitPay() {
                this.payBtnDisabled = true
                this.payBtnLoading = true
                this.$apps.http.post('/order/pay_all', {
                    order_id: this.data.id,
                    pay_password: this.form.password,
                    paytype: this.payments.paytype[this.checked_index].id
                }).then(res => {
                    if (res.code === 1) {
                        Toast.success(res.msg)
                        let _ = this
                        setTimeout(function() {
                            _.$router.replace('/pay/success/' + _.data.id)
                        }, 2000)
                    } else {
                        Toast.fail(res.msg)
                        this.payBtnDisabled = false
                        this.payBtnLoading = false
                    }
                    
                }).catch(err => {
                    this.payBtnDisabled = false
                    this.payBtnLoading = false
                })
            },
            changePayType(index) {
                this.checked_index = index
            },
            onInput(key) {
                this.form.password = (this.form.password + key).slice(0, 6);
            },
            onDelete() {
                this.form.password = this.form.password.slice(0, this.form.password.length - 1);
            }
        },
        created () {
            this.id = this.$route.params.no;
            if (this.id) {
                this.$apps.http.get('/order/info', {
                    order_id: this.id
                }).then((result) => {
                    if (result.code === 1) {
                        this.data = result.data
                        this.shop_num = result.data.shops.length
                        
                    }
                }).catch((err) => {
                    
                });
            }
            this.$apps.http.post('/user/info').then(res => {
                if (res.code === 1) {
                    this.user = res.data
                }
            }).catch(err => {

            })
        },
    }
</script>

<style lang="less" scoped>

</style>