<template>
  <div class="year-box">
    <div class="title">
      <p>年度游客量对比</p>
      <img src="../../images/dataScreen-title.png" alt="" />
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>
<script lang="ts" setup name="Year">
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'
// 获取DOM节点
let charts = ref()

onMounted(() => {
  // 一个容器可以展示多种类型的图形图表
  let mycharts = echarts.init(charts.value)
  mycharts.setOption({
    title: {
      text: '散点图',
      left: '40%',
      textStyle: {
        color: 'white',
      },
    },
    xAxis: {
      type: 'category',
      show: true,
    },
    yAxis: {
      show: false,
    },
    grid: {
      left: 20,
      top: 20,
      right: 0,
      bottom: 20,
    },
    series: {
      type: 'scatter',
      data: [33, 88, 21, 9, 788, 234, 32, 54, 56, 55, 77, 88, 99, 33, 22, 1, 4, 5],
      // 标记图形设置
      symbol: 'diamond',
      symbolSize: 16,
      // 图文标签
      label: {
        show: true,
        position: 'top',
        color: 'yellowgreen',
      },
      // 散点图标记的颜色
      itemStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: 'black', // 0% 处的颜色
            },
            {
              offset: 1,
              color: 'red', // 100% 处的颜色
            },
          ],
          global: false, // 缺省为 false
        },
      },
    },
  })
})
</script>
<style scoped lang="scss">
.year-box {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  margin: 20px 0px;
  .title {
    margin-left: 20px;
    p {
      color: white;
      font-size: 20px;
    }
  }
  .charts {
    height: calc(100% - 30px);
  }
}
</style>
