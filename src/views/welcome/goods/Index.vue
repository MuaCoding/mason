<template>
    <div class="page-goods-detail" id="page-goods-detail">
        <header-bar :fixed="true" :border="active !== 1" :isIos="iosShow" :back="-1">
            <!-- <div :style="{ height: heights + 'px' }" v-if="iosShow" class="headIos"></div> -->
            <van-icon @click="goto('/')" :info="cart_num" name="shopping-cart-o" slot="nav-right"></van-icon>
            <van-tabs v-model="active" @change="changeTab" :border="false" slot="nav-title">
                <van-tab title="商品"></van-tab>
                <van-tab title="详情"></van-tab>
                <van-tab title="评价"></van-tab>
            </van-tabs>
        </header-bar>
        <!-- app 下载提示 -->
        <div class="download-app-go smartloader" v-show="isApp">
            <div class="cross" @click="isApp = false">
                <van-icon name="cross" />
            </div>
            <div class="app-desc">
                <div class="app-logo">
                    <div class="logo-cover "></div>
                </div>
                <div class="app-content">
                    <div class="fs-14 overflow">下载Mason综合服务APP</div>
                    <div class="fs-12 overflow">体验更多功能，使用更顺畅！</div>
                </div>
                <div class="app-btn" @click="appGo">立即下载</div>
            </div>
        </div>

        <!-- <div v-if="loadingGoods" class="text-center mt-5 pt-5"><van-loading type="spinner" /></div> -->
        <div class="pb-2 goods-detail-container detail-box" id="goods-detail-container">
            <div class="" v-show="active === 0">
                <van-swipe :autoplay="3000" :height="swipeWidth" :width="swipeWidth">
                    <van-swipe-item v-for="(image, index) in images" :key="index">
                        <!-- <img v-lazy="image"/> -->
                        <van-image lazy-load :id="'swipe-' + index" style="width: 100%" :src="image | imageView2(swipeWidth * 2)" alt="">
                            <template v-slot:loading>
                                <van-loading type="spinner" size="20" />
                            </template>
                        </van-image>
                        <!-- <img v-lazy="image" style="width: 100%" /> -->
                    </van-swipe-item>
                </van-swipe>
                <div class="p-2 text-33 bg-white">
                    {{ goods.name }}
                </div>
                <van-cell-group>
                    <van-cell center style="padding-right: 0">
                        <div slot="title" class="text-danger fs-12">
                            <template v-if="sku.activity_is == 1 && sku.activity_nums > 0">
                                ￥<span class="fs-14 strong">{{ sku.promotion_prices[0] || "0" }}</span
                                ><span class="strong">.{{ sku.promotion_prices[1] || "00" }}</span>
                                <del class="text-99 ml-1">￥{{ sku.original_price }}</del>
                            </template>
                            <template v-else>
                                ￥<span class="fs-14">{{ sku.prices[0] || "0" }}</span
                                >.{{ sku.prices[1] || "00" }}
                            </template>
                            <span v-if="sku.activity_nums > 0 && sku.activity_buy_max > 0" class="ml-2 text-99"
                                >限购数量：{{ sku.activity_buy_max }}</span
                            >
                        </div>
                        <div slot="label">已出售 {{ goods.sale_nums || "0" }} 件</div>
                        <div>
                            <span
                                @click="onShare(goods)"
                                style="border-top-left-radius: 10px; border-bottom-left-radius: 10px;"
                                class="bg-f8 text-66 fs-12 pr-1 pl-2 py-1"
                                ><van-icon class="align-middle" name="share" /> 分享</span
                            >
                        </div>
                    </van-cell>
                </van-cell-group>
                <div class="fs-12 px-3 pb-2 text-33 pt-2">
                    <div>
                        <span style="width: 30%" class="d-inline-block"
                            ><span class="goods-info-extend align-middle"
                                >赠红包<img class="align-middle ml-1" height="12" src="/img/envelope.png"/></span
                        ></span>
                        送 {{ goods.award_multiple | formatScore(sku.price, sku.activity_price, sku.activity_is, sku.activity_nums) }} 红包
                    </div>
                    <div class="mt-2" v-if="sku.buy_score > 0">
                        <span style="width: 30%" class="d-inline-block"><span class="goods-info-extend">购物分抵扣</span></span>
                        可用{{ sku.buy_score }}个购物分抵扣商品{{ sku.buy_score }}元
                    </div>
                </div>
                <div class="p-1 bg-f6"></div>
                <van-cell-group>
                    <van-cell title="商品属性" @click="showSku = true" is-link :value="selectSkuText"></van-cell>
                    <van-cell title="运费查询" is-link @click="queryExpress" :value="query_express_text"></van-cell>
                    <van-cell title="发货地址">
                        <div slot="label">
                            {{ goods.express_address }}
                        </div>
                    </van-cell>
                </van-cell-group>
                <div class="p-1 bg-f6"></div>
                <van-cell-group :border="false" class="van-hairline--top">
                    <van-cell title="商品评价" @click="active = 2" is-link value="全部评价"></van-cell>
                </van-cell-group>
                <van-cell-group :border="false" class="van-hairline--top">
                    <van-cell v-for="(item, index) in goodsComment.list" :key="index">
                        <van-image slot="icon" width="50" height="50" class="mr-2" round :src="item.buyer.avatar || '/img/avatar.png'"></van-image>
                        <div slot="title">
                            {{ item.buyer.id }}
                        </div>
                        <div slot="label">
                            <div class="comment-content">
                                {{ item.content || "默认评价" }}
                            </div>
                        </div>
                    </van-cell>
                </van-cell-group>
                <div class="p-1 bg-f6"></div>
                <van-cell-group>
                    <van-cell :title="goods.shop.name" :to="'/shop/' + goods.shop.id" is-link value="进店看看">
                        <van-image class="mr-2" round slot="icon" :src="goods.shop.logo" width="50" height="50" />
                        <div slot="label">
                            <span class="align-middle">综合体验</span>
                            <van-rate
                                class="ml-2 align-middle"
                                readonly
                                size="12"
                                icon="star"
                                :color="switchColor"
                                void-color="#eee"
                                void-icon="star"
                                v-model="shop.fraction"
                            ></van-rate>
                        </div>
                    </van-cell>
                </van-cell-group>
                <van-row class="bg-white p-3 fs-12 text-99">
                    <van-col span="8"> 宝贝描述 {{ shop.fraction_desc | formatFraction }} 平 </van-col>
                    <van-col span="8"> 卖家服务 {{ shop.fraction_service | formatFraction }} 平 </van-col>
                    <van-col span="8"> 物流服务 {{ shop.fraction_speed | formatFraction }} 平 </van-col>
                </van-row>

                <!-- 推荐 -->
                <div class="p-1 bg-f6 clear"></div>
                <van-divider style="margin-bottom: 0; margin-top: 0" class="bg-f6">为你推荐</van-divider>
                <!-- 为你推荐 -->
                <goods-list-4
                    v-if="loadGoods"
                    style="padding-bottom: 30px"
                    :filter="{ cid: goods.category_three, order: 'rank_asc', is_zero_buy: 1 }"
                    :max="1"
                ></goods-list-4>
            </div>
            <!-- 详情 -->
            <div class="fs-14 text-66" v-show="active === 1">
                <van-tabs v-model="contentActive">
                    <van-tab title="详情参数" style="padding-bottom: 60px">
                        <img class="w-100 align-top" v-for="(item, index) in goods.detail" :key="index" :src="item" alt="" srcset="" />
                    </van-tab>
                    <!-- <van-tab title="参数">
                        参数
                    </van-tab>
                    <van-tab title="包装">
                        包装
                    </van-tab> -->
                    <van-tab title="包装售后">
                        <div class="p-2">
                            {{ goods.package_aftersale.descript }}
                        </div>
                    </van-tab>
                </van-tabs>
            </div>
            <!-- 评价 -->
            <div v-show="active === 2">
                <!-- <div class="pl-3 pr-3 pt-3 pb-2 bg-white">
                    <van-tag class="mr-3 mb-2" type="danger">全部 (15451)</van-tag>
                    <van-tag class="mr-3 mb-2" type="warning">好评 (1541)</van-tag>
                    <van-tag class="mr-3 mb-2" type="warning">中评 (154)</van-tag>
                    <van-tag class="mr-3 mb-2" type="warning">差评 (15451)</van-tag>
                    <van-tag class="mr-3 mb-2" type="warning">晒单 (1451)</van-tag>
                </div> -->
                <div class="comment-list pb-5">
                    <goods-comments v-if="showComments" :goods_id="sku_id"></goods-comments>
                    <!-- <common-no-data :show="comments.count === 0"></common-no-data> -->
                </div>
            </div>
        </div>

        <van-popup v-model="showSku" closeable position="bottom">
            <div class="p-3">
                <van-card style="padding-left: 0" :desc="goods.sub_name" :title="goods.name" :thumb="goods.master_image">
                    <div slot="price">
                        <template v-if="sku.activity_is == 1 && sku.activity_nums > 0">
                            <span class="strong text-danger fs-14">￥{{ sku.activity_price }}</span>
                            <del class="ml-1 text-99 fs-12">￥{{ sku.original_price }}</del>
                        </template>
                        <template v-else>
                            <span class="strong text-danger fs-14">￥{{ sku.original_price }}</span>
                        </template>
                    </div>
                    <div class="fs-10 text-danger" slot="bottom" v-if="sku.buy_score > 0">
                        <span class="fs-10" style="padding: 2px;border: solid 1px #dc3545;border-radius: 3px;">购物分抵￥{{ sku.buy_score }}</span>
                    </div>
                </van-card>
                <div>
                    <div v-for="(item, index) in goods.sku_group2" :key="index">
                        <div class="fs-14 text-33 mt-2">{{ item.group_name }}</div>
                        <van-tag
                            @click="skuSelected(index, tIndex, tag)"
                            :color="tIndex == skuIndexValues[index] ? '#ee0a24' : '#f0f0f0'"
                            :text-color="tIndex == skuIndexValues[index] ? '#fff' : '#333'"
                            size="medium"
                            class="mr-2 mt-2 bg-primaey"
                            v-for="(tag, tIndex) in item.list"
                            :key="tIndex"
                            >{{ tag }}</van-tag
                        >
                    </div>
                </div>

                <van-cell-group class="mt-3">
                    <van-cell title="购买数量" style="padding: 8px 0px">
                        <div>
                            <van-stepper v-model="num" min="1" :max="goods.is_zero_buy == 1 ? goods.user_zero_buy_max : 99999" />
                        </div>
                    </van-cell>
                </van-cell-group>
                <div class="van-sku-actions mt-3" style="padding: 8px 0">
                    <van-button square size="large" type="warning" :disabled="btnToCartDisbaled" :loading="btnToCartLoading" @click="btnToCart(0)">
                        加入购物车
                    </van-button>
                    <van-button square size="large" type="danger" :disabled="btnToBuyDisbaled" :loading="btnToBuyLoading" @click="btnToCart(1)">
                        立即购买
                    </van-button>
                </div>
            </div>
        </van-popup>
        <van-goods-action v-if="goods.shop.id" class="van-hairline--top">
            <van-goods-action-icon @click="onService" icon="chat-o" text="客服" />
            <van-goods-action-icon text="收藏" @click="onClickFav">
                <van-icon slot="icon" :color="isFav === 1 ? switchColor : ''" :name="isFav === 1 ? 'star' : 'star-o'"></van-icon>
            </van-goods-action-icon>
            <van-goods-action-icon :to="'/shop/' + goods.shop.id" icon="shop-o" text="店铺" />
            <van-goods-action-button type="warning" text="加入购物车" :disabled="goods.is_zero_buy == 1" @click="onClickButton" />
            <van-goods-action-button type="danger" text="立即购买" @click="onClickButton" />
        </van-goods-action>
        <van-popup v-model="show_query_express_container" position="bottom">
            <van-picker
                @cancel="show_query_express_container = false"
                @change="changeArea"
                @confirm="confirmArea"
                show-toolbar
                :loading="areaLoading"
                title="选择收货地区"
                :columns="areas"
            ></van-picker>
        </van-popup>
        <!--分享图片弹窗-->
        <van-dialog
            v-model="shareWindow"
            :close-on-click-overlay="true"
            :show-cancel-button="false"
            :show-confirm-button="false"
            confirm-button-text="保存图片"
            class="canvas-container"
            id="canvas-container"
        >
            <div>
                <van-image fit="cover" class="w-100" :src="share_img" />
            </div>
        </van-dialog>
        <!--分享图片-->
        <div v-if="goods.master_image1" class="canvas-container1" id="canvas-container1" ref="shareContainer">
            <div class="w-100" style="height: 320px">
                <van-image fit="cover" @load="load1" :width="320" :height="320" class="share-goods-images" :src="goods_master_img" />
            </div>
            <div class="px-3 mt-3 fs-14 text-33">
                {{ goods.name }}
            </div>
            <template v-if="sku.buy_score > 0">
                <div class="px-3 mt-2 text-66 fs-12">
                    <span class="envelope-span"
                        >赠 {{ goods.award_multiple | formatScore(sku.price, sku.activity_price, sku.activity_is, sku.activity_nums) }}
                        <img class="align-middle" style="height: 12px" src="/img/envelope.png"
                    /></span>
                </div>
                <van-row class="px-3 pb-3 mt-2">
                    <van-col span="12">
                        <span class="fs-12 discount-span">购物分抵扣 ￥{{ sku.buy_score }}</span>
                    </van-col>
                    <van-col span="12" class="fs-12 text-right text-danger">
                        <template v-if="sku.activity_is == 1">
                            ￥<strong class="fs-14">{{ sku.promotion_prices[0] || "0" }}.{{ sku.promotion_prices[1] || "00" }}</strong>
                        </template>
                        <template v-else>
                            ￥<strong class="fs-14">{{ sku.prices[0] || "0" }}.{{ sku.prices[1] || "00" }}</strong>
                        </template>
                    </van-col>
                </van-row>
            </template>
            <template v-else>
                <van-row class="px-3 pb-3 mt-3">
                    <van-col span="12" class="text-66 fs-12">
                        <span class="envelope-span"
                            >赠 {{ goods.award_multiple | formatScore(sku.price, sku.activity_price, sku.activity_is, sku.activity_nums) }}
                            <img class="align-middle" style="height: 12px" src="/img/envelope.png"
                        /></span>
                    </van-col>
                    <van-col span="12" class="fs-12 text-right text-danger">
                        ￥<strong class="fs-14">{{ sku.prices[0] || "0" }}.{{ sku.prices[1] || "00" }}</strong>
                    </van-col>
                </van-row>
            </template>

            <div class="px-3">
                <van-row class="py-3 px-1" style="border-top: 1px dashed #f0f0f0">
                    <van-col span="7">
                        <van-image @load="load2" width="70" :src="qrcode" />
                    </van-col>
                    <van-col span="17" class="text-66 fs-12">
                        <div class="mt-1"><span class="share-step">1</span>长按保存到相册</div>
                        <div class="mt-1"><span class="share-step">2</span>打开MASON APP</div>
                        <div class="mt-1"><span class="share-step">3</span>打开扫一扫，识别二维码</div>
                    </van-col>
                </van-row>
            </div>
        </div>
    </div>
</template>

<script>
import HeaderBar from "../../../components/common/HeaderBar";
import GoodsList4 from "../../../components/GoodsList2";
import GoodsComments from "../../../components/GoodsComments";
import CommonNoData from "../../../components/NoData";
import QRcode from "qrcode";
import { createCanvas, loadImage } from "canvas";
import html2canvas from "html2canvas";
import FileSaver from "file-saver";
import { mapGetters, mapActions } from "vuex";
import {
    GoodsAction,
    GoodsActionIcon,
    GoodsActionButton,
    Swipe,
    SwipeItem,
    CellGroup,
    Cell,
    Image,
    Lazyload,
    Rate,
    Row,
    Col,
    Divider,
    NavBar,
    Tab,
    Tabs,
    Tag,
    ImagePreview,
    Sku,
    Popup,
    Card,
    Toast,
    Stepper,
    Icon,
    Picker,
} from "vant";
import BScroll from "better-scroll";
export default {
    components: {
        HeaderBar,
        GoodsAction,
        GoodsActionIcon,
        GoodsActionButton,
        Swipe,
        SwipeItem,
        CellGroup,
        Cell,
        Image,
        Rate,
        Row,
        Col,
        Divider,
        NavBar,
        Tab,
        Tabs,
        Tag,
        ImagePreview,
        Sku,
        Popup,
        Card,
        Stepper,
        Toast,
        CommonNoData,
        Icon,
        Lazyload,
        GoodsList4,
        Picker,
        GoodsComments,
    },
    data() {
        return {
            iosShow: false,
            heights: 0,
            isApp: true,
            switchColor: "#ee0a24",
            rate: 4.25,
            images: [],
            swipeWidth: 375,
            active: 0,
            contentActive: 0,
            sku_id: 0,
            goods: {
                sku_group: [],
                sku_list: [],
                detail: [],
                slider: [],
                package_aftersale: {},
                sku_list2: {},
                sku_list3: [],
                sku_group2: [],
                shop: {},
                award_multiple: "0.00",
            },
            num: 1,
            sku: {
                prices: [],
            },
            comments: [],
            showSku: false,
            skuIndexValues: [],
            skuTagValues: [],
            btnToCartDisbaled: false,
            btnToCartLoading: false,
            btnToBuyDisbaled: false,
            btnToBuyLoading: false,
            selectSkuText: "选择属性",
            goodsComment: {},
            cart_num: 0,
            shop: {},
            isFav: 0,
            query_express_text: "运费查看",
            show_query_express_container: false,
            areas: [],
            areaLoading: true,
            areaValues: ["北京市", "直辖区"],
            loadGoods: false,
            showComments: false,
            shareData: {},
            shareWindow: false,
            qrcode: "",
            shareImage: "",
            shareWindow1: true,
            shareImgHeight: 0,
            share_img: "",
            user: {},
            scrollTop: 0,
            disabledShare: true,
            loadingGoods: true,
            goods_master_img: "",
        };
    },
    methods: {
        onService() {
            if (this.$apps.isAndroid()) {
                window.android.openCustomerService();
            } else {
                window.ios.openCustomerService();
            }
        },
        btnToCart(buy) {
            this.setBtnAttr(true);
            this.$apps.http
                .post("/goodsCart/create", {
                    goods_id: this.sku.goods_id,
                    goods_sku_id: this.sku.id,
                    num: this.num ? this.num : 1,
                    is_buy_now: buy,
                })
                .then((res) => {
                    if (res.code === 1) {
                        this.updateCartNum();

                        if (buy === 1) {
                            //  立即购买
                            this.$router.push("/confirm?ids=" + res.data.id);
                        } else {
                            Toast.success("已加入购物车");
                        }
                    } else {
                        Toast.fail(res.msg);
                    }
                    this.setBtnAttr(false);
                })
                .catch((err) => {
                    this.setBtnAttr(false);
                });
        },
        onPointClicked() {},
        onBuyClicked() {},
        onAddCartClicked() {},
        onClickFav() {
            Toast.loading("请求中...");
            let url = this.isFav == 1 ? "/userAttentionGoods/cancel" : "/userAttentionGoods/create";

            this.$apps.http
                .post(url, {
                    goods_id: this.goods.id,
                    goods_sku_id: this.goods.sku_list[0].id,
                })
                .then((res) => {
                    if (res.code === 1) {
                        this.isFav = this.isFav == 1 ? 0 : 1;
                        Toast.success(res.msg);
                    } else {
                        Toast.fail(res.msg);
                    }
                })
                .catch((err) => {
                    Toast.fail("网络错误");
                    Toast.clear();
                });
        },
        onClickButton() {
            let redirect = encodeURI(process.env.VUE_APP_BASE_URL + "auth");
            this.$apps.isLogin()
                ? this.goods.user_zero_buy_max > 0
                    ? (this.showSku = true)
                    : this.$toast("您的购买次数用完了")
                : (window.location.href = process.env.VUE_APP_ERP_BASE_URL + "login?url=" + redirect + "&invite=" + this.goods.invite_user_id);
        },
        goto(path) {
            this.$apps.session.set("tabbar", 2);
            this.$router.push(path);
        },
        appGo() {
            console.log(process.env.VUE_APP_ERP_BASE_URL);
            window.location.href = process.env.VUE_APP_ERP_BASE_URL;
        },
        changeTab(index) {
            switch (index) {
                case 2:
                    // this.$apps.http.get('/goodsComment', {
                    //     goods_id: this.sku_id
                    // }).then(res => {
                    //     if (res.code === 1) {
                    //         let d = res.data
                    //         for (let i in d.list) {
                    //             d.list[i].rate = parseFloat((parseFloat(d.list[i].service_score) + parseFloat(d.list[i].logistics_score) + parseFloat(d.list[i].descript_score)) / 3)
                    //         }
                    //         this.comments = d
                    //     }
                    // }).catch(err => {

                    // })
                    if (!this.showComments) this.showComments = true;
                    break;
            }
        },
        imagePreview(index, images) {
            ImagePreview({
                images: images,
                closeable: true,
                lazyLoad: true,
            });
        },
        skuSelected(row, col, tag) {
            if (this.skuIndexValues[row] == col) {
                // this.skuIndexValues.splice(row, 1)
                // this.skuTagValues.splice(row, 1)
                col = tag = null;
            }
            this.$set(this.skuIndexValues, row, col);
            this.$set(this.skuTagValues, row, tag);

            let skuLen = this.goods.sku_group2.length,
                len = 0;

            for (let i in this.skuIndexValues) {
                if (this.skuIndexValues[i] !== null && this.skuIndexValues[i] !== "" && this.skuIndexValues[i] !== undefined) ++len;
            }

            if (skuLen == len) {
                this.btnToCartDisbaled = false;
                this.btnToBuyDisbaled = false;
                this.selectSkuText = this.skuTagValues.join(",");

                //  商品价格及库存数量
                for (let j in this.goods.sku_list) {
                    if (this.goods.sku_list[j].name == this.selectSkuText) {
                        this.sku = this.goods.sku_list[j];
                        let tmp = this.sku.price.split("."),
                            tmp1 = this.sku.activity_price.split(".");
                        this.$set(this.sku, "prices", tmp);
                        this.$set(this.sku, "promotion_prices", tmp1);
                        break;
                    }
                }
            } else {
                this.btnToCartDisbaled = true;
                this.btnToBuyDisbaled = true;
                this.selectSkuText = "选择属性";
            }
        },
        setBtnAttr(bool) {
            this.btnToCartDisbaled = bool;
            this.btnToBuyDisbaled = bool;
            this.btnToCartLoading = bool;
            this.btnToBuyLoading = bool;
        },
        updateCartNum() {
            this.$apps.http
                .get("/goodsCart/has_nums", {})
                .then((res) => {
                    if (res.code === 1) {
                        this.cart_num = res.data.nums;
                    }
                })
                .catch((err) => {});
        },
        queryExpress() {
            this.show_query_express_container = true;
            if (this.areaLoading) {
                this.$apps.http.get("/Area/index", { parent_id: 900007, get_child: 1 }).then((res) => {
                    if (res.code === 1) {
                        let data = res.data;
                        for (let i in data) {
                            data[i].text = data[i].name;
                            data[i].children = data[i].child;
                            if (data[i].children.length > 0) {
                                for (let j in data[i].children) {
                                    data[i].children[j].text = data[i].children[j].name;
                                }
                            }
                        }
                        this.areas = data;
                        this.areaLoading = false;
                    }
                });
            }
        },
        changeArea(picker, val, index, index1) {
            this.areaValues = val;
        },
        confirmArea() {
            if (this.areaValues.length > 1) {
                let city = 0;
                for (let i in this.areas) {
                    if (this.areas[i].name == this.areaValues[0]) {
                        for (let j in this.areas[i]["child"]) {
                            if (this.areas[i]["child"][j].name == this.areaValues[1]) {
                                city = this.areas[i]["child"][j].id;
                                break;
                            }
                        }
                    }
                }

                if (city > 0) {
                    Toast.loading({
                        duration: 0, // 持续展示 toast
                        forbidClick: true,
                        message: "运费查询中...",
                    });
                    this.$apps.http
                        .get("/GoodsExpressTpl/count", {
                            sku_ids: this.sku.id,
                            nums: this.num,
                            city_id: city,
                        })
                        .then((res) => {
                            if (res.code === 1) {
                                let amount = parseFloat(res.data.count);
                                this.query_express_text = amount > 0 ? "￥" + amount.toFixed(2) : "包邮";
                            }
                            Toast.clear();
                            this.show_query_express_container = false;
                        })
                        .catch((err) => {
                            Toast.clear();
                            this.show_query_express_container = false;
                        });
                }
            } else {
                this.show_query_express_container = false;
            }
        },
        onShare(goods) {
            if (this.disabledShare) return false;
            // if (this.$apps.isAndroidApp()) {
            //     onShare(this.goods, this.sku)
            // } else {
            this.goods.qrcode = this.qrcode;
            this.goods.share_img = this.share_img;
            if (this.share_img) {
                this.shareWindow = true;
                onShare(this.goods, this.sku);
            } else {
                this.saverImg();
            }
            // }
        },
        async saverImg() {
            let _ = this;
            this.$toast.loading("图片生成中...");
            html2canvas(document.getElementById("canvas-container1"), {
                y: -10000,
                x: -10000,
                useCORS: true, // 【重要】开启跨域配置
                allowTaint: true, //允许跨域图片
                taintTest: false, //是否在渲染前测试图片
                // width: 320,
                // height: 502,
                scale: 2,
            })
                .then((img) => {
                    Toast.clear();
                    _.shareWindow = true;
                    _.share_img = img.toDataURL();
                    _.goods.share_img = _.share_img;
                    // _.goods.save_img = _.share_img
                    console.log(_.goods);
                    console.log(_.sku);
                    onShare(_.goods, _.sku);
                    // FileSaver.saveAs(img.toDataURL(), "MASON-"+this.goods.name+".jpg")
                    // _.shareImage = img.toDataURL()
                })
                .catch((err) => {
                    console.log("error", err);
                });
        },
        async createQrcode() {
            const w = 70,
                cw = 20;
            const cvs = createCanvas(1, 1);
            const url = await QRcode.toCanvas(cvs, this.share_url, {
                errorCorrectionLevel: "L",
                margin: 0,
            });
            const canvas = createCanvas(w, w);
            const ctx = canvas.getContext("2d");
            const img = await loadImage("/img/logo.png");
            ctx.drawImage(url, 0, 0, url.width, url.width, 0, 0, w, w);
            const center = (w - cw) / 2;
            ctx.drawImage(img, center, center, cw, cw);
            this.disabledShare = false;
            return canvas.toDataURL("image/png");
        },
        load1() {},
        load2() {},
        _vueCloseShare() {
            this.shareWindow = false;
        },
        closeShare1() {
            closeShare();
        },
        getImage(url) {
            let _ = this;
            const xhr = new XMLHttpRequest();
            xhr.open("get", url, true);
            xhr.responseType = "blob";
            xhr.onload = function() {
                if (this.status == 200) {
                    _.goods_master_img = URL.createObjectURL(this.response);
                }
            };
            xhr.send();
        },
    },
    created() {
        this.swipeWidth = document.documentElement.clientWidth;
        this.sku_id = this.$route.params.id;
        let invite = this.$route.params.invite;
        if (this.GET_FROMAPP) {
            this.isApp = false;
        }
        //  是否已关注当前商品
        // this.share_url = window.location.protocol + '//' + window.location.host + '/share?redirect=/goods/'+this.sku_id+'/'
        this.share_url = window.location.protocol + "//" + window.location.host + "/goods/" + this.sku_id + "/";
        this.$apps.http
            .get("/goods/detail", {
                id: this.sku_id,
            })
            .then((result) => {
                if (result.code === 1) {
                    if (result.data.invite_user_id > 0) {
                        this.share_url = this.share_url + result.data.invite_user_id;
                    }
                    result.data.master_image1 = "data:image/png;base64," + result.data.master_image1;
                    result.data.share_url = this.share_url;
                    this.goods = result.data;
                    this.images = result.data.slider;
                    this.images.unshift(result.data.master_image);
                    this.getImage(result.data.master_image);
                    try {
                        let sku_list = result.data.sku_list,
                            min_price = 0,
                            min_price_activity = 0,
                            tmp_sku = {},
                            tmp_sku_activity = {};
                        if (sku_list.length > 1) {
                            //  如果有活动，那么就按活动的最低价
                            for (let i in sku_list) {
                                // if (sku_list[i].activity_is == 0) {
                                let price_tmp = parseFloat(sku_list[i].price);
                                if (sku_list[i].activity_is == 1 && sku_list[i].activity_nums > 0) {
                                    let price_tmp_activity = parseFloat(sku_list[i].activity_price);
                                    if (min_price_activity == 0) {
                                        min_price_activity = price_tmp_activity;
                                        tmp_sku_activity = sku_list[i];
                                    }
                                    if (price_tmp_activity < min_price_activity) {
                                        min_price = price_tmp_activity;
                                        tmp_sku_activity = sku_list[i];
                                    }
                                }

                                if (i == 0) {
                                    min_price = price_tmp;
                                    tmp_sku = sku_list[i];
                                }
                                if (price_tmp < min_price) {
                                    min_price = price_tmp;
                                    tmp_sku = sku_list[i];
                                }
                                // }
                            }
                        } else {
                            tmp_sku = sku_list[0];
                        }

                        this.sku = Object.keys(tmp_sku_activity).length > 0 ? tmp_sku_activity : tmp_sku;

                        this.selectSkuText = this.sku.name;
                        let skus = this.sku.name.split(","),
                            groups = this.goods.sku_group2;
                        this.skuTagValues = skus;
                        for (let j in groups) {
                            this.skuIndexValues.push(groups[j].list.indexOf(skus[j]));
                        }
                        this.loadGoods = true;

                        //  生成二维码
                        this.createQrcode().then((res) => {
                            this.qrcode = res;
                        });
                    } catch (err) {
                        console.error(err);
                    }

                    // this.sku = result.data.sku_list[0]
                    let tmp = this.sku.price.split("."),
                        tmp1 = this.sku.activity_price.split(".");
                    this.$set(this.sku, "prices", tmp);
                    this.$set(this.sku, "promotion_prices", tmp1);

                    //  商家信息
                    this.$apps.http
                        .get("/Shop.Index/detail", { shop_id: result.data.shop_id })
                        .then((res) => {
                            if (res.code === 1) {
                                this.shop = res.data;
                            }
                        })
                        .catch((err) => {});

                    if (this.$apps.isLogin()) {
                        this.$apps.http
                            .get("/userAttentionGoods/has", {
                                goods_id: this.goods.id,
                                goods_sku_id: this.goods.sku_list[0].id,
                            })
                            .then((res) => {
                                if (res.code === 1) {
                                    this.isFav = res.data.has;
                                }
                            })
                            .catch((err) => {});
                    }
                    this.loadingGoods = false;
                }
            })
            .catch((err) => {});

        this.$apps.http
            .get("/goodsComment", {
                goods_id: this.sku_id,
                limit: 3,
            })
            .then((res) => {
                if (res.code === 1) {
                    this.goodsComment = res.data;
                }
            })
            .catch((err) => {});
        if (this.$apps.isLogin()) this.updateCartNum();
        window._vueCloseShare = this._vueCloseShare;
    },
    filters: {
        formatScore: function(value, amount, acPrice, isAc, num) {
            return parseFloat(value && isAc && num > 0 ? acPrice : amount).toFixed(2);
        },
        formatFraction: function(value) {
            return value ? value.toFixed(2) : "0.00";
        },
        formatPrice(price) {
            let tmp = price.split(".");
            return '<span class="fs-14">￥</span><span class="fs-18">' + tmp[0] + '</span>.<span class="fs-14">' + tmp[1] + "</span>";
        },
        getRate(val) {
            return 5;
        },
        imageView2(value, w) {
            return value + "?imageView2/1/w/" + w + "/h/" + w + "/interlace/1";
        },
    },
    deactivated() {
        sessionStorage.removeItem("share_data");
    },
    mounted() {
        this.$nextTick(() => {
            if (!this.$apps.isAndroidApp() && window.ios != undefined) {
                let head = document.querySelector(".van-nav-bar--fixed"),
                    downloadApp = document.querySelector(".download-app-go");
                this.heights = window.ios != undefined ? window.ios.statusHeight() : 20;
                if (this.heights > 40) {
                } else {
                    let detail = document.querySelector(".detail-box");
                    console.log(detail);
                    detail.style.paddingTop = Number(this.heights) + "px";
                    head.style.top = Number(this.heights) + "px";
                    downloadApp.style.top = Number(this.heights) + "px";
                    this.iosShow = true;
                }
            } else {
                this.heights = 0;
                this.iosShow = false;
            }
            console.log(this.iosShow);
        });
    },
    watch: {
        shareWindow(newValue, oldValue) {
            if (!newValue) this.closeShare1();
        },
    },
    computed: {
        ...mapGetters(["GET_FROMAPP"]),
    },
};
</script>

<style lang="scss">
.goods-info-extend {
    background: #fbeced;
    color: #e34a5c;
    padding: 2px 3px;
    border-radius: 3px;
}
#canvas-container {
    width: 60%;
}
#canvas-container .van-dialog__header,
#canvas-container1 .van-dialog__header {
    padding: 0;
}
.share-step {
    display: inline-block;
    height: 16px;
    width: 16px;
    text-align: center;
    line-height: 14px;
    border-radius: 8px;
    border: solid 1px #666666;
    margin-right: 5px;
}
.share-download {
    position: absolute;
    right: 10px;
    top: 10px;
    background: rgba($color: #000, $alpha: 0.8);
    z-index: 1;
    color: #fff;
    width: 50px;
    text-align: center;
    height: 24px;
    line-height: 24px;
    border-radius: 12px;
}
#canvas-container1 {
    position: absolute;
    left: -10000px;
    top: -10000px;
    z-index: -1;
    // height: 502px;
    width: 320px;
    -webkit-transform: none;
    transform: none;
    overflow: unset !important;
    // -webkit-backface-visibility:
    transition-property: none;
    backface-visibility: unset;
    transition: unset;
    background: #fff;
}
.share-goods-images img {
    height: 320px;
    width: 320px;
}
.envelope-span {
    color: #fb5858;
    border: solid 1px #fb5858;
    padding: 3px 5px;
    border-radius: 3px;
}
.discount-span {
    color: #ff6835;
    background: #ffefea;
    padding: 3px 5px;
}
.canvas-container {
    border-radius: 10px !important;
}
.page-goods-detail {
    background: #fff;
}

.download-app-go {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 99;
    background: rgba(0, 0, 0, 0.8);
    color: #ffffff;
    display: flex;
    transition: transform 0.2s ease-out, -webkit-transform 0.2s ease-out;
    .smartloader {
        top: env(safe-area-inset-top);
    }
    .cross {
        font-size: 0.75rem;
        width: 10%;
        text-align: center;
        height: 3.75rem;
        line-height: 3.75rem;
        box-sizing: border-box;
    }

    .app-desc {
        padding: 0.5rem 1rem 0.5rem 0;
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        .app-logo {
            display: flex;
            align-items: center;
            justify-content: center;
            padding-right: 0.5rem;
            .logo-cover {
                width: 2rem;
                height: 2rem;
                background-image: url("../../../assets/images/common/logo.png");
                background-image: image-set(url("../../../assets/images/common/logo.png") 2x, url("../../../assets/images/common/logo@2x.png") 3x);
                background-size: 100% 100%;
            }
        }

        .app-content {
            flex: 1;
        }

        .app-btn {
            line-height: 30px;
            height: 32px;

            border-radius: 4px;
            opacity: 0.94;
            border: 1px solid rgba(255, 255, 255, 1);
            font-size: 0.75rem;
            padding: 0 1rem;
        }
    }
}
</style>
