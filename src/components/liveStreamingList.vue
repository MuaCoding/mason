<template>
    <div class="liveStreamingList">
        <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            :immediate-check="false"
            @load="onLoad"
            >
                <div class="scrollViewList">
                    <div class="list">
                        <div class="indexItemImage" v-for="(item,index) in list" :key="index + 'left'" v-if="(index+1) % 2 == 1">
                            <van-image :src="item.backgroundImg" mode="widthFix" width="165px" style="display:block"/>
                            <div class="tier"></div>
                            <div class="indexItem" @click="toDetail(activeItem)">
                                <div class="shopIco" @click.stop="toShop(item.id)"><van-image style="width: 20px; height: 20px;" :src="require('@/assets/line_shop.png')"/></div>
                                <div class="videoName">{{item.videoName}}</div>
                            </div>
                            <div class="hostNumber">
                                <div class="hostIco"><van-image style="width: 11.6px; height: 12.15px;" :src="require('@/assets/line_host.png')"/></div>
                                <div class="hostValue">1221</div>
                            </div>
                        </div>
                    </div>
                    <div class="list">
                        <div class="indexItemImage" v-for="(item,index) in list" :key="index + 'right'" v-if="(index+1) % 2 == 0">
                            <van-image :src="item.backgroundImg" mode="widthFix" width="165px" style="display:block"/>
                            <div class="tier"></div>
                            <div class="indexItem" @click="toDetail(activeItem)">
                                <div class="shopIco" @click.stop="toShop(item.id)"><van-image style="width: 20px; height: 20px;" :src="require('@/assets/line_shop.png')"/></div>
                                <div class="videoName">{{item.videoName}}</div>
                            </div>
                            <div class="hostNumber">
                                <div class="hostIco"><van-image style="width: 11.6px; height: 12.15px;" :src="require('@/assets/line_host.png')"/></div>
                                <div class="hostValue">1221</div>
                            </div>
                        </div>
                    </div>
                </div>
        </van-list>
    </div>
</template>

<script>
    export default {
        props: {
            url: {
                type: String,
                default: '/search/goods'
            }
        },
        data() {
            return {
                list: [
						{
							id:1,
							videoName:'多啦A梦爱上大雄',
							userName:'测试用户001',
							userImg:'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1531443473,1544646807&fm=26&gp=0.jpg',
							backgroundImg:'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1847196905,3063906101&fm=26&gp=0.jpg',
						},
						{
							id:2,
							videoName:'比卡丘给自己电死了',
							userName:'测试用户002',
							userImg:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1856346319,2858228248&fm=26&gp=0.jpg',
							backgroundImg:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1149372565,7505010&fm=26&gp=0.jpg',
						},
						{
							id:3,
							videoName:'奥特曼大战葫芦娃',
							userName:'测试用户001',
							userImg:'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1531443473,1544646807&fm=26&gp=0.jpg',
							backgroundImg:'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3920994805,1303779659&fm=26&gp=0.jpg',
						},
						{
							id:4,
							videoName:'蜡笔小新在线调戏美少女战士',
							userName:'测试用户002',
							userImg:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1856346319,2858228248&fm=26&gp=0.jpg',
							backgroundImg:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1070234938,1939070745&fm=26&gp=0.jpg',
						},
										{
							id:2,
							videoName:'比卡丘给自己电死了',
							userName:'测试用户002',
							userImg:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1856346319,2858228248&fm=26&gp=0.jpg',
							backgroundImg:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1149372565,7505010&fm=26&gp=0.jpg',
						},
						{
							id:3,
							videoName:'奥特曼大战葫芦娃',
							userName:'测试用户001',
							userImg:'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1531443473,1544646807&fm=26&gp=0.jpg',
							backgroundImg:'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3920994805,1303779659&fm=26&gp=0.jpg',
						},
				],
                loading: false,
                finished: false,
            }
        },
        methods: {
            onLoad() {
                if (this.page > 1 || this.firstLoad) this.getData(true)
            },
            toDetail(){
                // 跳转到原生直播页面
            },
            toShop(id){
                console.log('购物车')
            }
        }
    }
</script>

<style lang="scss">
.liveStreamingList {
    width: 100%;
    height: auto;
    background: #f7f7f7;
    padding-top:11px;
    .scrollViewList{
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        justify-content: space-between;
        align-content: flex-start;
        height: 100%;
        padding:0 16px;
        .list{
        width:165px;
        }
}
.indexItemImage{
    width: 165px;
    height:auto;
    margin:0 0 8px 0;
    position: relative;
    border-radius: 6px;
    overflow: hidden;
    .tier{
        width: 100%;
        height:100%;
        // height:calc(98% - 1px);
        position: absolute;
        left:0;
        top:0;
        z-index:1;
        border-radius: 6px;
        background:linear-gradient(180deg,rgba(0,0,0,0.4) 0%,rgba(255,255,255,0) 41%,rgba(32,32,32,0.1) 84%,rgba(0,0,0,0.54) 100%);
        box-shadow:0px 0px 4px 0px rgba(196,196,196,0.2);
    }
    .hostNumber{
        position: absolute;
        right:4px;
        bottom:11px;
        z-index: 1;
        display: flex;
        justify-content: space-between;
        max-width:55px;
        .hostIco{
           width: 11.6px;
           height: 12.15px;
        }
        .hostValue{
           width: auto;
           margin-left:2px;
           text-align: center;
           flex: 1;
           height: 12.15px;
           font-size:12px;
            font-weight:400;
            color:rgba(255,255,255,0.8);
            line-height:16px;
            text-shadow:0px 0px 4px rgba(196,196,196,0.2);
        }
    }
    .van-image{
        height:100% !important;
        img{
            height:100% !important;
            border-radius: 6px;
        }
    }

    .indexItem{
        width: 165px;
        height:100%;
        position: absolute;
        left:0;
        top:0;
        z-index:1;
        .shopIco{
            position: absolute;
            right:4px;
            top:4px;
            width: 20px;
            height: 20px;
        }
        .videoName{
            position: absolute;
            width: 100px;
            left:5px;
            bottom:6px;
            display: -webkit-box;
            overflow: hidden;
            white-space: normal !important;
            text-overflow: ellipsis;
            word-wrap: break-word;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            font-size:12px;
            font-weight:400;
            color:rgba(255,255,255,0.8);
            line-height:17px;
            text-shadow:0px 0px 4px rgba(196,196,196,0.2);
        }
    }
}
}
</style>