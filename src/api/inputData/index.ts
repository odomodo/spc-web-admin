/*
 * @Author: Administrator 848563840@qq.com
 * @Date: 2022-05-27 15:54:20
 * @LastEditors: Administrator 848563840@qq.com
 * @LastEditTime: 2022-07-18 15:28:07
 * @FilePath: \chartc:\Users\Administrator\Desktop\share\code\spc-web-admin\src\api\inputData\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import request from '/@/utils/http/request';
import requests from '/@/utils/request';
import { getChartDataInterface } from './type'


// 单条新增
export const getInputDataAdd = (data: any) => {
    return requests({
        url: '/web/core/controlChart/TSpcControlGroupItemDataGp/save.do',
        method: 'post',
        data: data
    })

}


// 非分页查询
export const getFindList = (parentId: string, id: number) => {
    return request({
        url: '/web/core/controlChart/TSpcControlGroupItemDataGp/findList.do',
        method: 'post',
        data: { spcControlGroupItemId: parentId, decimalPlaces: id }
    })

}


// 删除
export const deleteById = (id: string, pid: string, badItem: string, spare1: number) => {
    return requests({
        url: '/web/core/controlChart/TSpcControlGroupItemDataGp/delete.do',
        method: 'get',
        params: { id: id, spcControlGroupItemId: pid, badItem: badItem, spare1: spare1 }
    })

}

//修改
export const updatedById = (param: any) => {
    return requests({
        url: '/web/core/controlChart/TSpcControlGroupItemDataGp/modify.do',
        method: 'post',
        data: param
    })
}

//图表立即分析接口
export const getChartData = (data: getChartDataInterface) => {
    return request({
        url: '/web/core/controlChart/TSpcControlGroupItem/immediateAnalysis.do',
        method: 'get',
        params: data
    })
}


//单条查询
export const FindOne = (id: any) => {
    return request({
        url: '/web/core/controlChart/TSpcControlGroupItem/findOne.do?id=' + id,
        method: 'get',

    })
}


//失控处理接口
//保存
export const outControlAdd = (data: any) => {
    return request({
        url: '/web/core/controlChart/TSpcControlGroupItemControlManage/save.do',
        method: 'post',
        data: data
    })
}

//采取措施

export const getTakeMeasureList = () => {
    return request({
        url: '/web/core/exceptionManagement/TSpcTakeMeasure/findList.do',
        method: 'get',
    })
}

//失控点管理接口 
export const getOutAuditList = (id: string) => {
    return request({
        url: '/web/core/exceptionManagement/TSpcOutControlAudit/findList.do',
        method: 'get',
        params: { id: id }
    })
}

// 首页图表统计
export const controlChartStatistics = (data: string) => {
    return request({
        url: '/web/core/controlChart/TSpcControlGroupItem/controlChartStatistics.do',
        method: 'post',
        params: { scope: data }
    })
}