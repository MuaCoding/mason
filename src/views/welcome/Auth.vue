<template>
    <div>
        <div class="text-center mt-5 pt-5">
            <van-loading type="spinner" />
        </div>
        <div class="text-center fs-14 text-99 mt-3">
            {{ $t('loading') }}
        </div>
    </div>
</template>

<script>
    import { Loading } from 'vant';
    export default {
        components: {
            Loading,
        },
        data() {
            return {
                token: '',
                url: '',
                openid: ''
            }
        },
        created () {

            this.$apps.session.rm('sessionid')

            this.token = encodeURI(this.$route.query.token);
            
            //  存储微信openid
            if (this.$route.query.openid != undefined && this.$route.query.openid != '') {
                sessionStorage.setItem('wx_openid', this.$route.query.openid)
            }

            this.url = this.$route.query.redirect;

            if (this.url) {
                this.$apps.session.set('redirect', this.url)
            }

            if (this.token == '' || this.token == null || this.token == undefined) {

                this.$router.push({
                    path: '/'
                })

                return false;
            } else {

                // this.url = this.url ? this.url : '/'

                //  请求登录
                this.$apps.http.get("/login/login", {
                    token: this.token
                }).then((result) => {
                    if (result.code === 1) {
                        localStorage.setItem('sessionid', result.data.ssid)
                        this.$apps.session.set('sessionid', result.data.ssid)
                        this.$router.push({
                            path: '/'
                        })
                    }
                }).catch((err) => {
                    
                });
            }


        },
    }
</script>

<style lang="less" scoped>

</style>