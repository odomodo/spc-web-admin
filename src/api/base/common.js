/*
 * @Author: 查恩虎
 * @Date: 2021-11-30 10:07:44
 * @LastEditTime: 2021-12-01 19:08:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \mes-ui\src\api\base\common.js
 */
import request from "/@/utils/request";
//调用打印服务
export function printCodeSoftPrint(data) {
    return request({
      url: "/web/common/codeSoftPrint.do",
      method: "post",
      data
    });
  }

//调用打印服务
export function codeSoftWebApiPrint(data) {
  return request({
    url: "/web/common/codeSoftWebApiPrint.do",
    method: "post",
    data
  });
}
