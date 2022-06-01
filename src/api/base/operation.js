/*
 * @Description: 
 * @Version: 2.0
 * @Autor: 刘云辉
 * @Date: 2021-04-19 15:01:48
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-12-11 15:22:09
 */
import request from "/@/utils/request";

// 新增
export function add(data) {
    return request({
      url: "/web/base/routeManager/operation/save.do",
      method: "post",
      data
    });
  }

// 列表
export function getOperationListUrl() {
    return "/web/base/routeManager/operation/ajaxList.do";
  }

// 菜单列表
export function operationMenuListUrl() {
    return "/web/system/menu/operationMenuList.do";
  }
  

// 查询列表
export function queryList(params = {}) {
    return request({
      url: getOperationListUrl(),
      method: "get",
      params
    });
  }

// 下拉列表
export function findList(params = {}) {
    return request({
      url: "/web/base/routeManager/operation/findList.do",
      method: "get",
      params
    });
  }

export function findOneByStationCode(params = {}) {
  return request({
    url: "/web/base/routeManager/operation/findOneByStationCode.do",
    method: "get",
    params
  });
}

// 获取数据权限控制车间下拉数据
export function permissOperationList(params = {}) {
  return request({
    url: "/web/base/routeManager/operation/permissList.do",
    method: "get",
    params
  });
}

// 删除
export function deleted(data) {
    return request({
      url: "/web/base/routeManager/operation/delete.do",
      method: "post",
      data
    });
  }

// 导出
export function exportOperation(data) {
  return request({
    url: "/web/base/routeManager/operation/exportOperation.do",
    method: "post",
    data
  });
}
  
// 修改
export function edit(data) {
    return request({
    url: "/web/base/routeManager/operation/modify.do",
    method: "post",
    data
    });
}

// 根据 id 查询
export function findOne(data) {
    return request({
    url: "/web/base/routeManager/operation/findOne.do",
    method: "post",
    data
    });
}

export function findOperationStationList(params = {}) {
  return request({
    url: "/web/base/routeManager/operation/findOperationStationList.do",
    method: "get",
    params
  });
}
