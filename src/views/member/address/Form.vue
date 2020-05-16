<template>
    <div>
        <header-bar :title="title" :border="false" :back="-1" :isIos="iosShow"></header-bar>
        <div>
            <van-cell-group>
                <van-field label="姓名" v-model="form.name" placeholder="请输入收件人姓名" />
                <van-field label="手机号码" v-model="form.mobile" placeholder="请输入收件人联系电话" />
                <!-- <van-cell title="国家" is-link :value="country_text" @click="getAreas(0, 'country')"></van-cell> -->
                <!-- <van-cell title="地区" is-link :value="distrcit_text"></van-cell> -->
                <van-cell title="地区" is-link @click="getAreas(900007, 0, true)">
                    <div slot="label">{{ distrcit_text }}</div>
                </van-cell>
                <van-field label="详细地址" type="textarea" v-model="form.info" placeholder="请输入详细地址" />
            </van-cell-group>
            <van-cell-group class="mt-4">
                <van-switch-cell :active-value="1" :inactive-value="0" active-color="#FB5870" v-model="form.is_default" title="是否默认" />
            </van-cell-group>
        </div>

        <div class="p-3 mt-5">
            <van-button type="danger" :loading="btnLoading" :disabled="btnLoading" @click="onSubmit" size="large">提交数据</van-button>
        </div>
        <van-popup v-model="showPicker" position="bottom">
            <van-picker
                :columns="columns"
                :loading="areaLoading"
                value-key="name"
                show-toolbar
                @change="onChange"
                @cancel="showPicker = false"
                @confirm="onConfirm"
            />
        </van-popup>
    </div>
</template>

<script>
import HeaderBar from "../../../components/common/HeaderBar";
import { Button, Field, Cell, SwipeCell, Picker, Popup, Toast } from "vant";
export default {
    components: {
        HeaderBar,
        Button,
        Field,
        Cell,
        SwipeCell,
        Picker,
        Popup,
        Toast,
    },
    data() {
        return {
            form: {
                name: "",
                mobile: "",
                country_id: "",
                province_id: "",
                city_id: "",
                district_id: "",
                town_id: "",
                is_default: 0,
                info: "",
            },
            id: "",
            data: {},
            country_text: "中国",
            distrcit_text: "请选择地区",
            areas: [],
            columns: [],
            showPicker: false,
            areaValues: [],
            current_id: 0,
            areaLoading: false,
            areaIndex: 0,
            btnLoading: false,
            title: "添加收货地址",
        };
    },
    methods: {
        onChange(picker, values, index, xx) {
            // this.areaValues.push(values)
            // if (index == 0) {
            //     values[1] = this.areas[values[0]][0]
            // }
            // this.areaValues = values;
            // picker.setColumnValues(1, this.areas[values[0]]);
        },
        onConfirm(item) {
            this.areaValues.push(item);

            let len = this.areaValues.length;

            this.getAreas(item.id, 0, false);
        },
        onSubmit() {
            let url = "/userAddress/create";
            if (this.form.id) {
                url = "/userAddress/update";
            }
            this.btnLoading = true;
            this.$apps.http
                .post(url, this.form)
                .then((res) => {
                    if (res.code == 1) {
                        Toast.success(res.msg);
                        let _ = this;
                        setTimeout(function() {
                            _.$router.go(-1);
                        }, 2000);
                    } else {
                        Toast.fail(res.msg);
                        this.btnLoading = false;
                    }
                })
                .catch((err) => {
                    this.btnLoading = false;
                });
        },
        getAreas(parent, index, isClick) {
            this.showPicker = true;
            this.areaLoading = true;

            if (isClick) {
                this.areaValues = [];
            }

            this.$apps.http
                .get("/area", {
                    parent_id: parent ? parent : 0,
                })
                .then((res) => {
                    if (res.code == 1) {
                        if (res.data.length > 0) {
                            this.columns = res.data;
                        } else {
                            this.distrcit_text = "";
                            for (let i in this.areaValues) {
                                switch (i) {
                                    case "0":
                                        this.form.province_id = this.areaValues[i].id;
                                        break;
                                    case "1":
                                        this.form.city_id = this.areaValues[i].id;
                                        break;
                                    case "2":
                                        this.form.district_id = this.areaValues[i].id;
                                        break;
                                    case "3":
                                        this.form.town_id = this.areaValues[i].id;
                                        break;
                                }
                                this.distrcit_text += this.areaValues[i].name;
                            }
                            this.showPicker = false;
                        }
                    }
                    this.areaLoading = false;
                })
                .catch((err) => {
                    this.areaLoading = false;
                });
        },
    },
    created() {
        this.id = this.$route.params.id;
        this.id = this.id ? parseInt(this.id) : 0;

        if (this.id > 0) {
            this.title = "修改收货地址";
            this.$apps.http
                .get("userAddress/detail", { id: this.id })
                .then((result) => {
                    if (result.code == 1) {
                        this.form = result.data;
                        this.distrcit_text = result.data.province.name + result.data.city.name + result.data.district.name;
                        // + result.data.district.name
                    }
                })
                .catch((err) => {});
        }
        // this.$apps.http.get('/area', {get_child: 1}).then(res => {
        //     if (res.code === 1) {

        //         let data = res.data

        //         let tmp = {}

        //         for (let i in data) {
        //             let tmp1 = []
        //             for (let j in data[i].child) {
        //                 tmp1.push(data[i].child[j].name)
        //             }
        //             tmp[data[i].name] = tmp1
        //         }

        //         this.areas = tmp

        //         this.columns = [
        //             {
        //                 values: Object.keys(tmp),
        //                 className: 'column1'
        //             },
        //             {
        //                 values: tmp['北京市'],
        //                 className: 'column2',
        //                 defaultIndex: 2
        //             }
        //         ]

        //     }
        // }).catch(err => {

        // })
    },
    mounted() {
        this.$nextTick(() => {
            if (!this.$apps.isAndroidApp() && window.ios != undefined) {
                let head = document.querySelector(".van-nav-bar--fixed");
                this.heights = window.ios != undefined ? window.ios.statusHeight() : 20;
                if (this.heights > 40) {
                } else {
                    let content = document.querySelector(".row-box");
                    head.style.top = Number(this.heights) + "px";
                    content.style.paddingTop = Number(this.heights) + "px";
                    this.iosShow = true;
                }
            } else {
                this.heights = 0;
                this.iosShow = false;
            }
            console.log(this.iosShow);
        });
    },
};
</script>

<style lang="less" scoped></style>
