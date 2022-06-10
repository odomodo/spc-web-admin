import request from "/@/utils/request";
import request1 from "/@/utils/http/request";

import { getUsersForRoleUrl, getUsersByRoleCodeUrl,getUsersByGroupCodeUrl } from "/@/api/consturl.js";
// 用户列表Url
export function getUserListUrl() {
  return "/web/system/sysUser/ajaxList.do";
}

// 查询列表
export function queryUserList(params = {}) {
  return request({
    url: getUserListUrl(),
    method: "get",
    params
  });
}

// 查询列表
export function getUserList(params = {}) {
  return request({
    url: "/web/system/sysUser/getUserList.do",
    method: "get",
    params
  });
}


// 查询列表
export function getUsersByCookieKey(params = {}) {
  return request({
    url: "/web/system/sysUser/getUsersByCookieKey.do",
    method: "get",
    params
  });
}




export function getUsersForRole(params = {}) {
  return request({
    url: getUsersForRoleUrl(),
    method: "get",
    params
  });
}
export function getUsersByRoleCode(params = {}) {
  return request({
    url: getUsersByRoleCodeUrl(),
    method: "get",
    params
  });
}

export function getUsersByGroupCode(params = {}) {
  return request({
    url: getUsersByGroupCodeUrl(),
    method: "get",
    params
  });
}

// 查询用户绑定的工厂编码集合
export function selectByUserIdList(params = {}) {
  return request({
    url: "/web/system/factory/selectByUserIdList.do",
    method: "get",
    params
  });
}

// 新增列表
export function addList(data) {
  return request({
    url: "/web/system/sysUser/sysSave.do",
    method: "post",
    data
  });
}

// 删除列表
export function delList(userId) {
  return request({
    url: "/web/system/sysUser/delete.do",
    method: "post",
    data:{
      userId
    }
  });
}
// 编辑列表
export function editList(data) {
  return request({
    url: "/web/system/sysUser/modifySys.do",
    method: "post",
    data
  });
}

// 批量修改cookieKey
export function modifyCookieKey(data) {
  return request({
    url: "/web/system/sysUser/modifyCookieKey.do",
    method: "post",
    data
  });
}



// 车间下拉框列表
export function getWorkshopDnList() {
  return request({
    url: "/web/system/sysUser/selectWorkShopList.do",
    method: "get"
  });
}

// 部门下拉框列表
export function getDetpDnList() {
  return request({
    url: "/web/system/sysUser/selectDeptList.do",
    method: "get"
  });
}

// 工厂下拉框列表
export function getFactoryDnList() {
  return request({
    url: "/web/system/factory/getFactoryDnList.do",
    method: "get"
  });
}

// admin列表数据
export function getAdminList() {
  return "/web/system/sysUser/getAdminList.do?identifying=1";
}

// admin列表数据
export function getAdminListForUser() {
  return "/web/system/sysUser/getAdminListForUser.do?identifying=1";
}

// 用户Id列表数据
export function getUserIdList() {
  return request({
    url: "/web/employee/employee/selectEmpData.do",
    method: "get"
  });
}

export function getUserInfo() {
  return request({
    url: "/web/system/sysUser/queryUserInfor.do",
    method: "get"
  });
}

export function editUserIdList(userId, userPwd) {
  return request({
    url: "/web/system/sysUser/editUserInfo.do",
    method: "post",
    data: {
      userId,
      userPwd
    }
  });
}

// 重置密码
export function resetUserPwd(id) {
  return request({
    url: "/web/system/sysUser/resetUserPwd.do",
    method: "post",
    data: {
      userId: id
    }
  });
}

export function exportUser(data) {
  return request({
    url: "/web/system/sysUser/export.do",
    method: "post",
    data
  });
}


// 工厂管理员界面- 新增
export function sysUserSysSave(data) {
  return request1({
    url: "/web/system/sysUser/sysSave",
    method: "post",
    data: data
  });
}

// 工厂管理员界面- 修改接口
export function sysUserModify(data) {
  return request1({
    url: "/web/system/sysUser/modify",
    method: "post",
    data: data
  });
}
