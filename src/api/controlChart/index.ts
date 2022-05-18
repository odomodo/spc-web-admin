/*
 * @Author: liuxinyi-yuhang 1029301987@qq.com
 * @Date: 2022-05-17 13:07:41
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @LastEditTime: 2022-05-18 11:09:53
 * @FilePath: \spc-web-admin\src\api\controlChart\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * @Author: liuxinyi-yuhang 1029301987@qq.com
 * @Date: 2022-05-17 13:07:41
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @LastEditTime: 2022-05-17 13:14:00
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