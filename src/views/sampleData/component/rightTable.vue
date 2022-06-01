<!--
* @Author: zhuangxingguo
* @Date: 2022/05/27 chartTypeArr.includes(chartType)0:chartTypeArr.includes(chartType)9:30
* @LastEditTime: 2022/05/27 chartTypeArr.includes(chartType)0:chartTypeArr.includes(chartType)9:30
* @LastEditors: zhuangxingguo
* @FilePath: 
-->
<template>
<div class="right-table">
	<el-table :data="showData" :height="400" :row-style="cellStyleRow" style="width: 100%">
	
			<el-table-column  :show-overflow-tooltip="true" width="150">
				<template #default="scope" >
					<i v-if="scope.$index == 0">图标类型</i>
					<i v-else>{{$t('message.input.'+scope.row[1])}}</i>
				</template>
			</el-table-column>
			<el-table-column  :show-overflow-tooltip="true" width="130">
				<template #default="scope">{{tableRow[scope.$index]}}</template>
			</el-table-column>

	</el-table>
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

defineProps({

	showData: {
		type: Array,
		default: () => [],
	},
	tableRow: {
		type: Object,
		default: () =>{},
	},
});


const cellStyleRow = ({ rowIndex }: any) => {
	let cla = { backgroundColor: '#FAFAFA' };
	if(rowIndex % 2 === 0){
		return cla;
	}
}
</script>
<style lang="scss" scoped>
.right-table{
	width: 100%;
	/* 表头 */
	.el-table .el-table__header-wrapper tr th {
		color: #313233;
		background-color: #f0f0f0 !important;
		height: 0;
	}
	.el-table td.el-table__cell,
	.el-table th.el-table__cell.is-leaf {
		border-bottom: 0;
	}
	.el-table {
		border-bottom: 0;
	}
	
}

</style>
