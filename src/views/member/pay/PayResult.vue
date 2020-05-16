<template>
    <div>
        <header-bar title="付款结果" :back="-1" :isIos="iosShow"></header-bar>
        <div class="p-5 text-center">
            <van-loading type="spinner" />
            <div class="text-99 mt-3 fs-14">订单支付中...</div>
        </div>
    </div>
</template>

<script>
import HeaderBar from "../../../components/common/HeaderBar";
import { Loading } from "vant";
export default {
    components: {
        HeaderBar,
        Loading,
    },
    data() {
        return {
            iosShow: false,
            heights: 0,
            status: false,
            interVal: "",
        };
    },
    created() {
        let _ = this,
            no,
            expire = 3,
            query = this.$route.query;
        no = this.$route.params.no;
        if (
            (navigator.userAgent.toLowerCase().indexOf("iphone") || navigator.userAgent.toLowerCase().indexOf("ipad")) &&
            Object.keys(query).length == 0
        ) {
            _.interVal = setInterval(function() {
                --expire;
                if (expire <= 0) {
                    clearInterval(_.interVal);
                    // _.$router.replace('/member/order')
                    _.$router.push("/member/order");
                    return false;
                }
            }, 1000);
            window.location.href = "ToMason://";
        } else {
            _.interVal = setInterval(function() {
                _.$apps.http
                    .get("/Order/check_pay_status", {
                        no: no,
                    })
                    .then((res) => {
                        --expire;
                        if (expire <= 0) {
                            clearInterval(_.interVal);
                            // _.$router.replace('/member/order')
                            _.$router.push("/member/order");
                            return false;
                        }
                        if (res.code === 1) {
                            _.status = res.data.is_pay == 1 ? true : false;
                            if (_.status) {
                                clearInterval(_.interVal);
                                // _.$router.replace('/pay/success/' + no)
                                _.$router.push("/pay/success/" + no);
                            }
                        }
                    })
                    .catch((err) => {});
            }, 1000);
        }
    },
    destroyed() {
        if (this.interVal) clearInterval(this.interVal);
    },
    mounted() {
        this.$nextTick(() => {
            if (!this.$apps.isAndroidApp() && window.ios != undefined) {
                let head = document.querySelector(".van-nav-bar--fixed");
                let headerBar = document.querySelector(".header-bar");
                this.heights = window.ios != undefined ? window.ios.statusHeight() : 20;
                if (this.heights > 40) {
                    return;
                } else {
                    let tab = document.querySelector(".wrapper");
                    // let ordeftabs = document.querySelector(".index-tab");
                    head.style.top = Number(this.heights) + "px";
                    headerBar.style.marginBottom = Number(this.heights) + "px";
                    this.iosShow = true;
                }
            } else {
                this.heights = 0;
                this.iosShow = false;
            }
        });
    },
};
</script>

<style lang="less" scoped></style>
