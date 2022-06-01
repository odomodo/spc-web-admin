/*
 * @Author: liuxinyi-yuhang 1029301987@qq.com
 * @Date: 2022-05-17 13:07:41
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @LastEditTime: 2022-05-31 15:06:28
 * @FilePath: \spc-web-admin\src\api\controlChart\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import request from '/@/utils/http/request';
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
// 检验项目接口 分页查询
export function TSpcInspectionAjaxList() {
	return "/web/core/inspection/TSpcInspection/ajaxList";
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