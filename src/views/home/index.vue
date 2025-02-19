<template>
  <div class="app-container">
    <a-row style="margin-top: 80px;">
      <a-col :offset="2" :span="8">
        <div class="main-box">
          <div class="title">MY管理系统</div>
          <div class="content">
            这是一个使用antdv组件的前端管理系统。<br/>
            使用前端技术栈有 Vue3 + Vite6 + TypeScript5 + Vue Router + Pinia + Ant Design Vue 4 等。
          </div>
        </div>
      </a-col>
      <a-col :offset="1" :span="10">
        <a-image :src="loginPng" :preview="false" />
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import loginPng from '@/assets/img/login.png'

</script>

<style scoped>

.main-box {
}
.title {
  font-size: 40px;
  font-weight: bold;
  padding-bottom: 10px;
}
.content {
  font-size: 20px;
  line-height: 36px;
}
.content .bold {
  font-weight: bold;
}
</style>