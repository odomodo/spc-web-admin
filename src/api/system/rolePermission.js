/*
 * @Description:
 * @Version: 2.0
 * @Autor: 曾宇奇
 * @Date: 2021-06-02 13:56:28
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @LastEditTime: 2022-05-27 14:44:23
 */
import request from "/@/utils/request";

// 查询角色列表
export function getRoleList(code) {
  return request({
    url: "/web/system/role/selectRoleFactoryData.do",
    method: "post",
    data: {
      code
    }
  });
}

// 根据角色Id查询权限数据
export function getPermissionData(roleId) {
  return request({
    url: "/web/sys/rolePermission/selectPermissionData.do",
    method: "post",
    data: {
      roleId
    }
  });
}

// 保存数据
export function saveData(data) {
  return request({
    url: "/web/sys/rolePermissionItem/save.do",
    method: "post",
    data
  });
}
