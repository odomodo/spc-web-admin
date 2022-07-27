<!--
* @Author: zhuangxingguo
* @Date: 2022/05/23 09:11:51
 * @LastEditTime: 2022-07-26 13:58:28
 * @LastEditors: Administrator 848563840@qq.com
* @FilePath: 
-->
<template>
	<div class="input-table">
		<div class="input-table-header">
			<span>显示范围 </span>
			<el-select v-model="filterType" size="large" placeholder="请选择筛选条件" style="width: 100px; margin-right: 10px; margin-left: 10px">
				<el-option v-for="item in options" :key="item.lable" :label="item.lable" :value="item.value"></el-option>
			</el-select>

			<el-date-picker
				style="width: 200px; margin-right: 10px"
				v-if="filterType !== 'numberSize'"
				size="large"
				v-model="filterValue[0]"
				type="datetime"
				placeholder="开始时间"
				format="YYYY-MM-DD HH:mm:ss"
				value-format="YYYY-MM-DD HH:mm:ss"
			/>
			<el-date-picker
				style="width: 200px; margin-right: 10px"
				v-if="filterType !== 'numberSize'"
				size="large"
				v-model="filterValue[1]"
				type="datetime"
				placeholder="结束时间"
				format="YYYY-MM-DD HH:mm:ss"
				value-format="YYYY-MM-DD HH:mm:ss"
			/>

			<el-select v-model="numberSize" size="large" style="width: 119px !important" placeholder="请选择">
				<el-option v-for="item in numberSizeOptions" :key="item.value" :label="item.lable" :value="item.value" />
			</el-select>

			<div class="input-table-header-button" v-loading="loading" @click="initCharts(tableConfig.parentId, 2)">
				<svg-icon iconName="analyze_icon"></svg-icon><label style="margin-left: 10px">立即分析</label>
			</div>

		</div>
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
							<span v-if="scope.row.editable == 0" class="input-picker">
								<el-date-picker
									v-model="scope.row[item.prop]"
									style="width: 105px;"
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
				<el-table-column label="操作" fixed="right" header-align="center" align="center" disabled="false" width="90px">
					<template #header>
							<svg-icon iconName="plus" @click="handelAdd" iconSize="16" style="color: #626466"></svg-icon>
					</template>
					<template #default="scope">
						<svg-icon
							iconName="check"
							iconSize="16"
							style="color: #5781c1; margin-right: 10px;margin-left: 10px;"
							v-if="scope.row.editable == 0"
							@click="valChange(scope.row, scope.$index, '0')"
						></svg-icon>
						<svg-icon
							iconName="edit"
							iconSize="16"
							style="color: #5781c1; margin-right: 10px;margin-left: 10px;"
							v-if="scope.row.editable == 1"
							@click="valChange(scope.row, scope.$index, '0')"
						></svg-icon>
						<svg-icon
							iconName="delete"
							iconSize="16"
							style="color: #5781c1; margin-right: 10px;margin-left: 10px;"
							v-if="scope.row.editable == 1"
							@click="handleDelete(scope.row, scope.$index, '0')"
						></svg-icon>
						<svg-icon
							iconName="close"
							iconSize="14"
							style="color: #5781c1; margin-right: 10px;margin-left: 10px;"
							v-if="scope.row.editable == 0"
							@click="valChange(scope.row, scope.$index, '1')"
						></svg-icon>
					</template>
				</el-table-column>
			</el-table>
		</div>
	</div>
	<div>
		<invaliDialog ref="invaliDia" @initCharts="initCharts" :pid="tableConfig.parentId" />
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
import { ViewState, filtersInterface } from '../../component/config/type';
import svgIcon from '/@/components/svgIcon/index.vue';

const emit = defineEmits(['initCharts']);
const tableRef = ref();
const state = reactive<ViewState>({
	numberSize: 30,
	metadata: {},
	errorArr: [],
	loading: true,
	operationType: 'edit',
	filterType: 'numberSize',
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
		type: '',
	},
});

// 每次请求样本容量
const numberSizeOptions = [
	{
		value: 30,
		lable: '最近30条',
	},
	{
		value: 50,
		lable: '最近50条',
	},
	{
		value: 100,
		lable: '最近100条',
	},
	{
		value: 200,
		lable: '最近200条',
	},
];

const options = [
	{ value: 'sampleTime', lable: '抽检时间' },
	{ value: 'entryTime', lable: '录入时间' },
	{ value: 'numberSize', lable: '最近条数筛选' },
];
const { tableConfig, filterType, numberSize, filterValue, operationType, loading, errorArr, metadata } = toRefs(state);

//失控弹窗
const invaliDia = <any>ref(null);

// 行的 className 的回调方
const tableRowClassName = ({ row, rowIndex }: any) => {
	row.row_index = rowIndex;
};

//  按钮（增改查）
const valChange = (
	row: { [x: string]: string; id: any; editable: any; sampleTime: string; entryTime: any; judgeStatus: any },
	index: any,
	lm: string
) => {
	if (row.judgeStatus == 2 || row.judgeStatus == 3 || row.judgeStatus == 4) {
		ElMessage.error('已提交审核，不能编辑');
		return;
	}
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

	if (row.editable == 0) {
		if (operationType.value == 'add') {
			if (row.sampleTime == '') {
				ElMessage.error('抽样时间不能为空');
				return;
			}
			if (row['checkNumber'] == '' || row['checkNumber'] == null || Number(row['checkNumber']) == 0) {
				ElMessage.error('抽检数不能为空且不为0');
				return;
			}
			if (row['sampleValues'] == null || row['sampleValues'] == '') {
				if (['P', 'NP'].includes(tableConfig.value.type)) {
					ElMessage.error('不良数不能为空');
				} else {
					ElMessage.error('缺陷数不能为空');
				}
				return false;
			}
			// if (Number(row['checkNumber']) < Number(row['sampleValues'])) {
			// 	if (['P', 'NP'].includes(tableConfig.value.type)) {
			// 		ElMessage.error('不良数不能大于抽检数');
			// 		return false;
			// 	}
			// }
			let da = {
				entity: { sampleTime: row.sampleTime, sampleValues: row['sampleValues'], checkNumber: row.checkNumber },
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
				});
		} else {
			if (row.sampleTime == '') {
				ElMessage.error('抽样时间不能为空');
				return;
			}
			if (row['checkNumber'] == '' || row['checkNumber'] == null || Number(row['checkNumber']) == 0) {
				ElMessage.error('抽检数不能为空且不为0');
				return;
			}
			if (row['sampleValues'] == null || row['sampleValues'] == '') {
				if (['P', 'NP'].includes(tableConfig.value.type)) {
					ElMessage.error('不良数不能为空');
				} else {
					ElMessage.error('缺陷数不能为空');
				}
				return false;
			}
			// if (Number(row['checkNumber']) < Number(row['sampleValues'])) {
			// 	if (['P', 'NP'].includes(tableConfig.value.type)) {
			// 		ElMessage.error('不良数不能大于抽检数');
			// 		return false;
			// 	}
			// }

			let da = {
				badItem: tableConfig.value.columns[3].label,
				sampleTime: row.sampleTime,
				sampleValues: row['sampleValues'],
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
				.catch((err) => {});
		}
	} else {
		operationType.value = 'edit';
		row.editable = 0;
	}
};

// 异常点颜色判断
const cellStyle = ({ row, column, rowIndex, columnIndex }: any) => {
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
	}
};

// 删除单行（根据自身Id）
const handleDelete = (row: any, index: any, lm: any) => {
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
		title: '',
		closeOnClickModal: false,
		closeOnPressEscape: false,
		message: '确认删除吗？',
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
		deleteById(row.id, tableConfig.value.parentId, tableConfig.value.columns[3].label, index + 1).then((res: any) => {
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
	let scronllDiv = document.getElementsByClassName('input-main');
	scronllDiv[0].scrollTop = scronllDiv[0].scrollHeight;
	operationType.value = 'add';
	state.tableConfig.row.id = uuid.v1();
	state.tableConfig.tableData.push(cloneDeep(state.tableConfig.row));
	nextTick(() => {
		if (state.tableConfig.tableData.length > 6) {
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
	v = v.replace(/[^\d]/g, '');
	// 保证第一位不能是0
	// v = v.replace(/^0/g, '');
	// 返回结果
	row[value] = v;
};
const check = (row: string[], value: any, index: number) => {};

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
	tableConfig.value.tableData = [];
	errorArr.value = [];
	if (TableDataList.length > 0) {
		tableConfig.value.tableData.push(...TableDataList);
		TableDataList.forEach((item, index) => {
			if (item.judgeStatus == 1) {
				errorArr.value.push(index);
			}
		});
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
function isNull(arr: string): boolean {
	let result: boolean = true;

	if (arr == 'null' || typeof arr == 'undefined') {
		result = false;
	}

	return result;
}
// echarts初始化----->>>>>>根据父Id查询
const initCharts = (PId: any, types?: number) => {
	loading.value = true;
	//数据为空的时候
	if (PId.controlChartCode == 'null') {
		loading.value = false;
		emit('initCharts', {
			controlChartCode: 'null',
			controlChartValue: PId.controlChartValue,
			tSpcControlGroupItemHierarchyList: PId.tSpcControlGroupItemHierarchyList,
		});
	} else if (types == 1) {
		//初始化的时候
		emit('initCharts', PId);
		loading.value = false;
	} else {
		let date: filtersInterface = {};
		if (filterType.value == 'entryTime' && filterValue.value.length > 0) {
			if (isNull(filterValue.value[0])) {
				date.entryStartTime = filterValue.value[0];
			}
			if (isNull(filterValue.value[1])) {
				date.entryEndTime = filterValue.value[1];
			}
		} else if (filterType.value == 'sampleTime' && filterValue.value.length > 0) {
			if (isNull(filterValue.value[0])) {
				date.sampleStartTime = filterValue.value[0];
			}
			if (isNull(filterValue.value[1])) {
				date.sampleEndTime = filterValue.value[1];
			}
		}
		getChartData({ spcControlGroupItemId: PId, ...date, numberSize: numberSize.value })
			.then((res: any) => {
				loading.value = false;
				metadata.value = {};
				if (res.code == 0 && res.data.tSpcControlGroupItemDataGpList.length > 0) {
					metadata.value = {
						differentRulesLMap: res.data.differentRulesLMap,
						differentRulesUMap: res.data.differentRulesUMap,
						itemDecRuleConfigList: res.data.itemDecRuleConfigList,
					};
					getList(res.data.tSpcControlGroupItemDataGpList);
					emit('initCharts', res.data);
				} else if (res.code == 0 && res.data.tSpcControlGroupItemDataGpList.length == 0) {
					metadata.value = {
						differentRulesLMap: res.data.differentRulesLMap,
						differentRulesUMap: res.data.differentRulesUMap,
						itemDecRuleConfigList: res.data.itemDecRuleConfigList,
					};
					getList([]);
					emit('initCharts', { controlChartCode: 'null', text: '暂无数据' });
				} else if (res.code == -1 && res.data.tSpcControlGroupItemDataGpList.length > 0) {
					metadata.value = {
						differentRulesLMap: {},
						differentRulesUMap: {},
						itemDecRuleConfigList: [],
					};
					getList(res.data.tSpcControlGroupItemDataGpList);
					emit('initCharts', { controlChartCode: 'null', text: '数据量过大,请控制筛选条件' });
				} else {
					ElMessage({
						type: 'error',
						message: res.msg,
					});
				}
			})
			.catch((err) => {
				loading.value = false;
			});
	}
};

//失控处理（弹窗控制）
const OpenCellDblClick = (row: any, column?: any, type?: number) => {
	if (row.judgeStatus == 1 && type == 1) {
		invaliDia.value.ruledialogVisible = true;
		invaliDia.value.chartType = tableConfig.value.type;
		invaliDia.value.rulefunction(metadata.value, column);
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
		invaliDia.value.rulefunction(metadata.value, row.row_index);
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
				invaliDia.value.rulefunction(metadata.value, row.row_index);
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
					remark: res.data[0].remark || '',
					reasonAnalysis: res.data[0].reasonAnalysis,
				};
				invaliDia.value.handleTableData = typeof res.data[0].auditResult == 'undefined' ? [] : res.data;
			} else if (res.code == 0 && res.data.length == 0) {
				invaliDia.value.reviewVisible = true;
				invaliDia.value.chartType = tableConfig.value.type;
				invaliDia.value.rulefunction(metadata.value, row.row_index);
				invaliDia.value.rowData = row;
				invaliDia.value.rowData['spare1'] = row.row_index + 1;
				invaliDia.value.handleform = {
					spcControlGroupItemId: row.spcControlGroupItemId,
					spcControlGroupItemDataGpId: row.id,
					spare1: row.row_index + 1,
					outControlReason: '',
					treatMeasure: '',
					handleUser: '',
					handleTime: '',
					remark: '',
					reasonAnalysis: '',
				};
				invaliDia.value.handleTableData = [];
			} else {
				ElMessage.error(res.msg);
			}
		});
	}
};

// 失控数据监控
watch(
	errorArr,
	(errArr) => {
		if (errorArr.value.length > 0 && size(metadata.value.differentRulesUMap) > 0) {
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
	&-header {
		display: flex;
		line-height: 80px;
		height: 80px;
		align-items: center;
		&-button {
			width: 120px;
			height: 40px;
			background: #5781c1;
			border-radius: 4px;
			color: #ffffff;
			position: absolute;
			right: 5px;
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;
			label {
				cursor: pointer;
			}
			&:hover {
				background-color: #7ba4e0;
			}
		}
	}

	.el-table .success-row {
		--el-table-tr-bg-color: rgb(169, 240, 175);
	}
	.el-table {
		border-bottom: 0;
	}
	/* 表头 */
	.el-table .el-table__header-wrapper tr th {
		font-size: 14px;
		color: #313233;
		background-color: #f0f0f0 !important;
		height: 52px;
	}
	.el-table .el-table__body-wrapper tr td {
		height: 52px;
		font-size: 14px;
		color: #313233;
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
