<template>
  <a-table v-bind="$props"
           @resizeColumn="onResizeColumn"
  >
    <template #[item]="scope" v-for="item in renderArr">
      <slot v-if="item" :name="item" :scope="scope" v-bind="scope || {}"></slot>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import { Table } from "ant-design-vue"
import { ref, onMounted, useSlots } from 'vue'

// 组件props
const props = defineProps({
      ...Table.props
    }
)

// 自动获取父组件传递过来的插槽
const slots = useSlots()
// 获取父组件过来的插槽数量，便于循环
const renderArr = Object.keys(slots)



// 可伸缩列
const onResizeColumn = (w, column) => {
  column.width = w
}
</script>


<style scoped>

/** 长文本截断,超过200px省略(约26个字母，15个汉字的长度) **/
.large-text {
  display: inline-block;
  width: 200px;
  overflow-x: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
}
</style>