import service from '@/utils/request'

/**
 * 站内消息相关接口
 */
export default {
  // 查询站内消息列表
  messageList(data) {
    return service.postJson('/api/dev/message/list', data)
  },
  // 分页查询站内消息列表
  messagePage(data) {
    return service.postJson('/api/dev/message/page', data)
  },
  // 获取站内消息详情
  messageDetail(data) {
    return service.postJson('/api/dev/message/detail', data)
  },
  // 新增站内消息
  addMessage(data) {
    return service.postJson('/api/dev/message/add', data)
  },
  // 编辑站内消息
  editMessage(data) {
    return service.postJson('/api/dev/message/edit', data)
  },
  // 删除站内消息，通过ids删除
  deleteMessage(data) {
    return service.postJson('/api/dev/message/delete', data)
  }

}
