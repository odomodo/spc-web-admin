<!--
* @Author: zhuangxingguo
* @Date: 2022/06/10 09:29:19
 * @LastEditTime: 2022-08-16 13:55:23
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
* @FilePath: 
-->
<template>
<div>
	<el-row class="sample_modify_log">
		<el-col :span="24" class="box1">
			<div class="df">
				<div :span="5" class="flex flex-c mr15"
					><label style="width: 80px" class="label">控制图编码</label><el-input placeholder="请输入图形编码" v-model="form.controlChartConfigCode"
				/></div>
				<div :span="5" class="flex flex-c mr15"
					><label style="width: 65px" class="label">数据点ID</label
					><el-select v-model="form.inspcationCode" placeholder="请选择">
						<el-option v-for="v in itemOptions" :label="v.inspectionName" :value="v.inspcationCode" :key="v.inspcationCode" /> </el-select
				></div>
				<div :span="5" class="flex flex-c mr5">
          <label style="width: 70px">显示范围</label>
          <el-select v-model="form.controlChartCode" placeholder="请选择">
						<el-option label="录入时间" value="录入时间" />
						<el-option label="抽样时间" value="抽样时间" />
          </el-select>
        </div>
         <el-date-picker
            v-model="form.value1"
            type="datetimerange"
            range-separator="——"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
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
<script lang="ts">
export default {
    name: "sample_date_edit_record",
};
</script>
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
			label: '抽样时间',
			width: '120px'
		},
    {
			prop: 'entryTime',
			label: '录入时间',
			width: '180px'
		},
		{
			prop: 'addTime',
			label: '样本1',
			width: '180px'
		},
    {
			prop: 'addTime',
			label: '样本1',
			width: '180px'
		},
    {
			prop: 'addTime',
			label: '样本1',
			width: '180px'
		},
    {
			prop: 'addTime',
			label: '样本1',
			width: '180px'
		},
    {
			prop: 'addTime',
			label: '样本1',
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
			icon: 'edit',
			label: '编辑',
			click: (index: any, row: any) => {
				modifyLog.value.modifyLogVisible = true;
				modifyLog.value.modifyLogForm = row;
			},
		},
		{
			type: 'success',
			icon: 'delete',
			label: '删除',
			click: (index: any, row: any) => {
				modifyLog.value.modifyLogVisible = true;
				modifyLog.value.modifyLogForm = row;
			},
		},
	],
	//操作按钮样式
	operationColumn: {
		// 样式
		style: {
			width: '120px'
		},
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
