<template>
    <div class="goods-comments">
        <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            :immediate-check="immediate"
            @load="onLoad"
            style="background: #f7f7f7; padding-bottom: 10px"
            >
            <div v-for="(item, index) in list" :key="index">
                <div class="comment-item">
                    <van-cell-group :border="false" class="van-hairline--top">
                        <van-cell>
                            <van-image slot="icon" width="50" height="50" class="mr-2" round :src="item.buyer.avatar||'/img/avatar.png'"></van-image>
                            <div slot="title">
                                {{ item.buyer.nick ? item.buyer.nick : item.buyer.login_name }}
                                <div class="fs-12 text-66">
                                    <van-rate size="12" allow-half readonly color="#ee0a24" v-model="item.rate" />
                                </div>
                            </div>
                            <div slot="label">
                                <div class="comment-content">
                                    {{ item.content ? item.content : '默认评价' }}
                                </div>
                                <div><span class="float-right">{{item.create_time}}</span>{{item.sku.name||''}}</div>
                            </div>
                            <!-- <div class="fs-10">{{item.create_time}}</div> -->
                        </van-cell>
                    </van-cell-group>
                    <div class="pb-2 pl-6 pr-3 bg-white">
                        <van-image
                            v-for="(image, index1) in item.images" :key="index1"
                            @click="imagePreview(index1, item.images)"
                            class="mr-2"
                            width="80"
                            height="80"
                            :src="image"
                        />
                    </div>
                </div>
                <div class="p-1 bg-f6 clear"></div>
            </div>
        </van-list>
    </div>
</template>

<script>
    import {List, Rate, Cell, CellGroup, Image, ImagePreview} from 'vant'
    export default {
        components: {
            List, Rate, Cell, CellGroup, Image, ImagePreview
        },
        props: {
            goods_id: {
                type: String,
                default: '0'
            },
        },
        data() {
            return {
                list: [],
                loading: false,
                finished: false,
                count: 0,
                size: 10,
                page: 1,
                totalPage: 0,
                immediate: true
            }
        },
        methods: {
            onLoad() {
                this.getData(true)
            },
            getData(isConcat) {
                this.$apps.http.get('/goodsComment', {
                    goods_id: this.goods_id,
                    page: this.page
                }).then((result) => {
                    if (result.code === 1) {
                        try {
                            let comments = result.data.list
                            for (let i in comments) {
                                comments[i].rate = parseFloat((parseFloat(comments[i].service_score) + 
                                parseFloat(comments[i].logistics_score) + parseFloat(comments[i].descript_score)) / 3)
                                if (!comments[i].sku) {
                                    comments[i].sku = {}
                                }
                            }

                            if (this.page > 1) {
                                this.list = this.list.concat(comments)
                            } else {
                                this.list = comments
                            }
                            //(this.max > 0 && result.data.page == this.max) || 
                            this.totalPage = Math.ceil(result.data.count / result.data.limit)
                            if ((result.data.page * result.data.limit) > result.data.count) {
                                this.finished = true
                            }
                            ++this.page
                            this.loading = false;
                        } catch(err) {
                            console.error(err)
                        }
                        
                    }
                }).catch((err) => {
                    console.log(err)
                });
            },
            imagePreview(index, images) {
                ImagePreview({
                    images: images,
                    closeable: true,
                    lazyLoad: true
                })
            }
        },
        created () {
            // this.getData(false);
        },
    }
</script>

<style lang="less" scoped>

</style>