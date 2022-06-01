/*
 * @Description: 
 * @Version: 2.0
 * @Autor: 刘阳
 * @Date: 2021-05-04 16:06:56
 * @LastEditors: 刘阳
 * @LastEditTime: 2021-06-12 11:49:57
 */
import request from "/@/utils/request";
 // 获取人员信息列表列表
 export function teamGroupEmployeeUrl() {
  return "/web/employee/employQualitydefinition/ajaxList.do";
}

// 获取资质信息列表列表
export function getQualityList(params = {}) {
  return request({
    url: "/web/employee/qualityDefinition/ajaxList.do",
    method: "get",
    params
  });
}
  // 查询列表
  export function queryList(params = {}) {
    return request({
      url: getEmployeeListUrl(),
      method: "get",
      params
    });
  }
  // 删除
export function deleted(data) {
  return request({
    url: "/web/employee/employQualitydefinition/delete.do",
    method: "post",
    data
  });
}
  // 班组列表
 export function findList(params = {}) {
  return request({
    url: "/web/employee/qualityDefinition/ajaxList.do",
    method: "get",
    params
  });
}
  // 新增列表
  export function add(data) {
    return request({
      url: "/web/employee/employQualitydefinition/save.do",
      method: "post",
      data
    });
  }
// 编辑列表
export function edit(data) {
  return request({
    url: "/web/employee/employQualitydefinition/modify.do",
    method: "post",
    data
  });
}
 // 班组列表
 export function queryQualification(params = {}) {
  return request({
    url: "/web/employee/qualityDefinition/findQualitysByType.do",
    method: "get",
    params
  });
}

  // 班组下拉列表
  export function findEmployQualitydefinition(params = {}) {
    return request({
      url: "/web/employee/employQualitydefinition/findEmployQualitydefinition.do",
      method: "get",
      params
    });
  }

// 人员列表
export function findEmployeeList(params = {}) {
  return request({
    url: "/web/employee/employee/ajaxList.do",
    method: "get",
    params
  });
}

