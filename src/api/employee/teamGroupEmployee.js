/*
 * @Description: 
 * @Version: 2.0
 * @Autor: 刘阳
 * @Date: 2021-05-04 16:06:56
 * @LastEditors: 刘阳
 * @LastEditTime: 2021-05-25 14:36:06
 */
import request from "/@/utils/request";
 // 获取人员信息列表列表
 export function teamGroupEmployeeUrl() {
  return "/web/employee/teamgroupemployee/ajaxList.do";
}
  // 查询列表
  export function queryList(params = {}) {
    return request({
      url: getEmployeeListUrl(),
      method: "get",
      params
    });
  }
  // 新增列表
  export function add(data) {
    return request({
      url: "/web/employee/teamgroupemployee/save.do",
      method: "post",
      data
    });
  }
// 班组列表
 export function teamGroupEmployeeList(params = {}) {
  return request({
    url: teamGroupEmployeeUrl(),
    method: "post",
    params
  });
}
 // 班组列表
 export function findList(params = {}) {
  return request({
    url: "/web/employee/teamGroup/ajaxList.do",
    method: "get",
    params
  });
}

  // 班组下拉列表
  export function findTeamGroupList(params = {}) {
    return request({
      url: "/web/employee/teamgroupemployee/findTeamGroupList.do",
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