/*
 * @Author: Administrator 848563840@qq.com
 * @Date: 2022-08-17 10:04:03
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @LastEditTime: 2022-08-19 15:31:38
 * @FilePath: \spc-web-admin\src\api\flow\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import requests from '/@/utils/request';
import { tSpcFlowInstanceVo } from './type'

/* 流程定义ID */
const tSpcFlowDefId= 'faeb7b564b114300b90e5efa2216621b';



/* 根据流程定义ID提交流程 */
export const addFlow = (    data:tSpcFlowInstanceVo) => {
    return requests({
        url: `/web/tspc/flow/instance/${tSpcFlowDefId}`,
        method: 'post',
        data: data
    })
}

/* 根据流程实例ID获取流程信息 */
export const getFlow = (Id: string) => {
    return requests({
        url: `/web/tspc/flow/instance/${Id}`,
        method: 'get',
    })
}

/* 获取流程节点人员信息分页查询 */
export const getUser = (Id: string) => {
    return requests({
        url: '/web/tspc/flow/def/node/user',
        method: 'get',
    })
}

/* 根据 流程定义节点ID查询 节点用户 */
export const getUserNode = (tSpcFlowDefNodeId: string) => {
    return requests({
        url: `/web/tspc/flow/def/node/user/${tSpcFlowDefNodeId}`,
        method: 'get',
    })
}

/* 根据流程定义节点ID查询流程定义开始节点 */
export const getFlowStart = () => {
    return requests({
        url: `/web/tspc/flow/def/node/${tSpcFlowDefId}`,
        method: 'get',
    })
}

/* 根据流程定义ID和当前流程定义节点ID查询 流程下一个节点 */
export const getFlowNext = ( currentNodeId:string | undefined) => {
    return requests({
        url: `/web/tspc/flow/def/node/${tSpcFlowDefId}/${currentNodeId}`,
        method: 'get',
    })
}

/* 获取流程实例已执行的任务节点 */
export const submitNodeList = ( tSpcFlowInstanceId:string) => {
    return requests({
        url: `/web/tspc/flow/instance/node/${tSpcFlowInstanceId}`,
        method: 'get',
    })
}


/* 根据流程定义ID获取所有任务节点 */
export const getFlowDefAll = ( tSpcFlowDefId:string) => {
    return requests({
        url: `/web/tspc/flow/def/node/all/${tSpcFlowDefId}`,
        method: 'get',
    })
}

/* 当前用户根据流程实例ID和流程节点id处理当前任务 */
export const auditNodeFunction = (data: { tSpcFlowInstanceId: string | undefined; tSpcFlowInstanceNodeId: string | undefined;tSpcFlowInstanceNodeUserAuditVo: object } ) => {
    return requests({
        url: `/web/tspc/flow/instance/node/user/audit/${data.tSpcFlowInstanceId}/${data.tSpcFlowInstanceNodeId}`,
        method: 'post',
        data:data.tSpcFlowInstanceNodeUserAuditVo
    })
}

/* 校验用户是否在当前节点可以审批 */
export const nodePowerFunction = (data: { tSpcFlowInstanceId: string; tSpcFlowInstanceNodeId:string} ) => {
    return requests({
        url: `/web/tspc/flow/instance/node/user/valid/${data.tSpcFlowInstanceId}/${data.tSpcFlowInstanceNodeId}`,
        method: 'get',
    })
}


// 根据流程定义ID获取所有任务节点
export function defnodelist(params: any) {
	return `/web/tspc/flow/def/node/list/${tSpcFlowDefId}`
}

// 获取流程节点人员信息分页查询
export const userpage = (tSpcFlowDefNodeId: any, params: any) => {
    return requests({
        url: `/web/tspc/flow/def/node/user/page/${tSpcFlowDefNodeId}`,
        method: 'get',
        params
    })
}

// 设置流程节点用户
export const nodeuser = (tSpcFlowDefNodeId: any, userIds: any) => {
    return requests({
        url: `/web/tspc/flow/def/node/user/${tSpcFlowDefNodeId}/${userIds}`,
        method: 'post',
    })
}

// 修改流程节点用户
export const nodeuserModei = (id: any, data: any) => {
    return requests({
        url: `/web/tspc/flow/def/node/user/${id}`,
        method: 'post',
        data
    })
}


// 根据流程节点用户ID删除节点审批用户
export const nodeuserdelete = (tSpcFlowDefNodeUserId: any) => {
    return requests({
        url: `/web/tspc/flow/def/node/user/${tSpcFlowDefNodeUserId}`,
        method: 'delete',
    })
}

