/*
 * @Author: 植秀振
 * @Date: 2021-04-19 10:36:08
 * @LastEditTime: 2021-08-13 13:15:05
 * @LastEditors: Please set LastEditors
 * @Description: 物料Bom
 * @FilePath: \mes-ui\src\api\base\materialBom.js
 */

import request from "/@/utils/request";

// 物料列表Url
export function getMaterialBomListUrl() {
  return "/web/base/BaseMaterialBom/ajaxList.do";
}

// 查询列表
export function queryList(params = {}) {
  return request({
    url: getMaterialBomListUrl(),
    method: "get",
    params
  });
}
// 新增列表
export function addList(data) {
  return request({
    url: "/web/base/BaseMaterialBom/save.do",
    method: "post",
    data
  });
}
// 删除列表
export function delList(data) {
  return request({
    url: "/web/base/BaseMaterialBom/delete.do",
    method: "post",
    data
  });
}
// 编辑列表
export function editList(data) {
  return request({
    url: "/web/base/BaseMaterialBom/modify.do",
    method: "post",
    data
  });
}

//获取物料类型
export function getMaterialTypeList() {
  return request({
    url: "/web/base/BaseMaterialBom/delete.do",
    method: "get",
  })
}

// 下拉列表
export function findProductList(params = {}) {
  return request({
    url: "/web/base/productModel/findList.do",
    method: "get",
    params
  });
}

// 查询列表
export function queryMaterialBomList(params = {}) {
  return request({
    url: "/web/base/BaseMaterialBom/findMaterialBomList.do",
    method: "get",
    params
  });
}

// 查询组价列表
export function queryMaterialBomAssemblyList(params = {}) {
  return request({
    url: "/web/base/BaseMaterialBomAssembly/ajaxList.do",
    method: "get",
    params
  });
}
///
// 根据Bom查询列表
export function findOneByMaterialBomId(params = {}) {
  return request({
    url: "/web/base/BaseMaterialBomAssembly/findOneByMaterialBomId.do",
    method: "get",
    params
  });
}

// 根据assemblyId获取该组件所有的替代料
export function findMaterialBomRepalceByAssemblyId(params = {}) {
  return request({
    url: "/web/base/BaseMaterialBomReplace/findAllList.do",
    method: "get",
    params
  });
}

// 根据BomId获取该组件所有的组件以及替代料
export function findMaterialBomById(params = {}) {
  return request({
    url: "/web/base/BaseMaterialBom/findMaterialBomById.do",
    method: "get",
    params
  });
}

// 获取工序
export function findOperationList(params = {}) {
  return request({
    url: "/web/base/routeManager/operation/findList.do",
    method: "get",
    params
  });
}
// 根据工艺路径id获取工序
export function findModelOperationList(params = {}) {
  return request({
    url: "/web/re/modelExt/getModelOperationbyId.do",
    method: "get",
    params
  });
}
//获取该料号的产品型号
export function findProductModelById(params = {}) {
  return request({
    url: "/web/base/productModelMeterial/findOne.do",
    method: "get",
    params
  });
}

//获取该料号bom的料号
export function findListByBomId(params = {}) {
  return request({
    url: "/web/base/materialVersion/findListByBomId.do",
    method: "get",
    params
  });
}