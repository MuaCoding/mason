<template>
    <div id="app">
        <transition :name="transitionName">
            <keep-alive>
                <!-- :key="routeKey" -->

                <router-view v-if="$route.meta.keepAlive" class="router-view" />
                <router-view :key="routeKey" v-else class="router-view" />
            </keep-alive>
        </transition>
        <loading :loading="loading"></loading>
    </div>
</template>

<script>
import Loading from "./components/common/Loading";
export default {
    data() {
        return {
            loading: false,
            iosShow: false,
            transitionName: "slide-left",
        };
    },
    components: {
        Loading,
    },
    created() {
        if (this.$route.params.from_id) {
            this.$store.dispatch(
                "SET_LOCALSTORAGE",
                JSON.stringify({
                    name: "FROMAPP",
                    value: this.$route.params.from_id,
                })
            );
        }
    },
    watch: {
        $route(to, from) {
            let isBack = localStorage.getItem("is_back");

            if (isBack == 1) {
                localStorage.setItem("is_back", 0);
                this.transitionName = "slide-left";
                if (to.name == "payResult" || !to) {
                    this.$router.replace("/");
                }
            } else {
                window.scrollTo(0, 0);
                this.transitionName = "slide-right";
            }
        },
    },
    computed: {
        routeKey() {
            return this.$route.path + Math.random();
        },
    },
    beforeDestroy() {},
};
</script>

<style lang="less">
@import url("/iconfont/iconfont.css");

#app {
    font-family: "PingFangSC-Medium", "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    bottom: constant(safe-area-inset-bottom);
    bottom: env(safe-area-inset-bottom);
}

#nav {
    padding: 30px;

    a {
        font-weight: bold;
        color: #2c3e50;

        &.router-link-exact-active {
            color: #42b983;
        }
    }
}
.van-nav-bar__right .van-icon,
.van-nav-bar__left .van-icon {
    font-size: 1.4rem;
    // color: #666666 !important;
}

.van-card {
    background: #ffffff !important;
}
.search-search-nav .van-nav-bar__title {
    max-width: 75%;
}
.van-dropdown-menu__title {
    color: #666666 !important;
    font-size: 0.875rem !important;
}
.mt-nav {
    margin-top: 46px;
}
.router-view {
    position: absolute;
    width: 100%;
    // height: 100%;
    transition: all 0.377s ease;
    // will-change: transform;
    top: 0;
    // backface-visibility: hidden;
    // perspective: 1000;
}
.slide-left-enter,
.slide-right-leave-active {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
}

.slide-left-leave-active,
.slide-right-enter {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
}

.van-hairline--top::after {
    border-width: 0 !important;
}
</style>
