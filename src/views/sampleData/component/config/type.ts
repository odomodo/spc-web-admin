export interface handleType {
    remark?:string;
	outControlReason?: string;
	treatMeasure?: string;
    spcControlGroupItemId:string;
	spcControlGroupItemDataGpId:string;
	spare1: number;
	handleUser?:string;
	handleTime?:string;
}

export interface ViewState {
	operationType: string;
	filterType: string;
	filterValue: any;
	tableConfig: any;
	loading: boolean;
	errorArr: number[];
	metadata: metaData;
}

interface metaData {
	itemDecRuleConfigList?:object[];
	differentRulesLMap?: object;
	differentRulesUMap?: object;
}
