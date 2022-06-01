/*
 * @Description: 
 * @Version: 2.0
 * @Autor: 熊长
 * @Date: 2021-04-22 17:01:48
 * @LastEditors: 刘阳
 * @LastEditTime: 2021-08-06 11:25:09
 */
import request from "/@/utils/request";

// 新增
export function addDept(data) {
    return request({
      url: "/web/employee/dept/save.do",
      method: "post",
      data
    });
  }

// 列表
export function getDeptList(){
  return "/web/employee/dept/ajaxList.do";
}


// 查询列表
export function queryList(params = {}) {
  return request({
    url: getDeptList(),
    method: "get",
    params
  });
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
    url: "/web/employee/dept/delete.do",
    method: "post",
    data
  });
}

// 修改
export function editDept(data) {
  return request({
  url: "/web/employee/dept/modify.do",
  method: "post",
  data
  });
}

//导出
export function exportQuality(data) {
  return request({
    url: "/web/employee/dept/exportQuality.do",
    method: "post",
    data
  });
}