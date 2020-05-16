<template>
    <div>
        <div class="pull-module">
            <section class="pull-bg">
                <header class="header-box">
                    <div class="header-bar">
                        <a class="header-btn" href="javascript:history.go(-1)">
                            <van-icon name="arrow-left" />
                        </a>
                        <div class="placeholder"></div>
                    </div>
                </header>
            </section>
            <div class="pull-wrap">
                <!--  -->
                <div class="pull-header">
                    <div class="header-cover">
                        <div class="dot"></div>
                        <div class="divider">商品不定期更新</div>
                        <div class="dot"></div>
                    </div>
                </div>
                <van-list v-model="result.loading" :finished="result.finished" finished-text="" @load="onLoad">
                    <!-- <pull-list :list="result.list"></pull-list> -->
                    <div class="list-group record-module">
                        <div class="list-item" v-for="(item, index) in result.list" :key="index" :to="'/goods/' + item.id">
                            <van-image
                                lazy-load
                                fit="cover"
                                class="list-cover"
                                radius="6px"
                                width="4.625rem"
                                height="4.625rem"
                                :src="item.master_image"
                            />
                            <div class="list-cell">
                                <h4 class="pull-title">{{ item.name }}</h4>
                                <p class="list-meta text-gray fs-12">
                                    <span style="text-decoration:line-through"
                                        >原价：¥{{ item.sku.original_price | NumberFormat(item.sku.original_price) }}</span
                                    >
                                    <span class="placeholder"></span>
                                    <span class="list-meta-r">{{ item.sale_nums }}人领取</span>
                                </p>
                                <div class="list-meta mt-2">
                                    <div class="list-meta-l  text-price">
                                        <span class="">¥ </span>
                                        <span class="fs-16 strong"> {{ item.sku.activity_price | NumberFormat(item.sku.activity_price) }}</span>
                                    </div>
                                </div>
                                <div class="list-meta search-tags">
                                    <van-tag color="#EEEEEE" text-color="#666666" @click="$router.push('/goods/' + item.id)">免费领取</van-tag>
                                    <van-tag color="#D53329" text-color="#FFFFFF" style="margin-left: 0.625rem;" @click="onShare(item)"
                                        >分享好友</van-tag
                                    >
                                </div>
                            </div>
                        </div>
                        <div v-if="result.list.length == 0" style="color:#A0A9B5;text-align:center;padding: 1rem 0;">暂无数据</div>
                    </div>
                </van-list>
            </div>
        </div>
        <!--分享图片弹窗-->
        <van-dialog
            v-model="payload.shareWindow"
            :close-on-click-overlay="true"
            :show-cancel-button="false"
            :show-confirm-button="false"
            confirm-button-text="保存图片"
            class="canvas-container"
            id="canvas-container"
        >
            <div>
                <van-image fit="cover" class="w-100" :src="payload.share_img" />
            </div>
        </van-dialog>
        <!--分享图片-->
        <div v-if="payload.master_image" class="canvas-container1" id="canvas-container1" ref="shareContainer">
            <div class="w-100" style="height: 320px">
                <van-image fit="cover" :width="320" :height="320" class="share-goods-images" :src="payload.goods_master_img" />
            </div>
            <div class="px-3 mt-3 fs-14 text-33">
                {{ payload.name }}
            </div>
            <template v-if="payload.buy_score > 0">
                <div class="px-3 mt-2 text-66 fs-12">
                    <span class="envelope-span"
                        >赠
                        {{
                            payload.award_multiple
                                | formatScore(payload.sku.price, payload.sku.activity_price, payload.sku.activity_is, payload.sku.activity_nums)
                        }}
                        <img class="align-middle" style="height: 12px" src="/img/envelope.png"
                    /></span>
                </div>
                <van-row class="px-3 pb-3 mt-2">
                    <van-col span="12">
                        <span class="fs-12 discount-span">购物分抵扣 ￥{{ payload.sku.buy_score }}</span>
                    </van-col>
                    <van-col span="12" class="fs-12 text-right text-danger">
                        <template v-if="payload.sku.activity_is == 1">
                            ￥<strong class="fs-14"
                                >{{ payload.sku.promotion_prices[0] || "0" }}.{{ payload.sku.promotion_prices[1] || "00" }}</strong
                            >
                        </template>
                        <template v-else>
                            ￥<strong class="fs-14">{{ payload.sku.prices[0] || "0" }}.{{ payload.sku.prices[1] || "00" }}</strong>
                        </template>
                    </van-col>
                </van-row>
            </template>
            <template v-else>
                <van-row class="px-3 pb-3 mt-3">
                    <van-col span="12" class="text-66 fs-12">
                        <span class="envelope-span"
                            >赠
                            {{
                                payload.award_multiple
                                    | formatScore(payload.sku.price, payload.sku.activity_price, payload.sku.activity_is, payload.sku.activity_nums)
                            }}
                            <img class="align-middle" style="height: 12px" src="/img/envelope.png"
                        /></span>
                    </van-col>
                    <van-col span="12" class="fs-12 text-right text-danger">
                        ￥<strong class="fs-14">{{ payload.sku.prices[0] || "0" }}.{{ payload.sku.prices[1] || "00" }}</strong>
                    </van-col>
                </van-row>
            </template>

            <div class="px-3">
                <van-row class="py-3 px-1" style="border-top: 1px dashed #f0f0f0">
                    <van-col span="7">
                        <van-image width="70" :src="payload.qrcode" />
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
import PullList from "../../components/pull/PullList.vue";
import QRcode from "qrcode";
import { createCanvas, loadImage } from "canvas";
import html2canvas from "html2canvas";
export default {
    data() {
        return {
            result: {
                page: 0,
                size: 10,
                finished: false,
                loading: false,
                list: [],
            },
            shareWindow: false,
            payload: {
                disabledShare: true,
                shareWindow: false,
                qrcode: "",
                share_url: "",
                share_img: "",
                goods_master_img: "",
                prices: [],
            },
        };
    },
    components: {
        PullList,
    },
    created() {
        this.getData();
        window._vueCloseShare = this.closeShare;
    },
    mounted() {
        this.$nextTick(() => {
            if (!this.$apps.isAndroidApp()) {
                let head = document.querySelector(".header-box"),
                    active = document.querySelector(".active-box");
                console.log(active);

                this.heights = window.ios != undefined ? window.ios.statusHeight() : 20;
                if (this.heights > 40) {
                } else {
                    head.style.top = Number(this.heights) + "px";
                    this.iosShow = true;
                }
            } else {
                this.heights = 0;
                this.iosShow = false;
            }
        });
    },
    methods: {
        onLoad() {
            console.log("onLoad");
            this.getData();
        },
        // 获取免费商品
        async getData(page) {
            this.result.page = (page === 0 ? page : parseInt(this.result.page)) + 1;
            let params = {
                page: this.result.page,
                rows: this.result.size,
                is_zero_buy: 1,
            };
            await this.$apps.http
                .get("/search.Goods/index", params)
                .then((res) => {
                    if (res.code === 1) {
                        let data = this.result.list;

                        if (this.result.page === 1) {
                            data = res.data.list;
                        } else {
                            data = this.result.list.concat(res.data.list);
                        }
                        this.result.list = data;
                        if (this.result.page * this.result.size >= res.data.count) {
                            this.result.finished = true;
                        } else {
                            this.result.loading = false;
                        }
                        res.data.list.forEach((e, i) => {
                            e.user_id = res.data.user_id;
                            e.sku.prices = e.sku.price.split(".");
                            e.sku.promotion_prices = e.sku.activity_price.split(".");
                            this.getImage(e.master_image, e);
                        });
                    } else {
                        this.result.list = [];
                        this.result.finished = true;
                        this.result.loading = false;
                    }
                })
                .catch((err) => {
                    this.result.finished = true;
                    this.result.loading = false;
                });
        },
        // 解决图片跨域
        getImage(url, e) {
            let _this = this;
            const xhr = new XMLHttpRequest();
            xhr.open("get", url, true);
            xhr.responseType = "blob";
            xhr.onload = function() {
                if (this.status == 200) {
                    e.goods_master_img = URL.createObjectURL(this.response);
                }
            };
            xhr.send();
        },
        async onShare(item) {
            this.payload = item;
            // this.$set(this, "payload", item);
            this.payload.share_url = window.location.protocol + "//" + window.location.host + "/goods/" + item.id + "/" + item.user_id;
            let res = await this.createQrcode(this.payload.share_url);
            this.$nextTick(() => {
                this.$set(this.payload, "qrcode", res);
                setTimeout(() => {
                    this.shareHandle(); //图片生成
                }, 1);
            });
        },
        shareHandle() {
            console.log("****");

            if (this.payload.disabledShare) return false;
            // this.payload.qrcode = this.result.qrcode;

            // this.result.share_img = this.payload.share_img;
            if (this.payload.share_img) {
                console.log("***");
                this.payload.shareWindow = true;
                onShare(this.payload, this.payload.sku);
            } else {
                this.saverImg();
            }
        },
        async saverImg() {
            let _this = this;
            this.$toast.loading("图片生成中...");
            await html2canvas(document.getElementById("canvas-container1"), {
                y: -10000,
                x: -10000,
                useCORS: true, // 【重要】开启跨域配置
                allowTaint: true, //允许跨域图片
                taintTest: false, //是否在渲染前测试图片
                backgroundColor: null,
                scale: window.devicePixelRatio * 2,
            })
                .then((img) => {
                    this.$toast.clear();
                    _this.$set(this.payload, "shareWindow", true);
                    _this.payload.share_img = img.toDataURL();
                    onShare(_this.payload, _this.payload.sku);
                })
                .catch((err) => {
                    console.log("error", err);
                });
        },
        async createQrcode(val) {
            const w = 70,
                cw = 20;
            const cvs = createCanvas(1, 1);
            const url = await QRcode.toCanvas(cvs, val, {
                errorCorrectionLevel: "L",
                margin: 0,
            });
            const canvas = createCanvas(w, w);
            const ctx = canvas.getContext("2d");
            const img = await loadImage("/img/logo.png");
            ctx.drawImage(url, 0, 0, url.width, url.width, 0, 0, w, w);
            const center = (w - cw) / 2;
            ctx.drawImage(img, center, center, cw, cw);
            this.payload.disabledShare = false;
            return canvas.toDataURL("image/png");
        },
        closeShare() {
            closeShare();
        },
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
};
</script>
<style lang="less" scoped>
.pull-module {
    position: relative;
    min-height: 100vh;
    background: linear-gradient(#ff5454, #ff3e3e, #e30000);
    .pull-bg {
        display: block;
        height: 30.5rem;
        background-image: url(../../assets/images/pull/pull_bg.png);
        background-image: image-set(url("../../assets/images/pull/pull_bg.png") 2x, url("../../assets/images/pull/pull_bg@2x.png") 3x);
        background-size: 100% 100%;
        background-repeat: no-repeat;
    }
    header {
        height: 50px;
        background: transparent;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        z-index: 10;
        .header-bar {
            display: flex;
            align-items: center;
            flex-wrap: nowrap;
            flex: 1 1 auto;
            height: 100%;
            .header-btn {
                display: block;
                width: 1.375rem;
                line-height: 3.125rem;
                margin: 0 1rem;
                color: #ffffff;
                border-radius: 50%;

                .icon {
                    display: inline-block;
                    background-color: transparent;
                    background-repeat: no-repeat;
                    background-size: 100% 100%;
                    width: 1rem;
                    height: 1rem;
                    //   transform: scale(0.6);

                    &.icon-back {
                        background-image: url("~@/assets/images/common/icon-back@2x.png");
                        background-image: image-set(
                            url("~@/assets/images/common/icon-back.png") 2x,
                            url("~@/assets/images/common/icon-back@2x.png") 3x
                        );
                    }
                }
            }
        }
    }

    .placeholder {
        flex: 1;
    }

    .pull-wrap {
        position: relative;
        width: 100%;
        margin-top: -17.5rem;
        border: 1rem solid transparent;
        /deep/.van-list {
            padding: 2.5rem 0.625rem 0.625rem 0.625rem;
            background: rgba(255, 230, 153, 1);
            border-radius: 6px;
            overflow: hidden;
        }
        .pull-header {
            display: table;
            margin-right: auto;
            margin-left: auto;
            table-layout: fixed;
            width: auto;
            position: relative;
            bottom: -22px;
            .header-cover {
                display: flex;
                width: 12.3125rem;
                height: 2.625rem;
                line-height: 2.625rem;
                border-radius: 2rem;
                color: #fff;
                text-align: center;
                background-color: #e30000;
                box-shadow: 0px 0px 10px #fff inset;
                align-items: center;
                justify-content: center;
                flex-wrap: wrap;
                .divider {
                    display: flex;
                    align-items: center;
                    color: #fff;
                    font-size: 1.125rem;
                    line-height: 24px;
                    text-align: center;
                    padding: 0 0.625rem;
                    letter-spacing: 2px;

                    // border-color: #ebedf0;
                    // border-style: solid;
                    // border-width: 0;
                    // height: 6px;
                    // width: 6px;
                    // border-radius: 50%;
                    // background: #971007;
                    // &::before,
                    // &::after {
                    //     content: "";
                    //     display: block;
                    //     flex: 1;
                    //     box-sizing: border-box;
                    //     height: 6px;
                    //     width: 6px;
                    //     border-radius: 50%;
                    //     background: #971007;
                    // }
                    // &::before {
                    //     margin-right: 2rem;
                    // }
                    // &::after {
                    //     margin-left: 2rem;
                    // }
                }
                .dot {
                    // flex: 1;
                    height: 6px;
                    width: 6px;
                    border-radius: 50%;
                    background: #971007;
                }
            }
        }
    }
}

.list-group {
    .list-item {
        padding: 0.75rem;
        display: flex;
        overflow: hidden;
        background: #ffffff;
        border-radius: 6px;

        & + .list-item {
            // border-top: 0.75rem solid #ffe699;
            margin-top: 0.75rem;
        }
        .list-cover {
            flex-shrink: 0;
        }

        .list-cell {
            width: 100%;
            border-left: 0.625rem solid transparent;
            .list-meta {
                display: flex;
                margin: 0.375rem 0;
                overflow: hidden;

                .placeholder {
                    flex: 1;
                }

                .text-price {
                    color: #ff6966;
                }
            }
        }

        .pull-title {
            margin: 0;
            // line-height: 18px;
            overflow: hidden;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            display: -webkit-box;
            text-align: justify;
            white-space: pre-wrap; //中文换行
            word-break: break-word; //英文换行，以单词为依据
            // text-overflow: ellipsis;
        }
    }
}
</style>
