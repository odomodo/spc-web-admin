<!--
* @Author: zhuangxingguo
* @Date: 2022/05/19 15:20:51
 * @LastEditTime: 2022-07-15 09:30:54
 * @LastEditors: Administrator 848563840@qq.com
* @FilePath: index.vue
@des: 计数型
-->
<template>
	<div class="input-main">
		<el-row class="input-rows">
			<el-col :span="24" style="line-height: 40px"
				><span class="input-tilte">单项数据录入</span><i class="spc-right" @click="goBack"><svg-icon iconName="close" /></i
			></el-col>
			<el-divider class="input-divider" />

			<el-col :span="20" class="chart-style">
				<el-tabs tab-position="left" class="chart-tabs" v-model="activeName" @tab-click="handleClick">
					<el-tab-pane label="控制图" class="chart-tab" name="chartUp">
						<el-row class="input-row">
							<chart ref="chartUp" :options="options" @currentRow="currentRow" />
						</el-row>
					</el-tab-pane>
				</el-tabs>
			</el-col>
			<el-col :span="4" class="input-right">
				<rightTableVue :showData="tableValue" :tableRow="tableValueRow"></rightTableVue>
			</el-col>
			<el-divider class="input-divider2" />
			<el-col :span="24">
				<Table ref="tables" @initCharts="initCharts"></Table>
			</el-col>
		</el-row>
	</div>
</template>

<script setup lang="ts">
import Table from './component/table.vue';
import { ref, onMounted } from 'vue';
import { useStore } from '/@/store/index';
import chart from '../component/chartService.vue';
import rightTableVue from './component/rightTable.vue';
import { getChartData } from '/@/api/inputData';
import { ElMessage } from 'element-plus';
import { useRoute } from 'vue-router';
const store = useStore();
const options: any = ref({});
const activeName = ref('chartUp');
const chartUp = ref();
const chartDown = ref();
const tableValue: any = ref([]);
const tableValueRow: any = ref({});
const tables = ref();
const router = useRoute();

// 图表自适应方法
const handleClick = () => {
	if (activeName.value == 'chartUp') {
		chartUp.value.eventListener();
	} else if (activeName.value == 'chartDown') {
		chartDown.value.eventListener();
	}
};
const isShow = ref();
// 关闭当前标签页
const goBack = () => {
	window.close();
};

// 加载图表数据
const initCharts = (a: any) => {
	options.value = a;
	if (a.controlChartCode == 'null') {
		tableValue.value = [];
		tableValueRow.value = {};
		return;
	}
	if (a.controlChartCode == 'P') {
		tableValue.value = [{ 1: 'P图' }];
		tableValueRow.value = { 0: 'P图' };
		leftTable(a.tSpcPVo);
	} else if (a.controlChartCode == 'U') {
		tableValue.value = [{ 1: 'U图' }];
		tableValueRow.value = { 0: 'U图' };
		leftTable(a.tSpcPVo);
	} else if (a.controlChartCode == 'NP') {
		tableValue.value = [{ 1: 'NP图' }];
		tableValueRow.value = { 0: 'NP图' };
		leftTable(a.tSpcPVo);
	} else if (a.controlChartCode == 'C') {
		tableValue.value = [{ 1: 'C图' }];
		tableValueRow.value = { 0: 'C图' };
		leftTable(a.tSpcPVo);
	}
};

// 右侧表格数据初始化
const leftTable = (das: Array<{}>) => {
	for (let item in das) {
		let da = { 1: item };
		let db = { [tableValue.value.length]: das[item] };
		// tableValueRow.value.push(db)
		Object.assign(tableValueRow.value, db);
		tableValue.value.push(da);
	}
};

// 返回表格当前行
const currentRow = (a: number, type?:string) => {
	if(type == 'click'){
		tables.value.currentRow(a, 'click');
	}else{
		tables.value.currentRow(a);
	}
};

onMounted(() => {
	getChartData({spcControlGroupItemId:router.params.Id, numberSize:30})
		.then((res: any) => {
			if (res.code === 0) {
				store.dispatch('counting/setRowConfig', res.data);
				tables.value.tableConfig = store.state.counting.tableConfig;
				tables.value.getList(res.data.tSpcControlGroupItemDataGpList);
				if (res.data.tSpcControlGroupItemDataGpList.length > 0) {
					tables.value.initCharts(res.data, 1);
				} else {
					tables.value.initCharts('null');
				}
				tables.value.metadata = {
					differentRulesUMap: res.data.differentRulesUMap,
					itemDecRuleConfigList: res.data.itemDecRuleConfigList,
				};
				
			} else {
				ElMessage.error(res.msg);
			}
		})
		.catch((err) => {
		});
});
</script>

<style lang="scss" scoped>
.input-main {
	background-color: #fff;
	width: 100%;
	height: 100%;
	overflow: auto;
	.input-rows {
		margin-right: 3%;
		margin-left: 3%;
	}
	.input-row {
		background-color: #fff;
		width: 100%;
		height: 100%;
	}
	.chart-tabs {
		margin-bottom: 10px;
		height: 400px;
		width: 100%;
	}
	.chart-tab {
		height: 400px;
		width: 100%;
	}
	.input-tilte {
		font-size: 20px;
		font-weight: bold;
		color: #626466;
	}
}

.input-divider {
	margin: 6px 0;
	border-top: 1px #f0f2f5 #f0f2f5;
}
.input-divider2 {
	margin-bottom: 15px;
	border-top: 1px #f0f2f5 #f0f2f5;
}
.input-right {
	position: absolute;
	right: 0px;
	top: 66px;
}
</style>
