/*
 * @Description: 
 * @Version: 2.0
 * @Autor: 熊长
 * @Date: 2021-04-22 17:01:48
 * @LastEditors: 刘云辉
 * @LastEditTime: 2021-04-28 10:23:32
 */
import request from "/@/utils/request";

// 新增
export function addQuality(data) {
    return request({
      url: "/web/employee/qualityDefinition/save.do",
      method: "post",
      data
    });
  }

// 列表
export function getQualityList(){
  return "/web/employee/qualityDefinition/ajaxList.do";
}


//查询列表
export function getQueryQualityList(params={}) {
  return request({
    url:getQualityList(),
    method:"get",
    params
  });
}

// 删除
export function deleted(data) {
  return request({
    url: "/web/employee/qualityDefinition/delete.do",
    method: "post",
    data
  });
}

// 修改
export function editQuality(data) {
  return request({
  url: "/web/employee/qualityDefinition/modify.do",
  method: "post",
  data
  });
}


// 列表查询
export function qualityList(data) {
  return request({
  url: qualityListUrl(),
  method: "get",
  data
  });
}


// 列表查询
export function qualityListUrl() {
  return "/web/employee/qualityDefinition/qualityList.do";
}