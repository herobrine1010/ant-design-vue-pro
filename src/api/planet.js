import request from '@/utils/request'

const userApi = {
   getPlanet: '/user/adminQueryUserInfo',
   adminBlockUser: '/userBlock/adminBlockUser', // 封禁
   adminMuteUser: '/userBlock/adminMuteUser', // 禁言
   adminCreateOrganization: '/organization/adminCreateOrganization',
   adminCreateOrganizationOperator: '/organizationOperator/addOperator',
   getTeamByUserId: '/team/getTeamByUserId', // 查询某用户发起的组队
   adminGetTeamList: '/team/adminGetTeamList', // 管理员分页获取济人组队
   getTeamByUserIdWithPage: '/team/getTeamByUserIdWithPage',
   feedBack: '/feedback', // 用户反馈
   getLabel: '/label',
   getOrganizationPostingList: '/posting/getOrganizationPostingList', // 查询恒星号历史发帖
   adminOperateFeedBack: '/feedback/adminOperateFeedback',
   queryOrganizationWithPage: '/organization/queryOrganizationWithPage',
   adminUnblockUser: '/userBlock/adminUnblockUser' // 恢复正常
}

export function getPlanetList (parameter) {
    return request({
      url: userApi.getPlanet,
      method: 'get',
      params: parameter
    })
}
export function getLabel (parameter) {
  return request({
    url: userApi.getLabel,
    method: 'get',
    params: parameter
  })
}
// 管理员封禁用户
export function adminBlockUser (parameter) {
    return request({
      url: userApi.adminBlockUser,
      method: 'get',
      params: parameter
    })
}
// 禁言
export function adminMuteUser (parameter) {
    return request({
      url: userApi.adminMuteUser,
      method: 'get',
      params: parameter
    })
}

// 管理员恢复用户正常
export function adminUnblockUser (parameter) {
    return request({
      url: userApi.adminUnblockUser,
      method: 'get',
      params: parameter
    })
}

// 管理员创建恒星号
export function adminCreateOrganization (parameter) {
  return request({
    url: userApi.adminCreateOrganization,
    method: 'post',
    data: parameter
  })
}

export function adminCreateOrganizationOperator (parameter) {
  return request({
    url: userApi.adminCreateOrganizationOperator,
    method: 'post',
    data: parameter
  })
}
// 用户反馈
export function getFeedBack (parameter) {
  return request({
    url: userApi.feedBack,
    method: 'get',
    params: parameter
  })
}
//  用户反馈-删除
export function deleteFeedBack (id) {
  return request({
    url: `/feedback/${id}`,
    method: 'delete'
  })
}
// 用户反馈-添加
// export function updateFeedBack(parameter) {
//   return request({
//     url: 'feedback',
//     method: 'post',
//     data:parameter
//   })
// }
// 用户反馈-修改
// export function updateFeedBack (id, data) {
//   return request({
//     url: `feedback/${id}`,
//     method: 'put',
//     data
//   })
// }
// export function updateFeedBack (parameter) {
//   return request({
//     url: `${userApi.adminOperateFeedBack}/${parameter}`,
//     method: 'patch'
//   })
// }
// 查询恒星号历史发帖
export function getOrganizationPostingList (id, data) {
  return request({
    url: `/posting/getOrganizationPostingList/${id}`,
    method: 'get',
    data
  })
}
export function updateFeedBack (parameter) {
  return request({
    url: userApi.adminOperateFeedBack,
    method: 'patch',
    data: parameter
  })
}
export function queryOrganizationWithPage (parameter) {
  return request({
    url: userApi.queryOrganizationWithPage,
    method: 'get',
    params: parameter
  })
}
export function getTeamByUserIdWithPage (parameter) {
  return request({
    url: userApi.getTeamByUserIdWithPage,
    method: 'get',
    params: parameter
  })
}
export function getTeamByUserId (id, data) {
  return request({
    url: `/team/getTeamByUserId/${id}`,
    method: 'get',
    data
  })
}
export function adminGetTeamList (parameter) {
  return request({
    url: userApi.adminBlockUser,
    method: 'get',
    params: parameter
  })
}
