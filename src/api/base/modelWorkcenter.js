/*
 * @Author: 刘云辉
 * @Date: 2021-04-19 19:19:06
 * @LastEditTime: 2021-04-25 10:45:32
 * @LastEditors: 刘云辉
 * @Description: 刘云辉
 * @FilePath: \mes-ui\src\network\api\base\modelWorkcenter.js
 */

import request from "/@/utils/request";

// 新增
export function add(data) {
    return request({
      url: "/web/base/model/modelWorkcenter/save.do",
      method: "post",
      data
    });
  }

// 列表
export function getModelWorkcenterListUrl() {
    return "/web/base/model/modelWorkcenter/ajaxList.do";
  }

// 查询分页列表
export function queryList(params = {}) {
    return request({
      url: getModelWorkcenterListUrl(),
      method: "get",
      params
    });
  }

// 查询列表
export function findModelWorkcenterList(params = {}) {
  return request({
    url: "/web/base/model/modelWorkcenter/findList.do",
    method: "get",
    params
  });
}

// 删除
export function deleted(data) {
    return request({
      url: "/web/base/model/modelWorkcenter/delete.do",
      method: "post",
      data
    });
  }

// 修改
export function edit(data) {
    return request({
    url: "/web/base/model/modelWorkcenter/modify.do",
    method: "post",
    data
    });
}