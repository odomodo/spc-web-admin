<!--
* @Author: zhuangxingguo
* @Date: 2022/05/19 15:20:51
* @LastEditTime: 2022/05/19 15:20:51
* @LastEditors: zhuangxingguo
* @FilePath: index.vue
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
					<el-tab-pane label="过程分析" class="chart-tab" name="chartDown">
						<!-- <el-row class="input-row"><chart ref="chartDown" :options="options" @currentRow="currentRow" /> </el-row> -->
					</el-tab-pane>
				</el-tabs>
			</el-col>
			<el-col :span="4" class="input-right">
				<rightTableVue :showData="tableValue" :tableRow="tableValueRow"></rightTableVue>
			</el-col>
			<el-divider class="input-divider2" />
			<el-col :span="24">
				<Table ref="tables" :options="tableConfig" @initCharts="initCharts"></Table>
			</el-col>
		</el-row>
	</div>
</template>

<script setup lang="ts">
import Table from './component/table.vue';
import { ref, onMounted } from 'vue';
import { useStore } from '/@/store/index';
import { useRouter } from 'vue-router';
import chart from './component/chartService.vue';
import rightTableVue from './component/rightTable.vue';
import { Session } from '/@/utils/storage';
import { getTSpcControlGroupItemById } from '/@/api/controlChart'
import { ElMessage } from 'element-plus';
const router = useRouter();
const store = useStore();
const options:any = ref({});
const activeName = ref('chartUp');
const chartUp = ref();
const chartDown = ref();
const tableConfig = ref({});
const tableValue: any = ref([]);
const tableValueRow:any = ref({})
const tables = ref()

// 图表自适应方法
const handleClick = () => {
	if (activeName.value == 'chartUp') {
		chartUp.value.eventListener();
	} else if (activeName.value == 'chartDown') {
		// chartDown.value.eventListener();
	}
};

// 返回上一个路由
const goBack = () => {
	router.go(-1);
};

// 加载图表数据
const initCharts = (a: any) => {
	tableValue.value = [{1: a.controlChartCode}]
	tableValueRow.value = {0: a.controlChartCode,}
	options.value = a;
	if(a.controlChartCode == 'X_R'){
		leftTable(a.tSpcXRVo);
	}else if(a.controlChartCode == 'Xbar_S'){
		leftTable(a.tSpcXBarSVo);
	}else if(a.controlChartCode == 'Xbar_R'){
		leftTable(a.tSpcXBarRVo);
	}
	
};

// 右侧表格数据初始化
const leftTable = (das: Array<{}>) => {
	for (let item in das) {
		let da = { 1: item };
		let db = { [tableValue.value.length]: das[item] };
		// tableValueRow.value.push(db)
		Object.assign(tableValueRow.value, db)
		tableValue.value.push(da);
	}
};

// 返回表格当前行
const currentRow = (a:number) => {
	tables.value.currentRow(a)
}

onMounted(() => {
		let id = Session.get('inputDataId')
		getTSpcControlGroupItemById(id).then((res:any) => {
		if(res.code === 0){
			store.dispatch('inputData/setRowConfig', res.data);
			tables.value.initCharts(res.data.id)
			tables.value.getList(res.data.id,res.data.decimalPlaces)
			tables.value.tableConfig = store.state.inputData.tableConfig
			tables.value.loading = false
		}else{
			ElMessage.error('数据丢失，请返回上一个路由');
		}
	})
})
</script>

<style lang="scss" scoped>
.input-main {
	background-color: #fff;
	width: 100%;
	height: 100%;
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
	top:66px
  }
</style>
