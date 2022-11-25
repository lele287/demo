<script setup lang="ts">
import { defineAsyncComponent, shallowRef } from "vue";

const dataList = [
  {
    name: "sign",
    explain: "签名，基于canvas画布实现",
    component: defineAsyncComponent(() => import("./Sign.vue")),
  },
];

const itemComponent = shallowRef();

function getComponent(name: string) {
  return dataList.find((item) => {
    return item.name === name;
  })?.component;
}

function goComponent(name: string) {
  itemComponent.value = getComponent(name);
}
</script>

<template>
  <div v-show="!itemComponent?.name">
    <div
      v-for="item in dataList"
      :key="item.name"
      class="tabs"
      @click="goComponent(item.name)"
    >
      <span> 组件名称：{{ item.name }} </span>
      <span> 组件描述：{{ item.explain }} </span>
    </div>
  </div>
  <div v-show="itemComponent?.name">
    <div class="return" @click="itemComponent = undefined">＜返回</div>
    <component :is="itemComponent"></component>
  </div>
</template>

<style scoped>
.tabs {
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 50px;
  background: #e8f3fe;
  margin: 10px;
  color: #7dbcfc;
  cursor: pointer;
}
.return {
  cursor: pointer;
  margin: 20px 0;
}
</style>
