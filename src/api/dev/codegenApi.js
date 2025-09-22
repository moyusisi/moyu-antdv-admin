import service from '@/utils/request'

/**
 * 代码生成相关接口
 */
export default {
	// 分页查询代码生成配置列表
	configPage(data) {
		return service.postJson('/api/gen/config/page', data)
	},
	// 分页查询代码生成配置列表
	configDetail(data) {
		return service.postJson('/api/gen/config/detail', data)
	},
	// 保存所有配置
	saveConfig(data) {
		return service.postJson('/api/gen/config/save', data)
	},
	// 删除所有配置
	deleteConfig(data) {
		return service.postJson('/api/gen/config/delete', data)
	},
	// 分页查询代码生成实体配置表列表
	tablePage(data) {
		return service.postJson('/api/gen/config/tablePage', data)
	},
	// 保存所有配置
	importTable(data) {
		return service.postJson('/api/gen/config/import', data)
	},
}
