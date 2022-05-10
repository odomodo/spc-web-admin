/*
 * @Author: zzg
 * @Date: 2021-04-28 10:07:16
 * @LastEditTime: 2021-04-28 10:47:44
 * @LastEditors: Please set LastEditors
 * @Description:  系统中所有的后端请求常量配置文件
 * @FilePath: \mes-ui1\src\api\consturl.js
 */


// 超级管理员 角色管理

// 查找当前所有用户,用于分配角色
export function getUsersForRoleUrl(){
    return "/web/system/sysUser/getUsersForRole.do";
}

// 指定角色的用户列表
export function getUsersByRoleCodeUrl(){
    return "/web/system/sysUser/getUsersByRoleCode.do";
}

// 指定用户组的用户列表
export function getUsersByGroupCodeUrl(){
  return "/web/system/sysUser/getUsersByGroupCode.do";
}

