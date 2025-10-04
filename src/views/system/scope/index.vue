<template>
  <!-- 上方选择区 -->
  <a-card size="small">
    <a-form ref="queryFormRef" :model="queryFormData" layout="inline">
      <a-flex wrap="wrap" gap="small">
        <a-form-item name="name" label="名称">
          <a-input v-model:value="queryFormData.name" placeholder="名称" allowClear />
        </a-form-item>
        <a-form-item name="code" label="编码">
          <a-input v-model:value="queryFormData.code" placeholder="编码" allowClear />
        </a-form-item>
        <a-form-item name="orgName" label="直属组织名称">
          <a-input v-model:value="queryFormData.orgName" placeholder="直属组织名称" allowClear />
        </a-form-item>
        <a-form-item name="createTime" label="创建时间">
          <a-range-picker v-model:value="queryFormData.createTimeRange" valueFormat="YYYY-MM-DD"/>
        </a-form-item>
        <a-form-item>
          <a-flex gap="small">
            <a-button type="primary" :icon="h(SearchOutlined)" @click="querySubmit">查询</a-button>
            <a-button :icon="h(RedoOutlined)" @click="reset">重置</a-button>
          </a-flex>
        </a-form-item>
      </a-flex>
    </a-form>
  </a-card>
  <a-card size="small">
    <a-row>
      <a-col :span="20" style="margin-bottom: 12px">
        <a-space wrap>
          <a-button type="primary" :icon="h(PlusOutlined)" @click="editFormRef.onOpen()">新增</a-button>
          <a-popconfirm title="确定要批量删除吗？" :disabled ="selectedRowKeys.length < 1" @confirm="batchDelete">
            <a-button danger :icon="h(DeleteOutlined)" :disabled="selectedRowKeys.length < 1">
              批量删除
            </a-button>
          </a-popconfirm>
        </a-space>
      </a-col>
      <a-col :span="4">
        <a-flex gap="small" class="tool-area" justify="flex-end" align="flex-start">
          <a-button :icon="h(PlusOutlined)" class="custom-btn" @click="null">操作</a-button>
        </a-flex>
      </a-col>
    </a-row>
    <MTable size="middle"
            ref="tableRef"
            :columns="columns"
            :loadData="loadData"
            :row-key="(row) => row.id"
            @selectedChange="onSelectedChange"
    >
      <template #bodyCell="{ column, record, index, text }">
        <!-- 长文本省略显示 -->
        <template v-if="text && text.length > 24">
          <a-tooltip :title="text">
            <span class="large-text">{{ text }}</span>
          </a-tooltip>
        </template>
        <template v-if="column.dataIndex === 'index'">
          <span>{{ index + 1 }}</span>
        </template>
        <template v-if="column.dataIndex === 'action'">
          <a-space>
            <a-tooltip title="编辑">
              <a @click="editFormRef.onOpen(record)">编辑</a>
            </a-tooltip>
            <a-tooltip title="删除">
              <a-popconfirm title="确定要删除吗？" @confirm="deleteScope(record)">
                <a style="color:#FF4D4F;">删除</a>
              </a-popconfirm>
            </a-tooltip>
          </a-space>
        </template>
      </template>
    </MTable>
  </a-card>
  <EditForm ref="editFormRef" @successful="loadData" />
</template>

<script setup>
  import scopeApi from '@/api/system/scopeApi.js'

  import { h } from "vue"
  import { PlusOutlined, DeleteOutlined, RedoOutlined, SearchOutlined } from "@ant-design/icons-vue"
  import { message } from "ant-design-vue"
  import EditForm from "./editForm.vue"
  import MTable from "@/components/MTable/index.vue"

  // 查询表单相关对象
  const queryFormRef = ref()
  const queryFormData = ref({})
  // 下拉框选项
  const exampleOptions = [
    { label: "选项一", value: 1 },
    { label: "选项二", value: 2 }
  ]
  // 其他页面操作
  const editFormRef = ref()

  /***** 表格相关对象 start *****/
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
      // console.log('onChange,selectedKeys:', selectedKeys);
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
      // 处理分页切换的逻辑
      paginationRef.value.current = page
      paginationRef.value.pageSize = pageSize
    },
  })
  // 表格列配置 TODO 根据字段生成
  const columns = ref([
    // 不需要序号可以删掉
    {
      title: '序号',
      dataIndex: 'index',
      align: 'center',
      width: 50,
    },
    {
      title: "名称",
      dataIndex: "name",
      align: "center",
      resizable: true,
      width: 150,
    },
    {
      title: "编码",
      dataIndex: "code",
      align: "center",
      resizable: true,
      width: 150,
    },
    {
      title: "直属组织名称",
      dataIndex: "orgName",
      align: "center",
      resizable: true,
      width: 150,
    },
    {
      title: "数据范围(字典 ",
      dataIndex: "dataScope",
      align: "center",
      resizable: true,
      width: 100,
    },
    {
      title: "排序顺序",
      dataIndex: "sortNum",
      align: "center",
      resizable: true,
      width: 100,
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      align: "center",
      width: 160,
    },
    // 单行操作，不需要可以删掉
    {
      title: '操作',
      dataIndex: 'action',
      align: 'center',
      width: 100,
    },
  ])
  /***** 表格相关对象 end *****/

  // 加载完毕调用
  onMounted(() => {
    // loadData()
  })

  // 提交查询
  const querySubmit = () => {
    tableRef.value.refresh()
  }
  // 重置
  const reset = () => {
    queryFormRef.value.resetFields()
    tableRef.value.refresh(true)
  }
  // 加载数据
  const loadData = (parameter) => {
    // 重新加载数据时，清空之前以选中的行
    selectedRowKeys.value = []
    // 分页参数
    let param = Object.assign(parameter, queryFormData.value)
    return scopeApi.scopePage(param).then((res) => {
      // paginationRef.value.total = res.data.total
      // tableData.value = res.data.records
      return res.data
    }).catch((err) => {
      console.error(err)
      tableRef.value.refresh()
    })
  }
  // 选中行发生变化
  const onSelectedChange = (selectedKeys, selectedRows) => {
    selectedRowKeys.value = selectedKeys
    console.log('onSelectedChange,selectedKeys:', selectedKeys);
  }

  // 可伸缩列
  // const onResizeColumn = (w, column) => {
  //   column.width = w
  // }
  // 删除
  const deleteScope = (record) => {
    let data = { ids: [record.id] }
    scopeApi.deleteScope(data).then((res) => {
      message.success(res.message)
      loadData()
    })
  }
  // 批量删除
  const batchDelete = (record) => {
    if (selectedRowKeys.value.length < 1) {
      message.warning("请至少选择一条数据")
      return
    }
    let data = { ids: selectedRowKeys.value }
    scopeApi.deleteScope(data).then((res) => {
      message.success(res.message)
      loadData()
    })
  }

</script>

<style scoped>
  /** 直接后代选择器 **/
  .ant-form-inline > .ant-form-item {
    margin-bottom: 12px !important;
  }
  /** 操作区 **/
  .tool-area {
    width: 100%;
    height: 100%;
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
