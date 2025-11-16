<template>
  <a-card size="small">
    <a-form ref="queryFormRef" :model="queryFormData">
      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-item name="searchKey" label="账号">
            <a-input v-model:value="queryFormData.searchKey" placeholder="搜索账号" allowClear />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item>
            <a-flex gap="small">
              <a-button type="primary" :icon="h(SearchOutlined)" @click="querySubmit">查询</a-button>
              <a-button :icon="h(RedoOutlined)" @click="reset">重置</a-button>
            </a-flex>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-card>
  <a-card size="small">
    <MTable ref="tableRef"
            :columns="columns"
            :loadData="loadData"
            :row-key="(row) => row.id"
            @selectedChange="onSelectedChange"
    >
      <template #operator>
        <a-form ref="queryFormRef" :model="queryFormData">
          <a-row :gutter="24" style="margin-bottom: 6px">
            <a-col :span="8">
              <a-form-item name="searchKey">
                <a-input v-model:value="queryFormData.searchKey" placeholder="搜索账号" allowClear />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item>
                <a-flex gap="small">
                  <a-button type="primary" :icon="h(SearchOutlined)" @click="querySubmit">查询</a-button>
                  <a-button :icon="h(RedoOutlined)" @click="reset">重置</a-button>
                </a-flex>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </template>
      <template #bodyCell="{ column, record, index, text }">
        <template v-if="column.dataIndex === 'index'">
          <span>{{ index + 1 }}</span>
        </template>
        <template v-if="column.dataIndex === 'sessionId'">
          <!-- 长文本省略提示 -->
          <a-tooltip :title="text" placement="topLeft">
            <a-tag>{{ text }}</a-tag>
          </a-tooltip>
        </template>
        <template v-if="column.dataIndex === 'account'">
          <a-tooltip :title="text" placement="topLeft">
            <span>{{ text }}</span>
          </a-tooltip>
        </template>
        <template v-if="column.dataIndex === 'name'">
          <!-- 长文本省略提示 -->
          <a-tooltip :title="text" placement="topLeft">
            <span>{{ text }}</span>
          </a-tooltip>
        </template>
        <template v-if="column.dataIndex === 'sessionTimeout'">
          <span v-if="record.sessionTimeout <= 0">永久有效</span>
          <a-statistic-countdown v-else :value="record.deadline" format="D 天 H 时 m 分 s 秒" :valueStyle="{fontSize:'14px'}" />
        </template>

        <template v-if="column.dataIndex === 'action'">
          <a-space>
            <template #split>
              <a-divider type="vertical" />
            </template>
            <a-tooltip title="已登录令牌列表">
              <a style="color:#1980FF;" @click="tokenListRef.onOpen(record)">令牌列表</a>
            </a-tooltip>
            <a-tooltip title="强制退出">
              <a-popconfirm title="确定要强制退出此用户的所有登录吗？" placement="topLeft" @confirm="deleteSession(record)">
                <a style="color:#FF4D4F;">强退</a>
              </a-popconfirm>
            </a-tooltip>
          </a-space>
        </template>
      </template>
    </MTable>
  </a-card>
  <TokenList ref="tokenListRef" @successful="tableRef.refresh()"/>
</template>

<script setup>
  import monitorApi from "@/api/auth/monitorApi.js";

  import { h, ref } from "vue"
  import { PlusOutlined, DeleteOutlined, RedoOutlined, SearchOutlined } from "@ant-design/icons-vue"
  import { message } from "ant-design-vue"
  import MTable from "@/components/MTable/index.vue"
  import TokenList from "./tokenList.vue"

  const columns = [
    // 不需要序号可以删掉
    {
      title: '序号',
      dataIndex: 'index',
      align: 'center',
      width: 50,
    },
    {
      title: '账号',
      dataIndex: 'account',
      align: "center",
      resizable: true,
      ellipsis: true,
      width: 200
    },
    {
      title: '姓名',
      dataIndex: 'name',
      align: "center",
      resizable: true,
      ellipsis: true,
      width: 150
    },
    {
      title: '会话创建时间',
      dataIndex: 'sessionCreateTime',
      align: 'center',
      width: 160
    },
    {
      title: '最新登录时间',
      dataIndex: 'latestLoginTime',
      align: 'center',
      width: 160
    },
    {
      title: '有效期',
      dataIndex: 'sessionTimeout',
      align: 'center',
      width: 160
    },
    {
      title: "令牌数",
      dataIndex: "tokenCount",
      align: "center",
      resizable: true,
      width: 80,
    },
    {
      title: '操作',
      dataIndex: 'action',
      align: 'center',
      width: 160
    }
  ]
  const selectedRowKeys = ref([])

  // 定义tableDOM
  const tableRef = ref()
  const formRef = ref()
  const tokenListRef = ref()
  const queryFormRef = ref()
  const queryFormData = ref({})

  // 表格查询 返回 Promise 对象
  const loadData = (parameter) => {
    let param = Object.assign(parameter, queryFormData.value)
    return monitorApi.sessionPage(param).then((res) => {
      return res.data
    })
  }
  // 查询
  const querySubmit = () => {
    tableRef.value.refresh(true)
  }
  // 重置
  const reset = () => {
    queryFormRef.value.resetFields()
    tableRef.value.refresh(true)
  }
  // 选中行发生变化
  const onSelectedChange = (selectedKeys, selectedRows) => {
    selectedRowKeys.value = selectedKeys
    // console.log('onSelectedChange,selectedKeys:', selectedKeys);
  }
  // 删除
  const deleteSession = (record) => {
    let data = { codes: [record.account] }
    monitorApi.deleteSession(data).then((res) => {
      message.success(res.message)
      tableRef.value.refresh(true)
    })
  }
</script>

<style scoped>
  /** 后代选择器 **/
  .ant-card .ant-form {
    margin-bottom: -12px !important;
  }
  .ant-form-item {
    margin-bottom: 12px !important;
  }

</style>
