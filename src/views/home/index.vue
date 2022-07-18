<!--
* @Author: zhuangxingguo
* @Date: 2022/07/14 13:59:00
 * @LastEditTime: 2022-07-14 16:59:01
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
						（静态数据展示）
						<div style="right:5px; position:absolute;">
							<el-button type="primary" @click="timeChoose(6)">全部</el-button>
							<el-button @click="timeChoose(5)">今天</el-button>
							<el-button @click="timeChoose(4)">本周</el-button>
							<el-button @click="timeChoose(3)">本月</el-button>
							<el-button @click="timeChoose(2)">本季</el-button>
							<el-button @click="timeChoose(1)">本年</el-button>
						</div>
					
				</el-row>
				<el-row class="chart-count-body">
					<chartView :options="chart"></chartView>
				</el-row>
			</el-col>
			<el-col :span="24" class="cahrt-choose">
				<el-row>
					<el-col :xs="4" :sm="6" :md="6" :lg="6" :xl="6">
						<div style="line-height: 67px">
							<span style="display: inline-block; width: 3px; height: 14px; background: #626466"></span>
							<label class="cahrt-choose-label">八大控制图选择</label>
						</div>
						<div class="cahrt-choose-tip">注：右侧为八大控制图选择的流程展示</div>
					</el-col>
					<el-col :xs="18" :sm="18" :md="18" :lg="18" :xl="18">
						<div class="cahrt-choose-img"></div>
					</el-col>
				</el-row>
			</el-col>
		</el-row>
	</div>
</template>
<script setup lang="ts">
import chartView from './components/chart.vue';
import { ref } from 'vue';

const chart = {
	type: 'bar',
};
const timeType = ref<string>();
function timeChoose(type: number) {
	switch (type) {
		case 1:
			timeType.value = 'year';
			break;
		case 2:
			timeType.value = 'quarter';
			break;
		case 3:
			timeType.value = 'month';
			break;
		case 4:
			timeType.value = 'week';
			break;
		case 5:
			timeType.value = 'today';
			break;
		case 6:
			timeType.value = 'all';
			break;
	}
}
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
		}
		&-body {
			height: 429px;
			width: 100%;
		}
	}
	.cahrt-choose {
		border-radius: 12px;
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
		&-img {
			margin-top: 35px;
			width: 100%;
			height: 334px;
			border: 3px dashed #c4c7cc;
			background: url(../../assets/img/control_flow_chart.png) no-repeat;
			background-size: 100% 100%;
		}
	}
}
</style>
