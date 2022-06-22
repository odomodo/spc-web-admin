import request from "/@/utils/http/request";
import request1 from "/@/utils/request";
/*
 * @Author: 曾宇奇
 * @Date: 2021-03-31 21:13:47
 * @LastEditTime: 2022-06-21 13:47:00
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \mes-ui\src\network\api\system\userManagement.js
 */

import { getUsersForRoleUrl, getUsersByRoleCodeUrl } from "/@/api/consturl";
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

// 查询用户绑定的工厂编码集合
export function selectByUserIdList(params = {}) {
  return request({
    url: "/web/system/factory/selectByUserIdList.do",
    method: "get",
    params
  });
}

// 新增列表
export function addList(data: any) {
  return request({
    url: "/web/system/sysUser/save.do",
    method: "post",
    data
  });
}
// 删除列表
export function delList(params: any) {
  return request({
    url: "/web/system/sysUser/delete",
    method: "get",
    params
  });
}
// 编辑列表
export function editList(data: any) {
  return request({
    url: "/web/system/sysUser/modify.do",
    method: "post",
    data
  });
}

// 车间下拉框列表
export function getWorkshopDnList() {
  return request({
    url: "/web/system/factory/getWorkshopDnList.do",
    method: "get"
  });
}

// 部门下拉框列表
export function getDetpDnList() {
  return request({
    url: "/web/base/model/getDepartmentDnList.do",
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
  return "/web/system/sysUser/getAdminList.do?identifying=0";
}
// 重置密码
export function resetUserPwd(id: any) {
  return request({
    url: "/web/system/sysUser/resetUserPwd.do",
    method: "post",
    data: {
      userId: id
    }
  });
}
