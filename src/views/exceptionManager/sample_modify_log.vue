<!--
* @Author: zhuangxingguo
* @Date: 2022/06/10 09:29:19
* @LastEditTime: 2022/06/10 09:29:19
* @LastEditors: zhuangxingguo
* @FilePath: 
-->
<template>
	<el-row class="sample_modify_log">
		<el-col :span="24">
			<el-row>
				<el-col :span="3" class="flex flex-c mr20"><label style="width: 100px">图形编码</label><el-input placeholder="请输入图形编码" /></el-col>
				<el-col :span="3" class="flex flex-c mr20"
					><label style="width: 100px">检测项目</label
					><el-select v-model="form.inspcationCode" placeholder="请选择">
						<el-option v-for="v in itemOptions" :label="v.inspectionName" :value="v.inspcationCode" :key="v.inspcationCode" /> </el-select
				></el-col>
				<el-col :span="3" class="flex flex-c mr20"
					><label style="width: 50px">图表</label
					><el-select v-model="form.controlChartCode" placeholder="请选择">
						<el-option v-for="v in chartOptions" :label="v.valueName" :value="v.valueCode" :key="v.valueCode" /> </el-select
				></el-col>
				<el-col :span="3" class="flex flex-c mr20">
					<div class="spc-button">
						<svg-icon iconName="search" iconSize="15"  ></svg-icon></div>
						<div class="spc-button">
							<svg-icon iconName="refresh" iconSize="15" ></svg-icon>
						</div>
				</el-col>
			</el-row>
		</el-col>
		<el-col :span="24" style="margin-top: 10px;">
			<nTable ref="indexTable" :tableConfig="tableConfig" />
		</el-col>
	</el-row>
</template>
<script setup lang="ts">
import nTable from '/@/components/nTable/index.vue';
import { ref, onMounted } from 'vue';
import { queryDictionaryData } from '/@/api/admin/paramsSet';
import { getSampleErroList } from '/@/api/exceptionManage/sample_modify_log';
import { tspcInspectionFindList } from "/@/api/controlChart/index.ts";



const itemOptions: any = ref(null);
const chartOptions: any = ref(null);
const form = ref<any>({
	controlChartCode: '',
});
const tableConfig: any = ref({
	height: '80vh',
	url: getSampleErroList(),
	//表格表头
	columns: [
		{
			prop: 'dataCode',
			label: '图形编码',
		},
		{
			prop: 'controlChartCode',
			label: '图形类型',
		},
		{
			prop: '',
			label: '检测项目',
		},
		{
			prop: 'dataCode',
			label: '数据点ID',
		},
		{
			prop: 'controlChartCode',
			label: '录入人',
		},
		{
			prop: 'remarks',
			label: '录入时间',
		},
		{
			prop: 'remarks',
			label: '修改人',
		},
		{
			prop: 'remarks',
			label: '修改时间',
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
			click: (index: any, row: any) => {},
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
onMounted(async () => {
	chartOptions.value = (await queryDictionaryData('control_chart_type', '')).values;
	itemOptions.value = (await tspcInspectionFindList()).data
});
</script>

<style scoped lang="scss">
.sample_modify_log{
	background-color: #fff;
	padding: 8px;
}
</style>
