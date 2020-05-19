<template>
    <!-- 评论列表 -->
    <van-list class="list-group" v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <van-cell-group :border="false" v-for="item in list" :key="item.id">
            <van-cell :border="false">
                <van-image round lazy-load width="2.5rem" height="2.5rem" :src="item.buyer.avatar || '/img/avatar.png'" />
                <div class="content">
                    <div class="top-bar">
                        <span class="strong text-secondary fs-12">{{ item.buyer.nick }}</span>
                        <label class="time text-gray fs-12">{{ item.create_time }}</label>
                    </div>
                    <div>
                        <van-rate
                            v-model="item.evaluate"
                            readonly
                            color="linear-gradient(140deg,rgba(254,193,36,1) 0%,rgba(251,168,35,1) 100%)"
                            :size="12"
                            void-icon="star-o"
                            void-color="#D8D8D8"
                        />
                    </div>
                </div>
            </van-cell>
            <div class="discuss-content">
                <p class="m-0 text-secondary-dark">
                    {{ item.content }}
                </p>
                <div class="images" v-show="item.images">
                    <div class="van-uploader__preview" v-for="(image, index) in item.images" :key="index">
                        <van-image radius="3px" lazy-load width="5rem" height="5rem" :src="image" @click="imagePreview(item.images)" />
                    </div>
                </div>
                <div class="prod-item mt-3">
                    <van-image radius="3px" lazy-load width="4.5rem" height="4.5rem" :src="item.goods.master_image" />
                    <div class="prod-content">
                        <p class="text-secondary-dark strong">名称：{{ item.goods.name }}</p>
                        <p>
                            ¥<span class="text-primary fs-14 strong"> {{ item.goods.min_price }}</span>
                        </p>
                        <!-- <div class="button-group p-0" v-show="item.is_append == 0">
                            <van-button round class="px-2" plain color="#FB5C70" size="mini" :hairline="true" @click="goto(item, 'review')"
                                >追加评论</van-button
                            >
                        </div> -->
                    </div>
                </div>
            </div>
        </van-cell-group>
    </van-list>
</template>

<script>
import { isloading } from "../../utils/utils";
import { ImagePreview } from "vant";
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
        immediate: {
            type: Boolean,
            default: true,
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
            isActive: false,
            current: 0,
        };
    },
    created() {
        // this.fetchData();
    },
    mounted() {},
    methods: {
        onLoad() {
            let page = 0;
            page = this.current + 1;
            this.fetchData(page);
        },
        goto(item, route) {
            this.$router.push("/member/comment/" + route + "/" + item.id);
        },
        fetchData(page) {
            try {
                let formdata = {
                    page: page,
                    limit: this.size,
                };
                this.$apps.http
                    .get("/user/comment/list", formdata)
                    .then((res) => {
                        if (res.code == 1) {
                            if (res.data.list.length == 0) this.finished = true;
                            if (res.data.page == 1) {
                                this.list = res.data.list;
                            } else {
                                this.list = this.list.concat(res.data.list);
                            }
                            this.page = parseInt(res.data.count) / parseInt(res.data.limit);
                            this.current++;
                            this.loading = false;
                        }
                    })
                    .catch((err) => {});
            } catch (err) {
                console.log(err);
            }
        },
        imagePreview(image) {
            ImagePreview({
                images: image,
                closeable: true,
                lazyLoad: true,
            });
        },
    },

    watch: {},
    deactivated() {},
    updated() {},
};
</script>

<style lang="less" scoped>
.page {
    .van-cell {
        .van-cell__value {
            display: flex;

            .van-image {
                min-width: 40px;
                min-height: 40px;
            }
        }
    }
    .discuss-content {
        font-size: 0.875rem;
        padding: 0 1rem 1rem 4.175rem;
        background-color: #ffffff;
        .images {
            display: flex;
            flex-wrap: wrap;
            padding-top: 1rem;
        }
        .prod-item {
            background: rgba(250, 250, 250, 1);
            border-radius: 4px;
            padding: 1rem;
        }
    }
}
</style>
