/*
 * @Description: 
 * @Version: 2.0
 * @Autor: 刘阳
 * @Date: 2021-06-15 14:30:52
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-11-24 20:25:41
 */
import request from "@/utils/request";

// 新增
export function add(data) {
    return request({
      url: "/web/base/batteryGear/save.do",
      method: "post",
      data
    });
  }
// 弹头档位类型值新增
export function addValue(data) {
    return request({
      url: "/web/base/batteryGearConfig/save.do",
      method: "post",
      data
    });
  }
//查询符合质检的条码
export function exportQuality(data) {
  return request({
    url: "/web/base/batteryGear/exportQuality.do",
    method: "post",
    data
  });
}
// 子列表
export function getPositionMaterialListUrl() {
    return "/web/system/dictionaryType/queryDictionaryData.do";
  }
  //子列表参数名称
  export function getPositionMaterialList(params = {}) {
    return request({
      url: getPositionMaterialListUrl(),
      method: "get",
      params
    });
  }
  //子列表参数值
  export function getValueList(params = {}) {
    return request({
      url: "/web/base/batteryGearConfig/ajaxList.do",
      method: "get",
      params
    });
  }
// 查询线边仓列表
export function getLinePositionsUrl() {
  return "/web/base/batteryGear/ajaxList.do";
}
// 线边仓查询列表
export function linePositionsQueryList(params = {}) {
  return request({
    url: getLinePositionsUrl(),
    method: "get",
    params
  });
}
// 删除
export function deleted(data) {
    return request({
      url: "/web/base/batteryGear/delete.do",
      method: "post",
      data
    });
  }

// 修改
export function edit(data) {
    return request({
    url: "/web/base/batteryGear/modify.do",
    method: "post",
    data
    });
}

// 弹头档位类型值修改
export function editValue(data) {
    return request({
    url: "/web/base/batteryGearConfig/modify.do",
    method: "post",
    data
    });
}
// 弹头档位类型值查询
export function getOneByGearType(data) {
  return request({
  url: "/web/base/batteryGearConfig/getOneByGearType.do",
  method: "post",
  data
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

//弹头档位参数值
export function findList(params = {}) {
  return request({
  url: "/web/base/batteryGearConfig/findList.do",
  method: "get",
  params
  });
}


