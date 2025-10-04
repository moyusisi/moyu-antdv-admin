<template>
  <a-table v-bind="$attrs"
           ref="tableRef"
           :data-source="tableData"
           :loading="dataLoading"
           :row-key="props.rowKey"
           :row-selection="rowSelection"
           :pagination="paginationRef"
           @resizeColumn="onResizeColumn"
           @change="onChange"
           @expand="onExpand"
           @expandedRowsChange="onExpandedRowsChange"
           :scroll="{ x: 'max-content' }"
           bordered
  >
    <template v-for="slotKey in slotKeys" #[slotKey]="scope" >
      <slot v-if="slotKey" :name="slotKey" :scope="scope" v-bind="scope || {}"></slot>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import { ref, onMounted, useSlots } from 'vue'

// 组件props
const props = defineProps(
    Object.assign({}, {
      rowKey: {
        type: [String, Function],
        default: "id"
      },
      loadData: {
        type: Function,
        required: true
      },
    })
)

// 自动获取父组件传递过来的插槽
const slots = useSlots()
// 获取父组件过来的插槽数量，便于循环
const slotKeys = computed(() => {
  return Object.keys(slots)
})

// 所有的事件均参考官方文档 https://www.antdv.com/components/table-cn#api
const emit = defineEmits(['selectedChange', 'change', 'expand', 'expandedRowsChange'])

/***** 表格相关对象 *****/
const tableRef = ref()
// 表格的数据源
const tableData = ref([])
const dataLoading = ref(false)
// 已选中的行
const selectedRowKeys = ref([])
// 表格行选择配置
const rowSelection = ref({
  selectedRowKeys: selectedRowKeys,
  onChange: (selectedKeys, selectedRows) => {
    selectedRowKeys.value = selectedKeys
    // console.log('rowSelection中的onChange,selectedKeys:', selectedKeys);
    emit('selectedChange', selectedKeys, selectedRows)
  }
});
// 表格的分页配置
const paginationRef = ref({
  // 当前页码
  current: 1,
  // 每页显示条数
  pageSize: 10,
  // 总条数，需要通过接口获取
  total: 0,
  // 显示总记录数
  showTotal: (total, range) => `共 ${total} 条 `,
  // 是否可改变每页显示条数
  showSizeChanger: true,
  // 只有一页或没有数据时隐藏分页栏
  // hideOnSinglePage: true,
  onChange: (page, pageSize) => {
    console.log('paginationRef中的onChange...')
    // 处理分页切换的逻辑
    paginationRef.value.current = page
    paginationRef.value.pageSize = pageSize
  },
})

// 加载完毕调用
onMounted(() => {
  loadTableData()
})

const loadTableData = () => {
  dataLoading.value = true
  // 重新加载数据时，清空之前选中的行
  rowSelection.value.onChange([],[])
  // 分页参数
  let param = { pageNum: paginationRef.value.current, pageSize: paginationRef.value.pageSize }
  props.loadData(param).then((data) => {
    paginationRef.value.total = data.total
    tableData.value = data.records ? data.records : []
  }).catch((err) => {
    console.error(err)
  }).finally(() => {
    dataLoading.value = false
  })
}

// 分页、排序、筛选变化时触发
const onChange = (pagination, filters, sorter) => {
  loadTableData()
  console.log('table的onChange...')
  emit('change', pagination, filters, sorter)
}
// 点击展开图标时触发
const onExpand = (expanded, record) => {
  emit('expand', expanded, record)

}

// 点击展开图标时触发
const onExpandedRowsChange = (expandedRows) => {
  emit('expandedRowsChange', expandedRows)
}
// 可伸缩列
const onResizeColumn = (w, column) => {
  column.width = w
}

// 刷新
const refresh = (bool = false) => {
  if (bool) {
    paginationRef.value.current = 1
  }
  loadTableData()
}
// 声明额外的选项
defineExpose({
  refresh
})

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