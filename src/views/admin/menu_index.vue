<!--
 * @Author: 曾宇奇
 * @Date: 2021-04-15 14:39:03
 * @LastEditTime: 2022-06-21 15:47:17
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @FilePath: \vue-next-admin\src\views\home\index.vue
-->

<template>
	<div class="menuManagement">
		<el-row class="menu">
			<el-col :span="5">
				<el-form-item label="菜单名称" style="margin-right: 10px">
					<el-input v-model="menuDataForm.menuName" ></el-input>
				</el-form-item>
			</el-col>
			<el-col :span="5" >
				<el-form-item label="状态">
					<el-select  v-model="menuDataForm.menuState">
					<el-option label="停用" value="1"> </el-option>
					<el-option label="启用" value="0"> </el-option>
					<el-option label="全部" value=""> </el-option>
				</el-select>
				</el-form-item>
			</el-col>
			<el-col :span="1">
				<div class="spc-button">
					<svg-icon iconName="search"  tipLable="搜索"  iconSize="15" @click="queryList"></svg-icon>
				</div>
			</el-col>
			<el-col :span="11">
				<div class="spc-button">
					<svg-icon iconName="search"  tipLable="重置"  iconSize="15" @click="reset"></svg-icon>
				</div>
			</el-col>
			<el-col :span="1">
				<el-button  style="right: 16px;" type="primary"  :icon="Plus"  @click="addNew">新增</el-button>
			</el-col>
		</el-row>

		<!-- 新增角色弹窗 -->
		<menu-add ref="menuAdds" @queryList="queryList"></menu-add>
		<!-- 编辑角色弹窗 -->
		<menu-edit ref="menuEdits" @queryList="queryList"></menu-edit>
		<!-- 工厂管理表格 -->
		<n-table ref="indexTable" :tableConfig="menuTableConfig" style="margin-top: 5px"></n-table>
	</div>
</template>

<script setup lang="ts">
import nTable from '/@/components/nTable/index.vue';
import menuAdd from './menu/menu_add.vue';
import menuEdit from './menu/menu_edit.vue';
// 方法
import { delList, findMenuListUrl } from '/@/api/admin/menu';

import { clearFormData } from '/@/utils/jsOptions';
import { reactive, toRefs, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {  Refresh, Search, Plus } from '@element-plus/icons-vue'

const indexTable = ref();
const menuAdds = ref();
const menuEdits = ref();
const state = reactive({
	// 表格配置
	menuTableConfig: {
		url: findMenuListUrl(),
		treeProps: { children: 'children', hasChildren: false }, //树节点
		//表格表头
		columns: [
			{
				prop: 'menuName',
				label: '菜单名称',
				width: 150,
			},
			{
				prop: 'menuUrl',
				label: '菜单路径',
			},
			// {
			//   prop: "addTime",
			//   label: "创建时间"
			// },
			{
				prop: 'addUserId',
				label: '创建人',
			},
			// {
			//   prop: "editTime",
			//   label: "更新时间"
			// },
			{
				prop: 'editUserId',
				label: '更新人',
			},
			{
				prop: 'menuState',
				label: '启用状态',

				formatter(row: any, column: any, cellValue: number, ) {
					return cellValue == 1 ? '停用' : '启用';
				},
			},
			{
				prop: 'menuVisible',
				label: '是否可见',

				formatter(row: any, column: any, cellValue: number, ) {
					return cellValue == 1 ? '不可见' : '可见';
				},
			},
			{
				prop: 'menuIcon',
				label: '菜单图标',
			},
			{
				prop: 'menuSort',
				label: '菜单排序',
			},
			{
				prop: 'remark',
				label: '备注',
			},
		],
		showPagination: false, //是否显示分页
		showOperation: true, //是否显示操作字段
		showBatchDelete: false, //是否批量删除
		rowNumbers: true, //是否显示行数
		//操作按钮列表
		options: [
			{
				type: 'warning',
				label: '编辑',
				icon:'edit',
				click: (index: any, row: { menuState: number; menuVisible: number; parentId: any }) => {
					menuEdits.value.load();
					menuEdits.value.menuDataForm = { ...row };
					menuEdits.value.menuDataForm.children = [];
					if (row.menuState == 1) {
						menuEdits.value.menuDataForm.menuState = false;
					} else {
						menuEdits.value.menuDataForm.menuState = true;
					}
					if (row.menuVisible == 1) {
						menuEdits.value.menuDataForm.menuVisible = false;
					} else {
						menuEdits.value.menuDataForm.menuVisible = true;
					}

					menuEdits.value.getValue(row.parentId);
					menuEdits.value.dialogVisible = true;
				},
			},
			{
				type: 'danger',
				label: '删除',
				icon:'delete',
				click: (index: any, row: any) => {
					ElMessageBox.confirm('确定删除?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
					})
						.then(async () => {
							const res: any = await delList(row.id);
							indexTable.value.reload();
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
	// 菜单新增数据
	menuDataForm: {
		menuName: null, // 菜单名称
		menuState: null, //启用状态
	} as any,
});
const { menuTableConfig, menuDataForm } = toRefs(state);

// 查询
const queryList = async () => {
	indexTable.value.find(state.menuDataForm);
};
// 新增
const addNew = async () => {
	menuAdds.value.load();
	menuAdds.value.initData();
	menuAdds.value.dialogVisible = true;
};
// 重置
const reset = () => {
	// 清空下拉框数据
	state.menuDataForm = clearFormData(state.menuDataForm);
	queryList();
};
</script>

<style lang="scss" scoped>
.menu{
	display: flex;
}
.spc-button{
	width: 32px;
	height: 32px;
}
</style>