import service from '@/utils/request'

/**
 * 三方集成接口相关接口
 */
export default {
  // 分页查询三方集成接口列表
  thirdPartyApiPage(data) {
    return service.postJson('/api/dev/thirdPartyApi/page', data)
  },
  // 获取三方集成接口详情
  thirdPartyApiDetail(data) {
    return service.postJson('/api/dev/thirdPartyApi/detail', data)
  },
  // 新增三方集成接口
  addThirdPartyApi(data) {
    return service.postJson('/api/dev/thirdPartyApi/add', data)
  },
  // 编辑三方集成接口
  editThirdPartyApi(data) {
    return service.postJson('/api/dev/thirdPartyApi/edit', data)
  },
  // 删除三方集成接口，通过ids删除
  deleteThirdPartyApi(data) {
    return service.postJson('/api/dev/thirdPartyApi/delete', data)
  }

}
