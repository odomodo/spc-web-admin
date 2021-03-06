/*
 * @Author: 查恩虎
 * @Date: 2022-01-06 14:49:50
 * @LastEditTime: 2022-01-06 15:59:14
 * @LastEditors: Please set LastEditors
 * @Description: 日期对照表api
 * @FilePath: \mes-ui\src\api\base\dateRule.js
 */
import request from "/@/utils/request";
export function autoGenerateDates(params = {}) {
    return request({
      url: "/web/base/dateRule/autoGenerate.do",
      method: "get",
      params
    });
  }
  export function queryDatesUrl() {
    return "/web/base/dateRuleItem/ajaxList.do";
  }
  export function findOneByDateType(params = {}) {
    return request({
      url: "/web/base/dateRule/findOneByDateType.do",
      method: "get",
      params
    });
  }