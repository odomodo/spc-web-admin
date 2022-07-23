<!--
* @Author: zhuangxingguo
* @Date: 2022/07/14 13:59:00
 * @LastEditTime: 2022-07-22 14:00:18
 * @LastEditors: Administrator 848563840@qq.com
* @FilePath: 
-->
<template>
	<div class="home">
		<el-row>
			<el-col :span="24" class="chart-count">
				<el-row class="chart-count-header">
					<span style="display: inline-block; width: 3px; height: 14px; background: #626466"></span>
					<label class="chart-count-header-label">控制图统计</label>
					<div style="right: 5px; position: absolute">
						<el-button :class="state.all" @click="timeChoose(6)">全部</el-button>
						<el-button :class="state.today" @click="timeChoose(5)">今天</el-button>
						<el-button :class="state.week" @click="timeChoose(4)">本周</el-button>
						<el-button :class="state.month" @click="timeChoose(3)">本月</el-button>
						<el-button :class="state.quarter" @click="timeChoose(2)">本季</el-button>
						<el-button :class="state.year" @click="timeChoose(1)">本年</el-button>
					</div>
				</el-row>
				<el-row :style="chartCountBody">
					<chartView ref="chartref" :options="chart" />
				</el-row>
			</el-col>
			<el-col :span="24" class="cahrt-choose">
				<el-row>
					<el-col :xs="6" :sm="6" :md="6" :lg="7" :xl="7">
						<div style="line-height: 67px">
							<span style="display: inline-block; width: 3px; height: 14px; background: #626466"></span>
							<label class="cahrt-choose-label">八大控制图选择</label>
						</div>
						<div class="cahrt-choose-tip">注：右侧为八大控制图选择的流程展示</div>
						<div class="cahrt-choose-divider"></div>
					</el-col>
					<el-col :lg="15" :xl="15">
						<div class="cahrt-choose-img"></div>
					</el-col>
				</el-row>
			</el-col>
		</el-row>
	</div>
</template>
<script setup lang="ts">
import chartView from './components/chart.vue';
import { computed, onMounted, ref, watch } from 'vue';
import { controlChartStatistics } from '/@/api/inputData';
import { ElMessage } from 'element-plus';
import { useStore } from '/@/store/index';

const state = ref({
	all: 'select-button',
	today: '',
	week: '',
	month: '',
	quarter: '',
	year: '',
});
const chartCountBody = ref({
	height: '429px',
	width: '100%',
});
const store = useStore();
const chart = ref({
	type: 'bar',
	dataAxis: [],
	data: [],
}) as any;
const timeType = ref<string>();
const chartref = ref();
function timeChoose(type: number) {
	switch (type) {
		case 1:
			timeType.value = 'year';
			getcontrolChartStatistics();
			state.value = {
				all: '',
				today: '',
				week: '',
				month: '',
				quarter: '',
				year: 'select-button',
			};
			break;
		case 2:
			timeType.value = 'quarter';
			getcontrolChartStatistics();
			state.value = {
				all: '',
				today: '',
				week: '',
				month: '',
				quarter: 'select-button',
				year: '',
			};
			break;
		case 3:
			timeType.value = 'month';
			getcontrolChartStatistics();
			state.value = {
				all: '',
				today: '',
				week: '',
				month: 'select-button',
				quarter: '',
				year: '',
			};
			break;
		case 4:
			timeType.value = 'week';
			getcontrolChartStatistics();
			state.value = {
				all: '',
				today: '',
				week: 'select-button',
				month: '',
				quarter: '',
				year: '',
			};
			break;
		case 5:
			timeType.value = 'today';
			getcontrolChartStatistics();
			state.value = {
				all: '',
				today: 'select-button',
				week: '',
				month: '',
				quarter: '',
				year: '',
			};
			break;
		case 6:
			timeType.value = 'all';
			getcontrolChartStatistics();
			state.value = {
				all: 'select-button',
				today: '',
				week: '',
				month: '',
				quarter: '',
				year: '',
			};
			break;
	}
}
function getcontrolChartStatistics() {
	controlChartStatistics(timeType.value)
		.then((result: any) => {
			if (result.code == 0) {
				chart.value.dataAxis = [];
				chart.value.data = [];
				result.data.forEach((element: { controlChartCode: any; numberSize: any }) => {
					chart.value.dataAxis.push(element.controlChartCode);
					chart.value.data.push(element.numberSize);
				});
			} else {
				ElMessage.error(result.msg);
			}
		})
		.catch((err) => {});
}
const handleClick = () => {
	let width = document.body.offsetWidth; // 网页可视区域高度
	if (!store.state.themeConfig.themeConfig.isCollapse) {
		chartCountBody.value.width = String(width - 310) + 'px';
	} else {
		chartCountBody.value.width = String(width - 153) + 'px';
	}

	// debugger
	chartref.value.eventListener();
};
onMounted(() => {
	getcontrolChartStatistics();
});
watch(
	() => store.state.themeConfig.themeConfig.isCollapse,
	(val) => {
		handleClick();
		console.log(1);
	},
	{
		deep: true,
	}
);
</script>
<style scoped lang="scss">
.home {
	width: 100%;

	.chart-count {
		border-radius: 12px;
		width: 100%;
		height: 500px;
		padding: 0 30px 20px 30px;
		background-color: #ffffff;
		&-header {
			align-items: center;
			height: 70px;
			line-height: 70px;
			border-bottom: 1px #f0f2f5 solid;
			&-label {
				margin-left: 8px;
				width: 90px;
				font-size: 18px;
				font-family: Microsoft YaHei;
				font-weight: 400;
				color: #313233;
			}
			.select-button {
				background: #5781c1;
				color: #FFF;
				&:hover{
				background-color: #7BA4E0;
				}
			}
		}
		&-body {
			height: 429px;
			width: 100%;
		}
	}
	.cahrt-choose {
		border-radius: 12px;
		width: 100%;
		height: 404px;
		padding: 0 30px 20px 30px;
		align-items: center;
		justify-content: center;
		background-color: #ffffff;
		margin-top: 20px;
		&-label {
			margin-left: 8px;
			width: 90px;
			height: 19px;
			font-size: 18px;
			font-family: Microsoft YaHei;
			font-weight: 400;
			color: #313233;
		}
		&-tip {
			width: 204px;
			height: 13px;
			font-size: 12px;
			font-family: Microsoft YaHei;
			font-weight: 400;
			color: #939599;
		}
		&-divider {
			width: 1px;
			height: 308px;
			background: #f0f2f5;
			left: 330px;
			position: absolute;
		}
		&-img {
			margin-left: 8px;
			margin-top: 35px;
			// width: 1071px;
			height: 334px;
			// border: 3px dashed #c4c7cc;
			background: url(../../assets/img/control_flow_chart.png) no-repeat;
			background-size: 100% 100%;
		}
	}
}
</style>
