<template>
  <a-row>
    <a-col :span="20">
      <!-- 操作区插槽 -->
      <slot name="operator"></slot>
    </a-col>
    <a-col :span="4" style="min-height: 28px">
      <a-flex gap="small" class="tool-area" justify="flex-end" align="flex-center">
        <!-- 刷新 -->
        <a-tooltip v-if="props.toolConfig.refresh" title="刷新" @click="refresh">
          <sync-outlined class="tool-icon" />
        </a-tooltip>
        <!-- 列展示 -->
        <a-popover v-if="props.toolConfig.columnSetting" trigger="click" placement="topLeft" arrow-point-at-center>
          <template #content>
            <columnSetting :columns="props.columns" @columnChange="columnChange" />
          </template>
          <a-tooltip title="列设置">
            <component class="tool-icon" is="setting-outlined"></component>
          </a-tooltip>
        </a-popover>
        <!-- 表格密度 -->
        <a-dropdown v-if="props.toolConfig.height" trigger="click">
          <template #overlay>
            <a-menu selectable :selectedKeys="[localData.size]" @click="changeSize">
              <a-menu-item key="large">宽松</a-menu-item>
              <a-menu-item key="middle">中等</a-menu-item>
              <a-menu-item key="small">紧凑</a-menu-item>
            </a-menu>
          </template>
          <a-tooltip title="表格密度">
            <component class="tool-icon" is="column-height-outlined"></component>
          </a-tooltip>
        </a-dropdown>
      </a-flex>
    </a-col>
  </a-row>
  <a-table v-bind="{...renderTableProps}"
           ref="tableRef"
           :loading="dataLoading"
           :row-key="props.rowKey"
           :row-selection="rowSelection"
           :pagination="paginationRef"
           @change="onChange"
           @expand="onExpand"
           @resizeColumn="onResizeColumn"
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
import { ref, onMounted, useSlots, h } from 'vue'
import { tableProps } from 'ant-design-vue/es/table/Table.js'
import { DeleteOutlined, PlusOutlined, SyncOutlined } from "@ant-design/icons-vue"
import columnSetting from "@/components/STable/columnSetting.vue"

// 自动获取父组件传递过来的插槽
const slots = useSlots()
// 所有的事件均参考官方文档 https://www.antdv.com/components/table-cn#api
const emit = defineEmits(['selectedChange', 'change', 'expand', 'expandedRowsChange'])
// 获取父组件过来的插槽数量，便于循环
const slotKeys = computed(() => {
  return Object.keys(slots)
})
// 组件props 通过tableProps()支持Table原属性
const props = defineProps(
    Object.assign({}, tableProps(), {
      rowKey: {
        type: [String, Function],
        default: "id"
      },
      loadData: {
        type: Function,
        required: true
      },
      // 配置工具栏
      toolConfig: {
        type: Object,
        default: () => ({
          refresh: true,
          height: true,
          columnSetting: true
        })
      }
    })
)
// 本地数据,用于向tableProps赋值
const localData = reactive({
  dataSource: [],
  columnsSetting: [],
  size: props.size,
})

// 表格props，在a-table中后面设置属性会覆盖renderTableProps的同名属性
const renderTableProps = ref({})

const tableRef = ref()
// 表格的加载状态
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
  localData.columnsSetting = props.columns
  loadTableData()
})

const loadTableData = () => {
  if (!props.loadData) {
    console.error("loadData不是函数，无法加载数据")
    return
  }
  dataLoading.value = true
  // 重新加载数据时，清空之前选中的行
  rowSelection.value.onChange([],[])
  // 分页参数
  let param = { pageNum: paginationRef.value.current, pageSize: paginationRef.value.pageSize }
  props.loadData(param).then((data) => {
    paginationRef.value.total = data.total
    localData.dataSource = data.records ? data.records : []
    dataLoading.value = false
    getTableProps()
  }).catch((err) => {
    console.error(err)
  }).finally(() => {
    dataLoading.value = false
  })
}

// 动态加载table的props
const getTableProps = () => {
  let renderProps = Object.assign(tableProps(), props)
  const localKeys = Object.keys(localData)
  const propsKeys = Object.keys(renderProps)
  // localData中的同名属性赋值给renderProps
  localKeys.forEach((key) => {
    if (propsKeys.includes(key)) {
      renderProps[key] = localData[key]
    }
  })
  // columns赋值
  renderProps = {
    ...renderProps,
    columns: localData.columnsSetting.filter((value) => value.checked === undefined || value.checked),
  }
  // 将值为 undefined 或者 null 的 table里props属性进行过滤
  renderTableProps.value = Object.fromEntries(Object.entries(renderProps).filter(([k,v]) => v != null))
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

// 表格大小切换
const changeSize = (v) => {
  localData.size = v.key
  getTableProps()
}
// 列设置
const columnChange = (v) => {
  localData.columnsSetting = v
  getTableProps()
}

// 声明额外的选项
defineExpose({
  refresh
})

</script>


<style scoped>
/** 操作区 **/
.tool-area {
  width: 100%;
  height: 100%;
}
/** 操作区图标 **/
.tool-icon {
  font-size: 16px;
}
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