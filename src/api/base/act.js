/*
 * @Description:
 * @Version: 2.0
 * @Autor: 赖元生
 * @Date: 2021-04-19 15:01:48
 * @LastEditors: 曾宇奇
 * @LastEditTime: 2021-08-03 14:02:04
 */
import request from "@/utils/request";
export function saveCopyUrl() {
  return "/web/re/modelExt/saveCopy.do";
}
//保存复制
export function saveCopy(data) {
  return request({
    url: saveCopyUrl(),
    method: "post",
    data
  });
}
export function saveVersionCopyUrl() {
  return "/web/re/modelExt/saveVersionCopy.do";
}
//保存复制
export function saveVersionCopy(data) {
  return request({
    url: saveVersionCopyUrl(),
    method: "post",
    data
  });
}

export function activitiUrl() {
  return "../../../modeler/activiti.html";
}

export function activitiViewUrl() {
  return "../../../modeler/activiti_view.html";
}

export function processRouteSaveUrl() {
  return "/web/base/processRoute/save.do";
}
export function processRouteSave(data) {
  return request({
    url: processRouteSaveUrl(),
    method: "post",
    data
  });
}

// 工艺路径下拉框列表
export function findRouteList() {
  return request({
    url: "/web/re/modelExt/findRouteList.do",
    method: "get"
  });
}

export function modelExtModifyUrl() {
  return "/web/re/modelExt/modifyRoute.do";
}
export function modeExtModify(data) {
  return request({
    url: modelExtModifyUrl(),
    method: "post",
    data
  });
}

export function modelExtSaveUrl() {
  return "/web/re/modelExt/saveRoute.do";
}
export function modeExtSave(data) {
  return request({
    url: modelExtSaveUrl(),
    method: "post",
    data
  });
}
export function modelExtFindRouteUrl() {
  return "/web/re/modelExt/findRouteList";
}
export function modelExtFindRoute(data) {
  return request({
    url: modelExtFindRouteUrl(),
    method: "post",
    data
  });
}
export function modelExtFindUrl() {
  return "/web/re/modelExt/ajaxList";
}
export function modelExtFind(data) {
  return request({
    url: modelExtFindUrl(),
    method: "post",
    data
  });
}
export function procdefExtFindUrl() {
  return "/web/re/procdefExt/findList";
}
export function procdefExtFind(data) {
  return request({
    url: procdefExtFindUrl(),
    method: "post",
    data
  });
}

export function getModelOperationbyIdUrl() {
  return "/web/re/modelExt/getModelOperationbyId";
}
export function getModelOperationbyId(data) {
  return request({
    url: getModelOperationbyIdUrl(),
    method: "post",
    data
  });
}

export function getProcdefNodeUrl() {
  return "/web/re/actReProcdef/getProcdefNode";
}
export function getProcdefNode(data) {
  return request({
    url: getProcdefNodeUrl(),
    method: "post",
    data
  });
}
export function getNowNodeUrl() {
  return "/web/re/actReProcdef/getNowNode";
}
export function getNowNode(data) {
  return request({
    url: getNowNodeUrl(),
    method: "post",
    data
  });
}
export function getFlowImgUrl() {
  return "/web/re/actReProcdef/getFlowImg";
}
export function getFlowImg(data) {
  return request({
    url: getFlowImgUrl(),
    method: "post",
    data
  });
}
export function getNowFlowImgUrl() {
  return "/web/re/actReProcdef/getNowFlowImg";
}
export function getNowFlowImg(data) {
  return request({
    url: getNowFlowImgUrl(),
    method: "post",
    data
  });
}
export function deployUrl() {
  return "/web/re/procdefExt/deploy";
}
export function deploy(data) {
  return request({
    url: deployUrl(),
    method: "post",
    data
  });
}
export function deleteModelUrl() {
  return "/web/re/procdefExt/deleteModel";
}
export function deleteModel(data) {
  return request({
    url: deleteModelUrl(),
    method: "post",
    data
  });
}
export function deleteRouteUrl() {
  return "/web/re/procdefExt/deleteRoute";
}
export function deleteRoute(data) {
  return request({
    url: deleteRouteUrl(),
    method: "post",
    data
  });
}
export function actReProcdefFindOneUrl() {
  return "/web/re/actReProcdef/findOne";
}
export function actReProcdefFindOne(data) {
  return request({
    url: actReProcdefFindOneUrl(),
    method: "post",
    data
  });
}
