/*
 * @Author: Administrator 848563840@qq.com
 * @Date: 2022-06-16 16:00:31
 * @LastEditors: Administrator 848563840@qq.com
 * @LastEditTime: 2022-07-18 10:27:27
 * @FilePath: \chartc:\Users\Administrator\Desktop\share\code\spc-web-admin\src\views\sampleData\component\config\type.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export interface handleType {
    remark?:string;
	outControlReason?: string;
	treatMeasure?: string;
    spcControlGroupItemId:string;
	spcControlGroupItemDataGpId:string;
	spare1: number;
	handleUser?:string;
	handleTime?:string;
	reasonAnalysis?:string;
}

export interface ViewState {
	operationType: string;
	filterType: string;
	filterValue: string[];
	tableConfig: any;
	loading: boolean;
	errorArr: number[];
	metadata: metaData;
	numberSize: number;
}

interface metaData {
	itemDecRuleConfigList?:object[];
	differentRulesLMap?: object;
	differentRulesUMap?: object;
}

export interface filtersInterface{
	entryStartTime?:string;
	sampleStartTime?:string;
	entryEndTime?:string;
	sampleEndTime?:string;
}
