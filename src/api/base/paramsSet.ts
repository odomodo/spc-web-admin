/*
 * @Description:
 * @Version: 2.0
 * @Autor: 曾宇奇
 * @Date: 2021-04-20 10:16:49
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-01-20 21:20:15
 */

import request from "/@/utils/http/request";

// 系统配置列表Url
export function getParamsListUrl(type: string) {
  return type == "parent"
    ? "/web/system/dictionaryType/ajaxList.do"
    : "/web/system/dictionaryValue/ajaxList.do";
}

// 查询列表
export function queryList(type: any, data?: any) {
  return request({
    url: getParamsListUrl(type),
    method: "post",
    data
  });
}

// 增加列表
export function addList(type: string, data: any) {
  return request({
    url:
      type == "parent"
        ? "/web/system/dictionaryType/save.do"
        : "/web/system/dictionaryValue/save.do",
    method: "post",
    data
  });
}

// 删除列表
export function delList(type: string, id: any) {
  return request({
    url:
      type == "parent"
        ? "/web/system/dictionaryType/delete.do"
        : "/web/system/dictionaryValue/delete.do",
    method: "post",
    data: {
      id
    }
  });
}

// 修改列表
export function editList(type: string, data: any) {
  return request({
    url:
      type == "parent"
        ? "/web/system/dictionaryType/modify.do"
        : "/web/system/dictionaryValue/modify.do",
    method: "post",
    data
  });
}

// 查询数据字典数据
export function queryParentData() {
  return request({
    url: "/web/system/dictionaryType/queryParentData.do",
    method: "get"
  });
}

// 查询数据字典数据
export function queryDictionaryData(typeCode: any, valueCode: any) {
  return request({
    url: "/web/system/dictionaryType/queryDictionaryData.do",
    method: "post",
    data: {
      typeCode,
      valueCode
    }
  });
}
export function queryDictionaryHu(typeCode: any, valueCode: any) {
  return request({
    url: "/web/system/dictionaryType/queryDictionaryHu.do",
    method: "post",
    data: {
      typeCode,
      valueCode
    }
  });
}

//下载导入模板
export function importTemplate(templateUrl: any) {
    return request({
      url: templateUrl,
      method: "post",
    });
  }
//导出模板
export function exportTemplate(templateUrl: any,params: any) {
  return request({
    url: templateUrl,
    method: "post",
    params
  });
}
// 查询产品型号
export function loadProductModel(params = {}) {
    return request({
      url: "/web/base/productModel/findList.do",
      method: "get",
      params
    });
  }

//获取车间，产线下拉数据
export function getBaseModelList(params = {}) {
  return request({
    url: "/web/base/model/findList.do",
    method: "get",
    params
  });
}

// 工序下拉列表
export function getOperationList(params = {}) {
    return request({
      url: "/web/base/routeManager/operation/findList.do",
      method: "get",
      params
    });
  }

// 获取设备
export function getEquipmentList(params = {}) {
  return request({
    url: "/web/equ/equipment/findList",
    method: "get",
    params
  });
}

// 查询标签模板
export function queryLabelType(params = {}) {
    return request({
      url: "/web/pro/label/findList.do",
      method: "get",
      params
    });
  }

// 查询条码模板
export function queryBarcodeType(params = {}) {
    return request({
      url: "/web/pro/barcode/findList.do",
      method: "get",
      params
    });
  }
  
// 查询产品型号绑定产品料号下拉列表
export function queryProductModelMeterial(params = {}) {
  return request({
    url: "/web/base/productModelMeterial/versionList1.do",
    method: "get",
    params
  });
}
