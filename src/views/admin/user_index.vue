<template>
	<!-- 用户管理 -->
	<div class="userManagement">
		<!-- 选择框组 -->
		<div class="select_group flex-c">
			<div class="select3 flex-c" style="margin-right: 20px">
				<label for="user">用户:</label>
				<el-input id="user" v-model="userSelectData.userName" placeholder="请输入" size="small"></el-input>
			</div>
			<div class="select3">
				<label>状态:</label>
				<el-select placeholder="请选择" size="small" v-model="userSelectData.userState">
					<el-option label="停用" value="1"> </el-option>
					<el-option label="启用" value="0"> </el-option>
					<el-option label="全部" value="2"> </el-option>
				</el-select>
			</div>

			<div class="select3 flex-c">
				<el-button type="primary" :icon="Search" size="small" @click="queryList(userSelectData)">查询</el-button>
				<el-button type="default" plain :icon="Refresh" size="small" @click="reset">重置</el-button>
			</div>
		</div>
		<!-- 按钮组 -->
		<div class="button_group">
			<el-button type="primary" plain :icon="Plus" size="small" @click="addNew">新增</el-button>
			<!-- <el-button type="info" plain icon="el-icon-upload2" size="small"
        >导入</el-button
      >
      <el-button type="warning" plain icon="el-icon-download" size="small"
        >导出</el-button
      > -->
			<el-button :icon="Setting" size="small" @click="resetPwd" perms="sys_user_resetpwd">重置密码</el-button>
		</div>
		<!-- 新增用户弹窗 -->
		<user-add ref="userAdds"></user-add>
		<!-- 编辑用户弹窗 -->
		<user-edit ref="userEdits"></user-edit>
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
import {  Refresh, Search, Plus, Setting } from '@element-plus/icons-vue'
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
				type: 'danger',
				label: '删除',
				show: -100,
				click: (index: any, row: { userId: any }) => {
					ElMessageBox.confirm('确定删除?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning',
					})
						.then(async () => {
							let idList = [];
							idList.push(row.userId);
							const res = await delList({ idList: idList });
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
const handleRadioChange = ({ userId }) => {
	state.userId = userId;
};
const resetPwd = async () => {
	ElMessageBox.confirm('确定重置密码?', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
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
	margin-right: 20px;
}
</style>
