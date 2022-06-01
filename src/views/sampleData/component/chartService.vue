<!--
* @Author: zhuangxingguo
* @Date: 2022/05/24 15:59:01
* @LastEditTime: 2022/05/24 15:59:01
* @LastEditors: zhuangxingguo
* @FilePath: 
-->
<template>
	<div :id="chartId" ref="chartRef" :style="{ borderRadius: borderRadius + 'px', width: width, height: height }" />
</template>
<script setup lang="ts">
import { onMounted, ref, watch, onBeforeUnmount, markRaw, nextTick } from 'vue';
import * as echarts from 'echarts';
import { ElMessage } from 'element-plus';
import { uuid } from 'vue-uuid';
import { baseXROption,baseXbarSOption, baseXbarROption } from './config/metrologicalType'

const props = defineProps({
	// 图表唯一 id
	// id: String,
	// 图表类名
	className: {
		type: String,
		default: 'chart',
	},
	// 图表宽度
	width: {
		type: String,
		require: true,
		default: '100%',
	},
	// 图表高度
	height: {
		type: String,
		require: true,
		default: '100%',
	},
	// 图表数据项
	options: {
		type: Object,
		default: () => ({}),
	},
});
const emit = defineEmits(['currentRow'])
const chartId = uuid.v1();
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
		setTimeout(() => {
				
		}, 500)
		chart.value.setOption(data, clearCaching);

		window.addEventListener('resize', eventListener);

		chart.value.on('mousemove', function (params: any) {
			// 此处一般写：click事件触发后的回调，来完成额外的功能
			// ElMessage.success('你点击了' + params.value);
			// console.log(params)
			emit('currentRow',params.dataIndex)
		});
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
	if (chart.controlChartCode == "Xbar_S") {
    // console.log(1,chart)
		chart_option = baseXbarSOption(chart)
	}else if(chart.controlChartCode == "X_R") {
		// console.log(2,chart)
			chart_option = baseXROption(chart);
	}else if(chart.controlChartCode == "Xbar_R") {
		console.log(3,chart)
			chart_option = baseXbarROption(chart);
	}
	console.log(chart_option)
  initChart(chart_option);
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

// 监听改变
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
