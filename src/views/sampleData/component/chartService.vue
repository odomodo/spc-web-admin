<!--
* @Author: zhuangxingguo
* @Date: 2022/05/24 15:59:01
 * @LastEditTime: 2022-07-26 16:33:07
 * @LastEditors: Xingguo Zhuang 848563840@qq.com
* @FilePath: 
-->
<template>
	<div :id="chartId" ref="chartRef" :style="{ borderRadius: borderRadius + 'px', width: width, height: height }" />
</template>
<script setup lang="ts">
import { onMounted, ref, watch, onBeforeUnmount, markRaw, nextTick } from 'vue';
import * as echarts from 'echarts';
import { uuid } from 'vue-uuid';
import { baseMROption, baseXbarSOption, baseXbarROption, baseXMROption, baseNullOption } from './config/metrologicalType';
import { basePOption, baseUOption, baseNPOption, baseCOption } from './config/countingType';
import { Cpk } from './config/normalDistribution';

const props = defineProps({
	// 图表唯一 id
	chartId: {
		type: String,
		default: uuid.v1(),
	},
	// 图表类名
	className: {
		type: String,
		default: 'chart',
	},
	// 图表宽度
	width: {
		type: String,
		default: '100%',
	},
	// 图表高度
	height: {
		type: String,
		default: '100%',
	},
	// 图表数据项
	options: {
		type: Object,
		default: () => ({}),
	},
});
const emit = defineEmits(['currentRow']);
const chartRef = ref<any>();
const chart = ref<any>();
const borderRadius = ref(0);
/**
 * 初始化echart
 * @param data 数据项
 * @param clearCaching 是否清除缓存
 */
const initChart = (data: any, clearCaching = false) => {
	if (data) {
		chart.value.setOption(data, clearCaching);

		window.addEventListener('resize', eventListener);

		chart.value.on('mousemove', function (params: any) {
			// index定位
			let rowIndex
			if(typeof params.data.xAxis == 'undefined'){
				rowIndex = params.dataIndex
			}else {
				rowIndex = params.data.xAxis
			}
			if (props.options.type == 'cpk') {
				return;
			}
			if (props.options.controlChartCode == 'U') {
				chart.value.setOption(baseUOption(props.options, rowIndex), false);
			} else if (props.options.controlChartCode == 'P') {
				chart.value.setOption(basePOption(props.options, rowIndex), false);
			}
			emit('currentRow', rowIndex);
		});
		chart.value.off('click');//这个是解决多次触发问题的关键
		chart.value.on('click', function (params: any) {
			if (props.options.type == 'cpk') {
				return;
			}
			// index定位
			let rowIndex
			if(typeof params.data.xAxis == 'undefined'){
				rowIndex = params.dataIndex
			}else {
				rowIndex = params.data.xAxis
			}
			emit('currentRow', rowIndex, 'click');
			//console.log(params);
		});
		chart.value.on('mousem')
	}
};
// 图表自适应
const eventListener = () => {
	if (chart.value) {
		nextTick(() => {
			chart.value.resize();
		});
	}
};

//数据处理
const renderChart = (chart: any) => {
	let chart_option = {};
	if (chart.controlChartCode == 'Xbar_S') {
		chart_option = baseXbarSOption(chart);
		// console.log(1,chart,chart_option)
	} else if (chart.controlChartCode == 'MR') {
		chart_option = baseMROption(chart);
		// console.log(2, chart,chart_option);
	} else if (chart.controlChartCode == 'Xbar_R') {
		chart_option = baseXbarROption(chart);
		// console.log(3,chart,chart_option)
	} else if (chart.controlChartCode == 'X_MR') {
		chart_option = baseXMROption(chart);
		// console.log(3,chart,chart_option)
	} else if (chart.controlChartCode == 'P') {
		chart_option = basePOption(chart, 0);
		// console.log(5, chart, chart_option);
	} else if (chart.controlChartCode == 'U') {
		chart_option = baseUOption(chart, 0);
		//console.log(6, chart , chart_option);
	} else if (chart.type == 'cpk') {
		chart_option = Cpk(chart);
		// chart_option = Cpkes(chart);
		// chart_option = demo(chart)
		// console.log(7, chart,chart_option);
	} else if (chart.controlChartCode == 'NP') {
		// console.log(8, chart);
		chart_option = baseNPOption(chart);
		// console.log(7, chart,chart_option);
	} else if (chart.controlChartCode == 'C') {
		// console.log(9, chart);
		chart_option = baseCOption(chart);
		
	} else if (chart.controlChartCode == 'null') {
		// console.log(9, chart);
		chart_option = baseNullOption(chart);
	}

	initChart(chart_option, true);
};


// 生命周期
onMounted(() => {
	// 定义实例
	nextTick(() => {
		chart.value = markRaw(echarts.init(chartRef.value));
		renderChart(props.options);
	});
});
// 销毁过期实列
onBeforeUnmount(() => {
	window.removeEventListener('resize', eventListener);
	chart.value.dispose();
	chart.value = null;
});

//监听改变
watch(
	() => props.options,
	(val) => {
		val && renderChart(val);
	},
	{
		deep: true,
	}
);

// 对外暴露接口
defineExpose({
	chartRef,
	initChart,
	eventListener,
});
</script>
