import service from '@/utils/request'

/**
 * 代码生成相关接口
 */
export default {
	// 分页查询代码生成配置列表
	configPage(data) {
		return service.postJson('/api/gen/code/page', data)
	},
	// 分页查询代码生成配置列表
	configDetail(data) {
		return service.postJson('/api/gen/code/detail', data)
	},
	// 保存所有配置
	saveConfig(data) {
		return service.postJson('/api/gen/code/save', data)
	},
	// 删除所有配置
	deleteConfig(data) {
		return service.postJson('/api/gen/code/delete', data)
	},
	// 分页查询代码生成实体配置表列表
	genTablePage(data) {
		return service.postJson('/api/gen/table/page', data)
	},
}
