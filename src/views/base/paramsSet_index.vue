<template>
	<el-row class="params_set">
		<el-col :span="13" class="params_set_parent">
			<!-- 编码搜索 -->
			<el-row class="parent_code" type="flex" align="center">
				<el-col :span="12" class="flex flex-c">
					<label style="width: 50px">编号：</label>
					<el-input autocomplete="off" v-model="parentDataCode" size="small"></el-input>
				</el-col>
				<el-col :span="10" :push="2" class="flex flex-c">
					<el-button type="primary" :icon="Search" size="small" @click="queryList('parent','', parentDataCode)">搜索</el-button>
					<el-button type="default" plain :icon="Refresh" size="small" @click="reset('parent')">重置</el-button>
				</el-col>
			</el-row>
			<!-- 按钮组 -->
			<div class="button_group">
				<el-button type="success" plain :icon="Plus" size="small" @click="addNewParent" perms="params_set_add">新增</el-button>
			</div>
			<!-- 新增父配置弹窗 -->
			<paramsSet-parent-add ref="paramsSetParentAdds" @queryList="queryList('parent','','')"></paramsSet-parent-add>
			<!-- 编辑父配置弹窗 -->
			<paramsSet-parent-edit ref="paramsSetParentEdits" @queryList="queryList('parent','','')"></paramsSet-parent-edit>
			<!-- 父配置表格 -->
			<n-table ref="parent" :tableConfig="parentTableConfig" @handleRadioChange="handleRadioChange" style="margin-top: 5px"></n-table>
		</el-col>
		<el-col :span="10" :push="1" class="params_set_child">
			<!-- 编码搜索 -->
			<el-row class="child_code" type="flex" align="center">
				<el-col :span="12" class="flex flex-c">
					<label style="width: 65px">子编号：</label>
					<el-input autocomplete="off" v-model="childDataCode" size="small"></el-input>
				</el-col>
				<el-col :span="10" :push="2" class="flex flex-c">
					<el-button type="primary" :icon="Search" size="small" @click="queryList('child', false, childDataCode)">搜索</el-button>
					<el-button type="default" plain :icon="Refresh" size="small" @click="reset('child')">重置</el-button>
				</el-col>
			</el-row>
			<!-- 按钮组 -->
			<div class="button_group">
				<el-button type="success" plain :icon="Plus" size="small" @click="addNewChild" perms="params_set_item_add" :disabled="isdisable"
					>新增</el-button
				>
			</div>
			<!-- 新增子配置弹窗 -->
			<paramsSet-child-add ref="paramsSetChildAdds" @queryList="queryList('child','','')" :params="params"></paramsSet-child-add>
			<!-- 编辑子配置弹窗 -->
			<paramsSet-child-edit ref="paramsSetChildEdits" @queryList="queryList('child','','')"></paramsSet-child-edit>
			<!-- 子配置表格 -->
			<n-table ref="child" :tableConfig="childTableConfig" style="margin-top: 5px"></n-table>
		</el-col>
	</el-row>
</template>

<script setup lang="ts">
import nTable from '/@/components/nTable/index.vue';
import paramsSetParentAdd from './paramsSet/paramsSet_parent_add.vue';
import paramsSetParentEdit from './paramsSet/paramsSet_parent_edit.vue';
import paramsSetChildAdd from './paramsSet/paramsSet_child_add.vue';
import paramsSetChildEdit from './paramsSet/paramsSet_child_edit.vue';
import {  Refresh, Search, Plus } from '@element-plus/icons-vue'
// 方法
import { getParamsListUrl, delList } from '/@/api/admin/paramsSet';
import { resizeForm } from '/@/utils/jsOptions';

import { reactive, toRefs, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

const parent = ref();
const child = ref();
const paramsSetParentAdds = ref();
const paramsSetChildAdds = ref();
const paramsSetParentEdits = ref();
const paramsSetChildEdits = ref();

const state = reactive({
	parentDataCode: '', //父数据编号
	childDataCode: '', //子数据编号
	// 父表格配置
	parentTableConfig: {
		height: '70vh',
		url: getParamsListUrl('parent'),
		//表格表头
		columns: [
			{
				prop: 'dataType',
				label: '数据类型',
				formatter(row: any, column: any, cellValue: number,) {
					return cellValue == 0 ? '系统类型' : '业务类型';
				},
			},
			// {
			//   prop: "factoryCode",
			//   label: "工厂代码"
			// },
			{
				prop: 'dataCode',
				label: '数据编号',
			},
			{
				prop: 'dataName',
				label: '名称',
			},
			{
				prop: 'parentCode',
				label: '上级编号',
			},

			{
				prop: 'addUserId',
				label: '创建人',
			},
			// {
			//   prop: "addTime",
			//   label: "创建时间"
			// },

			{
				prop: 'editUserId',
				label: '更新人',
			},
			// {
			//   prop: "editTime",
			//   label: "更新时间"
			// }
		],
		showOperation: true, //是否显示操作字段
		//rowNumbers: true, //是否显示行数
		showPagination: true, //分页
		showChoose: true, //是否显示选择框， 默认不显示
		singleSelect: true, //单选，复选，默认复选
		//操作按钮列表
		options: [
			{
				type: 'success',
				label: '编辑',
				perms: 'params_set_edit',
				click: (index: any, row: any) => {
					paramsSetParentEdits.value.paramsDataForm = { ...row };
					paramsSetParentEdits.value.queryDnData();
					paramsSetParentEdits.value.dialogVisible = true;
				},
			},
			{
				type: 'danger',
				label: '删除',
				perms: 'params_set_delete',
				click: (index: any, row: { id: any }) => {
					ElMessageBox.confirm('确定删除?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
					})
						.then(async () => {
							const res: any = await delList('parent', row.id);
							queryList('parent','','');
							ElMessage({
								type: 'success',
								message: res.msg,
							});
						})
						.catch(() => {
							ElMessage({
								type: 'info',
								message: '已取消删除',
							});
						});
				},
			},
		],
		//操作按钮样式
		operationColumn: {
			// 样式
			style: {},
			// 属性
			attr: {},
		},
	},
	// 子表格配置
	childTableConfig: {
		height: '70vh',
		url: getParamsListUrl('child'),
		initLoadFlag: false, // 初始不渲染表格
		data: [],
		//表格表头
		columns: [
			{
				prop: 'valueCode',
				label: '编号',
				minWidth: 150,
			},
			{
				prop: 'valueName',
				label: '名称',
				minWidth: 150,
			},
			{
				prop: 'valueSort',
				label: '排序',
				minWidth: 150,
			},
		],
		showOperation: true, //是否显示操作字段
		rowNumbers: true, //是否显示行数
		showPagination: true, //分页
		//操作按钮列表
		options: [
			{
				type: 'success',
				label: '编辑',
				perms: 'params_set_item_edit',
				click: (index: any, row: any) => {
					paramsSetChildEdits.value.paramsDataForm = { ...row };
					paramsSetChildEdits.value.dialogVisible = true;
				},
			},
			{
				type: 'danger',
				label: '删除',
				perms: 'params_set_item_delete',
				click: (index: any, row: { id: any }) => {
					ElMessageBox.confirm('确定删除?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
					})
						.then(async () => {
							const res = await delList('child', row.id);
							queryList('child','','');
							ElMessage({
								type: 'success',
								message: res.msg,
							});
						})
						.catch(() => {
							ElMessage({
								type: 'info',
								message: '已取消删除',
							});
						});
				},
			},
		],
		//操作按钮样式
		operationColumn: {
			// 样式
			style: {},
			// 属性
			attr: {},
		},
	},
	isdisable: true, //是否禁用子表格
	params: {}, //父表格传子表格参数
});
const { parentDataCode, childDataCode, parentTableConfig, childTableConfig, isdisable, params } = toRefs(state);

// 父表格单选点击
const handleRadioChange = (v: { dataCode: any; id: any; factoryCode: any }) => {
	state.childDataCode = '';
	queryList('child', v.dataCode, 'change');
	state.params = {
		dataTypeId: v.id,
		dataTypeCode: v.dataCode,
		factoryCode: v.factoryCode,
	};
	state.isdisable = false;
};
// 根据数据编号查询列表
const queryList = (type: string, code: string | boolean, name: string | null | undefined) => {
	if (name == 'change') name = null;

	type == 'parent' ? parent.value.find({ code }) : arguments[1] ? child.value.find({ code, name }) : child.value.find({ name });
};
// 父新增
const addNewParent = async () => {
	paramsSetParentAdds.value.dialogVisible = true;
	paramsSetParentAdds.value.paramsDataForm = resizeForm.call(paramsSetParentAdds.value, 'paramsDataForm');
	paramsSetParentAdds.value.queryDnData();
};
// 子新增
const addNewChild = async () => {
	paramsSetChildAdds.value.dialogVisible = true;
	paramsSetChildAdds.value.paramsDataForm = resizeForm.call(paramsSetChildAdds.value, 'paramsDataForm');
};
// 重置
const reset = (type: string) => {
	if (type == 'parent') {
		state.parentDataCode = resizeForm.call(state, 'parentDataCode');
		queryList('parent','','');
	} else {
		state.childDataCode = resizeForm.call(state, 'childDataCode');
		queryList('child','','');
	}
};
</script>
