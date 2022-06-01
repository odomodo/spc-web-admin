/*
 * @Author: 刘云辉
 * @Date: 2021-04-19 19:19:06
 * @LastEditTime: 2021-05-22 11:01:33
 * @LastEditors: 刘云辉
 * @Description: 刘云辉
 * @FilePath: \mes-ui\src\network\api\base\route.js
 */

import request from "/@/utils/request";

// 新增
export function add(data) {
    return request({
      url: "/web/base/routeManager/route/save.do",
      method: "post",
      data
    });
  }

// 列表
export function getRouteListUrl() {
    return "/web/base/routeManager/route/ajaxList.do";
  }

// 查询列表
export function queryList(params = {}) {
    return request({
      url: getRouteListUrl(),
      method: "get",
      params
    });
  }

// 版本列表
export function getRouteVersionList(params = {}) {
  return request({
    url: "/web/base/routeManager/route/routeVersionList.do",
    method: "get",
    params
  });
}
 

// 删除
export function deleted(data) {
    return request({
      url: "/web/base/routeManager/route/delete.do",
      method: "post",
      data
    });
  }

// 修改
export function edit(data) {
    return request({
    url: "/web/base/routeManager/route/modify.do",
    method: "post",
    data
    });
}

// 根据 id 查询
export function findOne(data) {
  return request({
  url: "/web/base/routeManager/route/findOne.do",
  method: "post",
  data
  });
}