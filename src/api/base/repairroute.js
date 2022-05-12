/*

 *  * @Description:
 * @Version: 2.0
 * @Autor: 赖元生
 * @Date: 2021-07-29 15:01:48
 * @LastEditors: 赖元生
 * @LastEditTime: 2021-07-29 13:25:35
 */
import request from "@/utils/request";


// 新增
export function add(data) {
  return request({
    url: "/web/base/repairManager/BaseRepairRoute/save.do",
    method: "post",
    data
  });
}

// 列表
export function getListUrl() {
  return "/web/base/repairManager/BaseRepairRoute/ajaxList";
}


// 查询列表
export function queryList(params = {}) {
  return request({
    url: getListUrl(),
    method: "get",
    params
  });
}

// 查询列表
export function findList(params = {}) {
  return request({
    url: "/web/base/repairManager/BaseRepairRoute/findList.do",
    method: "get",
    params
  });
}


// 删除
export function deleted(data) {
  return request({
    url: "/web/base/repairManager/BaseRepairRoute/delete",
    method: "post",
    data
  });
}

// 修改
export function edit(data) {
  return request({
    url: "/web/base/repairManager/BaseRepairRoute/modify.do",
    method: "post",
    data
  });
}

