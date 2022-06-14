import request from '/@/utils/http/request';

//样本修改记录接口

// 保存
export const saveSampleErro = (data: any) => {
    return request({
        url: '/web/controlChart/controlChart/TSpcSampleRecord/save.do',
        method: 'post',
        data:data
    })
}


// 样本修改查询（分页）
export function getSampleErroList() {
    return '/web/controlChart/controlChart/TSpcSampleRecord/ajaxList.do';
}