/*
 * @Description:
 * @Version: 1.0
 * @Autor: 朱发生
 * @Date: 2021-08-23 10:26:12
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-08-31 09:38:18
 */

import request from "@/utils/request";

//主表格URL
export function getprodParamStandListUrl() {
  return "/web/base/prodParamStand/ajaxList.do";
}

//查询主数据关联的产线数据表格
export function getLineTable(params) {
  return request({
    url: "/web/base/prodParamStandLine/ajaxList.do",
    method: "get",
    params
  });
}

//获取产品型号下拉数据
export function getProductModelList() {
  return request({
      url: "/web/base/productModel/findList.do",
      method: "get",
  });
}

//获取工艺路线下拉数据
export function queryRouteList(params) {
  return request({
    url: "/web/base/routeManager/route/ajaxList.do",
    method: "get",
    params
  });
}

//获取产线下拉数据
export function getWorkLineList(params) {
  return request({
      url: "/web/base/model/findList.do",
      method: "get",
      params
  });
}

//获取工艺工序列表URL
export function getRouteOperationUrl(params) {
  return request({
    url: "/web/base/prodParamStand/findRouteOpration.do",
    method: "get",
    params
  });
}

//根据工序id - 查询参数数据
export function getParamsByOpearionId(params) {
  return request({
    url: "/web/base/prodParamStand/findParameters.do",
    method: "get",
    params
  });
}

//数据保存
export function addList(data) {
  return request({
    url: "/web/base/prodParamStand/save.do",
    method: "post",
    data
  });
}

//回显工艺工序已经绑定的参数配置数据，（全局参数value，工步设置参数-工步表id ,工程完成参数value, ） 
export function getParamsValueByOperationId(params) {
  return request({
    url: "/web/base/prodParamStand/getParamsValueByOperationId.do",
    method: "get",
    params
  });
}

//回显工艺工序已经绑定的参数配置数据，（某个工步类型下的参数值数据 ） 
export function getWorkStepParamValueByOperationId(params) {
  return request({
    url: "/web/base/prodParamStand/getWorkStepParamValueByOperationId.do",
    method: "get",
    params
  });
}

//删除生产工步类型
export function deleteWorkStepParam(params) {
  return request({
    url: "/web/base/prodParamStand/deleteWorkStepParam.do",
    method: "post",
    params
  });
}

//删除生产工步类型
export function deleteList(params) {
  return request({
    url: "/web/base/prodParamStand/delete.do",
    method: "post",
    params
  });
}


//参数下发
export function send(params) {
  return request({
    url: "/web/base/prodParamStand/send.do",
    method: "post",
    data:params
  });
}

//参数下发
export function getXMLData(params) {
  return request({
    url: "/web/base/prodParamStand/getXMLData.do",
    method: "post",
    params
  });
}





