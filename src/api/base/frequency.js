/*
 * @Author: 刘云辉
 * @Date: 2021-04-19 19:19:06
 * @LastEditTime: 2021-08-12 14:45:45
 * @LastEditors: Please set LastEditors
 * @Description: 刘云辉
 * @FilePath: \mes-ui\src\network\api\base\frequency.js
 */

import request from "@/utils/request";

// 新增
export function add(data) {
    return request({
      url: "/web/base/frequency/save.do",
      method: "post",
      data
    });
  }

// 列表
export function getFrequencyListUrl() {
    return "/web/base/frequency/ajaxList.do";
  }

// 查询列表
export function queryList(params = {}) {
    return request({
      url: getFrequencyListUrl(),
      method: "get",
      params
    });
  }

// 删除
export function deleted(data) {
    return request({
      url: "/web/base/frequency/delete.do",
      method: "post",
      data
    });
  }

// 修改
export function edit(data) {
    return request({
    url: "/web/base/frequency/modify.do",
    method: "post",
    data
    });
}

// 根据 id 查询
export function findOne(data) {
  return request({
  url: "/web/base/frequency/findOne.do",
  method: "post",
  data
  });
}
