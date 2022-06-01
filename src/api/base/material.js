/*
 * @Author: 植秀振
 * @Date: 2021-04-19 10:36:08
 * @LastEditors: Please set LastEditors
 * @Description: 物料主数据
 * @FilePath: \mes-ui\src\api\base\material.js
 */

import request from "/@/utils/request";
export function getAllMaterialUrl() {
  return "/web/base/material/getAll.do";
}
// 物料列表Url
export function getMaterialListUrl() {
  return "/web/base/materialVersion/ajaxList.do";
}

// 查询列表
export function queryList(params = {}) {
  return request({
    url: getMaterialListUrl(),
    method: "get",
    params
  });
}

// 过站规则成品,半成品物料列表Url
export function getListMaterialUrl() {
  return "/web/base/materialVersion/ajaxListMaterial.do";
}

// 成品,半成品物料列表Url
export function getListMaterialCodeUrl() {
  return "/web/base/materialVersion/ajaxListMaterialCode.do";
}
// 成品,半成品查询列表
export function getListMaterialCode(params = {}) {
  return request({
    url: getListMaterialCodeUrl(),
    method: "get",
    params
  });
}

// 查询所有url
export function getMaterialAllUrl() {
  return "/web/base/materialVersion/findAll.do";
}

// 查询所有
export function getMaterialAll(params = {}) {
  return request({
    url: getMaterialAllUrl(),
    method: "get",
    params
  });
}

// 新增列表
export function addList(data) {
  return request({
    url: "/web/base/materialVersion/save.do",
    method: "post",
    data
  });
}
// 删除列表
export function delList(data) {
  return request({
    url: "/web/base/materialVersion/delete.do",
    method: "post",
    data
  });
}
// 编辑列表
export function editList(data) {
  return request({
    url: "/web/base/materialVersion/modify.do",
    method: "post",
    data
  });
}

//获取物料类型
export function getMaterialTypeList() {
  return request({
    url: "/web/base/materialVersion/delete.do",
    method: "get"
  });
}

//
export function getAllList(params = {}) {
  return request({
    url: "/web/base/materialVersion/findList.do",
    method: "get",
    params
  });
}
// 物料及版本下拉列表
export function getDistinctList(params = {}) {
  return request({
    url: "/web/base/material/getDistinctList.do",
    method: "get",
    params
  });
}

//获取工艺路线
export function getRouteDnList() {
  return request({
    url: "/web/re/modelExt/findRouteList.do",
    method: "get"
  });
}

// 删除列表
export function deleteMaterialConfigItem(data) {
  return request({
    url: "/web/material/materialConfig/materialCallConfigItem/delete.do",
    method: "post",
    data
  });
}
export function saveMaterialConfig(data) {
  return request({
    url: "/web/material/materialConfig/materialCallConfigItem/save.do",
    method: "post",
    data
  });
}
export function findBomVersionByMaterial(data) {
  return request({
    url: "/web/base/BaseMaterialBom/findBomVersionByMaterial.do",
    method: "post",
    data
  });
}

export function findOneByMaterial(data) {
  return request({
    url: "/web/base/BaseMaterialBom/findOneByMaterial.do",
    method: "post",
    data
  });
}

// 物料及版本下拉列表
export function getEntityByMaterialCodeAndMaterialVersion(params = {}) {
  return request({
    url: "/web/base/materialVersion/getEntityByMaterialCodeAndMaterialVersion.do",
    method: "get",
    params
  });
}

// 新增列表
export function recoveryEntity(data) {
  return request({
    url: "/web/base/materialVersion/recoveryEntity.do",
    method: "post",
    data
  });
}
