/*
 * @Author: 曾宇奇
 * @Date: 2021-03-31 19:19:06
 * @LastEditTime: 2021-05-31 15:43:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \mes-ui\src\network\api\system\roleManagement.js
 */

import request from "/@/utils/request";

// 角色列表Url
export function getRoleListUrl() {
  return "/web/system/role/ajaxList.do?identifying=1";
}

export function UsersByRoleCodeUrl() {
  return "/web/system/sysUser/getUsersByRoleCode.do";
}

// 查询列表
export function queryList(params = {}) {
  return request({
    url: getRoleListUrl(),
    method: "get",
    params
  });
}
// 新增列表
export function addList(data) {
  return request({
    url: "/web/system/role/sysRoleSave.do",
    method: "post",
    data
  });
}
// 删除列表
export function delList(id) {
  return request({
    url: "/web/system/role/delete.do",
    method: "post",
    data: {
      id
    }
  });
}
// 编辑列表
export function editList(data) {
  return request({
    url: "/web/system/role/modify.do",
    method: "post",
    data
  });
}
// 添加角色用户
export function saveRoleUser(data) {
  return request({
    url: "/web/system/role/saveRoleUser.do",
    method: "post",
    data
  });
}

// 根据角色ID查找用户
export function getUsersByGroupCode(data) {
  return request({
    url: "/web/system/sysUser/getUsersByGroupCode.do",
    method: "post",
    data
  });
}
