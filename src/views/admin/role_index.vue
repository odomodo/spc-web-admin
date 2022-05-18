<template>
	<!-- 角色管理 -->
	<div class="role">
		<!-- 选择框组 -->
		<div class="select_group flex-c">
			<div class="select1">
				<label>类型:</label>
				<el-select placeholder="请选择" size="small" v-model="roleSelectData.roleType">
					<el-option label="系统管理员" value="0"> </el-option>
					<el-option label="工厂管理员" value="1"> </el-option>
				</el-select>
			</div>
			<div class="select2 flex-c" style="margin-right: 20px">
				<label for="role">角色:</label>
				<el-input id="role" v-model="roleSelectData.roleName" placeholder="请输入" size="small"></el-input>
			</div>
			<div class="select3">
				<label>状态:</label>
				<el-select placeholder="请选择" size="small" v-model="roleSelectData.roleState">
					<el-option label="停用" value="1"> </el-option>
					<el-option label="启用" value="0"> </el-option>
				</el-select>
			</div>

			<div class="select3 flex-c">
				<el-button type="primary" :icon="Search" size="small" @click="queryList()">查询</el-button>

				<el-button type="default" plain :icon="Refresh" size="small" @click="reset">重置</el-button>
			</div>
		</div>
		<!-- 按钮组 -->
		<div class="button_group">
			<el-button type="success" plain :icon="Plus" size="small" @click="addNew">新增</el-button>

			<!-- <el-button type="info" plain icon="el-icon-upload2" size="small"
        >导入</el-button
      >
      <el-button type="warning" plain icon="el-icon-download" size="small"
        >导出</el-button
      > -->
			<el-button type="primary" :icon="User" size="small" @click="setRole">角色用户</el-button>
		</div>
		<!-- 弹框 用户角色分配表格 -->
		<el-dialog :title="dialogTitle" v-model="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" width="80%">
			<div class="dialog_role_management" v-if="dialogTitle === '角色用户管理'">
				<div class="flex-c-c">
					<div class="w-100">
						<div class="role_table_group flex-c">
							<div style="width: 50%">
								<div class="role_button_group flex-c">
									<section class="flex-c">
										<label class="lable" style="margin: 0 10px; width: 36px">用户</label>
										<el-input placeholder="请输入用户" size="small" v-model="dialogFromData.name"></el-input>
									</section>
									<el-button type="primary" plain size="small" @click="dialogQuery" style="margin-left: 10px">查询</el-button>
									<el-button type="default" plain size="small" @click="dialogReset">重置</el-button>
								</div>
								<n-table ref="selectUsersTable" :tableConfig="selectUsersTableConfig" class="roleUserBindClass"></n-table>
							</div>
							<div class="transfer_arrow h-100">
								<el-button type="success" plain :icon="ArrowRight" size="small" @click="userToRight()">添加</el-button>
								<el-button type="danger" plain :icon="ArrowLeft" size="small" class="del" @click="userToLeft()">移除</el-button>
							</div>
							<div style="width: 50%">
								<div class="role_button_group flex-c">
									<section class="flex-c">
										<label class="lable" style="margin: 0 10px; width: 36px">用户</label>
										<el-input placeholder="请输入用户" size="small" v-model="selectdDataFrom.userId"></el-input>
									</section>
									<el-button type="primary" plain size="small" @click="dialogdQuery" style="margin-left: 10px">查询</el-button>
									<el-button type="default" plain size="small" @click="dialogdReset">重置</el-button>
								</div>
								<n-table ref="selectedUsersTable" :tableConfig="selectedUsersTableConfig" class="roleUserBindClass"></n-table>
							</div>
						</div>
						<div class="role_options_group flex-c-c" style="margin-top: 20px; margin-bottom: 20px">
							<el-button type="primary" size="small" @click="save">保存</el-button>
							<el-button type="primary" size="small" @click="cancel">取消</el-button>
						</div>
					</div>
				</div>
			</div>
		</el-dialog>
		<!-- 新增角色弹窗 -->
		<role-add ref="roleAdds"></role-add>
		<!-- 编辑角色弹窗 -->
		<role-edit ref="roleEdits"></role-edit>
		<!-- 角色表格 -->
		<section class="flex">
			<!-- 角色管理表格 -->
			<n-table ref="indexTable" :tableConfig="roleTableConfig" @handleRadioChange="showUsers" style="margin: 5px 10px 0 0; width: 75vw" border>
			</n-table>
			<!-- 联动管理表格 -->
			<n-table ref="userTable" :tableConfig="roleLinkageTableConfig" style="margin-top: 5px; width: 25vw" class="roleLinkageTableConfigClass" border>
			</n-table>
		</section>
	</div>
</template>
<script setup lang="ts">
import nTable from '/@/components/nTable/index.vue';
import roleAdd from './role/role_add.vue';
import roleEdit from './role/role_edit.vue';
// 方法
import { getRoleListUrl, delList, saveRoleUser } from '/@/api/admin/role';
import {  Refresh, Search, Plus } from '@element-plus/icons-vue'
import { getUsersByRoleCodeUrl } from '/@/api/consturl';

import { getUsersByRoleCode, getUserList } from '/@/api/admin/user';

import { clearFormData } from '/@/utils/jsOptions';
import { reactive, toRefs, ref, nextTick,  } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ArrowRight,ArrowLeft, User } from '@element-plus/icons-vue';

const roleAdds = ref();
const indexTable = ref();
const roleEdits = ref();
const selectedUsersTable = ref();
const selectUsersTable = ref();
const userTable = ref();
const state = reactive({
	dialogFromData: {
		name: null,
	},
	selectUsersTableData: [],
	selectedUsersTableData: [],
	dialogVisible: false, //是否展示对话框
	dialogTitle: '角色用户管理', //对话框标题
	// 角色表格配置
	roleTableConfig: {
		url: getRoleListUrl(),
		//表格表头
		columns: [
			{
				prop: 'roleCode',
				label: '角色编码',
				minWidth: 200,
			},
			{
				prop: 'roleName',
				label: '角色名称',
				minWidth: 200,
			},
			{
				prop: 'roleState',
				label: '状态',
				minWidth: 60,
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
				minWidth: 80,
			},
			{
				prop: 'editTime',
				label: '更新时间',
				minWidth: 150,
			},
			{
				prop: 'editUserId',
				label: '更新人',
				//slot: true,
				minWidth: 80,
			},
		],
		highlightCurrentRow: true, //是否要高亮当前行
		showChoose: true, //是否显示选择框， 默认不显示
		// rowNumbers: true,
		showOperation: true, //是否显示操作字段
		singleSelect: true, //单选，复选，默认复选
		//操作按钮列表
		options: [
			{
				type: 'success',
				label: '编辑',
				icon:'edit',
				click: (index: any, row: any) => {
					let roleData = { ...row };
					if (roleData.roleState == 0) {
						roleData.roleState = true;
					} else if (roleData.roleState == 1) {
						roleData.roleState = false;
					}
					roleEdits.value.roleDataForm = roleData;
					roleEdits.value.dialogVisible = true;
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
							userTable.value.reload();
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
	// 角色联动表格配置
	roleLinkageTableConfig: {
		url: getUsersByRoleCodeUrl(),
		//表格表头
		columns: [
			{
				prop: 'userId',
				label: '用户账号',
				minWidth: 100,
			},
			{
				prop: 'userName',
				label: '用户名称',
				minWidth: 100,
			},
		],
		initLoadFlag: false, //初始时是否加载表格数据，默认加载
		showOperation: false, //是否显示操作字段
		//操作按钮列表
		options: [
			{
				type: 'success',
				label: '编辑',
			},
			{
				type: 'danger',
				label: '删除',
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
	// 待选择的用户列表
	selectUsersTableConfig: {
		//表格表头
		columns: [
			// {
			//   prop: "deptName",
			//   label: "部门",
			//   minWidth: 70
			// },
			{
				prop: 'userId',
				label: '用户账号',
				minWidth: 70,
			},
			{
				prop: 'userName',
				label: '用户名称',
				minWidth: 70,
			},
			// {
			//   prop: "employeeNo",
			//   label: "员工工号",
			//   minWidth: 70
			// }
		],
		height: '550px',
		data: [],
		initLoadFlag: false, //初始时是否加载表格数据，默认加载
		showChoose: true, //是否显示选择框， 默认不显示
		showPagination: false, //分页
	},
	selectedUsersTableConfig: {
		columns: [
			// {
			//   prop: "deptName",
			//   label: "部门",
			//   minWidth: 70
			// },
			{
				prop: 'userId',
				label: '用户账号',
				minWidth: 70,
			},
			{
				prop: 'userName',
				label: '用户名称',
				minWidth: 70,
			},
			// {
			//   prop: "employeeNo",
			//   label: "员工工号",
			//   minWidth: 70
			// }
		],
		height: '550px',
		data: [],
		initLoadFlag: false, //初始时是否加载表格数据，默认加载
		showChoose: true, //是否显示选择框， 默认不显示
		showPagination: false, //分页
	} as any,
	// 角色选择下拉框值
	roleSelectData: {
		roleType: '', //类型
		roleName: '', //角色
		roleState: '', //状态
	},
	// 角色用户管理下拉框值
	roleUserManagementData: {
		deptName: '',
		userName: '',
	},
	// 角色新增数据
	roleDataForm: {
		roleCode: '', //角色编码
		roleName: '', //角色名称
		roleType: '', //角色类型
		roleState: '', //角色状态
		description: '', //角色描述
		remark: '', //角色备注
	},
	// 选中的角色
	roleSelected: {
		roleCode: '', // 当前选中行的角色
		id: '',
	},
	// 角色总数据
	userListData: [],
	selectdDataFrom: {
		userId: null,
	},
});
const {
	dialogVisible,
	selectedUsersTableData,
	selectUsersTableData,
	selectdDataFrom,
	userListData,
	roleSelected,
	roleDataForm,
	roleUserManagementData,
	roleSelectData,
	selectedUsersTableConfig,
	selectUsersTableConfig,
	roleLinkageTableConfig,
	roleTableConfig,
	dialogTitle,
	dialogFromData,
} = toRefs(state);

// 新增
const addNew = () => {
	roleAdds.value.dialogVisible = true;
	roleAdds.value.roleDataForm = clearFormData(roleAdds.value.roleDataForm);
	roleAdds.value.roleDataForm.roleState = true;
};
// 查询
const queryList = async () => {
	indexTable.value.find(roleSelectData.value);
};
// 重置
const reset = () => {
	clearFormData(roleSelectData.value);
	queryList();
};
// 打开角色用户弹框
const setRole = async (queryData: {} | undefined) => {
	let checkedData = indexTable.value.getCheckedData();
	if (checkedData == null) {
		return ElMessage({ message: '请选择角色', type: 'error' });
	}
	let selectUsersData = (await getUserList(queryData)).data;
	// 已选择table数据
	let existData = (await getUsersByRoleCode({ roleCode: checkedData.roleCode })).data;
	selectedUsersTableConfig.value.data = existData;
	// 去除掉相同数据
	let arrIdList = existData.map((x: { userId: any }) => x.userId);
	state.selectUsersTableConfig.data = selectUsersData.filter((x: any) => !arrIdList.includes(x.userId));

	state.dialogVisible = true;
	nextTick(() => {
		selectedUsersTable.value.setTableData(existData);
		state.userListData = existData;
		selectUsersTable.value.setTableData(state.selectUsersTableConfig.data);
	});
};
// 保存
const save = async () => {
	let roleUserList: any[] = [];
	state.userListData.forEach((object: any) => {
		roleUserList.push({ userId: object.userId });
	});
	let data = {
		id: indexTable.value.getCheckedData().id,
		roleUserList: roleUserList,
	};
	const res: any = await saveRoleUser(data);
	if (res.code == 0) {
		ElMessage({
			message: res.msg,
			type: 'success',
			duration: 1500,
		});
		showUsers();
		state.dialogVisible = false;
	} else {
		ElMessage({
			message: res.msg,
			type: 'error',
			duration: 3000,
		});
	}
};
// 取消
const cancel = () => {
	state.dialogVisible = false;
};
// 显示指定角色的用户
const showUsers = async () => {
	let checkedData = indexTable.value.getCheckedData();
	userTable.value.find({ roleCode: checkedData.roleCode });
};
// 角色用户 添加
const userToRight = () => {
	selectUsersTable.value.getCheckedData().forEach((object: any) => {
		state.selectedUsersTableConfig.data.push(object);
	});

	let arrIdList = state.selectedUsersTableConfig.data.map((x: any) => x.userId);
	state.selectUsersTableConfig.data = state.selectUsersTableConfig.data.filter((x: any) => !arrIdList.includes(x.userId));
	selectedUsersTable.value.setTableData(state.selectedUsersTableConfig.data);
	selectUsersTable.value.setTableData(state.selectUsersTableConfig.data);
};
// 角色用户 移除
const userToLeft = () => {
	selectedUsersTable.value.getCheckedData().forEach((object: any) => {
		state.selectUsersTableConfig.data.push(object);
	});
	let arrIdList = state.selectUsersTableConfig.data.map((x: any) => x.userId);
	state.userListData = state.userListData.filter((x) => !arrIdList.includes(x.userId));
	state.selectedUsersTableConfig.data = state.selectedUsersTableConfig.data.filter((x) => !arrIdList.includes(x.userId));
	selectedUsersTable.value.setTableData(state.selectedUsersTableConfig.data);
	selectUsersTable.value.setTableData(state.selectUsersTableConfig.data);
};
const dialogQuery = async () => {
	let checkedData = indexTable.value.getCheckedData();
	if (checkedData == null) {
		return ElMessage({ message: '请选择角色', type: 'error' });
	}
	let selectUsersData = (await getUserList(state.dialogFromData)).data;
	// 已选择table数据
	// 去除掉相同数据
	let arrIdList = state.userListData.map((x) => x.userId);
	state.selectUsersTableConfig.data = selectUsersData.filter((x: { userId: any }) => !arrIdList.includes(x.userId));
	nextTick(() => {
		selectUsersTable.value.setTableData(state.selectUsersTableConfig.data);
	});
};
const dialogReset = () => {
	state.dialogFromData.name = null;
	dialogQuery();
};
const dialogdQuery = () => {
	if (state.userListData == [] || state.userListData.length == 0) {
		return;
	}
	if (state.selectdDataFrom.userId == null || state.selectdDataFrom.userId == '') {
		return;
	}
	let data: never[] = [];
	state.userListData.forEach((element) => {
		if (element.userId.includes(state.selectdDataFrom.userId)) {
			data.push(element);
		}
	});
	selectedUsersTable.value.setTableData(data);
};
const dialogdReset = () => {
	state.selectdDataFrom.userId = null;
	selectedUsersTable.value.setTableData(state.userListData);
};
</script>

// 自定义样式
<style lang="scss" scoped>
// 公共样式
.required {
	color: red;
}

.role {
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
	.role_button_group {
		margin-bottom: 10px;
		& section:nth-child(2) {
			margin-right: 10px;
		}
	}
	.role_table_group {
		.transfer_arrow {
			display: block;
			flex-direction: column;
			.del {
				margin: 20px 0 0 0;
			}
		}
	}
}
</style>

// 第三方样式
<style lang="scss" scoped>
>>> .el-input__inner {
	border-radius: 4px;
}
>>> .el-row {
	display: flex;
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
>>> .el-table__fixed::before,
>>> .el-table__fixed-right::before {
	position: fixed;
}

>>> .roleLinkageTableConfigClass .el-table .el-table__body .cell {
	line-height: 22px;
}
</style>
