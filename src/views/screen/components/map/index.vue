<template>
  <div class="map-box" ref="map">我是Map组件</div>
</template>
<script lang="ts" setup name="Map">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
// 引入中国地图的JSON数据
import chinaJSON from './chaina.json'
// 获取DOM元素
let map = ref()

// 注册中国地图
echarts.registerMap('china', chinaJSON as Parameters<typeof echarts.registerMap>[1])
onMounted(() => {
  let mychart = echarts.init(map.value)
  // 设置配置项
  mychart.setOption({
    // 地图组件
    geo: {
      map: 'china', // 中国地图
      roam: true, // 鼠标缩放效果
      // 地图位置调试
      left: 150,
      top: 150,
      right: 150,
      bootom: 150,
      // 地图上文字设置
      label: {
        show: true, // 显示文字
        color: 'white',
        // fontSize: 14,
      },
      itemStyle: {
        // 每一个多边形的样式
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
        opacity: 0.8,
      },
      // 地图高亮效果
      emphasis: {
        itemStyle: {
          color: 'red',
        },
        label: {
          fontSize: 40,
        },
      },
    },
    // 布局位置
    grid: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    },
    series: [
      {
        type: 'lines',
        data: [
          {
            coords: [
              [116.405285, 39.904989], // 起点
              [91.132212, 29.660361], // 终点
            ],
            // 统一样式设置
            lineStyle: {
              color: 'orange',
              width: 2,
            },
          },
          {
            coords: [
              [116.405285, 39.904989], // 起点
              [87.617733, 43.792818], // 终点
            ],
            // 统一样式设置
            lineStyle: {
              color: 'orange',
              width: 2,
            },
          },
        ],
        // 是否显示特效
        effect: {
          show: true,
          symbol:
            'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z',
          color: 'red',
          symbolSize: 15,
          trailLength: 0,
          period: 6,
        },
        lineStyle: {
          color: '#fff',
          width: 1,
          opacity: 0.6,
          curveness: 0.2,
        },
      },
    ],
  })
})
</script>
<style scoped></style>
