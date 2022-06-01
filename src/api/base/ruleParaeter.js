/*
 * @Author: 刘云辉
 * @Date: 2021-04-19 19:19:06
 * @LastEditTime: 2021-06-17 09:24:34
 * @LastEditors: Please set LastEditors
 * @Description: 刘云辉
 * @FilePath: \mes-ui\src\network\api\base\model.js
 */

import request from "/@/utils/request";

// tree  数据获取
export function treeList(data) {
  return request({
    url: "/web/base/ruleParaeter/treeList.do",
    method: "post",
    data
  });
}

//通过档次类型和产品型号来查询参数规则Url 查恩虎
export function getRulesByGearAndProductModelUrl(){
  return "/web/base/ruleParaeter/getRulesByGearAndProductModel.do";
}
//通过档次类型和产品型号来查询参数规则 查恩虎
export function getRulesByGearAndProductModel(data) {
  return request({
    url: getRulesByGearAndProductModelUrl(),
    method: "post",
    data
  });
}
// 列表数据获取
export function propertyList(data) {
  return request({
    url: "/web/base/property/propertyList.do",
    method: "post",
    data
  });
}

// 列表数据获取
export function findList(data) {
  return request({
    url: "/web/base/property/findList.do",
    method: "post",
    data
  });
}

// 列表数据保存
export function propertySave(data) {
  return request({
    url: "/web/base/property/save.do",
    method: "post",
    data
  });
}
//获取指定档位类型的装驘数量 查恩虎
export function getProperty(data){
  return request({
    url: "/web/base/property/getProperty.do",
    method: "post",
    data
  });
}

// 产品型号列表
export function productModelList() {
  return request({
      url: "/web/base/productModel/findList.do",
      method: "get",
  });
}

// 规则新增
export function ruleAdd(data) {
  return request({
      url: "/web/base/ruleParaeter/save.do",
      method: "post",
      data
  });
}

// 规则删除
export function deleted(data) {
  return request({
      url: "/web/base/ruleParaeter/delete.do",
      method: "post",
      data
  });
}

// 根据 id 查询
export function findOne(data) {
  return request({
    url: "/web/base/ruleParaeter/findOne.do",
    method: "post",
    data
  });
}

// 修改
export function edit(data) {
  return request({
    url: "/web/base/ruleParaeter/modify.do",
    method: "post",
    data
  });
}
