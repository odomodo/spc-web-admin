<template>
	<div style="width: 100%" id="divTable" class="input-table">
	<div class="table-box">
		<el-table
			ref="tableRef"
			:data="tableData"
			:height="tableConfig_.height"
			:stripe="tableConfig_.stripe"
			:fit="tableConfig_.fit"
			:show-header="tableConfig_.showHeader"
			:highlight-current-row="tableConfig_.highlightCurrentRow"
			:tree-props="tableConfig_.treeProps"
			:row-key="tableConfig_.rowKey"
			:default-sort="tableConfig_.defaultSort"
			:cell-class-name="tableConfig_?.cellClassName"

			align="center"
			header-align="center"
			@selection-change="_handleSelectionChange"
			@select="_handleSelect"
			@select-all="_handleSelectAll"
			@row-click="_handleRowClick"
			@row-dblclick="_handleRowDblClick"
			@cell-click="_handleCellClick"
			@cell-dblclick="_handleCellDblClick"
			@current-change="_handleTableCurrentChange"
			:header-cell-style="{ height: '50px', padding: '2px', backgroundColor: '#f0f0f0', color: '#313233' }"
			:row-style="{ height: '50px' }"
			:cell-style="{ padding: '3px' }"
		>
			<!--选择框-->
			<template v-if="tableConfig_.showChoose">
				<!--单选框-->
				<el-table-column header-align="center" label="选择" align="center" fixed="left" width="80" v-if="tableConfig_.singleSelect">
					<template #default="scope">
						<el-radio v-model="selectionData_" :label="scope.row" @change="_handleRadioChange"><i></i></el-radio>
					</template>
				</el-table-column>

				<!--复选框-->
				<el-table-column v-else header-align="center" align="center" fixed="left" width="80" type="selection"> </el-table-column>
			</template>

			<!--序号-->
			<template v-if="tableConfig_.rowNumbers">
				<el-table-column header-align="center" align="center" fixed="left" width="60" type="index" :index="indexMethod"> </el-table-column>
			</template>

			<!--列显示-->
			<template v-for="(column, index) in tableConfig_.columns">
				<template v-if="!column.hidden">
					<!--编辑列-->
					<el-table-column
						v-if="column.type === 'edit'"
						:key="index"
						:label="column.label"
						:header-align="!column.align ? 'center' : column.align"
						:align="!column.align ? 'center' : column.align"
						:prop="column.prop"
						:width="column.width"
						:min-width="column.minWidth"
						:fixed="column.fixed"
						:formatter="column.formatter"
						:sortable="!column.sortable ? false : column.sortable"
						:label-class-name="!column.labelClassName ? '' : column.labelClassName"
						:resizable="!column.resizable ? true : column.resizable"
						:show-overflow-tooltip="!column.showOverflowToolTip ? true : column.showOverflowToolTip"
					>
						<template #default="scope">
							<el-input v-model="scope.row[column.prop]" />
						</template>
					</el-table-column>
					<!--非编辑列-->
					<el-table-column
						v-else
						:key="column.prop"
						:label="column.label"
						:type="column.type"
						:header-align="!column.align ? 'center' : column.align"
						:align="!column.align ? 'center' : column.align"
						:prop="column.prop"
						:width="column.width"
						:min-width="column.minWidth || 100"
						:fixed="column.fixed"
						:sortable="!column.sortable ? false : column.sortable"
						:label-class-name="!column.labelClassName ? '' : column.labelClassName"
						:resizable="!column.resizable ? true : column.resizable"
						:show-overflow-tooltip="!column.showOverflowToolTip ? true : column.showOverflowToolTip"
					>
						<template #default="scope">
							<slot v-if="column.slot" :name="column.prop" :row="scope.row"></slot>
							<span v-else>{{ changLang(column, scope) }}</span>
						</template>
					</el-table-column>
				</template>
			</template>

			<!--操作按钮-->
			<template v-if="tableConfig_.showOperation && tableConfig_.options.length > 0">
				<el-table-column
					:width="tableConfig_.operationColumn.style.width || tableConfig_.options.length * 60 + 'px'"
					:label="$t('message.common.operation')"
					:fixed="tableConfig_.operationColumn.attr.fixed || 'right'"
					:header-align="tableConfig_.operationColumn.attr.headerAlign || 'center'"
					:align="tableConfig_.operationColumn.attr.align || 'center'"
					:disabled="tableConfig_.operationColumn.attr.disabled || 'false'"
				>
					<template #default="scope">
						<i v-for="(item, i) in tableConfig_.options" :key="i">
							<!-- 新增formatter函数，给操作按钮置灰功能 -->
							<svg-icon
								v-if="item.formatter && item.formatter(scope.$index, scope.row)"
								:class="['curn', 'disabled']"
								:color="'#C4C7CC'"
								:iconName="item.icon"
								:tipLable="item.tipLable || item.label"
								style="color: #c4c7cc; margin-left: 10px; margin-right: 10px"
							></svg-icon>
							<svg-icon
								v-else
								:class="['curn']"
								:color="item.color || '#5781c1'"
								:iconName="item.icon"
								:tipLable="item.tipLable || item.label"
								style="color: #5781c1; margin-left: 10px; margin-right: 10px"
								@click="item.click(scope.$index, scope.row)"
							></svg-icon>
						</i>
					</template>
				</el-table-column>
			</template>
		</el-table>
	</div>


		<!--分页-->
		<div style="padding: 14px 20px 5px 0px"  class="pagination">
			<!--设置批量删除为true 显示选择框，并且为多选框才会显示-->
			<el-button
				label="批量删除"
				type="danger"
				size="small"
				@click="_handleBatchDelete()"
				v-if="tableConfig_.showBatchDelete && tableConfig_.showChoose && !tableConfig_.singleSelect"
			/>
			<el-pagination
				@size-change="_handleSizeChange"
				@current-change="_refreshPageRequest"
				:current-page="currentPage_"
				:page-sizes="tableConfig_.pageList"
				:page-size="tableConfig_.pageSize"
				background
				layout="total, sizes, prev, pager, next, jumper"
				:total="total_"
			>
			</el-pagination>
		</div>
	</div>
</template>
<script setup lang="ts">
import { reactive, toRefs, onMounted, onUpdated, watch, ref } from 'vue';
import request from '/@/utils/http/request';
import layerUtils from '/@/utils/layerUtils';
import { useI18n } from 'vue-i18n';

const props = defineProps({
	tableConfig: {
		type: Object,
		required: true,
	},
});
const tableRef = ref();
const { t, te } = useI18n({ useScope: 'global' });
const state = reactive({
	screeWidth: document.body.clientWidth, // 屏幕宽度
	tableMaxHeight: 25 * 17,
	tableData: [],
	//表格配置
	tableConfig_: {
		operationColumn: {},
		url: '', //从远程站点请求数据的 URL。
		data: [], //要加载的数据，data有值，不会再从远程站点请求数据
		initLoadFlag: true, //初始时是否加载表格数据，默认加载
		cellClassName: () => {}, // 单元格的 className 的回调方法，也可以使用字符串为所有单元格设置一个固定的 className。function({ row, column, rowIndex, columnIndex }) / string
		treeProps: {},
		rowKey: 'id',
		param: {}, //初始化查询参数
		/*
            {
                label: "显示名称",
                prop: "对应列内容的字段名",
                type: "显示列类型，可选择值：selection/index/expand/edit",
                hidden: "隐藏列，默认false",
                slot: "加载自定义主键，默认false"
            }
            */
		columns: [], //显示字段
		height: '70vh', //表格高度
		stripe: false, //是否为斑马纹，默认false
		border: false, //是否带有纵向边框 false
		fit: true, //列的宽度是否自撑开
		showHeader: true, //是否显示表头
		highlightCurrentRow: false, //是否要高亮当前行
		rowNumbers: false, //行号，默认不显示
		showBatchDelete: false, //是否显示批量删除按钮，默认不显示

		//选择框
		showChoose: false, //是否显示选择框， 默认不显示
		singleSelect: false, //单选，复选，默认复选

		//操作按钮
		showOperation: false, //是否操作按钮，默认不显示
		/*
                具体参考eButton
                {
                    label:"按钮显示名称",
                    click: function(index, row) {} //点击事件
                }
                */
		options: [], //操作按钮列表
		operationStyle: {}, //操作按钮样式
		optionSlot: false, //自定义slot，name为custTableOperation

		//分页参数
		showPagination: true, //是否显示分页
		pageSize: 15, //当设置了showPagination属性为true时，一页显示数据条数
		pageList: [15, 30, 90, 150, 240], //当设置了showPagination属性为true时，一页显示数据条数列表
		defaultSort: {},
	} as any,
	selectionData_: null, //已选中值  单选时为对象，复选时为数组
	currentPage_: 1, //当前页
	total_: 0, //总条数
	loading_: false, //表格加载中
});

const { loading_, total_, currentPage_, selectionData_, tableConfig_, tableData, tableMaxHeight, screeWidth } = toRefs(state);
const emit = defineEmits([
	'handleRadioChange',
	'batchDelete',
	'select',
	'check',
	'check-all',
	'uncheck-all',
	'row-click',
	'row-dblclick',
	'cell-click',
	'cell-dblclick',
	'findPage',
	'Query',
	'uncheck',
]);
// const caLable = (index: any,row: { dataState: number; },label: string) =>{ //通过row中的dataState来自定义操作按钮标签，要求label格式为'dataState,按钮0，按钮1,....',按钮0对应dataState的0值，按钮1对应dataState的1值,.....
//       if(label.indexOf(',')!=-1){
//         let labelTemps = label.split(',');
//         return row.dataState < labelTemps.length ? labelTemps[row.dataState+1] : "";
//       }else{
//         return label;
//       }
//     }

/**
 * 自定义索引
 */
const indexMethod = (index: number) => {
	if (currentPage_.value == 0) {
		return index + 1;
	}
	let res = index + 1 + (currentPage_.value * 1 - 1) * tableConfig_.value.pageSize;
	return res;
};

/**
 * 单选操作
 */
const _handleRadioChange = (value: null) => {
	
	if (value) {
		console.log(value, 'value');
		selectionData_.value = value;
		emit('handleRadioChange', value);
	}
	
};
/**
 * 当前页改变
 */
const _refreshPageRequest = (currentPage: number) => {
	currentPage_.value = currentPage;
	_findPage();
};
/**
 * 每个显示条数发生变化
 */
const _handleSizeChange = (pageSize: number) => {
	currentPage_.value = 1;
	tableConfig_.value.pageSize = pageSize;
	_findPage();
};
/**
 * 批量删除
 */
const _handleBatchDelete = () => {
	emit('batchDelete', { selectList: getCheckedData() });
};
/**
 * 行发生改变时
 */
const _handleSelectionChange = (selection: null) => {
	selectionData_.value = selection;
};
/**
 * 当前行发生改变时
 *
 */
const _handleTableCurrentChange = (value: null) => {
	//有选择框时，当前行发生改变做赋值处理
	if (tableConfig_.value?.showChoose) {
		_handleRadioChange(value)
	}
	selectionData_.value = value;
};
/**
 * 当用户手动勾选数据行的 Checkbox 时触发的事件
 */
const _handleSelect = (selection: any[], row: { __ob__: { dep: { id: any } } }) => {
	emit('select', selection, row);

	//操作行
	let rowList = selection.filter((item: { __ob__: { dep: { id: any } } }) => item?.__ob__?.dep?.id === row?.__ob__?.dep?.id);

	//选中行
	if (rowList.length > 0) {
		emit('check', row);
	}
	//取消行
	else {
		emit('uncheck', row);
	}
};
/**
 * table 全选、取消事件
 */
const _handleSelectAll = (selection: string | any[]) => {
	if (selection.length > 0) {
		emit('check-all', tableData.value);
	} else {
		emit('uncheck-all', tableData.value);
	}
};
/**
 * 行点击事件
 */
const _handleRowClick = (row: any, column: any, event: any) => {
	emit('row-click', row, column, event);
};
/**
 * 行双击事件
 */
const _handleRowDblClick = (row: any, column: any, event: any) => {
	emit('row-dblclick', row, column, event);
};
/**
 * 单元格点击事件
 */
const _handleCellClick = (row: any, column: any, cell: any, event: any) => {
	emit('cell-click', row, column, cell, event);
};
/**
 * 单元格双击事件
 */
const _handleCellDblClick = (row: any, column: any, cell: any, event: any) => {
	emit('cell-dblclick', row, column, cell, event);
};
/**
 * 分页查询
 */
const _findPage = () => {
	//url不存在，不做任何处理
	if (!tableConfig_.value.url) {
		emit('findPage');
		return;
	}

	loading_.value = true;
	//请求参数处理
	let param: any = Object.assign({}, tableConfig_.value.param) || {};
	//不显示分页，则不加分页参数
	if (tableConfig_.value.showPagination) {
		param.startIndex = currentPage_.value;
		param.pageSize = tableConfig_.value.pageSize;
		param.currPage = param.startIndex;
	}
	//请求后端
	request({
		url: tableConfig_.value.url,
		method: 'get',
		params: param,
	})
		.then((result: any) => {
			if(result.code == 0) {
				tableData.value = result.data || [];
				total_.value = result.total;
				loading_.value = false;
				emit('Query');
			}
		}).catch((err) =>{
			
		})
};
/**
 * 获取选中数据
 */
const getCheckedData = () => {
	return selectionData_.value;
};

/**
 * 设置表格选中
 */
const toggleRowSelection = (row: any, selected: any) => {
	//表格数据不存在，不做任何处理
	if (!tableData.value || tableData.value.length == 0) {
		return;
	}

	//单选
	if (tableConfig_.value.showChoose && tableConfig_.value.singleSelect) {
		if (!selected) {
			selectionData_.value = null;
			return;
		}
		//改变选中值
		selectionData_.value = row;
	} else {
		if (row) {
			tableRef.value.clearSelection();
			if (row.length > 0) {
				row.forEach((cur: any) => {
					tableRef.value.toggleRowSelection(cur);
				});
			}
		}
	}
};
/**
 * 搜索
 * @param {Object} param 查询参数
 * @param {Boolean} isReplace 是否覆盖以前，true表示替换，false表示与之前参数合并， 默认false
 */
const find = (param?: {} | undefined, isReplace?: undefined) => {
	currentPage_.value = 1;

	//未传参数
	if (!param) {
		_findPage();
		return;
	}

	if (isReplace) {
		tableConfig_.value.param = param || {};
	} else {
		//合并参数
		tableConfig_.value.param = Object.assign(tableConfig_.value.param, param);
	}

	_findPage();
};

/**
 * 重新加载并刷新表格
 */
const reload = () => {
	find();
};
/**
 * 获取表格数据
 */
const getTableData = () => {
	return tableData.value;
};
/**
 * 设置表格数据
 */
const setTableData = (tableDatas: never[]) => {
	tableData.value = tableDatas;
};
/**
 * 设置表格数据,和总数
 */
const setTable = (result: { data: never[]; total: number }) => {
	tableData.value = result.data || [];
	total_.value = result.total;
	loading_.value = false;
	emit('Query');
};

//自适应
const changeTableMaxHeight = () => {
	let height = document.body.offsetHeight; // 网页可视区域高度
	let offtop: any = document?.getElementById('divTable')?.getBoundingClientRect().top;
	if (tableConfig_.value.height >= 17 * 25) {
		tableMaxHeight.value = height - offtop - 50;
		tableConfig_.value.height = tableMaxHeight.value;
	}
};

//数据国际化
const changLang = (
	col: { formatter: (arg0: any, arg1: any, arg2: any, arg3: any) => any; prop: string | number },
	sp: { row: { [x: string]: any }; $index: any }
) => {
	var value = col.formatter ? col.formatter(sp.row, col, sp.row[col.prop], sp.$index) : sp.row[col.prop];
	var result = value;

	if (te('message.' + value)) {
		result = t('message.' + value);
	}
	return result;
};

onMounted(() => {
	window.onresize = () => {
		changeTableMaxHeight();
	};
	//表格初始化
	//如果存在data数据，直接展示data，不从后端取数据
	if (tableConfig_.value.data && tableConfig_.value.data.length > 0) {
		tableData.value = tableConfig_.value.data;
	} else {
		//表格初始化，是否记载数据
		if (tableConfig_.value.initLoadFlag) {
			_findPage();
		}
	}
});
onUpdated(() => {
	changeTableMaxHeight();
});
watch(tableConfig_.value.data, () => {
	tableData.value = tableConfig_.value.data;
});
state.tableConfig_ = Object.assign(state.tableConfig_, props.tableConfig);

defineExpose({
	find,
	reload,
	getTableData,
	setTableData,
	setTable,
	toggleRowSelection,
	getCheckedData,
});
</script>
<style lang="scss" scoped>
.table-box{
	padding-right: 14px;
	border-right: 1px solid #F0F2F5;
	border-bottom: 1px solid #F0F2F5;
}
::v-deep(.el-table .el-table__header-wrapper ){
	border-radius: 8px 8px 0px 0px !important;
}
.curn {
	cursor: pointer;
}
.disabled {
	cursor: not-allowed;
}
::v-deep(.pagination){
  display: flex;
	flex-direction: row-reverse;
}
::v-deep(.pagination .el-pagination ){
	float: none !important;
	display: flex;
	// flex-direction: row-reverse;
	margin-top: 15px;
}
::v-deep(.cell){
	text-align: center;
}
::v-deep(.el-table){
	--el-table-border-color: #fff;
}
::v-deep(.el-popper.is-dark){
    color: var(--el-text-color-primary) !important;
    background: var(--el-bg-color)  !important;
    border: 1px solid var(--el-text-color-primary)  !important;
}
</style>
