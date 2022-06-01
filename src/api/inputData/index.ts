
import request from '/@/utils/request';



// 单条新增
export const getInputDataAdd = (data: any) => {
    return request({
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
export const deleteById = (data: any) => {
    return request({
        url: '/web/core/controlChart/TSpcControlGroupItemDataGp/delete.do?id=' + data,
        method: 'get',
    })

}

//修改
export const updatedById = (param: any) => {
    return request({
        url: '/web/core/controlChart/TSpcControlGroupItemDataGp/modify.do',
        method: 'post',
        data: param
    })
}

//图表立即分析接口
export const getChartData = (id: any) => {
    return request({
        url: '/web/core/controlChart/TSpcControlGroupItem/immediateAnalysis.do?id=' + id,
        method: 'get',
        
    })
}
