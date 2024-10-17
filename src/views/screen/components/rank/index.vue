<template>
  <div class="rank-box">
    <div class="title">
      <p>热门景区排行</p>
      <img src="../../images/dataScreen-title.png" alt="" />
    </div>
    <!-- 图形图表的容器 -->
    <div class="charts" ref="charts"></div>
  </div>
</template>
<script lang="ts" setup name="Rank">
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'
// 获取DOM节点
let charts = ref()

onMounted(() => {
  // 一个容器可以展示多种类型的图形图表
  let mycharts = echarts.init(charts.value)
  mycharts.setOption({
    title: {
      // 主标题
      text: '景区排行',
      link: 'https://www.baidu.com',
      // 标题位置
      left: '50%',
      // 主标题文字样式
      textStyle: {
        color: 'yellowgreen',
        fontSize: 20,
      },
      subtext: '各大景区排行',
      // 子标题样式
      subtextStyle: {
        color: 'yellowgreen',
        fontSize: 16,
      },
    },
    // x|y轴组件
    xAxis: {
      type: 'category', // 图形图表在x轴均匀分布
    },
    yAxis: {},
    // 布局组件
    grid: {
      left: 20,
      bottom: 20,
      right: 20,
    },
    // 系列：决定显示的图形图表的类型
    series: [
      {
        type: 'bar',
        data: [10, 20, 30, 40, 50, 60, 70],
        // 柱状图：图形上的文本标签
        label: {
          show: true,
          // 文字的位置
          position: 'insideTop',
          // 文字颜色
          color: 'yellowgreen',
        },
        // 是否显示背景颜色
        showBackground: true,
        backgroundStyle: {
          // 北京颜色
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
                color: 'blue', // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
        },
        // 柱条的颜色
        itemStyle: {
          borderRadius: [10, 10, 0, 0],
          // 柱条颜色
          color: function (data: any) {
            // 给每一个柱条设置背景颜色
            let arr = ['red', 'orange', 'yellowgreen', 'green', 'purple', 'hotpink', 'skyblue']
            return arr[data.dataIndex]
          },
        },
      },
      {
        type: 'line',
        data: [10, 20, 30, 40, 50, 60, 90],
        smooth: true, // 平滑曲线
      },
    ],
    tooltip: {
      backgroundColor: 'rgba(50,50,50,0.7)',
    },
  })
})
</script>
<style scoped lang="scss">
.rank-box {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  margin: 20px 0px;

  .title {
    margin-left: 10px;
    margin-top: 20px;
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
