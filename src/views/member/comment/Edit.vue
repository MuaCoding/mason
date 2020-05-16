<template>
    <div>
        <header-bar title="修改评价" :border="false" :back="-1"></header-bar>
         <van-cell-group>
            <van-cell icon="location-o" title="商品描述">
                <van-rate icon="like" :color="switchColor" void-color="#eee" void-icon="like-o" v-model="rate"></van-rate>
            </van-cell>
            <div class="border-bottom-1">
                <van-field placeholder="请理性对当前商品进行评价" type="textarea"></van-field>
                <div class="p-3">
                    <van-uploader
                    v-model="fileList"
                    multiple
                    :max-count="5"
                    />
                </div>
            </div>
            <van-switch-cell v-model="checked" :active-color="switchColor" title="匿名评价" />
        </van-cell-group>
        <van-cell-group class="mt-3">
            <van-cell title="店铺评分"></van-cell>
            <van-cell title="物流评分">
                <van-rate icon="like" :color="switchColor" void-color="#eee" void-icon="like-o" v-model="rate"></van-rate>
            </van-cell>
            <van-cell title="服务态度">
                <van-rate icon="like" :color="switchColor" void-color="#eee" void-icon="like-o" v-model="rate"></van-rate>
            </van-cell>
        </van-cell-group>
    </div>
</template>

<script>
    import HeaderBar from '../../../components/common/HeaderBar'
    import { Cell, CellGroup, Button, Card, SubmitBar, Checkbox, List, Rate } from 'vant'
    export default {
        components: {
            HeaderBar, Cell, CellGroup, Button, Card, SubmitBar, Checkbox, List, Rate
        },
        data() {
            return {
                loading: false,
                finished: true,
                list: [],
                no: '',
                checked: true,
                rate: 2,
                fileList: [],
                switchColor: '#ee0a24'
            }
        },
        methods: {
            onLoad() {
                
            }
        },
    }
</script>

<style lang="less" scoped>

</style>