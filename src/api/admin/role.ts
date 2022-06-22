/*
 * @Author: 曾宇奇
 * @Date: 2021-03-31 19:19:06
 * @LastEditTime: 2022-06-21 16:32:43
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \mes-ui\src\network\api\system\roleManagement.js
 */

import request from "/@/utils/http/request";

// 角色列表Url
export function getRoleListUrl() {
  return "/web/system/role/ajaxList.do?identifying=0";
}

export function UsersByRoleCodeUrl(){
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
export function addList(data: any) {
  return request({
    url: "/web/system/role/save.do",
    method: "post",
    data
  });
}
// 删除列表
export function delList(data: any) {
  return request({
    url: "/web/system/role/delete.do",
    method: "post",
    data
  });
}
// 编辑列表
export function editList(data: any) {
  return request({
    url: "/web/system/role/modify.do",
    method: "post",
    data
  });
}
// 添加角色用户
export function saveRoleUser(data: any) {
  console.log(data, 'qweqwe');
  return request({
    url: "/web/system/role/saveRoleUserForSPC",
    method: "post",
    data
  });
}

// 根据角色ID查找用户
export function getUsersByRoleCode(data: any) {
  return request({
    url: "/web/system/sysUser/getUsersByRoleCode.do",
    method: "post",
    data
  });
}
