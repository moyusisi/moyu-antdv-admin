<template>
  <div>
    <a-card :bordered="false">
      <a-row>
        <a-col :span="4"></a-col>
        <a-col :span="12">
          <a-steps :current="current">
            <a-step v-for="item in steps" :key="item.title" :title="item.title"/>
          </a-steps>
        </a-col>
        <a-col :span="8">
          <a-space style="float:right;">
            <a-button :disabled="current === 0" @click="prev"> 上一步</a-button>
            <a-button :disabled="current === 2" type="primary" @click="next"> 继续</a-button>
            <a-button type="primary" danger ghost @click="emit('closed')"> 关闭</a-button>
          </a-space>
        </a-col>
      </a-row>
    </a-card>
    <a-card v-if="current === 0">
      <a-form ref="formRef" :model="configFormData" :label-col="{span: 4}">
        <a-row :gutter="24">
          <a-col :span="10" :offset="2">
            <a-form-item label="表名" name="tableName" :rules="[required('请输入表名')]">
              <a-input v-model:value="configFormData.tableName" placeholder="如:sys_user"/>
            </a-form-item>
          </a-col>
          <a-col :span="10">
            <a-form-item label="业务名" name="businessName" :rules="[required('请输入业务名')]">
              <a-input v-model:value="configFormData.businessName" placeholder="如:用户"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="10" :offset="2">
            <a-form-item label="包名" name="packageName" :rules="[required('请输入包名')]">
              <a-input v-model:value="configFormData.packageName" placeholder="如:com.moyu.boot"/>
            </a-form-item>
          </a-col>
          <a-col :span="10">
            <a-form-item label="模块名" name="moduleName" :rules="[required('请输入模块名')]">
              <a-input v-model:value="configFormData.moduleName" placeholder="如:system"/>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="10" :offset="2">
            <a-form-item label="实体名" name="entityName" :rules="[required('请输入实体名')]">
              <a-input v-model:value="configFormData.entityName" placeholder="如:User"/>
            </a-form-item>
          </a-col>
          <a-col :span="10">
            <a-form-item label="作者" name="author">
              <a-input v-model:value="configFormData.author" placeholder="如:moyusisi"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
    <a-card v-if="current === 1">
      <!-- 数据列表 -->
      <a-table size="small"
               ref="tableRef"
               :columns="columns"
               :data-source="tableData"
               :row-key="(record) => record.code"
               :row-selection="rowSelection"
               bordered>
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
            </a-space>
          </template>
        </template>
      </a-table>
      <FieldConfig ref="fieldConfigRef"/>
    </a-card>
    <a-card v-if="current === 2">
      <a-result status="success" title="配置完成" sub-title="此刻您可以在代码生成页选择一行进行生成代码或预览代码了">
        <template #extra>
          <a-space size="middle">
            <a-button v-if="current > 0" type="primary" @click="emit('closed')">去预览</a-button>
          </a-space>
        </template>
      </a-result>
    </a-card>
  </div>
</template>
<script setup name="genSteps">
import { message } from 'ant-design-vue'
import FieldConfig from "./fieldConfig.vue"
import { required } from "@/utils/formRules.js";
// import downloadUtil from '@/utils/downloadUtil'
// import genPreview from './preview.vue'
// import genBasicApi from '@/api/gen/genBasicApi'

const emit = defineEmits({ closed: null })
const current = ref(0)
const recordData = ref()
const configFormData = ref({
  fieldConfigList: [],
  packageName: "com.moyu.boot",
  author: "moyusisi"
});
const submitLoading = ref(false)
const tableConfigRef = ref()
const fieldConfigRef = ref()
const configRef = ref()

const columns = [
  {
    title: '列名',
    align: 'center',
    dataIndex: 'columnName',
    ellipsis: true
  },
  {
    title: '列类型',
    align: 'center',
    dataIndex: 'columnType',
    ellipsis: true
  },
  {
    title: '字段名',
    align: 'center',
    dataIndex: 'fieldName',
    ellipsis: true
  },
  {
    title: '字段类型',
    align: 'center',
    dataIndex: 'fieldType',
    ellipsis: true
  },
  {
    title: '注释',
    align: 'center',
    dataIndex: 'fieldComment',
    ellipsis: true
  },
  {
    title: '查询条件',
    align: 'center',
    dataIndex: 'showInQuery',
    width: 80
  },
  {
    title: '列表显示',
    align: 'center',
    dataIndex: 'showInList',
    width: 80
  },
  {
    title: '表单填写',
    align: 'center',
    dataIndex: 'showInForm',
    width: 80
  },
  {
    title: '必填',
    align: 'center',
    dataIndex: 'required',
    width: 80
  },
  {
    title: '查询方式',
    align: 'center',
    dataIndex: 'queryType',
    width: 100
  },
  {
    title: '表单类型',
    align: 'center',
    dataIndex: 'fromType'
  },
  {
    title: '字典类型',
    align: 'center',
    dataIndex: 'dictType',
    width: 140
  },
]

// 打开这个界面
const configSteps = (record) => {
  basicRef.value.onOpen(record)
}
// 下一步
const next = () => {
  current.value++
  // 判断是哪一步
  if (current.value === 1) {
    tableConfigRef.value
        .onSubmit()
        .then((data) => {
          recordData.value = data
          current.value++
          nextTick(() => {
            fieldConfigRef.value.onOpen(data)
          })
        })
        .catch(() => {
        })
    current.value--
  }
  if (current.value === 2) {
    fieldConfigRef.value
        .onSubmit(recordData.value)
        .then((data) => {
          current.value++
        })
        .catch((err) => {
          message.warning(err)
        })
    current.value--
  }
}
// 上一步
const prev = () => {
  current.value--
  if (current.value === 0) {
    nextTick(() => {
      tableConfigRef.value.onOpen(recordData.value)
    })
  }
  if (current.value === 1) {
    nextTick(() => {
      fieldConfigRef.value.onOpen(recordData.value)
    })
  }
}
// 分布步骤数据
const steps = [
  {
    title: '基础信息',
    content: '基础信息'
  },
  {
    title: '详细配置',
    content: '详细配置'
  },
  {
    title: '完成',
    content: '已经配置好代码生成，现在可以生成代码啦'
  }
]
// 生成代码
const seveGenerate = () => {
  const param = {
    id: recordData.value.id
  }
  if (recordData.value.generateType === 'PRO') {
    // genBasicApi.basicExecGenPro(param).then(() => {
    // 	message.success('操作成功')
    // 	emit('closed')
    // })
  } else {
    // 下载压缩包
    // genBasicApi.basicExecGenBiz(param).then((res) => {
    // 	downloadUtil.resultDownload(res)
    // 	emit('closed')
    // })
  }
}
// 对外暴露
defineExpose({
  configSteps
})
</script>
<style scoped>

</style>
