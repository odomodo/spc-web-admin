
import request from '/@/utils/http/request';
import requests from '/@/utils/request';



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
export const deleteById = (id: string, pid: string, badItem: string,spare1:number) => {
    return requests({
        url: '/web/core/controlChart/TSpcControlGroupItemDataGp/delete.do',
        method: 'get',
        params: { id:id, spcControlGroupItemId: pid,badItem:badItem,spare1:spare1 }
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
export const getChartData = (id: any,type?:number, time?:any) => {
    let param = {}
    if(type == 1){
        param={spcControlGroupItemId:id,entryStartTime: time[0],entryEndTime:time[1]}
    }else if(type == 2){
        param={spcControlGroupItemId:id,sampleStartTime: time[0],sampleEndTime:time[1]}
    }else{
        param={spcControlGroupItemId:id}
    }
    return request({
        url: '/web/core/controlChart/TSpcControlGroupItem/immediateAnalysis.do',
        method: 'get',
        params:param
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