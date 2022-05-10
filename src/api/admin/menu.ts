/*
 * @Author: 曾宇奇
 * @Date: 2021-04-13 10:50:24
 * @LastEditTime: 2021-05-14 09:54:19
 * @LastEditors: 刘云辉
 * @Description: In User Settings Edit
 * @FilePath: \ruoyi-ui\src\api\system\menu.js
 */
import request from "/@/utils/http/request";

// 菜单列表Url
export function getMenuListUrl() {
  return "/web/system/menu/ajaxList.do"; //+ "?token="+Cookies.get('Admin-Token')
}

// 无分页树型结构列表查询
export function findMenuListUrl() {
  return "/web/system/menu/findMenuList.do"; 
}


// 无分页树型结构列表查询
export function findMenuList(params = {}) {
  return request({
    url: findMenuListUrl(),
    method: "get",
    params
  });
}

// 查询列表
export function queryList(params = {}) {
  return request({
    url: getMenuListUrl(),
    method: "get",
    params
  });
}

// 新增列表
export function addList(data: any) {
  return request({
    url: "/web/system/menu/save.do",
    method: "post",
    data
  });
}
// 删除列表
export function delList(data: any) {
  return request({
    url: "/web/system/menu/delete.do",
    method: "post",
    data
  });
}
// 编辑列表
export function editList(data: any) {
  return request({
    url: "/web/system/menu/modify.do",
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
    url: "/web/base/model/getWorkshopDnList.do",
    method: "get"
  });
}
