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
    <MTable size="middle"
            ref="tableRef"
            :columns="columns"
            :loadData="loadData"
            :row-key="(row) => row.id"
            showRowSelection
            @selectedChange="onSelectedChange"
    >
      <template #operator>
        <a-space wrap style="margin-bottom: 6px">
          <a-button type="primary" :icon="h(PlusOutlined)" @click="editFormRef.onOpen()">新增</a-button>
          <a-popconfirm :title=" '确定要删除这 ' + selectedRowKeys.length + ' 条数据吗？'" :disabled ="selectedRowKeys.length < 1" @confirm="batchDelete">
            <a-button danger :icon="h(DeleteOutlined)" :disabled="selectedRowKeys.length < 1">
              批量删除
            </a-button>
          </a-popconfirm>
        </a-space>
      </template>
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
  <EditForm ref="editFormRef" @successful="tableRef.refresh()" />
</template>

<script setup>
  import scopeApi from '@/api/system/scopeApi.js'

  import { h, ref } from "vue"
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
  // 已选中的行
  const selectedRowKeys = ref([])
  // 表格列配置
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
      // res.data 为 {total, records}
      return res.data
    }).catch((err) => {
      console.error(err)
    })
  }
  // 选中行发生变化
  const onSelectedChange = (selectedKeys, selectedRows) => {
    selectedRowKeys.value = selectedKeys
    // console.log('onSelectedChange,selectedKeys:', selectedKeys);
  }

  // 删除
  const deleteScope = (record) => {
    let data = { ids: [record.id] }
    scopeApi.deleteScope(data).then((res) => {
      message.success(res.message)
      tableRef.value.refresh()
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
      tableRef.value.refresh()
    })
  }

</script>

<style scoped>
  /** 直接后代选择器 **/
  .ant-form-inline > .ant-form-item {
    margin-bottom: 12px !important;
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
