<!--
* @Author: zhuangxingguo
* @Date: 2022/05/19 15:20:51
 * @LastEditTime: 2022-07-25 09:41:47
 * @LastEditors: Administrator 848563840@qq.com
* @FilePath: index.vue
* @des: 计量型
-->
<template>
	<div class="input-main">
		<el-row class="input-rows">
			<el-col :span="24" class="input-rows-header"
				><span class="input-tilte">单项数据录入</span
				><i class="spc-right" @click="goBack"><svg-icon iconSize="20" iconName="close" style="color: #626466" /></i
			></el-col>
			<el-col :span="24" class="input-rows-project">
				<el-row class="input-rows-project-content">
					<el-col :span="4" v-for="(item, index) in hierarchyList" :key="index" class="input-rows-project-content-label">
						<label>{{ item.dataName }}:{{ item.valueName }}</label>
					</el-col>
				</el-row>
			</el-col>
			<el-col :span="20" class="chart-style">
				<el-tabs tab-position="left" class="chart-tabs" v-model="activeName" @tab-click="handleClick">
					<el-tab-pane label="控制图" class="chart-tab" name="chartUp">
						<el-row class="input-row">
							<chart ref="chartUp" :options="options" @currentRow="currentRow" />
						</el-row>
					</el-tab-pane>
					<el-tab-pane label="过程能力" class="chart-tab" name="chartDown">
						<el-row class="input-row"><chart ref="chartDown" :options="options.normalDistribution" @currentRow="currentRow" /> </el-row>
					</el-tab-pane>
				</el-tabs>
			</el-col>
			<el-col :span="4" class="input-right">
				<rightTableVue :showData="tableValue"></rightTableVue>
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
const tables = ref();
const router = useRoute();
const hierarchyList = ref<any>([]);

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
	hierarchyList.value = a.tSpcControlGroupItemHierarchyList;
	options.value = a;
	if (a.controlChartCode == 'null') {
		tableValue.value = [
			{ value: a.controlChartValue, key: a.controlChartValue },
			{ value: a.usl, key: 'usl' },
			{ value: a.lsl, key: 'lsl' },
			{ value: a.target, key: 'target' },
		];
		return;
	}
	tableValue.value = [{ value: a.controlChartValue, key: a.controlChartValue }];
	if (a.controlChartCode == 'MR') {
		leftTable(a.tSpcXRVo);
	} else if (a.controlChartCode == 'Xbar_S') {
		leftTable(a.tSpcXBarSVo);
	} else if (a.controlChartCode == 'Xbar_R') {
		leftTable(a.tSpcXBarRVo);
	} else if (a.controlChartCode == 'X_MR') {
		leftTable(a.tSpcXMrVo);
	}
};

// 右侧表格数据初始化
const leftTable = (das: Array<{}>) => {
	for (let item in das) {
		let da = { key: item, value: das[item] };
		tableValue.value.push(da);
	}
};

// 返回表格当前行
const currentRow = (a: number, type?: string) => {
	if (type == 'click') {
		tables.value.currentRow(a, 'click');
	} else {
		tables.value.currentRow(a);
	}
};

onMounted(() => {
	getChartData({ spcControlGroupItemId: router.params.Id, numberSize: 30 })
		.then((res: any) => {
			if (res.code === 0) {
				store.dispatch('metrological/setRowConfig', res.data);
				tables.value.tableConfig = store.state.metrological.tableConfig;
				tables.value.getList(res.data.tSpcControlGroupItemDataGpList);
				if (res.data.tSpcControlGroupItemDataGpList.length > 0) {
					tables.value.initCharts(res.data, 1);
				} else {
					tables.value.initCharts({
						controlChartCode: 'null',
						controlChartValue: res.data.controlChartValue,
						usl: res.data.usl,
						lsl: res.data.lsl,
						target: res.data.target,
						tSpcControlGroupItemHierarchyList: res.data.tSpcControlGroupItemHierarchyList
					});
				}
				tables.value.metadata = {
					differentRulesLMap: res.data.differentRulesLMap,
					differentRulesUMap: res.data.differentRulesUMap,
					itemDecRuleConfigList: res.data.itemDecRuleConfigList,
				};
			} else {
				ElMessage.error(res.msg);
			}
		})
		.catch((err) => {});
});
</script>

<style lang="scss" scoped>
@import '../component/config/style.scss'
</style>
