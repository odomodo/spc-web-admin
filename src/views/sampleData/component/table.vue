<!--
* @Author: zhuangxingguo
* @Date: 2022/05/23 09:11:51
* @LastEditTime: 2022/05/23 09:11:51
* @LastEditors: zhuangxingguo
* @FilePath: 
-->
<template>
	<div class="input-table">
		<el-row>
			<el-col :span="24" class="flex flex-c" style="margin-bottom: 10px">
				<span>显示范围 :</span>
				<el-select v-model="filterType" placeholder="请选择语言" style="width: 100px; margin-right: 10px">
					<el-option v-for="item in options" :key="item.lable" :label="item.lable" :value="item.value"></el-option>
				</el-select>
				<div>
					<el-date-picker
						v-model="filterValue"
						type="datetimerange"
						range-separator="---"
						start-placeholder="开始时间"
						format="YYYY-MM-DD hh:mm:ss"
						value-format="YYYY-MM-DD hh:mm:ss"
						end-placeholder="结束时间"
					/>
				</div>
				<el-button plin :icon="Search" style="margin-left: 10px" @click="filterHandler" />
				<!-- <div class="spc-button"  style="width: 32px;height:32px;"><svg-icon  iconName="search" @click="filterHandler" /></div> -->

				<div class="spc-right">
					<el-button type="primary" @click="initCharts(tableConfig.parentId)">立即分析</el-button><el-button>清空数据</el-button><el-button>导出图表</el-button
					><el-button>选项设置</el-button>
				</div>
			</el-col>
			<!-- <el-col><el-button>立即分析</el-button><el-button>清空数据</el-button><el-button>导出图表</el-button><el-button>选项设置</el-button></el-col> -->
		</el-row>
		<div >
		<el-table
			v-loading="loading"
			ref="tableRef"
			:row-key="tableConfig.rowKey"
			:data="tableConfig.tableData"
			:height="tableConfig.height"
			:fit="tableConfig.fit"
			:border="tableConfig.border"
			:highlight-current-row="tableConfig.highlightCurrentRow"
			:show-header="tableConfig.showHeader"
			@cell-dblclick="OpenCellDblClick"
			:cell-style="cellStyle"
			:stripe="tableConfig.stripe"
			style="width: 100%"
			size="small"
		>
			<el-table-column align="center" label="序号" type="index" width="50" />
			<!-- 序号 -->
			<template v-for="(item, index) in tableConfig.columns">
				<el-table-column :key="index" prop="item.prop" :label="item.label" align="center" v-if="item.type == 'time'" :show-overflow-tooltip="true">
					<template #default="scope">
						<span v-if="scope.row.editable == 0">
							<el-date-picker
								v-model="scope.row[item.prop]"
								type="datetime"
								size="small"
								placeholder="请选择时间"
								format="YYYY-MM-DD hh:mm:ss"
								value-format="YYYY-MM-DD hh:mm:ss"
							/>
						</span>
						<span v-else>{{ scope.row[item.prop] }}</span>
					</template>
				</el-table-column>
				<el-table-column :key="index" prop="item.prop" align="center" :label="item.label" v-if="item.type == 'input'" :show-overflow-tooltip="true">
					<template #default="scope">
						<span v-if="scope.row.editable == 0">
							<el-input min-width="10px" size="small" v-model="scope.row[item.prop]" />
						</span>
						<span v-else>
							{{ scope.row[item.prop] }}
						</span>
					</template>
				</el-table-column>
				<el-table-column :key="index" prop="item.prop" align="center" :label="item.label" v-if="item.type == 'text'" :show-overflow-tooltip="true">
					<template #default="scope">
						<span>{{ scope.row[item.prop] }}</span>
					</template>
				</el-table-column>
				<el-table-column
					prop="item.prop"
					width="70px"
					align="center"
					:label="item.label"
					v-if="item.type == 'status'"
					:key="index"
					:show-overflow-tooltip="true"
				>
					<template #default="scope">
						<i style="color: #72bd1d" disable-transitions v-if="scope.row[item.prop] == 0">正常</i>
						<i style="color: #eb715e" type="danger" disable-transitions v-else>失败</i>
					</template>
				</el-table-column>
			</template>
			<el-table-column label="操作" fixed="right" header-align="center" align="center" disabled="false" width="85px">
				<template #header>
					<svg-icon iconName="plus" style="color: #5781c1; margin-right: 20px" @click="handelAdd"></svg-icon>
				</template>
				<template #default="scope">
					<svg-icon
						iconName="check"
						style="color: #5781c1; margin-right: 20px"
						v-if="scope.row.editable == 0"
						@click="valChange(scope.row, scope.$index, '0')"
					></svg-icon>
					<svg-icon
						iconName="edit"
						style="color: #5781c1; margin-right: 20px"
						v-if="scope.row.editable == 1"
						@click="valChange(scope.row, scope.$index, '0')"
					></svg-icon>
					<svg-icon
						iconName="delete"
						style="color: #5781c1; margin-right: 20px"
						v-if="scope.row.editable == 1"
						@click="handleDelete(scope.row, scope.$index, '0')"
					></svg-icon>
					<svg-icon
						iconName="close"
						style="color: #5781c1; margin-right: 20px"
						v-if="scope.row.editable == 0"
						@click="valChange(scope.row, scope.$index, '1')"
					></svg-icon>
				</template>
			</el-table-column>
		</el-table>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus';
import { reactive, toRefs, onMounted, ref, nextTick } from 'vue';
import { cloneDeep } from 'lodash-es';
import { getInputDataAdd, getFindList, deleteById, updatedById, getChartData } from '/@/api/inputData';
import { Search } from '@element-plus/icons-vue';
import { uuid } from 'vue-uuid';


interface ViewState {
	currentValue: number;
	operationType: string;
	filterType: string;
	filterValue: string[];
	tableConfig: any;
	loading: boolean,
}
const emit = defineEmits(['initCharts']);
const tableRef = ref();
const state = reactive<ViewState>({
	loading:true,
	currentValue: -1,
	operationType: '',
	filterType: 'entryTime',
	filterValue: [],
	tableConfig: {
		parentId: '',
		tableData: [],
		rowKey: 'id',
		columns: [],
		height: 25 * 15,
		stripe: false,
		border: false,
		fit: true,
		showHeader: true,
		highlightCurrentRow: true,
		row: {},
		sampleSize: 0,
		decimalPlaces: 0, //小数点位数
	},
});

const options = [
	{ value: 'sampleTime', lable: '抽检时间' },
	{ value: 'entryTime', lable: '录入时间' },
];
const { tableConfig, filterType, filterValue, operationType, currentValue,loading} = toRefs(state);

//过滤
const filterHandler = () => {
	let filterTime = [];
	if (filterValue.value.length == 0) {
		ElMessage.warning('条件查询不能为空！');
	} else if (filterType.value == 'sampleTime') {
		filterTime = state.tableConfig.tableData.filter((item: { sampleTime: string | number | Date }) => {
			return (
				new Date(item.sampleTime).getTime() >= new Date(filterValue.value[0]).getTime() &&
				new Date(filterValue.value[1]).getTime() >= new Date(item.sampleTime).getTime()
			);
		});
		state.tableConfig.tableData = filterTime;
	} else if (filterType.value == 'entryTime') {
		filterTime = state.tableConfig.tableData.filter((item: { entryTime: string | number | Date }) => {
			return (
				new Date(item.entryTime).getTime() >= new Date(filterValue.value[0]).getTime() &&
				new Date(filterValue.value[1]).getTime() >= new Date(item.entryTime).getTime()
			);
		});
		state.tableConfig.tableData = filterTime;
	}
};

const OpenCellDblClick = (row: any, column: any, cell: any, event: any) => {
	ElMessage.success('弹窗');
	// console.log(row, column, cell, event);
};
//  按钮（增删改查）
const valChange = (row: { [x: string]: string; id: any; editable: any; sampleTime: string; entryTime: any }, index: any, lm: string) => {
	//console.log(row)
	for (let i in state.tableConfig.tableData) {
		if (state.tableConfig.tableData[i].editable == 0 && state.tableConfig.tableData[i].id != row.id) {
			ElMessage.warning('请保存当前编辑项！');
			return false;
		}
	}

	if (lm != '0') {
		if (state.operationType == 'add') {
			state.tableConfig.tableData.splice(index, 1);
		} else {
			row.editable = 1;
		}
		return;
	}

	if (row.editable == 0) {
		if (operationType.value == 'add') {
			let column = '';
			for (let i = 1; i <= state.tableConfig.sampleSize; i++) {
				if (row.sampleTime == '' || row['sampleValues' + i] == '0' || row['sampleValues' + i] == null) {
					ElMessage.error('样本不能为空或者等于0');
					return false;
				}
				if (state.tableConfig.sampleSize == i) {
					column += row['sampleValues' + i];
				} else {
					column += row['sampleValues' + i] + ',';
				}
			}
			let da = {
				d: {
					entity: { sampleTime: row.sampleTime, sampleValues: column },
					spcControlGroupItemId: state.tableConfig.parentId,
				},
			};
			let json = JSON.parse(JSON.stringify(da));
			json.d.entity = JSON.stringify(da.d.entity);
			json.d = JSON.stringify(da.d);
			getInputDataAdd(json.d).then((res: any) => {
				if (res.code == 0) {
					initCharts(tableConfig.value.parentId);
					getList(tableConfig.value.parentId,tableConfig.value.decimalPlaces);
					ElMessage({
						type: 'success',
						message: '新增成功',
					});
				} else {
					ElMessage({
						type: 'error',
						message: res.msg,
					});
				}
			});

			row.editable = 1;
		} else {
			let column = '';
			for (let i = 1; i <= state.tableConfig.sampleSize; i++) {
				if (row.sampleTime == '' || row['sampleValues' + i] == '0' || row['sampleValues' + i] == null) {
					ElMessage.error('样本不能为空或者等于0');
					return false;
				}
				if (state.tableConfig.sampleSize == i) {
					column += row['sampleValues' + i];
				} else {
					column += row['sampleValues' + i] + ',';
				}
			}
			let da = {
				sampleTime: row.sampleTime,
				sampleValues: column,
				id: row.id,
			};
			let json = JSON.stringify(da);
			updatedById(json).then((res: any) => {
				if (res.code == 0) {
					initCharts(tableConfig.value.parentId);
					operationType.value = 'edit';
					row.editable = 0;
					getList(tableConfig.value.parentId,tableConfig.value.decimalPlaces);
					ElMessage({
						type: 'success',
						message: '修改成功',
					});
				} else {
					ElMessage({
						type: 'error',
						message: res.msg,
					});
				}
			});
		}
	} else {
		operationType.value = 'edit';
		row.editable = 0;
	}
};

// 异常点颜色判断
const cellStyle = ({ row, column, rowIndex, columnIndex }: any) => {
	let cla = { color: '#F7A427' };
	if (row.status == 1 && row.errorSampleValues.split(',')[0] != '' && row.errorSampleValues.split(',').length == 1) {
		let strArr = row.sampleValues.split(',');
		let intArr = [];
		intArr = strArr.map(function (data: string | number) {
			return +data;
		});
		for (let i = 0; i < intArr.length; i++) {
			if (intArr[i] == Number(row.errorSampleValues.split(',')[0]) && columnIndex == i + 3) {
				return cla;
			}
		}
	} else if (row.status == 1 && row.errorSampleValues.split(',').length > 1) {
		let strArr = row.sampleValues.split(',');
		let intArr = [];
		let err = row.errorSampleValues.split(',');
		let errArr = [];
		intArr = strArr.map(function (data: string | number) {
			return +data;
		});
		errArr = err.map(function (data: string | number) {
			return +data;
		});
		for (let i = 0; i < intArr.length; i++) {
			for (let j = 0; j < errArr.length; j++) {
				if (intArr[i] == row.errorSampleValues.split(',')[j] && columnIndex == i + 3) {
					return cla;
				}
			}
		}
	}
};

// 删除单行（根据自身Id）
const handleDelete = (row: any, index: any, lm: any) => {
	ElMessageBox.confirm('是否确认删除当前行', {
		confirmButtonText: 'OK',
		cancelButtonText: 'Cancel',
		type: 'warning',
	})
		.then(() => {
			deleteById(row.id).then((res: any) => {
				if (res.code == 0) {
					state.tableConfig.tableData.splice(index, 1);
					initCharts(tableConfig.value.parentId);
					ElMessage({
						type: 'success',
						message: '删除成功',
					});
				} else {
					ElMessage({
						type: 'error',
						message: res.msg,
					});
				}
			});
		})
		.catch(() => {
			ElMessage({
				type: 'info',
				message: '已取消删除',
			});
		});
};

// 新增
const handelAdd = () => {
	let row = state.tableConfig.tableData.slice(-1);
	for (let i in row) {
		if (row[i].editable == 0 && row[i].id != row.id) {
			ElMessage.warning('请保存当前编辑项！');
			return false;
		}
	}
	operationType.value = 'add';
	state.tableConfig.row.id = uuid.v1();
	state.tableConfig.tableData.push(cloneDeep(state.tableConfig.row));
	nextTick(() =>{
		getTableScrollTop(0)
	})
	
};

// 表格定位
const getTableScrollTop = (index:number,type?:string) => {
	let elTable = tableRef.value.$el
	if(!elTable) return
	const scrollParent = elTable.querySelector('.el-table__body-wrapper')
	const targetTop = elTable.querySelectorAll('.el-table__body tr')[index].getBoundingClientRect().top//该行的位置
    const containerTop = elTable.querySelector('.el-table__body').getBoundingClientRect().top //body的位置
	if(type == 'row'){
		let memoryScrollTop = targetTop - containerTop
		tableRef.value.setScrollTop(memoryScrollTop)
	}else{
		tableRef.value.setScrollTop(containerTop)
	}
}

// 表格数据查询（非分页）
const getList = (parentId:string,decimalPlaces:number) => {
	getFindList(parentId, decimalPlaces).then((res) => {
		tableConfig.value.tableData = [];
		if (res.data.length > 0) {
			res.data.forEach((item: { [x: string]: any; sampleValues: string }) => {
				let a = {};
				for (let i in item) {
					let b = { [i]: item[i] };
					Object.assign(a, b);
				}
				for (let i = 1; i <= tableConfig.value.sampleSize; i++) {
					let b = { ['sampleValues' + i]: item.sampleValues.split(',')[i - 1] };
					Object.assign(a, b);
				}
				tableConfig.value.tableData.push(a);
			});
		}
	});
};

// 当前行坐标
const currentRow = (a: number) => {
	tableRef.value.setCurrentRow(tableConfig.value.tableData[a]);
	getTableScrollTop(a,'row')
};

// echarts初始化
const initCharts = (PId:string) => {
	getChartData(PId).then((res: any) => {
		if (res.code == 0) {
			emit('initCharts', res.data);
		} else {
			ElMessage({
				type: 'error',
				message: '图表初始化失败',
			});
		}
	});
};

defineExpose({
	currentRow,
	initCharts,
	getList,
	tableConfig,
	loading
});
</script>

<style lang="scss" scope>
.input-table {
	.el-table .success-row {
		--el-table-tr-bg-color: rgb(169, 240, 175);
	}
	.el-table {
		border-bottom: 0;
	}
	/* 表头 */
	.el-table .el-table__header-wrapper tr th {
		color: #313233;
		background-color: #f0f0f0 !important;
		height: 46px;
	}
	.el-table-fixed-column--right {
		background-color: #f0f0f0;
	}
	.el-table td.el-table__cell,
	.el-table th.el-table__cell.is-leaf {
		border-bottom: 0;
	}
}
</style>
