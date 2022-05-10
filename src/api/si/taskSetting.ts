/*
 * @Description:
 * @Version: 2.0
 * @Autor: 曾宇奇
 * @Date: 2021-06-16 16:10:41
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-08-04 15:15:50
 */

import request from "/@/utils/http/request";

// 获取服务配置url
export function getTaskSetting() {
  return "/web/si/taskConfig/ajaxList.do";
}

// 删除
export function delList(id: any) {
  return request({
    url: "/web/si/taskConfig/delete.do",
    method: "post",
    data: {
      id
    }
  });
}
// 新增
export function addList(data: any) {
  return request({
    url: "/web/si/taskConfig/save.do",
    method: "post",
    data
  });
}

// 修改
export function editList(data: any) {
  return request({
    url: "/web/si/taskConfig/modify.do",
    method: "post",
    data
  });
}

// 获取服务名称下拉框数据
export function getServeNameDnList() {
  return request({
    url: "/web/si/taskConfig/selectServiceData",
    method: "get"
  });
}

// 启动任务
export function startTask(id: any) {
  return request({
    url: "/web/si/taskConfig/startTask",
    method: "post",
    data: {
      id
    }
  });
}
// 暂停/恢复任务
export function stopResumeTask(id: any) {
  return request({
    url: "/web/si/taskConfig/stopResumeTask",
    method: "post",
    data: {
      id
    }
  });
}
// 停止任务
export function deleteTask(id: any) {
  return request({
    url: "/web/si/taskConfig/deleteTask",
    method: "post",
    data: {
      id
    }
  });
}

// 停止所有任务
export function deleteAllTask() {
  return request({
    url: "/web/si/taskConfig/deleteAllTask",
    method: "post"
  });
}

//
export function getTaskLog() {
  return "/web/api/taskConfig/ajaxList.do";
}
