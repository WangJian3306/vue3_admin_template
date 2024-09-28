<template>
  <div>
    <h1>SKU管理</h1>
    姓：
    <input type="text" v-model="firstName" />
    <br />
    名：
    <input type="text" v-model="lastName" />
    <br />
    <button @click="changFullName">将全名改为li-si</button>
    全名:
    <span>{{ fullName }}</span>
    <br />
    <hr />

    <el-form>
      <el-form-item label="平台属性" v-if="show">
        <el-form :inline="true">
          <el-form-item v-for="(item, index) in selectArr2" :key="item.id" :label="item.attrName">
            <el-select style="width: 240px" v-model="attrValueList[index].attrIdAndValueId">
              <el-option
                :value="`${item.id}:${attrValue.id}`"
                v-for="attrValue in item.attrValueList"
                :key="attrValue.id"
                :label="attrValue.valueName"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
    </el-form>
    <br />
    <button @click="changeAtrr">修改Atrr的值</button>
    <el-select v-model="value" placeholder="Select" size="large" style="width: 240px">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>
<script lang="ts" setup name="Sku">
import type { Attr } from '@/api/product/attr/type'
import { ref, computed, watch, reactive } from 'vue'
const firstName = ref('zhang')
const lastName = ref('san')
const value = ref('')
// const selectValue = ref([])
const attrValueList = ref<{ attrIdAndValueId: string }[]>([])
const show = ref<boolean>(false)

// 只读
// let fullName = computed(()=>{
//   return firstName.value.slice(0,1).toUpperCase() + firstName.value.slice(1) + '-' + lastName.value
// })

// 可读可写
let fullName = computed({
  get() {
    return (
      firstName.value.slice(0, 1).toUpperCase() + firstName.value.slice(1) + '-' + lastName.value
    )
  },
  set(val) {
    const [str1, str2] = val.split('-')
    firstName.value = str1
    lastName.value = str2
  },
})

function changFullName() {
  fullName.value = 'li-si'
}

// const selectValue = computed({
//   get(){
//     return '38537:518112'
//   },
//   set(val){
//     // console.log(val)
//     let [attrId, valueId] = val.split(':')
//     attrValueList.value.push({
//       attrId,
//       valueId
//     })
//   }
// })

const selectArr = reactive([
  {
    id: 38537,
    createTime: null,
    updateTime: null,
    attrName: '颜色',
    categoryId: 997,
    categoryLevel: 3,
    attrValueList: [
      {
        id: 518112,
        createTime: null,
        updateTime: null,
        valueName: '黑色',
        attrId: 38537,
      },
      {
        id: 518114,
        createTime: null,
        updateTime: null,
        valueName: '白色',
        attrId: 38537,
      },
      {
        id: 518113,
        createTime: null,
        updateTime: null,
        valueName: '11',
        attrId: 38537,
      },
      {
        id: 518115,
        createTime: null,
        updateTime: null,
        valueName: '你好',
        attrId: 38537,
      },
    ],
  },
  {
    id: 38692,
    createTime: null,
    updateTime: null,
    attrName: '品牌',
    categoryId: 997,
    categoryLevel: 3,
    attrValueList: [
      {
        id: 515603,
        createTime: null,
        updateTime: null,
        valueName: '安踏',
        attrId: 38692,
      },
      {
        id: 515604,
        createTime: null,
        updateTime: null,
        valueName: '李宁',
        attrId: 38692,
      },
    ],
  },
  {
    id: 38694,
    createTime: null,
    updateTime: null,
    attrName: '防滑',
    categoryId: 997,
    categoryLevel: 3,
    attrValueList: [
      {
        id: 378150,
        createTime: null,
        updateTime: null,
        valueName: '雪地防滑',
        attrId: 38694,
      },
      {
        id: 378151,
        createTime: null,
        updateTime: null,
        valueName: '草地防滑',
        attrId: 38694,
      },
    ],
  },
  {
    id: 38872,
    createTime: null,
    updateTime: null,
    attrName: '鞋底厚度',
    categoryId: 997,
    categoryLevel: 3,
    attrValueList: [
      {
        id: 514110,
        createTime: null,
        updateTime: null,
        valueName: '12公分',
        attrId: 38872,
      },
      {
        id: 514109,
        createTime: null,
        updateTime: null,
        valueName: '9公分',
        attrId: 38872,
      },
      {
        id: 514111,
        createTime: null,
        updateTime: null,
        valueName: '9公分',
        attrId: 38872,
      },
    ],
  },
  {
    id: 40655,
    createTime: null,
    updateTime: null,
    attrName: '重量',
    categoryId: 997,
    categoryLevel: 3,
    attrValueList: [
      {
        id: 518345,
        createTime: null,
        updateTime: null,
        valueName: '1kg',
        attrId: 40655,
      },
    ],
  },
])

let selectArr2 = ref<Attr[]>([])

watch(
  selectArr2,
  (newValue) => {
    for (let index = 0; index < newValue.length; index++) {
      attrValueList.value.push({
        attrIdAndValueId: '',
      })
    }
  },
  { deep: true },
)

function changeAtrr() {
  selectArr2.value = [
    {
      id: 38537,
      createTime: null,
      updateTime: null,
      attrName: '颜色',
      categoryId: 997,
      categoryLevel: 3,
      attrValueList: [
        {
          id: 518112,
          createTime: null,
          updateTime: null,
          valueName: '黑色',
          attrId: 38537,
        },
        {
          id: 518114,
          createTime: null,
          updateTime: null,
          valueName: '白色',
          attrId: 38537,
        },
        {
          id: 518113,
          createTime: null,
          updateTime: null,
          valueName: '11',
          attrId: 38537,
        },
        {
          id: 518115,
          createTime: null,
          updateTime: null,
          valueName: '你好',
          attrId: 38537,
        },
      ],
    },
    {
      id: 38692,
      createTime: null,
      updateTime: null,
      attrName: '品牌',
      categoryId: 997,
      categoryLevel: 3,
      attrValueList: [
        {
          id: 515603,
          createTime: null,
          updateTime: null,
          valueName: '安踏',
          attrId: 38692,
        },
        {
          id: 515604,
          createTime: null,
          updateTime: null,
          valueName: '李宁',
          attrId: 38692,
        },
      ],
    },
    {
      id: 38694,
      createTime: null,
      updateTime: null,
      attrName: '防滑',
      categoryId: 997,
      categoryLevel: 3,
      attrValueList: [
        {
          id: 378150,
          createTime: null,
          updateTime: null,
          valueName: '雪地防滑',
          attrId: 38694,
        },
        {
          id: 378151,
          createTime: null,
          updateTime: null,
          valueName: '草地防滑',
          attrId: 38694,
        },
      ],
    },
  ]
  show.value = true
}

const options = [
  {
    value: 'Option1',
    label: 'Option1',
  },
  {
    value: 'Option2',
    label: 'Option2',
  },
  {
    value: 'Option3',
    label: 'Option3',
  },
]
</script>
<style scoped></style>
