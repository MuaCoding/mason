<template>
  <div>
    <van-nav-bar title="标题" left-text="返回" right-text="按钮" left-arrow />
    <!-- 退款日志 -->
    <van-collapse v-model="activeNames">
      <van-collapse-item title="退款日志" name="1">
        <van-cell
          title="售后完成"
          value="2019-11-01 10:23:21"
          label="卖家已完成售后服务并寄回商品给买家"
        />
        <van-cell
          title="售后完成"
          value="2019-11-01 10:23:21"
          label="卖家已完成售后服务并寄回商品给买家"
        />
      </van-collapse-item>
    </van-collapse>

    <!-- 卖家收货信息 -->
    <van-collapse v-model="takeName" style="margin-top: 1rem">
      <van-collapse-item title="卖家收货信息" name="1">
        <van-cell>
          <!-- 使用 title 插槽来自定义标题 -->
          <template #title>
            <span class="take-title">卖家收货人：</span>
            <span class="custom-title">三岁半小朋友</span>
          </template>
        </van-cell>
        <van-cell>
          <!-- 使用 title 插槽来自定义标题 -->
          <template #title>
            <span class="take-title">联系号码：</span>
            <span class="custom-title">13666660000</span>
          </template>
        </van-cell>
        <van-cell>
          <!-- 使用 title 插槽来自定义标题 -->
          <template #title>
            <span class="take-title">邮政编码：</span>
            <span class="custom-title">518000</span>
          </template>
        </van-cell>
        <van-cell>
          <!-- 使用 title 插槽来自定义标题 -->
          <template #title>
            <span class="take-title">收货地址：</span>
            <span class="custom-title"
              >广东省广州市天河区保利克洛维大厦709室</span
            >
          </template>
        </van-cell>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script>
import { NavBar, Collapse, CollapseItem, Cell, Panel } from "vant";
export default {
  data() {
    return {
      activeNames: ["1"],
      takeName: ["1"]
    };
  },
  components: {
    [NavBar.name]: NavBar,
    [Collapse.name]: Collapse,
    [CollapseItem.name]: CollapseItem,
    [Cell.name]: Cell,
    [Panel.name]: Panel
  }
};
</script>

<style lang="less">
.van-collapse-item__content {
  padding: 0 !important;
}
.van-cell {
  .van-cell__title {
    .van-cell__label {
      .ellipsis-mult(1);
    }
    .take-title {
      display: inline-block;
      width: 90px;
      font-size: 13px;
      text-align: justify;
      text-align-last: justify;
      color: #a0a9b5;
      //   &::after {
      //     // content: "";
      //     display: inline-block;
      //     width: 100%;
      //     overflow: hidden;
      //     height: 0;
      //   }
    }

    .custom-title {
      font-size: 13px;
    }
  }
}

.van-hairline--top-bottom::after {
  border-width: 1 !important;
}
</style>
