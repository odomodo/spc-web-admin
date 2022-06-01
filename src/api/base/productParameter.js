/*
 * @Description: 
 * @Version: 2.0
 * @Autor: 刘云辉
 * @Date: 2021-04-19 15:01:48
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-09-18 15:49:27
 */
import request from "/@/utils/request";

// 新增
export function add(data) {
    return request({
      url: "/web/base/productParameter/save.do",
      method: "post",
      data
    });
  }


// 导出
export function exportProductParameter(data) {
  return request({
    url: "/web/base/routeManager/productParameter/exportProductParameter.do",
    method: "post",
    data
  });
}

// 列表
export function getProductParameterListUrl() {
    return "/web/base/productParameter/ajaxList.do";
  }

// 查询列表
export function queryList(params = {}) {
    return request({
      url: getProductParameterListUrl(),
      method: "get",
      params
    });
  }

//查询上级参数
export function queryParentParamList(params) {
  return request({
    url: "/web/base/productParameter/ajaxList.do",
    method: "get",
    params
  });
}


// 删除
export function deleted(data) {
    return request({
      url: "/web/base/productParameter/delete.do",
      method: "post",
      data
    });
  }

// 修改
export function edit(data) {
    return request({
    url: "/web/base/productParameter/modify.do",
    method: "post",
    data
    });
}

//查询工序数据
export function findOperationList(params) {
  return request({
    url: "/web/base/routeManager/operation/findList.do",
    method: "get",
    params
  });
}