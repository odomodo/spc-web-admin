<!--
 * @Author: 曾宇奇
 * @Date: 2021-04-15 14:39:03
 * @LastEditTime: 2022-07-20 10:47:20
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @FilePath: \vue-next-admin\src\views\home\index.vue
-->

<template>
	<!-- 用户管理 -->
	<div class="userManagement">
		<!-- 选择框组 -->
		<div class="select_group flex-c">
			<div class="select3 flex-c" style="margin-right: 20px">
				<label for="user">用户名称/编号:</label>
				<el-input id="user" v-model="userSelectData.userName" placeholder="请输入" onfocus="this.removeAttribute('readonly');"></el-input>
			</div>
			<div class="select3">
				<label>状态:</label>
				<el-select placeholder="请选择" v-model="userSelectData.userState">
					<el-option label="停用" value="1"> </el-option>
					<el-option label="启用" value="0"> </el-option>
					<el-option label="全部" value="2"> </el-option>
				</el-select>
			</div>

			<div class="select3 flex-c">
				<div class="spc-button">
					<svg-icon iconName="search_icon"  tipLable="搜索"  iconSize="10" @click="queryList(userSelectData)"></svg-icon>
				</div>
				<div class="spc-button">
					<svg-icon iconName="重置_icon"  tipLable="重置"  iconSize="10" @click="reset"></svg-icon>
				</div>
				<div class="spc-right" style="right: 16px;">
					<el-button type="primary" :icon="Plus" @click="addNew">新增</el-button>
					<!-- <el-button type="info" plain icon="el-icon-upload2" 
        >导入</el-button
      >
      <el-button type="warning" plain icon="el-icon-download" 
        >导出</el-button
      > -->
					<el-button :icon="Setting"  @click="resetPwd" perms="sys_user_resetpwd">重置密码</el-button>
				</div>
			</div>
		</div>
		<!-- 按钮组 -->

		<!-- 新增用户弹窗 -->
		<user-add ref="userAdds" @queryList="queryList"></user-add>
		<!-- 编辑用户弹窗 -->
		<user-edit ref="userEdits" @queryList="queryList"></user-edit>
		<!-- 用户管理表格 -->
		<n-table ref="indexTable" :tableConfig="userTableConfig" style="margin-top: 5px" border @handleRadioChange="handleRadioChange"> </n-table>
	</div>
</template>
<script setup lang="ts">
import nTable from '/@/components/nTable/index.vue';
import userAdd from './user/user_add.vue';
import userEdit from './user/user_edit.vue';
// 方法
import { delList, getAdminList, resetUserPwd } from '/@/api/admin/user';
import { Refresh, Search, Plus, Setting } from '@element-plus/icons-vue';
import { clearFormData } from '/@/utils/jsOptions';

import { reactive, toRefs, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';

const userAdds: any = ref();
const userEdits = ref();
const indexTable = ref();
const state = reactive({
	// 用户表格配置
	userTableConfig: {
		height: '550px',
		url: getAdminList(),
		//表格表头
		columns: [
			{
				prop: 'userId',
				label: '用户账号',
				minWidth: 150,
			},
			{
				prop: 'userName',
				label: '用户名称',
				minWidth: 150,
			},
			{
				prop: 'roleName',
				label: '所属角色',
				minWidth: 150,
			},
			{
				prop: 'factoryName',
				label: '所属工厂',
				minWidth: 150,
			},
			{
				prop: 'contactWay',
				label: '联系方式',
				minWidth: 150,
			},
			{
				prop: 'userState',
				label: '状态',

				formatter(row: any, column: any, cellValue: number, index: any) {
					return cellValue == 1 ? '停用' : '启用';
				},
			},
			// {
			//   prop: "addTime",
			//   label: "创建时间",
			//   minWidth: 150
			// },
			{
				prop: 'addUserId',
				label: '创建人',
				minWidth: 150,
			},
			// {
			//   prop: "editTime",
			//   label: "更新时间",
			//   minWidth: 150
			// },
			{
				prop: 'editUserId',
				label: '更新人',
				minWidth: 150,
			},
		],
		showOperation: true, //是否显示操作字段
		showChoose: true, //是否显示选择框， 默认不显示
		singleSelect: true,
		rowNumbers: true, //是否显示行数
		showBatchDelete: false, //是否批量删除
		//操作按钮列表
		options: [
			{
				type: 'success',
				label: '编辑',
				icon: 'edit',
				show: -100,
				click: (index: any, row: { userState: number; factoryCode: string | null }) => {
					userEdits.value.userDataForm = { ...row };
					userEdits.value.dialogVisible = true;
					if (row.userState == 1) {
						userEdits.value.userDataForm.userState = false;
					} else {
						userEdits.value.userDataForm.userState = true;
					}
					if (row.factoryCode != null && row.factoryCode.indexOf(',')) {
						userEdits.value.userDataForm.factoryList = row.factoryCode.split(',');
					} else {
						userEdits.value.userDataForm.factoryList = row.factoryCode;
					}
					userEdits.value.getDnList();
				},
			},
			{
				type: 'success',
				label: '查看',
				icon: 'show',
				show: -100,
				click: (index: any, row: { userState: number; factoryCode: string | null }) => {
					userEdits.value.userDataForm = { ...row };
					userEdits.value.dialogVisible = true;
					if (row.userState == 1) {
						userEdits.value.userDataForm.userState = false;
					} else {
						userEdits.value.userDataForm.userState = true;
					}
					if (row.factoryCode != null && row.factoryCode.indexOf(',')) {
						userEdits.value.userDataForm.factoryList = row.factoryCode.split(',');
					} else {
						userEdits.value.userDataForm.factoryList = row.factoryCode;
					}
					userEdits.value.getDnList();
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
	// 用户选择下拉框值
	userSelectData: {
		userName: null, //用户
		userState: null, //状态
	} as any,
	userId: '',
});

const { userId, userSelectData, userTableConfig } = toRefs(state);

// 查询
const queryList = (userSelectData?: undefined) => {
	indexTable.value.find(userSelectData);
};
// 新增
const addNew = () => {
	userAdds.value.dialogVisible = true;
	userAdds.value.getFactoryList();
	userAdds.value.userDataForm = clearFormData(userAdds.value.userDataForm);
	//this.$refs.userAdd.userDataForm = {};
	userAdds.value.userDataForm.userState = true;
};
// 重置
const reset = () => {
	// 清空下拉框数据
	state.userSelectData = clearFormData(state.userSelectData);
	queryList();
};
const handleRadioChange = ({ userId }:any) => {
	state.userId = userId;
};
const resetPwd = async () => {
	ElMessageBox.confirm('确定重置密码?', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
	})
		.then(async () => {
			const res: any = await resetUserPwd(state.userId);
			if (res.code == 0) {
				ElMessage({
					type: 'success',
					message: res.msg,
				});
				indexTable.value.reload();
			} else {
				ElMessage({
					message: res.msg,
					type: 'error',
					duration: 3000,
				});
			}
		})
		.catch(() => {
			ElMessage({
				type: 'info',
				message: '已取消重置',
			});
		});
};
</script>

<style lang="scss" scoped>
// 页面公共样式
.required {
	color: red;
}
.userManagement {
	background-color: #fff;
	.button_group {
		margin-top: 5px;
		padding-left: 20px;
	}
	.select_group {
		padding: 10px 0 0 20px;
		label {
			width: 45px;
			margin-right: 10px;
			font-size: 13px;
			color: #606266;
		}
	}
}
</style>

<style lang="scss" scoped>
::v-deep .el-input__inner {
	border-radius: 4px;
}
::v-deep .el-table th.is-leaf {
	border-bottom: 2px solid #ebeef5;
}
::v-deep .el-row {
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
::v-deep(input:-webkit-autofill) {
  box-shadow: 0 0 0px 1000px #c7c6c6 inset !important;
  // -webkit-text-fill-color: #ededed !important;
  -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
  background-color: transparent;
  background-image: none;
  transition: background-color 50000s ease-in-out 0s;
}
</style>
