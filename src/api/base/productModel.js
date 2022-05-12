/*
 * @Description: 
 * @Version: 2.0
 * @Autor: 刘阳
 * @Date: 2021-04-19 18:59:29
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-02-12 16:41:25
 */
import request from "@/utils/request";

// 产品列表Url
export function getProductModelListUrl() {
  return "/web/base/productModel/ajaxList.do";
}

// 查询列表
export function productModelList(params = {}) {
  return request({
    url: getProductModelListUrl(),
    method: "get",
    params
  });
}
// 根据产品型号Id获取该组件所有的组件以及替代料
export function findMaterialById(params = {}) {
  return request({
    url: "/web/base/productModelMeterial/findList.do",
    method: "get",
    params
  });
}
// 根据产品型号和工序查找物料料号和物料版本
export function findOneByProcessAndProductModel(params = {}) {
  return request({
    url: "/web/base/productModelMeterial/findOneByProcessAndProductModel.do",
    method: "get",
    params
  });
}
// 根据 id 查询
export function findBarcodeTemplateIdById(params = {}) {
  return request({
  url: "/web/base/productModel/findBarcodeTemplateIdById.do",
  method: "get",
  params
  });
}
// 查询列表
export function queryList(params = {}) {
  return request({
    url: getProductModelListUrl(),
    method: "get",
    params
  });
}
// 下拉列表
export function findList(params = {}) {
  return request({
    url: "/web/base/productModel/findList.do",
    method: "get",
    params
  });
}
// 新增列表
export function addList(data) {
  return request({
    url: "/web/base/productModel/save.do",
    method: "post",
    data
  });
}
// 关联物料新增列表
export function addMaterialList(data) {
  return request({
    url: "/web/base/productModelMeterial/save.do",
    method: "post",
    data
  });
}
// 关联条码新增列表
export function addBarcodeList(data) {
  return request({
    url: "/web/base/productModelBarcode/save.do",
    method: "post",
    data
  });
}
// 关联标签新增列表
export function addLabelList(data) {
  return request({
    url: "/web/base/productModelLabel/save.do",
    method: "post",
    data
  });
}
// 查询
export function findByProductModelCode(params={}) {
  return request({
    url: "/web/base/productModelLabel/findByProductModelCode.do",
    method: "get",
    params
  });
}

export function findByOrderCode(params={}) {
  return request({
    url: "/web/base/productModel/findByOrderCode.do",
    method: "get",
    params
  });
}
// 根据 id 查询
export function findOne(data) {
  return request({
  url: "/web/base/productModel/findOne.do",
  method: "post",
  data
  });
}
// 删除
export function deleted(data) {
  return request({
    url: "/web/base/productModel/delete.do",
    method: "post",
    data
  });
}
// 编辑列表
export function editList(data) {
  return request({
    url: "/web/base/productModel/modify.do",
    method: "post",
    data
  });
}
// 通过物料id和版本id查找
export function findAllByMaterialIdAndVersionId(data) {
  return request({
    url: "/web/base/productModel/findAllByMaterialIdAndVersionId.do",
    method: "post",
    data
  });
}
// 物料下拉列表
export function versionList() {
  return request({
      url: "/web/base/materialVersion/versionList.do",
      method: "get"
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
//弹头档位参数值
export function findBatteryGearConfigList(data) {
  return request({
  url: "/web/base/batteryGearConfig/ajaxList.do",
  method: "get",
  data
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
// 获取工序
export function findOperationListPages(params = {}) {
  return request({
    url: "/web/base/routeManager/operation/ajaxList.do",
    method: "get",
    params
  });
}

// 物料及版本下拉列表
export function getMaterialList(params = {}) {
  return request({
    url: "/web/base/materialVersion/ajaxList.do",
    method: "get",
    params
  });
}

// 通过物料料号获取绑定的产品型号
export function findByMaterialCode(params = {}) {
  return request({
    url: "/web/base/productModelMeterial/findByMaterialCode.do",
    method: "get",
    params
  });
}