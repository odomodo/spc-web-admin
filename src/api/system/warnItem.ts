/*
 * @Description:
 * @Version: 2.0
 * @Autor: 曾宇奇
 * @Date: 2021-05-10 11:00:30
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @LastEditTime: 2022-05-09 15:18:40
 */

import request from "/@/utils/request";

// 预警列表Url
export function WarnListUrl() {
  return "/web/system/warnItem/ajaxList.do";
}

//根据id获取 预警项名称和预警项类型
export function getWarnNameAndWarnTypeList(id: String | Number) {
    return  request({
      url:"/web/system/warnItem/findOne.do",
      method:"post",
      data:{
        id
      }
    })
}

//得到预警项下拉数据

export function getWarnDownList(data: any) {
  return request({
    url: WarnListUrl(),
    method: "post",
    data
  });
}

// 新增列表
export function addList(data: any) {
  return request({
    url: "/web/system/warnItem/save.do",
    method: "post",
    data
  });
}
// 删除列表
export function delList(id: String | Number) {
  return request({
    url: "/web/system/warnItem/delete.do",
    method: "post",
    data: {
      id
    }
  });
}
// 编辑列表
export function editList(data: any) {
  return request({
    url: "/web/system/warnItem/modify.do",
    method: "post",
    data
  });
}
