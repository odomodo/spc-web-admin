<!--
 * @Author: 曾宇奇
 * @Date: 2021-04-15 14:39:03
 * @LastEditTime: 2022-04-20 13:32:31
 * @LastEditors: zhuangxingguo
 * @FilePath: \vue-next-admin\src\views\home\index.vue
-->

<template>
	<div class="menuManagement">
		<!-- 选择框组 -->
		<div class="select_group flex-c">
			<div class="select3 flex-c" style="margin-right: 10px">
				<label for="user">菜单名称:</label>
				<el-input v-model="menuDataForm.menuName" ></el-input>
			</div>
			<div class="select3">
				<label>状态:</label>
				<el-select  v-model="menuDataForm.menuState">
					<el-option label="停用" value="1"> </el-option>
					<el-option label="启用" value="0"> </el-option>
					<el-option label="全部" value=""> </el-option>
				</el-select>
			</div>

			<div class="select3 flex-c">
			<div class="spc-button">
					<svg-icon iconName="search" iconSize="15" @click="queryList"></svg-icon>
				</div>
				<div class="spc-button">
					<svg-icon iconName="refresh" iconSize="15" @click="reset"></svg-icon>
				</div>
			</div>
				<el-button class="spc-right" style="right: 16px;" type="primary"  :icon="Plus"  @click="addNew">新增</el-button>
		</div>
		<!-- 按钮组 -->
		<div class="button_group">
			

			<!-- <el-button type="info" plain icon="el-icon-upload2" 
        >导入</el-button
      >
      <el-button type="warning" plain icon="el-icon-download" 
        >导出</el-button
      > -->
		</div>
		<!-- 新增角色弹窗 -->
		<menu-add ref="menuAdds"></menu-add>
		<!-- 编辑角色弹窗 -->
		<menu-edit ref="menuEdits"></menu-edit>
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
							const res: any = await delList(row);
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
// 页面公共样式
.required {
	color: red;
}
.menuManagement {
	background-color: #fff;
	.button_group {
		margin-top: 5px;
		padding-left: 20px;
	}
	.select_group {
		padding: 10px 0 0 20px;
		label {
			width: 80px;
			margin-right: 10px;
			font-size: 13px;
			color: #606266;
		}
	}
}
</style>

// 第三方样式
<style lang="scss" scoped>
>>> .el-input__inner {
	border-radius: 4px;
}
>>> .el-table th.is-leaf {
	border-bottom: 2px solid #ebeef5;
}
>>> .el-row {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-start;
	margin-bottom: 15px;
	.el-col {
		text-align: right;
		padding-right: 20px;
	}
}
.el-select {
	margin-right: 3px;
}
</style>
