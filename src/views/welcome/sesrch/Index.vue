<template>
    <div>
        <form action="/">
            <div :style="{ height: heights + 'px', background: 'rgb(245, 245, 245)' }" v-if="iosShow" class="headIos"></div>
            <van-search
                v-model="q"
                class="search-box"
                :placeholder="data.keywords"
                show-action
                @search="onSearch"
                @cancel="onCancel"
                background="#f5f5f5"
                shape="round"
                @input="onSuggest"
            />
        </form>
        <div class="search-content">
            <div class="py-2">
                <van-cell :border="false">
                    <div slot="title" class="align-middle"><strong class="fs-14 text-33">最近搜索</strong></div>
                    <van-icon @click="deleteHistory" slot="right-icon" size="20" class="align-middle text-66" name="delete" />
                    <div slot="label">
                        <router-link
                            @click.native="saveHistory(item)"
                            v-for="(item, index) in history"
                            :key="index"
                            class="keywords-container"
                            :to="'/search/goods?q=' + item"
                            >{{ item }}</router-link
                        >
                    </div>
                </van-cell>
            </div>
            <div class="py-2">
                <van-cell :border="false">
                    <div slot="title" class="align-middle"><strong class="fs-14 text-33">搜索发现</strong></div>
                    <van-icon slot="right-icon" @click="getRange" size="20" class="align-middle text-66" name="replay" />
                    <div slot="label">
                        <router-link
                            @click.native="saveHistory(item)"
                            v-for="(item, index) in data.hot"
                            :key="index"
                            class="keywords-container"
                            :to="'/search/goods?q=' + item"
                            >{{ item }}</router-link
                        >
                    </div>
                </van-cell>
            </div>
            <van-cell-group v-show="q" style="position: absolute;width: 100%;top: 54px;z-index: 999;">
                <van-cell :to="'/search/goods?q=' + q" icon="search" :title="q"></van-cell>
                <van-cell
                    @click="saveHistory(item.text)"
                    v-for="(item, index) in suggest"
                    :key="index"
                    :to="'/search/goods?q=' + item.text"
                    icon="search"
                    :title="item.text"
                ></van-cell>
            </van-cell-group>
        </div>
    </div>
</template>

<script>
import { Search, Icon, Cell, Dialog, CellGroup } from "vant";
export default {
    components: {
        Search,
        Icon,
        Cell,
        Dialog,
        CellGroup,
    },
    data() {
        return {
            q: "",
            data: {
                history: [],
                hot: [],
            },
            suggest: [],
            history: [],
            iosShow: false,
            heights: 0,
        };
    },
    methods: {
        onSearch() {
            let q = this.q ? this.q : this.data.keywords;
            this.saveHistory(q);
            this.$router.push("/search/goods?q=" + q);
        },
        onCancel() {
            this.$router.go(-1);
        },
        deleteHistory() {
            Dialog.confirm({
                title: "删除提示",
                message: "您真的要删除历史记录吗",
            })
                .then(() => {
                    localStorage.removeItem("history");
                    this.history = [];
                })
                .catch(() => {});
        },
        getRange() {
            this.$apps.http
                .get("/search/hot/range", {})
                .then((res) => {
                    if (res.code === 1) {
                        this.$set(this.data, "hot", res.data);
                    }
                })
                .catch((err) => {});
        },
        onSuggest(q) {
            if (q) {
                this.$apps.http
                    .get("/search/suggest", {
                        q: q,
                    })
                    .then((res) => {
                        if (res.code === 1) {
                            this.suggest = res.data;
                        }
                    })
                    .catch((err) => {});
            }
        },
        saveHistory(keywords) {
            let history = this.getHistory();
            if (history) {
                let index = history.indexOf(keywords);
                if (index > -1) {
                    history.splice(index, 1);
                }
            }
            if (!history) history = [];
            history.unshift(keywords);
            localStorage.setItem("history", JSON.stringify(history));
        },
        getHistory() {
            let history = localStorage.getItem("history");
            return JSON.parse(history);
        },
    },
    created() {
        this.history = this.getHistory();
        console.log(this.history);
        this.$apps.http
            .get("/search/hot", {})
            .then((res) => {
                if (res.code === 1) {
                    this.data = res.data;
                }
            })
            .catch((err) => {});
    },
    mounted() {
        this.$nextTick(() => {
            if (!this.$apps.isAndroid()) {
                let head = document.querySelector(".search-box");
                this.heights = window.ios != undefined ? window.ios.statusHeight() : 20;
                if (this.heights > 40) {
                    this.heights = 0;
                    this.iosShow = false;
                    return;
                } else {
                    head.style.paddingTop = Number(this.heights) + 10 + "px";
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

<style lang="less">
.keywords-container {
    background: #f2f2f2;
    color: #666666;
    height: 1.8rem;
    line-height: 1.8rem;
    padding: 0 1rem;
    display: inline-block;
    border-radius: 0.9rem;
    margin-top: 0.5rem;
    margin-right: 0.5rem;
}
.van-search__content {
    background: #ffffff !important;
}
.van-search__action {
    color: #666666;
}
</style>
