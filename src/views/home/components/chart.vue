<!--
* @Author: zhuangxingguo
* @Date: 2022/05/24 15:59:01
 * @LastEditTime: 2022-07-19 10:16:29
 * @LastEditors: Administrator 848563840@qq.com
* @FilePath: 
-->
<template>
	<div :id="chartId" ref="chartRef" :style="{ borderRadius: borderRadius + 'px', width: width, height: height }" />
</template>
<script setup lang="ts">
import { onMounted, ref, watch, onBeforeUnmount, markRaw, nextTick } from 'vue';
import * as echarts from 'echarts';
import { uuid } from 'vue-uuid';
import { baseOption } from './option';

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
	if (chart.type == 'bar') {
		chart_option = baseOption(chart);
		console.log(1,chart,chart_option)
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
	renderChart,
});
</script>
