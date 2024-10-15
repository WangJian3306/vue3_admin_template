<template>
  <div class="container">
    <!-- 数据大屏展示内容区域 -->
    <div class="screen" ref="screen">
      <!-- 数据大屏顶部 -->
      <div class="top">
        <Top />
      </div>
      <div class="bottom">
        <div class="left">
          <Tourist class="tourist"></Tourist>
          <Sex class="sex"></Sex>
          <Age class="age"></Age>
        </div>
        <div class="center">
          <Map class="map"></Map>
          <Line class="line"></Line>
        </div>
        <div class="right">右侧</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup name="Screen">
import { ref, onMounted } from 'vue'
// 引入组件
import Top from './components/top/index.vue'
// 引入左侧三个子组件
import Tourist from './components/tourist/index.vue'
import Sex from './components/sex/index.vue'
import Age from './components/age/index.vue'

// 引入中间两个子组件
import Map from './components/map/index.vue'
import Line from './components/line/index.vue'

// 获取数据大屏展示内容盒子的DOM元素
let screen = ref()

onMounted(() => {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%, -50%)`
})

// 定义大屏缩放的比例
function getScale(w = 1920, h = 1080) {
  const ww = window.innerWidth / w
  const wh = window.innerHeight / h

  return ww < wh ? ww : wh
}

// 监听视口的变化
window.onresize = () => {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%, -50%)`
}
</script>
<style scoped lang="scss">
.container {
  width: 100vw;
  height: 100vh;
  background: url(./images/bg.png) no-repeat;
  background-size: cover;
  .screen {
    position: fixed;
    width: 1920px;
    height: 1080px;
    left: 50%;
    top: 50%;
    transform-origin: left top;
    .top {
      width: 100%;
      height: 40px;
    }
    .bottom {
      display: flex;
      .right {
        flex: 1;
      }
      .left {
        flex: 1;
        height: 1040px;
        display: flex;
        flex-direction: column;

        .tourist {
          flex: 1.2;
        }
        .sex {
          flex: 1;
        }
        .age {
          flex: 1;
        }
      }
      .center {
        flex: 2;
        display: flex;
        flex-direction: column;
        .map {
          flex: 4;
          // background: red;
        }
        .line {
          flex: 1;
          background: orange;
        }
      }
    }
  }
}
</style>
