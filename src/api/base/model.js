/*
 * @Author: 刘云辉
 * @Date: 2021-04-19 19:19:06
 * @LastEditTime: 2021-12-24 11:33:15
 * @LastEditors: Please set LastEditors
 * @Description: 刘云辉
 * @FilePath: \mes-ui\src\network\api\base\model.js
 */

import request from "@/utils/request";

// 新增
export function add(data) {
    return request({
      url: "/web/base/model/save.do",
      method: "post",
      data
    });
  }

// 列表
export function getModelListUrl() {
    return "/web/base/model/ajaxList.do";
  }

// 查询列表
export function queryList(params = {}) {
    return request({
      url: getModelListUrl(),
      method: "get",
      params
    });
  }

// 列表
export function getModelOperationListUrl() {
  return "/web/base/model/ajaxOperationList.do";
}

// 查询列表
export function queryModelOperationList(params = {}) {
  return request({
    url: getModelOperationListUrl(),
    method: "get",
    params
  });
}

// 下拉列表
export function findModelList(params = {}) {
    return request({
      url: "/web/base/model/findList.do",
      method: "get",
      params
    });
  }
// 通过工位id和产品型号编码获取物料料号
export function findByStationIdAndProductModelCode(params = {}) {
  return request({
    url: "/web/base/model/findByStationIdAndProductModelCode.do",
    method: "get",
    params
  });
}
//获取数据权限控制车间下拉数据
export function getPermissBaseModelList(params = {}) {
  return request({
    url: "/web/base/model/permissList.do",
    method: "get",
    params
  });
}
//获取数据权限控制车间下拉数据
export function getPermissBaseModelListPage(params = {}) {
  return request({
    url: "/web/base/model/permissListPage.do",
    method: "get",
    params
  });
}

// 下拉列表
export function getGroupModelList(params = {}) {
  return request({
    url: "/web/base/model/getGroupModelList.do",
    method: "get",
    params
  });
}

// 条件查询列表
export function stationList(params = {}) {
    return request({
      url: "/web/base/model/stationList.do",
      method: "get",
      params
    });
  }

// 工位列表URl
export function stationListUrl() {
    return "/web/base/model/stationList.do";
  }


// 删除
export function deleted(data) {
    return request({
      url: "/web/base/model/delete.do",
      method: "post",
      data
    });
  }

// 修改
export function edit(data) {
    return request({
    url: "/web/base/model/modify.do",
    method: "post",
    data
    });
}

// 根据 id 查询
export function findOne(data) {
  return request({
  url: "/web/base/model/findOne.do",
  method: "post",
  data
  });
}

//批量修改工厂模型及其子模型的状态  查恩虎
export function changeDataState(data){
  return request({
    url: "/web/base/model/changeDataState.do",
    method: "post",
    data
    });
}
//物理删除  查恩虎
export function deletewithReal(data) {
  return request({
    url: "/web/base/model/deletewithReal.do",
    method: "post",
    data
  });
}

// 根据modelcode查询工厂信息及上级信息
export function findModelInfo(data) {
  return request({
    url: "/web/base/model/findModelInfo",
    method: "post",
    data
  });
}
