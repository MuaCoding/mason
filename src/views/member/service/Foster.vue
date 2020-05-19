<template>
    <div class="bg-f4">
        <div :style="{ height: heights + 'px' }" v-if="iosShow" class="headIos"></div>
        <header-bar title="回寄商品" :border="true" :back="-1" :isIos="iosShow" :heights="heights"></header-bar>
        <van-cell-group class="content">
            <van-notice-bar :scrollable="false" background="#FFEAED" color="#FB5C70">
                请填写寄回商品信息…
            </van-notice-bar>
            <van-cell :border="true">
                <template #title><span class=" text-secondary-dark">快递公司</span></template></van-cell
            >
            <van-field type="textarea" v-model="form.express" placeholder="请填写快递公司名称…" />
        </van-cell-group>
        <van-cell-group class="mt-1">
            <van-cell :border="true">
                <template #title><span class=" text-secondary-dark">快递单号</span></template></van-cell
            >
            <van-field type="textarea" v-model="form.number" placeholder="请填写邮寄的快递单号…" />
        </van-cell-group>

        <van-cell-group class="mt-1 p-5 bg-white" :border="false">
            <van-button block :loading="loading" color="linear-gradient(315deg,rgba(251,88,112,1) 0%,rgba(251,143,96,1) 100%)" @click="submitAction()"
                >我已寄回商品</van-button
            >
        </van-cell-group>
    </div>
</template>

<script>
import HeaderBar from "../../../components/common/HeaderBar";
export default {
    components: {
        HeaderBar,
    },
    data() {
        return {
            iosShow: false,
            heights: 0,
            loading: false,
            form: {
                express: "",
                number: "",
            },
        };
    },
    created() {},
    mounted() {
        this.$nextTick(() => {
            let content = document.querySelector(".content");
            if (!this.$apps.isAndroid()) {
                let head = document.querySelector(".van-nav-bar--fixed");

                this.heights = window.ios != undefined ? window.ios.statusHeight() : 20;
                if (this.heights > 40) {
                    this.heights = 0;
                    this.iosShow = false;
                    content.style.paddingTop = 47 + "px";
                    return;
                } else {
                    head.style.top = Number(this.heights) + "px";
                    content.style.paddingTop = Number(this.heights) + 47 + "px";
                    this.iosShow = true;
                }
            } else {
                this.heights = 0;
                content.style.paddingTop = 47 + "px";
                this.iosShow = false;
            }
        });
    },
    methods: {
        submitAction() {
            if (this.form.express == null || this.form.express === "" || typeof this.form.express == "undefined") {
                this.$toast("请填写快递公司");
                return;
            } else if (this.form.number == null || this.form.number === "" || typeof this.form.number == "undefined") {
                this.$toast("请填写快递单号");
                return;
            }
            this.loading = true;
            const formdata = {
                id: this.$route.params.id,
                user_type: 1,
                express: this.form.express,
                express_no: this.form.number,
            };
            let t = this;
            this.$apps.http
                .post("/SoldService.Order/send_goods", formdata)
                .then((res) => {
                    this.loading = false;
                    if (res.code == 1) {
                        this.$toast("提交成功");
                        setTimeout(() => {
                            t.$router.replace("/member/service/2");
                            t.$store.dispatch(
                                "SET_LOCALSTORAGE",
                                JSON.stringify({
                                    name: "SERVICEBAR",
                                    value: 2,
                                })
                            );
                        }, 2000);
                        this.$toast.clear;
                    } else {
                        this.$toast(res.msg);
                    }
                })
                .catch((err) => {});
        },
    },
};
</script>

<style lang="less" scoped></style>
