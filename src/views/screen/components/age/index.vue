<template>
  <div class="age-box">
    <div class="title">
      <p>年龄比例</p>
      <img src="../../images/dataScreen-title.png" alt="" />
    </div>
    <!-- 图形图表容器 -->
    <div class="charts" ref="charts"></div>
  </div>
</template>
<script lang="ts" setup name="Age">
import { ref, onMounted } from 'vue'
// 引入echarts
import * as echarts from 'echarts'

let charts = ref()

// 组件挂载完毕初始化图形图表
onMounted(() => {
  let mychart = echarts.init(charts.value)
  // 设置配置项
  let option = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      top: '40px',
      right: '30px',
      orient: 'vertical', // 图例组件方向
      textStyle: {
        color: 'white',
        fontSize: 14,
      },
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: true,
          position: 'inside',
          color: 'white',
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 1048, name: '军事' },
          { value: 735, name: '新闻' },
          { value: 580, name: '娱乐' },
          { value: 484, name: '财经' },
          { value: 300, name: '直播' },
        ],
      },
    ],
    // 调整图形图表位置
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
  }
  mychart.setOption(option)
})
</script>
<style scoped lang="scss">
.age-box {
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
    height: 260px;
  }
}
</style>
