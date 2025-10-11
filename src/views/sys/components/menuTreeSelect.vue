<template>
  <!-- 组织选择器 -->
  <a-tree-select
      v-model:value="selectValue"
      v-model:treeExpandedKeys="defaultExpandedKeys"
      :dropdown-style="{ maxHeight: '500px', overflow: 'auto' }"
      placeholder="请选择"
      allow-clear
      :tree-data="treeData"
      :field-names="{ children: 'children', label: 'name', value: 'code' }"
      :tree-line="{ showLeafIcon:false }"
      :tree-checkable="props.multiSelect"
      :show-checked-strategy="TreeSelect.SHOW_ALL"
      @change="onChange"
  />
</template>

<script setup lang="ts">
import resourceApi from "@/api/sys/resourceApi"

import { TreeSelect } from "ant-design-vue"

const props = defineProps({
  // 是否多选
  multiSelect: {
    type: Boolean,
    default: false
  },
  defaultValue: {
    type: [String, Array]
  },
  // 模块编码
  moduleCode: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['onChange'])
// 树节点被选中时调用(https://antdv.com/components/tree-select-cn#api)
const onChange = (value, label, extra) => {
  // 传递被选中的节点key
  emit('onChange', value, label, extra)
}

// 默认展开的节点
const defaultExpandedKeys = ref([])
const selectValue = ref()
const treeData = ref()

onMounted(() => {
  loadTreeData()
  selectValue.value = props.defaultValue
  console.log(selectValue.value)
})

// 加载左侧的树
const loadTreeData = () => {
  // 获取当前登陆者的orgTree 获取所有组织机构可使用orgApi.orgTree
  resourceApi.menuTreeSelector({}).then((res) => {
    if (res.data !== null) {
      const moduleList = res.data
      const moduleMenu = moduleList.find((e) => e.code === props.moduleCode)
      treeData.value = [moduleMenu]
      defaultExpandedKeys.value = [moduleMenu.code]
    }
  })

}

// 重新加载树的数据
const refresh = () => {
  loadTreeData()
}
// 暴露子组件的方法
defineExpose({
  refresh
})
</script>

<style scoped>

</style>
