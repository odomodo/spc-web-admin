/*
 * @Description:
 * @Version: 2.0
 * @Autor: 曾宇奇
 * @Date: 2021-06-16 10:07:57
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-07-08 15:06:30
 */

import request from "/@/utils/http/request";

// 获取服务配置url
export function getServeSetting() {
  return "/web/si/serviceConfig/ajaxList.do";
}

// 删除
export function delList(id: any) {
  return request({
    url: "/web/si/serviceConfig/delete.do",
    method: "post",
    data: {
      id
    }
  });
}
// 新增
export function addList(data: any) {
  return request({
    url: "/web/si/serviceConfig/save.do",
    method: "post",
    data
  });
}

// 修改
export function editList(data: any) {
  return request({
    url: "/web/si/serviceConfig/modify.do",
    method: "post",
    data
  });
}
// 查找
export function findList(params = {}) {
  return request({
    url: getServeSetting(),
    method: "get",
    params
  });
}

// 测试
export function serviceTest(id: any) {
  return request({
    url: "/web/si/serviceConfig/serviceTest.do",
    method: "post",
    data: {
      id: id
    }
  });
}
