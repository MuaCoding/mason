<template>
    <!-- <div class=""> -->
    <van-list
        class="goods-list goods-list-container"
        :value="isLoading"
        :finished="isFinished"
        finished-text=""
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
        ref="goodsList"
        :immediate-check="false"
    >
        <router-link :to="'/goods/' + item.id" class="goods-item" :key="index" v-for="(item, index) in goods.list">
            <div class="goods-item-images" style="position:relative;width:100%;height:0;padding-top: 100%;">
                <van-image
                    style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;"
                    width="100%"
                    height="100%"
                    fit="contain"
                    lazy-load
                    :src="item.master_image"
                ></van-image>
            </div>
            <div class="goods-item-info">
                <div class="goods-item-price fs-14 text-danger">￥ {{ item.min_price }}</div>
                <div class="goods-item-price fs-14 text-danger py-1">赠送美豆 {{ item.award_multiple }}</div>
                <h4 class="fs-12 text-66 goods-item-title m-0">{{ item.name }}</h4>
            </div>
        </router-link>
    </van-list>
    <!-- </div> -->
</template>

<script>
import { List, Cell, Lazyload, Image } from "vant";
export default {
    components: {
        List,
        Cell,
        Lazyload,
        Image
    },
    props: {
        isLoading: {
            type: Boolean,
            default: true
        },
        isFinished: {
            type: Boolean,
            default: false
        },
        params: {
            type: Object,
            default: {}
        }
    },
    methods: {
        onLoad() {
            console.log(12);
        },
        getData() {
            this.$apps.http
                .get("/search/goods", this.params)
                .then(res => {
                    if (res.code === 1) {
                        this.goods.count = res.data.count;
                        this.goods.size = res.data.size;
                        this.goods.page = res.data.page;
                        this.$set(this.goods, "list", this.goods.list.concat(res.data.list));
                    }
                })
                .catch(err => {});
        }
    },
    data() {
        return {
            goods: {
                list: [],
                count: 0,
                page: 1,
                size: 20
            },
            data: [],
            error: false
        };
    },
    created() {
        this.getData();
    },
    watch: {
        params: {
            deep: true,
            handler(newValue, oldValue) {
                console.log(newValue, oldValue);
            }
        }
    }
};
</script>

<style lang="less">
.goods-list-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0.5rem;
    background: #f6f6f6;
}
.goods-list-container .goods-item {
    width: calc(50% - 0.25rem);
    background: #ffffff;
    margin: 0.25rem 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-radius: 0.5rem;
}
.goods-item .goods-item-images img {
    width: 100%;
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
}
.goods-item-info {
    padding: 0.75rem;
}
.goods-item-title {
    line-height: 1.07rem;
    -webkit-line-clamp: 2;
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;
    height: 2rem;
    -webkit-box-orient: vertical;
}
.van-list__loading {
    width: 100%;
}
</style>
