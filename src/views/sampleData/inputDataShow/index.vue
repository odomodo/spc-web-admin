<!--
* @Author: zhuangxingguo
* @Date: 2022/05/19 15:20:51
 * @LastEditTime: 2022-07-22 15:12:05
 * @LastEditors: Administrator 848563840@qq.com
* @FilePath: index.vue
-->
<template>
	<div class="input-main">
		<el-row class="input-rows">
			<el-col :span="24" class="input-rows-header"
				><span class="input-tilte">查看</span><i class="spc-right" @click="goBack"><svg-icon iconName="close" /></i
			></el-col>
			<el-col :span="24" class="input-rows-project">
				<el-row class="input-rows-project-content">
					<el-col :span="4" v-for="(item, index) in hierarchyList" :key="index" class="input-rows-project-content-label">
					<label>{{item.dataName}}:{{item.valueName}}</label>
					
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
					<el-tab-pane
						label="过程能力"
						class="chart-tab"
						name="chartDown"
						v-if="['X_MR', 'Xbar_S', 'MR', 'Xbar_R'].includes(options.controlChartCode)"
					>
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
const hierarchyList = ref<any>([])

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
	hierarchyList.value = a.tSpcControlGroupItemHierarchyList
	options.value = a;
	if (a.controlChartCode == 'null') {
		tableValue.value = [{ value: a.controlChartValue, key: a.controlChartValue }];
		return;
	}
	tableValue.value = [{ value: a.controlChartValue, key:  a.controlChartValue}];
	if (a.controlChartCode == 'MR') {
		leftTable(a.tSpcXRVo);
	} else if (a.controlChartCode == 'Xbar_S') {
		leftTable(a.tSpcXBarSVo);
	} else if (a.controlChartCode == 'Xbar_R') {
		leftTable(a.tSpcXBarRVo);
	} else if (a.controlChartCode == 'X_MR') {
		leftTable(a.tSpcXMrVo);
	} else if (a.controlChartCode == 'P') {
		leftTable(a.tSpcPVo);
	} else if (a.controlChartCode == 'U') {
		leftTable(a.tSpcPVo);
	} else if (a.controlChartCode == 'NP') {
		leftTable(a.tSpcPVo);
	} else if (a.controlChartCode == 'C') {
		leftTable(a.tSpcPVo);
	}
};

// 右侧表格数据初始化
const leftTable = (das: Array<{}>) => {
	for (let item in das) {
		let da = { key: item, value:  das[item]};
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
				store.dispatch('inputData/setRowConfig', res.data);
				tables.value.tableConfig = store.state.inputData.tableConfig;
				tables.value.getList(res.data.tSpcControlGroupItemDataGpList);
				if (res.data.tSpcControlGroupItemDataGpList.length > 0) {
					tables.value.initCharts(res.data, 1);
				} else {
					tables.value.initCharts({
						controlChartCode: 'null',
						controlChartValue: res.data.controlChartValue,
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
		margin: 0 100px 15px 100px;
		&-header{
			line-height: 80px;
			border-bottom: 1px #E1E5EB solid;
		}
		&-project{
			line-height: 112px;
			height: 112px;
			width: 100%;
			align-items: center;
			display: flex;
			border-bottom: 1px #E1E5EB solid;
			margin-bottom: 40px;
			&-content{
				background-color: #FAFAFA;
				line-height: 53px;
				height: 53px;
				width: 100%;
				justify-content: center;
				font-size: 14px;
				font-family: Microsoft YaHei;
				font-weight: 400;
				color: #313233;
				white-space: nowrap;
				
			}
			&-content-label{
					text-overflow: ellipsis;
					overflow: hidden;
					white-space: nowrap;
				}
		}
	}
	.input-row {
		background-color: #fff;
		width: 100%;
		height: 100%;
	}
	.chart-tabs {
		margin-bottom: 10px;
		height: 440px;
		width: 100%;
	}
	.chart-tab {
		height: 440px;
		width: 100%;
	}
	.input-tilte {
		line-height: 40px;
		font-size: 20px;
		font-family: Microsoft YaHei;
		font-weight: 400;
		color: #626466;
		align-items: center;
		
	}
	:deep(.el-tabs) {
		.el-tabs__item {
			font-size: 14px !important;
			font-family: Microsoft YaHei;
			font-weight: 400;
			color: #939599;
			height:30px;
			line-height:30px;
			// padding: 0;
			&.is-active{
				color: var(--el-color-primary);
				font-weight:bold;

			}
		}
		.el-tabs__active-bar{
			height:30px !important;
		}
		.el-tabs__nav-scroll {
			border-right: #e1e5eb 1px solid;
		}
	}
}

.input-divider2 {
	margin: 36px 0 20px 0;
	border-top: 1px #f0f2f5 #f0f2f5;
}
// .input-right {
// 	position: absolute;
// 	right: 0px;
// 	top: 130px;
// }
</style>
