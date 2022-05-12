/*
 * @Description:
 * @Version: 2.0
 * @Autor: 熊长
 * @Date: 2021-05-13 09:34:09
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @LastEditTime: 2022-05-11 13:34:06
 */
import request from "/@/utils/request";

// 预警方法列表
export function getWarnMethodList() {
  return "/web/system/warnMethod/ajaxList.do";
}

//获取字段列表
export function getFieldList(id) {
   return request ({
     url:getFieldListById(),
     method:"post",
     data:{
       id
     }
   });

}
export function getFieldListById ()
{
  return "/web/system/warnMethodParam/getFileListByWarnMethodId";
}

//查询字段列表
export function queryFileDataList(id) {
  return request ({
    url:getFieldListById(),
    method:"post",
    data:{
      id
    }
  });
}




// 字段列表Url
export function fieldListUrl() {
  return "/web/system/warnItem/ajaxList.do";
}

// 新增预警方法列表
export function addWarnMethod(data) {
  return request({
    url: "/web/system/warnMethod/save.do",
    method: "post",
    data
  });
}

export function deleteWarnMethod(id){
return request ({
    url:"/web/system/warnMethod/delete.do",
    method:"post",
    data:{
      id
    }
});

}



// 编辑预警方法列表
export function editList(data) {
  return request({
    url: "/web/system/warnItem/modify.do",
    method: "post",
    data
  });
}


// 修改
export function editWarnMethod(data) {
  return request({
  url: "/web/system/warnMethod/modify.do",
  method: "post",
  data
  });
}

// 预警方法下拉框列表
export function getWarnMethodDownList() {
  return request({
    url: "/web/system/warnMethod/getWarnMethodDownList",
    method: "get"
  });
}

// 测试
export function methodTest(id) {
  return request({
    url: "/web/system/warnMethod/methodTest.do",
    method: "post",
    data: {
      id: id
    }
  });
}
