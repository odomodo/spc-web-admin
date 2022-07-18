/*
 * @Author: liuxinyi-yuhang 1029301987@qq.com
 * @Date: 2022-05-17 13:07:41
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @LastEditTime: 2022-07-08 10:42:45
 * @FilePath: \spc-web-admin\src\api\controlChart\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import request from '/@/utils/http/request';
import request1 from "/@/utils/request";
import { tSpcControlGroupSaveType } from './type.ts'
// spc控制组接口,
export const tSpcControlGroupAjaxList = () => {
	return request({
		url: "/web/core/controlChart/TSpcControlGroup/findList",
		method: "get"
	});
}

export const tSpcControlGroupSave = (data: tSpcControlGroupSaveType) => {
	return request({
		url: "/web/core/controlChart/TSpcControlGroup/save",
		method: "post",
		data
	});
}

export const tSpcControlGroupModify = (data: tSpcControlGroupSaveType) => {
	return request({
		url: "/web/core/controlChart/TSpcControlGroup/modify",
		method: "post",
		data
	});
}
// 删除接口
export const TSpcControlGroupdelete = (id) => {
	return request({
		url: "/web/core/controlChart/TSpcControlGroup/delete",
		method: "get",
		params: { id }
	});
}


export const tspcInspectionFindList = () => {
	return request({
		url: "/web/core/inspection/TSpcInspection/findList",
		method: "get",
	});
}

// spc控制组下的控制项的控制图明细接口 新增
export const tspcControlGroupItemSave = (data: any) => {
	return request({
		url: "/web/core/controlChart/TSpcControlGroupItem/save",
		method: "post",
		data
	});
}
// spc控制组下的控制项的控制图明细接口 修改
export const tspcControlGroupItemModify = (data: any) => {
	return request({
		url: "/web/core/controlChart/TSpcControlGroupItem/modify",
		method: "post",
		data
	});
}

// 检验项目接口  新增
export const TSpcInspectionSave = (data: any) => {
	return request({
		url: "/web/core/inspection/TSpcInspection/save",
		method: "post",
		data
	});
}
// 检验项目接口  编辑
export const TSpcInspectionModify = (data: any) => {
	return request({
		url: "/web/core/inspection/TSpcInspection/modify",
		method: "post",
		data
	});
}

// spc控制组下的控制项的控制图明细接口 分页查询
export function TSpcControlGroupItemAjaxList() {
	return "/web/core/controlChart/TSpcControlGroupItem/ajaxList";
}

// 删除接口
export const TSpcControlGroupItemdelete = (id: any) => {
	return request({
		url: "/web/core/controlChart/TSpcControlGroupItem/delete",
		method: "get",
		params: {id}
	});
}
// 检验项目接口 分页查询
export function TSpcInspectionAjaxList() {
	return "/web/core/inspection/TSpcInspection/ajaxList";
}

// 检验项目接口 删除
export function TSpcInspectiondelete(data) {
	return request({
		url:"/web/core/inspection/TSpcInspection/delete",
		method:'post',
		data
	})
}


//spc控制组下的控制项的控制图明细接口 
export function getTSpcControlGroupItemById(id:string) {
	return request({
		url:"/web/core/controlChart/TSpcControlGroupItem/findOne.do?id=" + id,
		method:'get'
		
	})
}

export function postDictionaryTypeFindList(dataType:string) {
	return request({
		url:"/web/system/dictionaryType/findList",
		method:'post',
		data: { dataType }
	})
}

// 工厂管理员界面- 新增
export function roleSysRoleSave(data) {
	return request({
		url:"/web/system/role/sysRoleSave",
		method:'post',
		data
	})
}

// 角色用户关联接口 - GET 分页查询接口
export function roleAjaxList(params) {
	return request({
		url:"/web/api/role/ajaxList",
		method:'get',
		params
	})
}

// 获取用户列表
export function sysUserGetUserList(params) {
	return request({
		url:"/web/system/sysUser/getUserList",
		method:'get',
		params
	})
}


// 新增角色用户关联关系
export function roleSave(data) {
	return request({
		url:"/web/api/role/save",
		method:'post',
		data
	})
}

// 修改接口
export function roleModify(data) {
	return request({
		url:"/web/system/role/modify",
		method:'post',
		data
	})
}


// 修改接口
export function apiroleModify(data) {
	return request({
		url:"/web/api/role/modify",
		method:'post',
		data
	})
}


export function apiroledelete(id) {
	return request({
		url:"/web/api/role/delete",
		method:'get',
		params:{ id }
	})
}
export function roleDelete(id) {
	return request({
		url:"/web/system/role/delete",
		method:'get',
		params:{ id }
	})
}

//角色权限关联接口 分页查询接口
export function rolePermissionItemAjaxList() {
	return request({
		url:"/web/sys/rolePermissionItem/ajaxList",
		method:'get',
	})
}

// 无分页功能菜单列表查询
export function menuFindMenuList(params) {
	return request({
		url:"/web/system/menu/findMenuListForSPC",
		method:'get',
		params
	})
}


// 角色管理接口  非分页查询接口
export function roleFindList(params) {
	return request({
		url:"/web/system/role/findList",
		method:'get',
		params
	})
}

// 角色权限管理 - 数据保存SaveSimple
export function rolePermissionItemsaveSimple(data) {
	return request({
		url:"/web/sys/rolePermissionItem/saveSimple",
		method:'post',
		data
	})
}

// 角色权限管理 - 数据编辑
export function rolePermissionItemmodify(data) {
	return request({
		url:"/web/sys/rolePermissionItem/modify",
		method:'post',
		data
	})
}

// 删除
export function rolePermissionItemdelete(roleId) {
	return request({
		url:"/web/sys/rolePermissionItem/delete",
		method:'get',
		params:{
			roleId
		}
	})
}

export function rolePermissionItemajaxList(params) {
	return "/web/sys/rolePermissionItem/ajaxList"
}

// 采取措施接口 - 新增接口
export function TSpcTakeMeasuresave(data) {
	return request({
		url:"/web/core/exceptionManagement/TSpcTakeMeasure/save",
		method:'post',
		data
	})
}

// 修改接口
export function TSpcTakeMeasuremodify(data) {
	return request({
		url:"/web/core/exceptionManagement/TSpcTakeMeasure/modify",
		method:'post',
		data
	})
}
export function TSpcTakeMeasureajaxList(params) {
	return "/web/core/exceptionManagement/TSpcTakeMeasure/ajaxList"
}

// 删除
export function TSpcTakeMeasuredelete(id) {
	return request({
		url:"/web/core/exceptionManagement/TSpcTakeMeasure/delete",
		method:'get',
		params: { id }
	})
}


// 失控点管理接口 分页查询接口
export function TSpcOutControlAuditajaxList(params) {
	return request({
		url:"/web/core/exceptionManagement/TSpcOutControlAudit/ajaxList",
		method:'get',
		params
	})
}

// 失控点管理接口修改接口
export function TSpcOutControlAuditmodify(data) {
	return request({
		url:"/web/core/exceptionManagement/TSpcOutControlAudit/modify",
		method:'post',
		data
	})
}



// 采取措施接口 - 分页查询接口
export function exceptionManagementTSpcTakeMeasureajaxList(params) {
	return "/web/core/exceptionManagement/TSpcTakeMeasure/ajaxList"
}
