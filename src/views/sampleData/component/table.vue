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
				<el-select v-model="filterType" placeholder="请选择筛选条件" style="width: 100px; margin-right: 10px">
					<el-option v-for="item in options" :key="item.lable" :label="item.lable" :value="item.value"></el-option>
				</el-select>
				<div>
					<el-date-picker
						v-model="filterValue"
						type="datetimerange"
						range-separator="---"
						start-placeholder="开始时间"
						format="YYYY-MM-DD HH:mm:ss"
						value-format="YYYY-MM-DD HH:mm:ss"
						end-placeholder="结束时间"
					/>
				</div>
				<el-button plin :icon="Search" style="margin-left: 10px" @click="filterHandler" />
				<div class="spc-right">
					{{ filterValue }}
					<el-button type="primary" @click="initCharts(tableConfig.parentId, 2)">立即分析</el-button><el-button>选项设置</el-button>
				</div>
			</el-col>
			<!-- <el-col><el-button>立即分析</el-button><el-button>清空数据</el-button><el-button>导出图表</el-button><el-button>选项设置</el-button></el-col> -->
		</el-row>
		<div>
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
				:row-class-name="tableRowClassName"
				style="width: 100%"
				size="small"
				empty-text="暂无数据"
			>
				<!-- 序号 -->
				<el-table-column align="center" label="序号" type="index" width="50" />

				<template v-for="(item, index) in tableConfig.columns">
					<el-table-column
						:key="index"
						prop="item.prop"
						:width="124"
						:label="item.label"
						align="center"
						v-if="item.type == 'time'"
						:show-overflow-tooltip="true"
					>
						<template #default="scope">
							<span v-if="scope.row.editable == 0">
								<el-date-picker
									v-model="scope.row[item.prop]"
									type="datetime"
									size="small"
									placeholder="请选择时间"
									format="YYYY-MM-DD HH:mm:ss"
									value-format="YYYY-MM-DD HH:mm:ss"
									:editable="false"
								/>
							</span>
							<span v-else>{{ scope.row[item.prop] }}</span>
						</template>
					</el-table-column>
					<el-table-column :key="index" prop="item.prop" align="center" :label="item.label" v-if="item.type == 'input'" :show-overflow-tooltip="true">
						<template #default="scope">
							<span v-if="scope.row.editable == 0">
								<el-input
									min-width="10px"
									size="small"
									v-model="scope.row[item.prop]"
									@input="onVerifyNumberIntegerAndFloat($event, scope.row, item.prop, scope.$index)"
									@change="check(scope.row, item.prop, scope.$index)"
								/>
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
						v-if="item.type == 'judgeStatus'"
						:key="index"
						:show-overflow-tooltip="true"
					>
						<template #default="scope">
							<i style="color: #72bd1d" disable-transitions v-if="scope.row[item.prop] == 0">正常</i>
							<i style="color: #eb715e" disable-transitions v-if="scope.row[item.prop] == 1">失控</i>
							<i style="color: #eb715e" disable-transitions v-if="scope.row[item.prop] == 2">已处理</i>
							<i style="color: #eb715e" disable-transitions v-if="scope.row[item.prop] == 3">审核中</i>
							<i style="color: #eb715e" disable-transitions v-if="scope.row[item.prop] == 4">已审核</i>
						</template>
					</el-table-column>
				</template>
				<el-table-column label="操作" fixed="right" header-align="center" align="center" disabled="false" width="85px">
					<template #header>
						<div className="spc-button" @click="handelAdd" style="background-color: #5781c1">
							<svg-icon iconName="plus" style="color: #fff"></svg-icon>
						</div>
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
	<div>
		<invaliDialog ref="invaliDia" @errorArr="delErrorArr" @initCharts="initCharts" :pid="tableConfig.parentId" />
	</div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus';
import { reactive, toRefs, onMounted, ref, nextTick, watch, h } from 'vue';
import { cloneDeep, size } from 'lodash-es';
import { getInputDataAdd, getOutAuditList, deleteById, updatedById, getChartData } from '/@/api/inputData';
import { Search, Setting } from '@element-plus/icons-vue';
import { uuid } from 'vue-uuid';
import invaliDialog from './invalidDialog.vue';
import { ViewState } from './config/type';
import { verifyNumberIntegerAndFloat } from '/@/utils/toolsValidate';

const emit = defineEmits(['initCharts']);
const tableRef = ref();
const state = reactive<ViewState>({
	metadata: {},
	errorArr: [],
	loading: true,
	operationType: 'edit',
	filterType: 'entryTime',
	filterValue: null,
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
		type: '',
		defectRateSize: 0,
	},
});

const options = [
	{ value: 'sampleTime', lable: '抽检时间' },
	{ value: 'entryTime', lable: '录入时间' },
];
const { tableConfig, filterType, filterValue, operationType, loading, errorArr, metadata } = toRefs(state);

//失控弹窗
const invaliDia = <any>ref(null);

//过滤
const filterHandler = () => {
	let filterTime = [];
	if (filterValue.value == null) {
		initCharts(tableConfig.value.parentId);
		return;
	}
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

// 行的 className 的回调方
const tableRowClassName = ({ row, rowIndex }: any) => {
	row.row_index = rowIndex;
};

//  按钮（增改查）
const valChange = (row: { [x: string]: string; id: any; editable: any; sampleTime: string; entryTime: any }, index: any, lm: string) => {
	for (let i in state.tableConfig.tableData) {
		if (state.tableConfig.tableData[i].editable == 0 && state.tableConfig.tableData[i].id != row.id) {
			ElMessage.warning('请保存当前编辑项！');
			return false;
		}
	}

	if (lm != '0') {
		if (state.operationType == 'add') {
			state.operationType = 'edit';
			state.tableConfig.tableData.splice(index, 1);
		} else {
			initCharts(tableConfig.value.parentId);
			state.operationType = 'edit';
			row.editable = 1;
		}
		return;
	}

	if (['X_MR', 'Xbar_S', 'X_R', 'Xbar_R'].includes(tableConfig.value.type)) {
		if (row.editable == 0) {
			if (operationType.value == 'add') {
				4;
				if (row.sampleTime == '') {
					ElMessage.error('抽样时间不能为空');
					return;
				}
				let column = '';
				for (let i = 1; i <= state.tableConfig.sampleSize; i++) {
					if (Number(row['sampleValues' + i]) == 0 || row['sampleValues' + i] == null || row['sampleValues' + i] == '') {
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
					entity: { sampleTime: row.sampleTime, sampleValues: column, checkNumber: row.checkNumber },
					spcControlGroupItemId: state.tableConfig.parentId,
				};
				let json = JSON.parse(JSON.stringify(da));
				row.editable = 1;
				getInputDataAdd(json)
					.then((res: any) => {
						if (res.code == 0) {
							initCharts(tableConfig.value.parentId);

							ElMessage({
								type: 'success',
								message: '新增成功',
							});
						} else {
							initCharts(tableConfig.value.parentId);
							ElMessage({
								type: 'error',
								message: res.msg,
							});
						}
					})
					.catch((err) => {
						state.tableConfig.tableData.splice(index, 1);
						ElMessage({
							type: 'info',
							message: err,
						});
					});
			} else {
				let column = '';
				if (row.sampleTime == '') {
					ElMessage.error('抽样时间不能为空');
					return;
				}
				for (let i = 1; i <= state.tableConfig.sampleSize; i++) {
					if (Number(row['sampleValues' + i]) == 0 || row['sampleValues' + i] == null || row['sampleValues' + i] == '') {
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
					badItem: tableConfig.value.columns[3].label,
					sampleTime: row.sampleTime,
					sampleValues: column,
					id: row.id,
					spare1: index + 1,
				};
				let json = JSON.stringify(da);
				row.editable = 1;
				updatedById(json)
					.then((res: any) => {
						if (res.code == 0) {
							initCharts(tableConfig.value.parentId);
							operationType.value = 'edit';

							ElMessage({
								type: 'success',
								message: '修改成功',
							});
						} else {
							row.editable = 0;
							ElMessage({
								type: 'error',
								message: res.msg,
							});
						}
					})
					.catch((err) => {
						ElMessage({
							type: 'info',
							message: err,
						});
					});
			}
		} else {
			operationType.value = 'edit';
			row.editable = 0;
		}
	} else if (['P', 'U', 'NP', 'C'].includes(tableConfig.value.type)) {
		if (row.editable == 0) {
			if (operationType.value == 'add') {
				if (row.sampleTime == '') {
					ElMessage.error('抽样时间不能为空');
					return;
				}
				let column = '';
				for (let i = 0; i < state.tableConfig.defectRateSize; i++) {
					if (row['defectRate' + i] == null || row['defectRate' + i].indexOf('.') > 0 || row.checkNumber.indexOf('.') > 0) {
						ElMessage.error('样本不能为空或者等于0而且只能为整数');
						return false;
					}
					if (state.tableConfig.defectRateSize == i + 1) {
						column += row['defectRate' + i];
					} else {
						column += row['defectRate' + i] + ',';
					}
				}
				let da = {
					entity: { sampleTime: row.sampleTime, sampleValues: column, checkNumber: row.checkNumber },
					spcControlGroupItemId: state.tableConfig.parentId,
				};
				let json = JSON.parse(JSON.stringify(da));
				row.editable = 1;
				getInputDataAdd(json)
					.then((res: any) => {
						if (res.code == 0) {
							initCharts(tableConfig.value.parentId);
							ElMessage({
								type: 'success',
								message: '新增成功',
							});
						} else {
							state.tableConfig.tableData.splice(index, 1);
							ElMessage({
								type: 'error',
								message: res.msg,
							});
						}
					})
					.catch((err) => {
						state.tableConfig.tableData.splice(index, 1);
						ElMessage({
							type: 'info',
							message: err,
						});
					});
			} else {
				if (row.sampleTime == '') {
					ElMessage.error('抽样时间不能为空');
					return;
				}
				let column = '';
				for (let i = 0; i < state.tableConfig.defectRateSize; i++) {
					if (row['defectRate' + i] == null || row['defectRate' + i].indexOf('.') > 0 || String(row.checkNumber).indexOf('.') > 0) {
						ElMessage.error('样本不能为空或者等于0');
						return false;
					}
					if (state.tableConfig.defectRateSize == i + 1) {
						column += row['defectRate' + i];
					} else {
						column += row['defectRate' + i] + ',';
					}
				}
				let da = {
					badItem: tableConfig.value.columns[3].label,
					sampleTime: row.sampleTime,
					sampleValues: column,
					id: row.id,
					checkNumber: row.checkNumber,
					spare1: index + 1,
				};
				let json = JSON.stringify(da);
				row.editable = 1;
				updatedById(json)
					.then((res: any) => {
						if (res.code == 0) {
							initCharts(tableConfig.value.parentId);
							operationType.value = 'edit';
							ElMessage({
								type: 'success',
								message: '修改成功',
							});
						} else {
							operationType.value = 'edit';
							row.editable = 0;
							initCharts(tableConfig.value.parentId);
							ElMessage({
								type: 'error',
								message: res.msg,
							});
						}
					})
					.catch((err) => {
						ElMessage({
							type: 'info',
							message: err,
						});
					});
			}
		} else {
			operationType.value = 'edit';
			row.editable = 0;
		}
	}
};

// 异常点颜色判断
const cellStyle = ({ row, column, rowIndex, columnIndex }: any) => {
	if (['X_MR', 'Xbar_S', 'X_R', 'Xbar_R'].includes(tableConfig.value.type)) {
		if (tableConfig.value.tableData.length == 0) {
			return;
		}
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
	} else if (['P', 'U', 'NP', 'C'].includes(tableConfig.value.type)) {
		if (tableConfig.value.tableData.length == 0) {
			return;
		}
		let cla = { color: '#F7A427' };
		if (row.status == 1 && row.errorSampleValues.split(',')[0] != '' && row.errorSampleValues.split(',').length == 1) {
			let strArr = row.sampleValues.split(',');
			let intArr = [];
			intArr = strArr.map(function (data: string | number) {
				return +data;
			});
			for (let i = 0; i < intArr.length; i++) {
				if (intArr[i] == Number(row.errorSampleValues.split(',')[0]) && columnIndex == i + 4) {
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
					if (intArr[i] == row.errorSampleValues.split(',')[j] && columnIndex == i + 4) {
						return cla;
					}
				}
			}
		}
	}
};

// 删除单行（根据自身Id）
const handleDelete = (row: any, index: any, lm: any) => {
	if (tableConfig.value.type == 'X_MR' && tableConfig.value.tableData.length != index + 1) {
		ElMessage.error('X_MR只能从末尾删除数据');
		return;
	}
	if (row.judgeStatus == 2 || row.judgeStatus == 3 || row.judgeStatus == 4) {
		ElMessage.error('已提交审核，不能删除');
		return;
	}
	for (let i = 0; i < tableConfig.value.tableData.length; i++) {
		if (
			tableConfig.value.tableData[i].judgeStatus == 2 ||
			tableConfig.value.tableData[i].judgeStatus == 3 ||
			tableConfig.value.tableData[i].judgeStatus == 4
		) {
			if (index < i) {
				ElMessage.error('提交审核之前的数据，不能删除');
				return;
			}
		}
	}
	ElMessageBox({
		type: 'warning',
		message: '是否确认删除当前行',
		showCancelButton: true,
		cancelButtonText: '取消',
		confirmButtonText: '确认',
		beforeClose: (action, instance, done) => {
			if (action === 'confirm') {
				setTimeout(() => {
					done();
					setTimeout(() => {
						instance.confirmButtonLoading = false;
					}, 100);
				}, 100);
			} else {
				done();
			}
		},
	}).then((action) => {
		deleteById(row.id, tableConfig.value.parentId, tableConfig.value.columns[3].label, index + 1)
			.then((res: any) => {
				if (res.code == 0) {
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
			})
			.catch((err) => {
				ElMessage({
					type: 'info',
					message: err,
				});
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
	nextTick(() => {
		if (state.tableConfig.tableData.length > 18) {
			getTableScrollTop(state.tableConfig.tableData.length - 1, 'row');
		} else {
			getTableScrollTop(0);
		}
	});
};

// 录入数据校验
const onVerifyNumberIntegerAndFloat = (val: string, row: string[], value: any, index: number) => {
	// 匹配空格
	let v = val.replace(/(^\s*)|(\s*$)/g, '');
	// 只能是数字和小数点，不能是其他输入
	v = v.replace(/[^-//\d.]/g, '');
	// 以0开始只能输入一个
	v = v.replace(/^0{2}$/g, '0');
	// 以-开始只能输入一次
	v = v.replace(/^-{2}$/g, '-');
	// 保证第一位不能是点
	v = v.replace(/^\./g, '');
	// 小数只能出现1位
	v = v.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
	// -只能出现1次
	v = v.replace('-', '$#$').replace(/\-/g, '').replace('$#$', '-');
	// 小数点保留位数
	v = v.replace(/^(\-)*(\d+)\.(\d\d\d\d\d).*$/, '$1$2.$3');
	// 返回结果
	row[value] = v;
};
const check = (row: string[], value: any, index: number) => {
	if (['X_MR', 'Xbar_S', 'X_R', 'Xbar_R'].includes(tableConfig.value.type)) {
		if (tableConfig.value.decimalPlaces > 0) {
			let str = Number(row[value]).toFixed(7);
			row[value] = str.substring(0, str.lastIndexOf('.') + tableConfig.value.decimalPlaces + 1);
		} else {
			row[value] = Number(row[value]).toFixed(0);
		}
	}
};


// 表格定位
const getTableScrollTop = (index: number, type?: string) => {
	let elTable = tableRef.value.$el;
	if (!elTable) return;
	const scrollParent = elTable.querySelector('.el-table__body-wrapper');
	const targetTop = elTable.querySelectorAll('.el-table__body tr')[index].getBoundingClientRect().top; //该行的位置
	const containerTop = elTable.querySelector('.el-table__body').getBoundingClientRect().top; //body的位置
	if (type == 'row') {
		let memoryScrollTop = targetTop - containerTop;
		tableRef.value.setScrollTop(memoryScrollTop);
	} else {
		tableRef.value.setScrollTop(containerTop);
	}
};

// 表格数据查询（非分页）
const getList = (TableDataList: { [x: string]: any; sampleValues: string }[]) => {
	if (['X_MR', 'Xbar_S', 'X_R', 'Xbar_R'].includes(tableConfig.value.type)) {
		tableConfig.value.tableData = [];
		errorArr.value = [];
		if (TableDataList.length > 0) {
			TableDataList.forEach((item: { [x: string]: any; sampleValues: string }, index: number) => {
				let a = {};
				for (let i in item) {
					let b = { [i]: item[i] };
					Object.assign(a, b);
				}
				for (let i = 1; i <= tableConfig.value.sampleSize; i++) {
					let b = { ['sampleValues' + i]: item.sampleValues.split(',')[i - 1] };
					Object.assign(a, b);
				}
				if (item.judgeStatus == 1) {
					errorArr.value.push(index);
				}
				tableConfig.value.tableData.push(a);
			});
		}
	} else if (['P', 'U', 'NP', 'C'].includes(tableConfig.value.type)) {
		tableConfig.value.tableData = [];
		errorArr.value = [];
		if (TableDataList.length > 0) {
			TableDataList.forEach((item: { [x: string]: any; sampleValues: string }, index: number) => {
				let a = {};
				for (let i in item) {
					let b = { [i]: item[i] };
					Object.assign(a, b);
				}
				for (let i = 0; i < tableConfig.value.defectRateSize; i++) {
					let b = { ['defectRate' + i]: item.sampleValues.split(',')[i] };
					Object.assign(a, b);
				}
				if (item.judgeStatus == 1) {
					errorArr.value.push(index);
				}
				tableConfig.value.tableData.push(a);
			});
		}
	}
};

// 当前行坐标
const currentRow = (a: number, type?: string) => {
	if (type == 'click') {
		OpenCellDblClick(tableConfig.value.tableData[a]);
	} else {
		tableRef.value.setCurrentRow(tableConfig.value.tableData[a]);
		getTableScrollTop(a, 'row');
	}
};

// echarts初始化----->>>>>>根据父Id查询
const initCharts = (PId: string | Object, type?: number) => {
	if (PId == 'null') {
		emit('initCharts', { controlChartCode: 'null' });
	} else if (type == 1) {
		emit('initCharts', PId);
	} else if (type == 2) {
		let date: string[] = [];
		let type = 0;
		if (filterType.value == 'entryTime' && Array.isArray(filterValue.value)) {
			date.push(filterValue.value[0]);
			date.push(filterValue.value[1]);
			type = 1;
		} else if (filterType.value == 'sampleTime' && Array.isArray(filterValue.value)) {
			date.push(filterValue.value[0]);
			date.push(filterValue.value[1]);
			type = 2;
		}
		getChartData(PId, type, date)
			.then((res: any) => {
				metadata.value = {};
				if (res.code == 0 && res.data.tSpcControlGroupItemDataGpList.length > 0) {
					metadata.value = {
						differentRulesLMap: res.data.differentRulesLMap,
						differentRulesUMap: res.data.differentRulesUMap,
						itemDecRuleConfigList: res.data.itemDecRuleConfigList,
					};
					getList(res.data.tSpcControlGroupItemDataGpList);
					emit('initCharts', res.data);
				} else if (res.data.tSpcControlGroupItemDataGpList.length == 0) {
					metadata.value = {
						differentRulesLMap: res.data.differentRulesLMap,
						differentRulesUMap: res.data.differentRulesUMap,
						itemDecRuleConfigList: res.data.itemDecRuleConfigList,
					};
					getList([]);
					emit('initCharts', { controlChartCode: 'null' });
				} else {
					ElMessage({
						type: 'error',
						message: res.msg,
					});
				}
			})
			.catch((err) => {
				ElMessage({
					type: 'info',
					message: err,
				});
			});
	} else {
		getChartData(PId)
			.then((res: any) => {
				metadata.value = {};
				if (res.code == 0 && res.data.tSpcControlGroupItemDataGpList.length > 0) {
					metadata.value = {
						differentRulesLMap: res.data.differentRulesLMap,
						differentRulesUMap: res.data.differentRulesUMap,
						itemDecRuleConfigList: res.data.itemDecRuleConfigList,
					};
					getList(res.data.tSpcControlGroupItemDataGpList);
					emit('initCharts', res.data);
				} else if (res.data.tSpcControlGroupItemDataGpList.length == 0) {
					metadata.value = {
						differentRulesLMap: res.data.differentRulesLMap,
						differentRulesUMap: res.data.differentRulesUMap,
						itemDecRuleConfigList: res.data.itemDecRuleConfigList,
					};
					getList([]);
					emit('initCharts', { controlChartCode: 'null' });
				} else {
					ElMessage({
						type: 'error',
						message: res.msg,
					});
				}
			})
			.catch((err) => {
				ElMessage({
					type: 'info',
					message: err,
				});
			});
	}
};

//失控处理（弹窗控制）
const OpenCellDblClick = (row: any, column?: any, type?: number) => {
	if (row.judgeStatus == 1 && type == 1) {
		invaliDia.value.ruledialogVisible = true;
		invaliDia.value.chartType = tableConfig.value.type;
		invaliDia.value.rulefunction(metadata.value);
		invaliDia.value.rowData = row;
		invaliDia.value.rowData['spare1'] = column + 1;
		invaliDia.value.handleform = {
			spcControlGroupItemId: row.spcControlGroupItemId,
			spcControlGroupItemDataGpId: row.id,
			spare1: column + 1,
		};
	} else if (row.judgeStatus == 1) {
		invaliDia.value.ruledialogVisible = true;
		invaliDia.value.chartType = tableConfig.value.type;
		invaliDia.value.rulefunction(metadata.value);
		invaliDia.value.rowData = row;
		invaliDia.value.rowData['spare1'] = row.row_index + 1;
		invaliDia.value.handleform = {
			spcControlGroupItemId: row.spcControlGroupItemId,
			spcControlGroupItemDataGpId: row.id,
			spare1: row.row_index + 1,
		};
	} else if (row.judgeStatus == 2 || row.judgeStatus == 3 || row.judgeStatus == 4) {
		getOutAuditList(row.id).then((res: any) => {
			if (res.code == 0 && res.data.length > 0) {
				invaliDia.value.reviewVisible = true;
				invaliDia.value.chartType = tableConfig.value.type;
				invaliDia.value.rulefunction(metadata.value);
				invaliDia.value.rowData = row;
				invaliDia.value.rowData['spare1'] = row.row_index + 1;
				invaliDia.value.handleform = {
					spcControlGroupItemId: row.spcControlGroupItemId,
					spcControlGroupItemDataGpId: row.id,
					spare1: row.row_index + 1,
					outControlReason: res.data[0].outControlReason,
					treatMeasure: res.data[0].treatMeasure,
					handleUser: res.data[0].manageUser,
					handleTime: res.data[0].manageTime,
					remark: res.data[0].remark,
				};
				invaliDia.value.handleTableData = res.data;
			} else if (res.code == 0 && res.data.length == 0) {
				ElMessage.warning('未审核');
			} else {
				ElMessage.error(res.msg);
			}
		});
	}
};

// 失控数据改变
const delErrorArr = () => {
	errorArr.value.shift();
};

// 失控数据监控
watch(
	errorArr,
	(errArr) => {
		if (errorArr.value.length > 0 && (size(metadata.value.differentRulesUMap) || size(metadata.value.differentRulesLMap))) {
			OpenCellDblClick(tableConfig.value.tableData[errArr[0]], errArr[0], 1);
		}
	},
	{
		deep: true,
	}
);

defineExpose({
	currentRow,
	initCharts,
	getList,
	tableConfig,
	loading,
	metadata,
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
