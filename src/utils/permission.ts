/*
 * @Description:
 * @Version: 2.0
 * @Autor: 曾宇奇
 * @Date: 2021-04-14 11:51:15
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @LastEditTime: 2022-05-09 15:22:24
 */
import { store } from "/@/store/index.ts";

/**
 * 字符权限校验
 * @param {Array} value 校验值
 * @returns {Boolean}
 */
export function checkPermi(value) {
  if (value && value instanceof Array && value.length > 0) {
    const permissions = store.getters && store.getters.permissions;
    const permissionDatas = value;
    const all_permission = "*:*:*";

    const hasPermission = permissions.some(permission => {
      return (
        all_permission === permission || permissionDatas.includes(permission)
      );
    });

    if (!hasPermission) {
      return false;
    }
    return true;
  } else {
    console.error(
      `need roles! Like checkPermi="['system:user:add','system:user:edit']"`
    );
    return false;
  }
}

/**
 * 角色权限校验
 * @param {Array} value 校验值
 * @returns {Boolean}
 */
export function checkRole(value) {
  if (value && value instanceof Array && value.length > 0) {
    const roles = store.getters && store.getters.roles;
    const permissionRoles = value;
    const super_admin = "admin";

    const hasRole = roles.some(role => {
      return super_admin === role || permissionRoles.includes(role);
    });

    if (!hasRole) {
      return false;
    }
    return true;
  } else {
    console.error(`need roles! Like checkRole="['admin','editor']"`);
    return false;
  }
}

export function hasPermission(perms,s) {
  let hasPermission = false;
  // let permission =s.getters!=undefined?store.state.permission.permission:s.getters.permissions;
  let permission =store.state.permission.permission;
  if(permission.length==0){
    if(s!=undefined){

        permission=s.getters.permissions;
      
    }

  }
  for (let i in permission) {
    if (permission[i] == perms) {
      hasPermission = true;
      break;
    }
  }
  return hasPermission;
}
