import service from '@/utils/request'

/**
 * 分组相关接口
 */
export default {
  // 查询分组列表
  scopeList(data) {
    return service.postJson('/api/system/scope/list', data)
  },
  // 分页查询分组列表
  scopePage(data) {
    return service.postJson('/api/system/scope/page', data)
  },
  // 获取分组详情
  scopeDetail(data) {
    return service.postJson('/api/system/scope/detail', data)
  },
  // 新增分组
  addScope(data) {
    return service.postJson('/api/system/scope/add', data)
  },
  // 编辑分组
  editScope(data) {
    return service.postJson('/api/system/scope/edit', data)
  },
  // 删除分组，通过ids删除
  deleteScope(data) {
    return service.postJson('/api/system/scope/delete', data)
  }

}
