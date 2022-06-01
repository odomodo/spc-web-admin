/*
 * @Description: 
 * @Version: 2.0
 * @Autor: 熊长
 * @Date: 2021-04-22 17:01:48
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-04-24 15:52:11
 */
import request from "/@/utils/request";

// 新增
export function addStation(data) {
    return request({
      url: "/web/employee/stationDefinition/save.do",
      method: "post",
      data
    });
  }

// 列表
export function getStationList(){
  return "/web/employee/stationDefinition/ajaxList.do";
}


//查询列表
export function queryStationList(params={}) {
  return request({
    url:getStationList(),
    method:"get",
    params
  });
}

// 删除
export function deleted(data) {
  return request({
    url: "/web/employee/stationDefinition/delete.do",
    method: "post",
    data
  });
}

// 修改
export function editStation(data) {
  return request({
  url: "/web/employee/stationDefinition/modify.do",
  method: "post",
  data
  });
}
