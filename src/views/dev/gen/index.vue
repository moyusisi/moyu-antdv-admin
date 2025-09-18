<template>
	<a-card size="small">
		<STable
			ref="tableRef"
			:columns="columns"
			:data="loadData"
			:alert="options.alert.show"
			bordered
			:row-key="(record) => record.id"
			:row-selection="options.rowSelection"
			:tool-config="toolConfig"
		>
			<template #operator>
        <a-form ref="searchFormRef" :model="searchFormData">
          <a-row :gutter="24">
            <a-col :span="7" offset="1">
              <a-form-item name="searchKey" label="搜索关键词">
                <a-input v-model:value="searchFormData.searchKey" placeholder="请输入关键词" allowClear />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-space>
                <a-button type="primary" :icon="h(SearchOutlined)" @click="tableRef.refresh(true)">查询</a-button>
                <a-button :icon="h(RedoOutlined)" @click="reset">重置</a-button>
              </a-space>
            </a-col>
          </a-row>
        </a-form>
			</template>
			<template #bodyCell="{ column, record }">
				<template v-if="column.dataIndex === 'code'">
					<a-tag v-if="record.code" :bordered="false">{{ record.code }}</a-tag>
				</template>
				<template v-if="column.dataIndex === 'status'">
					<a-tag v-if="record.status === 0" color="green">正常</a-tag>
					<a-tag v-else>已停用</a-tag>
				</template>
				<template v-if="column.dataIndex === 'action'">
					<a-space>
            <a-tooltip title="预览">
              <a style="color:#53C61D;" @click="stepsFormRef.onOpen(record)">预览</a>
            </a-tooltip>
            <a-tooltip title="生成代码">
              <a style="color:#1980FF;" @click="stepsFormRef.onOpen(record)">生成</a>
            </a-tooltip>
						<a-tooltip title="修改配置">
              <a @click="stepsFormRef.onOpen(record)">配置</a>
<!--              <a @click="openConfig(record)">配置</a>-->
						</a-tooltip>
						<a-tooltip title="重置配置">
							<a-popconfirm title="确定要重置配置吗？" @confirm="deleteConfig(record)">
								<a style="color:#FF4D4F;">重置配置</a>
							</a-popconfirm>
						</a-tooltip>
					</a-space>
				</template>
			</template>
		</STable>
	</a-card>
  <stepsForm ref="stepsFormRef" @successful="tableRef.refresh(true)" />
</template>

<script setup>
  import codegenApi from '@/api/dev/codegenApi'

	import { h } from "vue"
	import { RedoOutlined, SearchOutlined } from "@ant-design/icons-vue"
  import StepsForm from "./stepsForm.vue"
	import { message } from "ant-design-vue";
  import STable from "@/components/STable/index.vue"

	const columns = [
		{
			title: '表名',
			dataIndex: 'tableName',
			resizable: true,
			width: 150
		},
		{
			title: '描述',
			dataIndex: 'tableComment',
			resizable: true,
			width: 200
		},
		{
			title: '存储引擎',
			dataIndex: 'engine',
			align: 'center',
			width: 100
		},
		{
			title: '排序规则',
			dataIndex: 'tableCollation',
			align: 'center',
			width: 150
		},
		{
			title: '创建时间',
			dataIndex: 'createTime',
			align: 'center',
			width: 160
		},
		{
			title: '操作',
			dataIndex: 'action',
			align: 'center',
			resizable: true,
      width: 200,
		}
	]
	const selectedRowKeys = ref([])
	// 使用状态options（0正常 1停用）
	const statusOptions = [
		{ label: "正常", value: 0 },
		{ label: "已停用", value: 1 }
	]
	// 列表选择配置
	const options = {
		alert: {
			show: false,
			clear: () => {
				selectedRowKeys.value = ref([])
			}
		}
	}
	// 定义tableDOM
	const tableRef = ref()
	const formRef = ref()
  const stepsFormRef = ref()
	const toolConfig = { refresh: true, height: true, columnSetting: false, striped: false }
	const searchFormRef = ref()
	const searchFormData = ref({})

	// 表格查询 返回 Promise 对象
	const loadData = (parameter) => {
		let param = Object.assign(parameter, searchFormData.value)
		return codegenApi.configPage(param).then((res) => {
			return res.data
		})
	}
	// 重置
	const reset = () => {
		searchFormRef.value.resetFields()
		tableRef.value.refresh(true)
	}
	// 删除
	const deleteConfig = (record) => {
		let data = { tableName: record.tableName }
    codegenApi.deleteConfig(data).then((res) => {
			message.success(res.message)
			tableRef.value.refresh(true)
		})
	}

</script>

<style scoped>
	.ant-form-item {
		margin-bottom: 0 !important;
	}
</style>
