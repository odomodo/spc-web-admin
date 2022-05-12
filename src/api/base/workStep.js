/*
 * @Description: 
 * @Version: 2.0
 * @Autor: 刘云辉
 * @Date: 2021-04-19 15:01:48
 * @LastEditors: 刘云辉
 * @LastEditTime: 2021-07-21 14:03:30
 */
import request from "@/utils/request";

// 新增
export function add(data) {
    return request({
      url: "/web/base/routeManager/workstep/save.do",
      method: "post",
      data
    });
  }

// 导出
export function exportWorkStep(data) {
  return request({
    url: "/web/base/routeManager/workstep/exportWorkStep.do",
    method: "post",
    data
  });
}

// 列表
export function getWorkstepListUrl() {
    return "/web/base/routeManager/workstep/ajaxList.do";
  }

// 查询列表
export function queryList(params = {}) {
    return request({
      url: getWorkstepListUrl(),
      method: "get",
      params
    });
  }

// 下拉
export function findListUrl() {
  return "/web/base/routeManager/workstep/findList.do";
}

// 下拉列表
export function findList(params = {}) {
  return request({
    url: findListUrl(),
    method: "get",
    params
  });
}

// 删除
export function deleted(data) {
    return request({
      url: "/web/base/routeManager/workstep/delete.do",
      method: "post",
      data
    });
  }

// 修改
export function edit(data) {
    return request({
    url: "/web/base/routeManager/workstep/modify.do",
    method: "post",
    data
    });
}
