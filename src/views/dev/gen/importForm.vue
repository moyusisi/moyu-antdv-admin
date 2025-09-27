<template>
  <a-drawer
      :open="visible"
      title="从数据表导入"
      :width="drawerWidth"
      :closable="false"
      :footerStyle="{display: 'flex', justifyContent: 'flex-end'}"
      :destroy-on-close="true"
      @close="onClose"
  >
    <template #extra>
      <a-button type="primary" size="small" @click="onClose"><CloseOutlined /></a-button>
    </template>
    <!-- 页面内容 -->
    <a-card size="small">
      <a-form ref="searchFormRef" :model="searchFormData">
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item name="searchKey">
              <a-input v-model:value="searchFormData.searchKey" placeholder="请输入关键词" allowClear />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-space>
              <a-button type="primary" :icon="h(SearchOutlined)" @click="loadTableData()">查询</a-button>
              <a-button :icon="h(RedoOutlined)" @click="reset">重置</a-button>
            </a-space>
          </a-col>
          <a-col :span="8" style="text-align: right">
            <a-button @click="addRows" :icon="h(PlusOutlined)" class="custom-btn">导入</a-button>
          </a-col>
        </a-row>
      </a-form>
      <a-table size="small"
               ref="tableRef"
               :columns="columns"
               :data-source="tableData"
               :row-key="(record) => record.tableName"
               :row-selection="rowSelection"
               :pagination="paginationRef"
               @change="handleTableChange"
               bordered>
        <template #bodyCell="{ column, record }">
        </template>
      </a-table>
    </a-card>
    <!-- 底部内容 -->
    <template #footer>
      <a-space>
        <a-button @click="onClose">关闭</a-button>
      </a-space>
    </template>
  </a-drawer>
</template>

<script setup>

  import { useSettingsStore } from "@/store";
  import { message } from "ant-design-vue";
  import { h } from "vue";
  import { PlusOutlined, RedoOutlined, SearchOutlined } from "@ant-design/icons-vue"
  import userApi from "@/api/sys/userApi"
  import codegenApi from "@/api/dev/codegenApi.js";

  const settingsStore = useSettingsStore()

  const columns = [
    {
      title: '表名称',
      dataIndex: 'tableName',
      align: 'center',
      resizable: true,
      width: 150
    },
    {
      title: '表描述',
      dataIndex: 'tableComment',
      align: 'center',
      resizable: true,
      width: 200
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center',
      width: 160
    },
    {
      title: '变更时间',
      dataIndex: 'updateTime',
      align: 'center',
      width: 160
    }
  ]

  // 默认是关闭状态
  const visible = ref(false)
  const title = ref()
  const emit = defineEmits({ successful: null })
  // 表单数据
  const searchFormRef = ref()
  const searchFormData = ref({})
  // table数据
  const tableRef = ref()
  // 表格中的数据(loadTableData中会更新)
  const tableData = ref([])
  // 已选中的菜单(loadTableData中会更新)
  const selectedRowKeys = ref([])
  // 列表选择配置
  const rowSelection = ref({
    checkStrictly: false,
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedKeys, selectedRows) => {
      selectedRowKeys.value = selectedKeys
      console.log('onChange,selectedKeys:', selectedKeys);
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
    hideOnSinglePage: true,
    onChange: (page, pageSize) => {
      // 处理分页切换的逻辑
      paginationRef.value.current = page
      paginationRef.value.pageSize = pageSize
    },
  })
  // 抽屉宽度
  const drawerWidth = computed(() => {
    return settingsStore.menuCollapsed ? `calc(100% - 80px)` : `calc(100% - 210px)`
  })

  // 打开抽屉
  const onOpen = (record) => {
    // 加载数据
    loadTableData()
    visible.value = true
  }
  // 关闭抽屉
  const onClose = () => {
    visible.value = false
  }
  // 表格查询
  const loadTableData = async () => {
    selectedRowKeys.value = []
    let param = { pageNum: paginationRef.value.current, pageSize: paginationRef.value.pageSize }
    const res = await codegenApi.tablePage(Object.assign(param, searchFormData.value))
    paginationRef.value.total = res.data.total
    tableData.value = res.data.records
  }
  // 分页、排序、筛选等操作变化时，会触发 change 事件
  const handleTableChange = (pagination, filters, sorter) => {
    let param = { pageNum: paginationRef.value.current, pageSize: paginationRef.value.pageSize }
    codegenApi.tablePage(Object.assign(param, searchFormData.value)).then((res) => {
      paginationRef.value.total = res.data.total
      tableData.value = res.data.records
    })
  }
  // 重置
  const reset = () => {
    searchFormData.value = {}
    paginationRef.value.current = 1
    loadTableData()
  }
  // 添加记录
  const addRows = () => {
    if (selectedRowKeys.value.length < 1) {
      message.warning('请选择一条或多条数据')
      return
    }
    let data = { tableNameSet: selectedRowKeys.value }
    codegenApi.importTable(data).then((res) => {
      message.success(res.message)
      emit('successful')
      // 添加之后重新加载数据
      loadTableData()
    })
  }
  // 调用这个函数将子组件的一些数据和方法暴露出去
  defineExpose({
    onOpen
  })
</script>

<style scoped>
  .ant-form-item {
    margin-bottom: 10px !important;
  }

  .custom-btn {
    background-color: #52C41AFF;
    border-color: #52C41AFF;
    color: #fff;
  }
  .custom-btn:hover {
    background-color: #79D84B;
    border-color: #79D84B;
    color: #fff;
  }
</style>
