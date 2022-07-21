<!--
* @Author: zhuangxingguo
* @Date: 2022/06/10 09:29:19
 * @LastEditTime: 2022-07-20 16:42:17
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
* @FilePath: 
-->
<template>
<div>
	<el-row class="sample_modify_log">
		<el-col :span="24" class="box1">
			<div class="df">
				<div :span="5" class="flex flex-c mr15"
					><label style="width: 65px" class="label">图形编码</label><el-input placeholder="请输入图形编码" v-model="form.controlChartConfigCode"
				/></div>
				<div :span="5" class="flex flex-c mr15"
					><label style="width: 65px" class="label">检测项目</label
					><el-select v-model="form.inspcationCode" placeholder="请选择">
						<el-option v-for="v in itemOptions" :label="v.inspectionName" :value="v.inspcationCode" :key="v.inspcationCode" /> </el-select
				></div>
				<div :span="5" class="flex flex-c mr5"
					><label style="width: 40px">图表</label
					><el-select v-model="form.controlChartCode" placeholder="请选择">
						<el-option v-for="v in chartOptions" :label="v.valueName" :value="v.valueCode" :key="v.valueCode" /> </el-select
				></div>
				<div :span="5" class="flex flex-c ">
					<div class="spc-button mr5">
						<svg-icon iconName="search_icon" tipLable="搜索" @click="queryList" iconSize="10"></svg-icon>
					</div>
					<div class="spc-button">
						<svg-icon iconName="重置_icon" @click="reset" tipLable="重置" iconSize="10"></svg-icon>
					</div>
				</div>
			</div>
		</el-col>
		<el-col :span="24">
			<nTable ref="indexTable" :tableConfig="tableConfig" />
		</el-col>

		
	</el-row>
	<sample-modify-log ref="modifyLog" />
	</div>
</template>
<script setup lang="ts">
import nTable from '/@/components/nTable/index.vue';
import { ref, onMounted } from 'vue';
import { queryDictionaryData } from '/@/api/admin/paramsSet';
import { getSampleErroList } from '/@/api/exceptionManage/sample_modify_log';
import { tspcInspectionFindList } from '/@/api/controlChart/index.ts';
import sampleModifyLog from './component/sample_modify_log_dialog.vue';

const itemOptions: any = ref(null);
const chartOptions: any = ref(null);
const form = ref<any>({
	controlChartCode: '',
	inspcationCode: '',
	controlChartConfigCode: '',
});
const indexTable = ref();

const tableConfig: any = ref({
	height: '70vh',
	url: getSampleErroList(),
	//表格表头
	columns: [
		{
			prop: 'controlChartConfigCode',
			label: '图形编码',
			width: '120px'
		},
		{
			prop: 'controlChartCode',
			label: '图形类型',
		},
		{
			prop: 'spare1',
			label: '数据点序号',
		},
		{
			prop: 'spcControlGroupItemGpId',
			label: '数据点ID',
			width: '260px'
		},
		{
			prop: 'inputUser',
			label: '录入人',
		},
		{
			prop: 'entryTime',
			label: '录入时间',
			width: '180px'
		},
		{
			prop: 'addUserId',
			label: '修改人',
		},
		{
			prop: 'addTime',
			label: '修改时间',
			width: '180px'
		},
	],
	showOperation: true, //是否显示操作字段
	rowNumbers: true, //是否显示行数
	showPagination: true, //分页
	singleSelect: false, //单选，复选，默认复选
	//操作按钮列表
	options: [
		{
			type: 'success',
			icon: 'show',
			label: '查看',
			click: (index: any, row: any) => {
				modifyLog.value.modifyLogVisible = true;
				modifyLog.value.modifyLogForm = row;
			},
		},
	],
	//操作按钮样式
	operationColumn: {
		// 样式
		style: {},
		// 属性
		attr: {},
	},
});

const queryList = () => {
	indexTable.value.find({
		controlChartConfigCode: form.value.controlChartConfigCode,
		inspcationCode: form.value.inspcationCode,
		controlChartCode: form.value.controlChartCode,
	});
};
const reset = () => {
	form.value = {
		controlChartCode: '',
		inspcationCode: '',
		controlChartConfigCode: '',
	};
	queryList();
};

const modifyLog = ref();
onMounted(async () => {
	chartOptions.value = (await queryDictionaryData('control_chart_type', '')).values;
	itemOptions.value = (await tspcInspectionFindList()).data;
});
</script>

<style scoped lang="scss">
.sample_modify_log {
	background-color: #fff;
	padding: 20px;
	border-radius: 10px;
}
.box1{
	margin-bottom: 20px;
}
.label{
	flex-shrink: 0;
}
</style>
