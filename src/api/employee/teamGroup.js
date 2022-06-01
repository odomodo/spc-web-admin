/*
 * @Description: 
 * @Version: 2.0
 * @Autor: 刘阳
 * @Date: 2021-04-26 13:51:27
 * @LastEditors: 刘阳
 * @LastEditTime: 2021-04-29 14:28:50
 */
import request from "/@/utils/request";

// 班组管理列表Url
export function getTeamGroupListUrl() {
    return "/web/employee/teamGroup/ajaxList.do";
  }
  
  // 查询列表
  export function queryList(params = {}) {
    return request({
      url: getTeamGroupListUrl(),
      method: "get",
      params
    });
  }
  // 新增列表
  export function add(data) {
    return request({
      url: "/web/employee/teamGroup/save.do",
      method: "post",
      data
    });
  }
  // 删除列表
  export function deleted(data) {
    return request({
      url: "/web/employee/teamGroup/delete.do",
      method: "post",
      data
    });
  }
  // 编辑列表
  export function edit(data) {
    return request({
      url: "/web/employee/teamGroup/modify.do",
      method: "post",
      data
    });
  }

  // 所属车间下拉列表
export function findModelList(params = {}) {
  return request({
    url: "/web/base/model/findList.do",
    method: "get",
    params
  });
}

  // 班组下拉列表
  export function findTeamGroupList(params = {}) {
    return request({
      url: "/web/employee/teamGroup/findList.do",
      method: "get",
      params
    });
  }

// 部门下拉列表
export function findDeptCodeList(params = {}) {
  return request({
    url: "/web/employee/dept/findDeptList.do",
    method: "get",
    params
  });
}

  
  // // 车间下拉框列表
  // export function getWorkshopDnList() {
  //   return request({
  //     url: "/web/base/model/getWorkshopDnList.do",
  //     method: "get"
  //   });
  // }
  
  // 部门下拉框列表
  export function getDetpDnList() {
    return request({
      url: "/web/base/model/getDepartmentDnList.do",
      method: "get"
    });
  }
  
  // 工厂下拉框列表
  export function getFactoryDnList() {
    return request({
      url: "/web/base/model/getFactoryDnList.do",
      method: "get"
    });
  }