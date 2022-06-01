/*
 * @Description: 
 * @Version: 2.0
 * @Autor: 刘云辉
 * @Date: 2021-04-19 15:01:48
 * @LastEditors: 刘云辉
 * @LastEditTime: 2021-05-06 17:54:58
 */
import request from "/@/utils/request";

// 新增
export function add(data) {
    return request({
      url: "/web/employee/employee/save.do",
      method: "post",
      data
    });
  }

// 列表
export function getEmployeeListUrl() {
    return "/web/employee/employee/ajaxList.do";
  }

// 查询列表
export function queryList(params = {}) {
    return request({
      url: getEmployeeListUrl(),
      method: "get",
      params
    });
  }
// 根据部门编码查询员工  查恩虎
export function findListByDepartCode(params = {}) {
  return request({
    url: "/web/employee/employee/findListByDepartCode.do",
    method: "get",
    params
  });
}
// 查询部门列表
export function findDeptList(params = {}) {
    return request({
      url: "/web/employee/dept/findDeptList.do",
      method: "get",
      params
    });
  }

// 查询部门Tree
export function findDeptTree(params = {}) {
    return request({
      url: "/web/employee/dept/ajaxList.do",
      method: "get",
      params
    });
}

// 查询岗位类型列表
export function findStationList(params = {}) {
    return request({
      url: "/web/employee/stationDefinition/findStationList.do",
      method: "get",
      params
    });
  }

// 删除
export function deleted(data) {
    return request({
      url: "/web/employee/employee/delete.do",
      method: "post",
      data
    });
  }

// 修改
export function edit(data) {
    return request({
    url: "/web/employee/employee/modify.do",
    method: "post",
    data
    });
}

// 根据 id 查询
export function findOne(data) {
    return request({
    url: "/web/employee/employee/findOne.do",
    method: "post",
    data
    });
}