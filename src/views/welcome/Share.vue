<template>
    <div class="share-container">
        <div class="text-center p-5 mt-5">
            <van-image width="235" src="/img/share/logo.png" />
        </div>
        <div class="text-center share-text-container">
            <div class="text-white">好友给您分享了一份商品</div>
            <div class="text-white">快去查看吧</div>
            <van-image class="share-img-arrow" src="/img/share/arrow.png" />
        </div>
        <div class="p-5 sahre-botton-container">
            <div>
                <van-button v-clipboard:copy="copy_str"
      v-clipboard:success="download"
      v-clipboard:error="onError" size="large" icon="/img/share/search.png" block>查看当前分享商品</van-button>
            </div>
            <div class="mt-3">
                <van-button :url="h5_url" size="large" icon="/img/share/download.png" block>下载MASON APP</van-button>
            </div>
        </div>
        <!-- <div class="px-5">
            <div class="mt-3">
                <van-button color="linear-gradient(to right, #FB8F60, #FB5870)" :url="h5_url" type="primary" block>下载MASON APP</van-button>
            </div>
            <div class="mt-3">
                <van-button color="linear-gradient(to right, #FB8F60, #FB5870)" to="/" class="mt-3" type="primary" block>进入MASON商城首页</van-button>
            </div>
            <div class="mt-3">
                <van-button color="linear-gradient(to right, #FB8F60, #FB5870)" :to="goods_url" class="mt-3" type="primary" block>查看当前分享商品</van-button>
            </div>
        </div> -->
        <div class="wechat-tips" v-show="showWechatLine">
            <img src="../../assets/wechat_line.png" alt="" srcset="">
        </div>
        <van-dialog title="分享提示" v-model="showWechatLine" class="dialog_alert" :show-confirm-button="false">
            <div class="text-66 p-3 fs-14 pb-4 text-center">请点击右上角再点击“在浏览器中打开”</div>
        </van-dialog>
    </div>
</template>

<script>
    import CallApp from 'callapp-lib';
    export default {
        data() {
            return {
                showWechatLine: true,
                h5_url: '',
                goods_url: '',
                goods: {},
                id: 0,
                uid: '',
                app_url: '',
                copy_str: ''
            }
        },
        methods: {
            ua() {
                return navigator.userAgent.toLowerCase();
            },
            download() {
                let _ = this

                const lib = new CallApp({
                    scheme: {
                        protocol: _.app_url
                    },
                    fallback: _.h5_url,
                    appstore: _.h5_url,
                    yingyongbao: _.h5_url,
                    timeout: 5000
                })
                
                lib.open({
                    path: ''
                })
            },
            onError() {

            }
        },
        created () {
            let _ = this
            // console.log(navigator.userAgent, _.$apps.isQQAPPBrowser(), navigator.userAgent.indexOf('QBWebViewType') > -1, 
            // navigator.userAgent.indexOf('Mobile') > -1, navigator.userAgent.indexOf('MQQBrowser') == 0)
            _.showWechatLine = _.$apps.isWeChat() || _.$apps.isQQAPPBrowser()
            _.h5_url = process.env.VUE_APP_ERP_BASE_URL
            _.goods_url = _.$route.query.redirect
            let redirect = _.$route.query.redirect
            _.uid = redirect.split('/')[3] ? redirect.split('/')[3] : ''
            _.copy_str = 'mason:uid=' + _.uid + '&redirect=' + _.goods_url
            if (/iphone|ipad|ipod/.test(_.ua())) {
                _.app_url = 'ToMason://?uid=' + _.uid + '&redirect=' + _.goods_url
            } else if (/android/.test(_.ua())) {
                _.app_url = 'android://h5/openmason?uid=' + _.uid + '&redirect=' + _.goods_url
            } else {
                _.app_url = _.h5_url
            }
        },
        mounted () {
        },
    }
</script>

<style>
.wechat-tips {
  position: absolute;
  top: 30px;
  right: 30px;
  z-index: 10009;
}
.dialog_alert {
  top: 200px !important
}
.share-container {
    background: url(https://img.greendg.cn/2020/0401/0732597wHGBcS7.png);
    background-size: 100% 100%;
    height: 100%;
    width: 100%;
}
.share-text-container {
    position: absolute;
    width: 100%;
    top: 50%
}
.share-img-arrow {
    width: 60px;
    position: relative;
    top: -13px;
    margin-left: 150px;
}
.sahre-botton-container {
    position: absolute;
    width: 100%;
    top: 60%
}
.sahre-botton-container .van-button__text {
    color: #212121;
    margin-left: 9px;
}
</style>