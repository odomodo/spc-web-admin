/*
 * @Author: 曾宇奇
 * @Date: 2021-03-29 20:56:14
 * @LastEditTime: 2021-05-12 11:18:59
 * @LastEditors: 刘云辉
 * @Description: In User Settings Edit
 * @FilePath: \mes-ui\src\network\api\system\factoryManagement.js
 */

import request from "/@/utils/http/request";

// 工厂列表Url
export function getModelListUrl() {
  return "/web/system/factory/ajaxList.do";
}

// 查询列表
export function queryList(params = {}) {
  return request({
    url: getModelListUrl(),
    method: "get",
    params
  });
}
// 新增列表
export function addList(data: any) {
  return request({
    url: "/web/system/factory/save.do",
    method: "post",
    data
  });
}
// 删除
export function delList(data: any) {
  return request({
    url: "/web/system/factory/delete.do",
    method: "post",
    data
  });
}
// 编辑列表
export function editList(data: any) {
  return request({
    url: "/web/system/factory/modify.do",
    method: "post",
    data
  });
}
// 删除
export function deleteById(data: any) {
  return request({
    url: "/web/system/factory/deleteById.do",
    method: "post",
    data
  });
}

// 地区下拉框列表
export function getAreaDnList() {
  return request({
    url: "/web/system/factory/getAreaDnList.do",
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
