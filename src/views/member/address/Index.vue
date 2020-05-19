<template>
    <div>
        <div :style="{ height: heights + 'px' }" v-if="iosShow" class="headIos"></div>
        <header-bar title="收货地址" :back="-1" :heights="heights">
            <van-icon name="delete" @click="btnDelete" slot="nav-right"></van-icon>
        </header-bar>
        <div class="address" :data-top="height">
            <van-address-list
                v-model="chosenAddressId"
                :list="list"
                @select="selected"
                :disabled-list="[]"
                disabled-text=""
                @add="onAdd"
                @edit="onEdit"
            />
            <!-- @click-item="selected" -->
            <common-no-data :show="list.length === 0"></common-no-data>
        </div>
    </div>
</template>

<script>
import HeaderBar from "../../../components/common/HeaderBar";
import CommonNoData from "../../../components/NoData";
import { AddressList, Icon, Dialog, Toast } from "vant";
export default {
    components: {
        HeaderBar,
        AddressList,
        Icon,
        Dialog,
        Toast,
        CommonNoData,
    },
    data() {
        return {
            iosShow: false,
            heights: 0,
            height: 0,
            chosenAddressId: 0,
            list: [],
            index: "",
            item: {},
            isChoose: false,
        };
    },
    methods: {
        chooseAddr(item, index) {},
        onAdd() {
            this.$router.push("/member/address/form");
        },
        onEdit(item, index) {
            this.$router.push("/member/address/form/" + item.id);
        },
        btnDelete() {
            if (this.index === "") {
                Toast("请选择地址");
                return false;
            }

            Dialog.confirm({
                title: "删除提醒",
                message: "您真的要删除选中地址吗",
            })
                .then(() => {
                    Toast.loading({
                        message: "数据提交中...",
                        forbidClick: true,
                        loadingType: "spinner",
                        duration: 0,
                    });
                    this.$apps.http
                        .post("/userAddress/delete", {
                            id: this.chosenAddressId,
                        })
                        .then((res) => {
                            Toast.clear;
                            if (res.code === 1) {
                                //  移除删除地址
                                Toast.success(res.msg);
                                this.list.splice(this.index, 1);
                            }
                        })
                        .catch((res) => {
                            Toast.clear;
                        });
                })
                .catch(() => {
                    // on cancel
                });
        },
        selected(item, index) {
            if (this.isChoose) {
                this.$apps.session.set("addr_id", item.id);
                localStorage.setItem("is_back", 1);
                this.$router.go(-1);
            } else {
            }
            this.index = index;
            this.item = item;
        },
    },
    created() {
        this.$apps.http
            .get("/userAddress", {})
            .then((result) => {
                if (result.code === 1) {
                    let list = result.data;
                    for (let i in list) {
                        list[i].tel = list[i].mobile;
                        list[i].isDefault = list[i].is_default ? true : false;
                        list[i].address = list[i].province.name + list[i].city.name + list[i].district.name + list[i].info;
                    }
                    this.list = list;
                }
            })
            .catch((err) => {});
        this.isChoose = this.$route.query.choose ? true : false;
    },
    mounted() {
        this.$nextTick(() => {
            let content = document.querySelector(".address");
            if (!this.$apps.isAndroid()) {
                let head = document.querySelector(".van-nav-bar");

                this.heights = window.ios != undefined ? window.ios.statusHeight() : 20;
                if (this.heights > 40) {
                    this.iosShow = false;
                    this.heights = 0;
                    content.style.marginTop = 47 + "px";
                    this.height = 47;
                    return;
                } else {
                    head.style.top = Number(this.heights) + "px";
                    this.height = content.style.marginTop = Number(this.heights) + 47;
                    content.style.marginTop = Number(this.heights) + 47 + "px";
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

    watch: {
        height(val) {
            console.log(val);
            // this.height = val;
            return val;
        },
    },
};
</script>

<style lang="less" scoped></style>
