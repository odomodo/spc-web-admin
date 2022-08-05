<!--
* @Author: zhuangxingguo
* @Date: 2022/05/27 chartTypeArr.includes(chartType)0:chartTypeArr.includes(chartType)9:30
 * @LastEditTime: 2022-07-26 09:37:59
 * @LastEditors: Xingguo Zhuang 848563840@qq.com
* @FilePath: 
-->
<template>
<div class="right-table">
	<el-table :data="showData" :height="400" :row-style="cellStyleRow" style="width: 100%" empty-text="暂无数据">
	
		<el-table-column :show-overflow-tooltip="true" width="160">
				<template #default="scope">
					<i v-if="scope.$index == 0">图表类型</i>
					<i v-else>{{ $t('message.input.' + costom(scope.row.key)) }}</i>
				</template>
			</el-table-column>
			<el-table-column :show-overflow-tooltip="true" width="120">
				<template #default="scope">{{ scope.row.value }}</template>
			</el-table-column>

	</el-table>

	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps({
	showData: {
		type: Array,
		default: () => [],
	},
	
});

const costom = (key: string) => {
	if(key == 'defectiveProductRate' &&  (props.showData[0].key == 'C' || props.showData[0].key == 'U')){
		return 'defectRate';
	}else if(key == 'defectiveProductNumber' &&  (props.showData[0].key == 'C' || props.showData[0].key == 'U')){
		return 'defectNumber';
	}else{
		return key;
	}
}


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
	:deep(.el-table) {
		.el-table__header-wrapper {
			display: none;

		}
		.cell{
			padding: 0 30px;
		}
	}
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
	i {
		font-size: 14px;
		font-family: Microsoft YaHei;
		font-weight: 400;
		color: #313233;
		font-style: normal;
	}
}

</style>
