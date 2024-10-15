<template>
  <div class="line-box">
    <div class="title">
      <p>未来七天游客数量趋势图</p>
      <img src="../../images/dataScreen-title.png" alt="" />
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>
<script lang="ts" setup name="Line">
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'
// 获取图形图表的节点
let charts = ref()

onMounted(() => {
  let mycharts = echarts.init(charts.value)
  // 设置配置项
  mycharts.setOption({
    // 标题组件
    title: {
      text: '(访问量)',
    },
    // x|y轴
    xAxis: {
      type: 'category',
      // 两侧不留白
      boundaryGap: 0,
      // 分割线
      splitLine: {
        show: false,
      },
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      // 刻度
      axisTick: {
        show: true,
      },
    },
    yAxis: {
      // 分割线
      splitLine: {
        show: false,
      },
      // 轴线设置
      axisLine: {
        show: true,
      },
      // 刻度
      axisTick: {
        show: true,
      },
    },
    grid: {
      left: 40,
      top: 0,
      right: 0,
      bottom: 20,
    },
    series: [
      {
        type: 'line',
        data: [1, 240, 6, 100, 1, 200, 2],
        // 平滑曲线
        smooth: true,
        // 区域填充样式
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'red', // 0% 处的颜色
              },
              {
                offset: 1,
                color: 'blue', // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
        },
      },
    ],
  })
})
</script>
<style scoped lang="scss">
.line-box {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  margin: 0px 20px;

  .title {
    margin-left: 10px;
    p {
      color: white;
      font-size: 20px;
    }
  }
  .charts {
    height: calc(100% - 40px);
    // background: red;
  }
}
</style>
