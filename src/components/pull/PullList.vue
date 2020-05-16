<template>
    <div class="list-group record-module">
        <div class="list-item" v-for="(item, index) in list" :key="index" :to="'/goods/' + item.id">
            <van-image
                lazy-load
                fit="cover"
                class="list-cover"
                radius="6px"
                width="4.625rem"
                height="4.625rem"
                :src="item.master_image | imageView(200, 148)"
            />
            <div class="list-cell">
                <h4 class="pull-title">{{ item.name }}</h4>
                <p class="list-meta text-gray fs-12">
                    <span style="text-decoration:line-through">原价：¥{{ item.max_price | NumberFormat(item.max_price) }}</span>
                    <span class="placeholder"></span>
                    <span class="list-meta-r">{{ item.sale_nums }}人领取</span>
                </p>
                <div class="list-meta mt-2">
                    <div class="list-meta-l  text-price">
                        <span class="">¥ </span>
                        <span class="fs-16 strong"> {{ item.min_price | NumberFormat(item.min_price) }}</span>
                    </div>
                </div>
                <div class="list-meta search-tags">
                    <van-tag color="#EEEEEE" text-color="#666666">免费领取</van-tag>
                    <van-tag color="#D53329" text-color="#FFFFFF" style="margin-left: 0.625rem;" @click="onShare(item)">分享好友</van-tag>
                </div>
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
                <van-image fit="cover" class="w-100" :src="result.share_img" />
            </div>
        </van-dialog>
        <!--分享图片-->
        <div v-show="payload.master_image" class="canvas-container1" id="canvas-container1" ref="shareContainer">
            <div class="w-100" style="height: 320px">
                <van-image fit="cover" :width="320" :height="320" class="share-goods-images" :src="result.goods_master_img" />
            </div>
            <div class="px-3 mt-3 fs-14 text-33">
                {{ result.name }}
            </div>
            <!-- <template v-if="result.buy_score > 0">
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
            </template> -->

            <div class="px-3">
                <van-row class="py-3 px-1" style="border-top: 1px dashed #f0f0f0">
                    <van-col span="7">
                        <van-image width="70" :src="result.qrcode" />
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
import QRcode from "qrcode";
import { createCanvas, loadImage } from "canvas";
import html2canvas from "html2canvas";
export default {
    components: {},
    props: {
        url: {
            type: String,
            default: "/detail",
        },
        active: {
            type: Number,
            default: 0,
        },
        list: {
            type: Array,
            default: function() {
                return [];
            },
        },
        immediate: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            payload: {
                disabledShare: true,
                qrcode: "",
                share_url: "",
                share_img: "",
            },
            result: {
                disabledShare: true,
                shareWindow: false,
                qrcode: "",
                share_url: "",
                share_img: "",
                goods_master_img: "",
            },
        };
    },
    created() {},
    mounted() {},
    methods: {
        goto(item, route) {
            this.$router.push("/member/service/" + route + "/" + item.id);
        },
        getImage(url) {
            let _this = this;
            const xhr = new XMLHttpRequest();
            xhr.open("get", url, true);
            xhr.responseType = "blob";
            xhr.onload = function() {
                console.log(this);
                if (this.status == 200) {
                    _this.result.goods_master_img = URL.createObjectURL(this.response);
                }
            };
            xhr.send();
        },
        onShare(item) {
            console.log(item);
            this.getImage(item.master_image);
            this.payload.share_url = window.location.protocol + "//" + window.location.host + "/goods/" + item.id + "/";
            this.createQrcode(this.payload.share_url).then((res) => {
                this.result.qrcode = res;
                this.shareHandle();
            });
            window.closeShare = this.closeShare;
            // }
        },
        shareHandle() {
            if (this.payload.disabledShare) return false;
            this.payload.qrcode = this.result.qrcode;
            this.payload.share_img = this.result.share_img;
            if (this.result.share_img) {
                this.result.shareWindow = true;
                onShare(this.goods, this.sku);
            } else {
                this.saverImg();
            }
        },
        async saverImg() {
            console.log("save");
            let _this = this;
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
                    // this.$toast.clear();
                    console.log(img);
                    _this.result.shareWindow = true;
                    _this.result.share_img = img.toDataURL();
                    _this.payload.share_img = _this.result.share_img;
                    // _.goods.save_img = _.share_img
                    onShare(_this.goods, _this.sku);
                    // FileSaver.saveAs(img.toDataURL(), "MASON-"+this.goods.name+".jpg")
                    // _.shareImage = img.toDataURL()
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

    watch: {
        shareWindow(newValue, oldValue) {
            if (!newValue) this.closeShare();
        },
    },
    deactivated() {},
    updated() {},
    filters: {
        imageView: function(value, w, h) {
            h = h ? h : w;
            return value + "?imageView2/1/w/" + w + "/h/" + h + "/interlace/1";
        },
    },
};
</script>

<style lang="less" scoped>
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
