/*
 * @Description:
 * @Version: 2.0
 * @Autor: 曾宇奇
 * @Date: 2021-06-04 09:27:32
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @LastEditTime: 2022-05-30 15:00:42
 */
import request from "/@/utils/request";

// 查询用户-角色列表
export function getUserList(userId) {
  return request({
    url: "/web/system/sysUser/userRolePerissionQuery.do",
    method: "post",
    data: {
      userId
    }
  });
}

// 根据用户Id查询权限数据
export function getPermissionData(userId) {
  return request({
    url: "/web/sys/rolePermission/selectPermissionLstByRoles.do",
    method: "post",
    data: {
      userId
    }
  });
}
