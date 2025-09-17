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
            <a-button :disabled="current === 2" :loading="submitLoading" type="primary" @click="next"> 下一步</a-button>
            <a-button type="primary" danger ghost @click="emit('closed')"> 关闭</a-button>
          </a-space>
        </a-col>
      </a-row>
    </a-card>
    <a-card v-if="current === 0">
      <a-form ref="tableFormRef" :model="configFormData" :label-col="{span: 4}">
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
               :data-source="configFormData.fieldConfigList"
               :row-key="(record) => record.id"
               :row-selection="rowSelection"
               :pagination="false"
               :scroll="{ x: 'max-content' }"
               bordered>
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'code'">
            <a-tag v-if="record.code" :bordered="false">{{ record.code }}</a-tag>
          </template>
          <template v-if="column.dataIndex === 'fieldName'">
            <a-input v-model:value="record.fieldName" />
          </template>
          <template v-if="column.dataIndex === 'fieldComment'">
            <a-input v-model:value="record.fieldComment" />
          </template>
          <template v-if="column.dataIndex === 'maxLength'">
            <a-input v-model:value="record.maxLength" />
          </template>
          <template v-if="column.dataIndex === 'showInQuery'">
            <a-checkbox v-model:checked="record.showInQuery" @change="showInQueryChange(record)"/>
          </template>
          <template v-if="column.dataIndex === 'showInList'">
            <a-checkbox v-model:checked="record.showInList" @change="showInListChange(record)"/>
          </template>
          <template v-if="column.dataIndex === 'showInForm'">
            <a-checkbox v-model:checked="record.showInForm" @change="showInFormChange(record)"/>
          </template>
          <template v-if="column.dataIndex === 'required'">
            <span v-if="record.showInForm === 1" >
              <a-checkbox v-model:checked="record.required" @change="requiredChange(record)"/>
            </span>
            <span v-else>-</span>
          </template>
          <template v-if="column.dataIndex === 'queryType'">
            <a-select v-if="record.showInQuery === 1" v-model:value="record.queryType"
                      :options="queryTypeOptions" placeholder="请选择" style="width: 100%"/>
            <span v-else>-</span>
          </template>
          <template v-if="column.dataIndex === 'formType'">
            <a-select v-model:value="record.formType" :options="formTypeOptions" style="width: 100%"/>
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
    </a-card>
    <a-card v-if="current === 2">
      <a-result status="success" title="配置完成" sub-title="您的配置已保存成功，此刻您可以去生成代码或预览代码了">
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
import codegenApi from '@/api/dev/codegenApi'

import { message } from 'ant-design-vue'
import { required } from "@/utils/formRules.js";
// import downloadUtil from '@/utils/downloadUtil'
// import genPreview from './preview.vue'
// import genBasicApi from '@/api/gen/genBasicApi'

const emit = defineEmits({ closed: null })
const current = ref(0)
const recordData = ref()
const tableFormRef = ref()
const configFormData = ref({
  fieldConfigList: [],
  packageName: "com.moyu.boot",
  author: "moyusisi"
});
const submitLoading = ref(false)
const tableConfigRef = ref()
const fieldConfigRef = ref()

const columns = [
  {
    title: '列名',
    align: 'center',
    dataIndex: 'columnName',
    width: 120,
    ellipsis: true
  },
  {
    title: '列类型',
    align: 'center',
    dataIndex: 'columnType',
    width: 80,
    ellipsis: true
  },
  {
    title: '字段名',
    align: 'center',
    dataIndex: 'fieldName',
    width: 150,
    ellipsis: true
  },
  {
    title: '字段类型',
    align: 'center',
    dataIndex: 'fieldType',
    width: 100,
    ellipsis: true
  },
  {
    title: '注释',
    align: 'center',
    dataIndex: 'fieldComment',
    width: 150,
    ellipsis: true
  },
  {
    title: '最大长度',
    align: 'center',
    dataIndex: 'maxLength',
    width: 80,
    ellipsis: true
  },
  {
    title: '查询条件',
    align: 'center',
    dataIndex: 'showInQuery',
    width: 50
  },
  {
    title: '列表显示',
    align: 'center',
    dataIndex: 'showInList',
    width: 50
  },
  {
    title: '表单填写',
    align: 'center',
    dataIndex: 'showInForm',
    width: 50
  },
  {
    title: '必填',
    align: 'center',
    dataIndex: 'required',
    width: 50
  },
  {
    title: '查询方式',
    align: 'center',
    dataIndex: 'queryType',
    width: 130
  },
  {
    title: '表单类型',
    align: 'center',
    dataIndex: 'formType',
    width: 130
  },
  {
    title: '字典类型',
    align: 'center',
    dataIndex: 'dictType',
    width: 140
  },
]

// 查询方式选项
const queryTypeOptions = ref([
  {
    label: "LIKE",
    value: "LIKE"
  },
  {
    label: "=",
    value: "EQ"
  },
  {
    label: "IN",
    value: "IN"
  },
  {
    label: ">",
    value: "GT"
  },
  {
    label: ">=",
    value: "GE"
  },
  {
    label: "<",
    value: "LT"
  },
  {
    label: "<=",
    value: "LE"
  },
  {
    label: "!=",
    value: "NE"
  },
  {
    label: "BETWEEN",
    value: "BETWEEN"
  },
])
// 表单类型选项
const formTypeOptions = ref([
  {
    label: '输入框',
    value: 'INPUT'
  },
  {
    label: '下拉框',
    value: 'SELECT'
  },
  {
    label: '文本框',
    value: 'TEXT_AREA'
  },
  {
    label: '数字输入框',
    value: 'INPUT_NUMBER'
  },
  {
    label: '单选框',
    value: 'RADIO'
  },
  {
    label: '复选框',
    value: 'CHECK_BOX'
  },
  {
    label: '日期选择',
    value: 'DATE'
  },
  {
    label: '时间选择',
    value: 'DATE_TIME'
  },
  {
    label: '开关',
    value: 'SWITCH'
  },
])

// 打开这个界面
const configSteps = async (record) => {
  // 获取组织信息
  let res = await codegenApi.configDetail({ tableName: record.tableName })
  configFormData.value = res.data
  // 数据就绪之后显示
  // visible.value = true
}
// 下一步
const next = () => {
  if (current.value === 0) {
    console.log("step:", current.value)
    tableFormRef.value.validate().then(() => {
      current.value++
    }).catch(error => {});
  }
  if (current.value === 1) {
    // 保存所有配置
    submitLoading.value = true
    codegenApi.saveConfig(configFormData.value).then((res) => {
      if (res.code === 0) {
        current.value++
      } else {
        message.error(res.message)
      }
    }).finally(() => {
      submitLoading.value = false
    })
  }
}
// 上一步
const prev = () => {
  if (current.value === 1) {
    current.value--
  }
  if (current.value === 2) {
    current.value--
  }
}
// 分布步骤数据
const steps = [
  {
    title: '基础信息',
    description: '实体配置'
  },
  {
    title: '详细配置',
    description: '字段配置'
  },
  {
    title: '完成',
    description: '配置已保存'
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

// 点击 查询条件 的处理
const showInQueryChange = (record) => {
  if (record.showInQuery) {
    record.showInQuery = 1
  } else {
    record.showInQuery = 0
  }
}

// 点击 查询条件 的处理
const showInListChange = (record) => {
  if (record.showInList) {
    record.showInList = 1
  } else {
    record.showInList = 0
  }
}

// 点击 查询条件 的处理
const showInFormChange = (record) => {
  if (record.showInForm) {
    record.showInForm = 1
  } else {
    record.showInForm = 0
  }
}

// 点击 是否必填 的处理
const requiredChange = (record) => {
  if (record.required) {
    record.required = 1
  } else {
    record.required = 0
  }
}
// 对外暴露
defineExpose({
  configSteps
})
</script>
<style scoped>

</style>
