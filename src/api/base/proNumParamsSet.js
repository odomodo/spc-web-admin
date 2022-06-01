/*
 * @Description:
 * @Version: 2.0
 * @Autor: 曾宇奇
 * @Date: 2021-06-03 17:01:30
 * @LastEditors: 曾宇奇
 * @LastEditTime: 2021-06-03 19:11:14
 */
import request from "/@/utils/request";

// 获取产品型号Url
export function getlistTableUrl() {
  return "/web/base/productModel/ajaxList.do";
}

// 装驘参数列表Url
export function getParamsListUrl() {
  return "/web/system/dictionaryValue/ajaxList.do";
}
