<!--
 * @Author: 曾宇奇
 * @Date: 2021-04-15 14:39:03
 * @LastEditTime: 2022-07-28 17:13:05
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @FilePath: \vue-next-admin\src\views\home\index.vue
-->

<template>
	<!-- 角色管理 -->
	<div class="role">
		<div class="select_group df aic jcsb mb20" style="padding-right: 14px">
			<div class="df aic">
				<div class="select3 flex-c" style="margin-right: 15px">
					<label for="user" style="width: 130px">角色名称/编号</label>
					<el-input id="user" v-model="roleSelectData.roleName" placeholder="请输入"></el-input>
				</div>
				<div class="select3" style="margin-right: 5px">
					<label>状态</label>
					<el-select placeholder="请选择" v-model="roleSelectData.roleState">
						<el-option label="停用" value="1"> </el-option>
						<el-option label="启用" value="0"> </el-option>
					</el-select>
				</div>
				<div class="spc-button" style="margin-right: 5px"  @click="queryList">
					<svg-icon  iconName="search_icon"  tipLable="搜索"  iconSize="10"></svg-icon>
				</div>
				<div class="spc-button" @click="reset">
					<svg-icon  iconName="重置_icon"  tipLable="重置"  iconSize="10" ></svg-icon>
				</div>
			</div>
			<div class="df">
				<el-button  @click="setRole" perms="sys_user_resetpwd"><i><svg-icon iconName="角色用户_icon" iconSize="10" style="margin-right: 5px;"></svg-icon></i>角色用户</el-button>
				<el-button type="primary" @click="addNew" style="margin-right: 3px;"><i><svg-icon iconName="新增_icon"  iconSize="10" style="margin-right: 5px;"></svg-icon></i>新增</el-button>
				
			</div>
		</div>
		<!-- 按钮组 -->

		<!-- 弹框 用户角色分配表格 -->
		<el-dialog :title="dialogTitle" v-model="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" width="80%">
			<div class="dialog_role_management" v-if="dialogTitle === '角色用户管理'">
				<div class="flex-c-c">
					<div class="w-100">
						<div class="role_table_group df aic jcc">
							<div style="width: 50%">
								<div class="role_button_group flex-c">
									<section class="flex-c">
										<label class="lable" style="margin: 0 10px; width: 36px">用户</label>
										<el-input placeholder="请输入用户" v-model="dialogFromData.name"></el-input>
									</section>
									<div class="spc-button" style="margin-right: 5px"  @click="dialogQuery">
										<svg-icon  iconName="search_icon"  tipLable="搜索"  iconSize="10"></svg-icon>
									</div>
									<div class="spc-button" @click="dialogReset">
										<svg-icon  iconName="重置_icon"  tipLable="重置"  iconSize="10" ></svg-icon>
									</div>
								</div>
								<n-table ref="selectUsersTable" :tableConfig="selectUsersTableConfig" class="roleUserBindClass"></n-table>
							</div>
							<div class=" h-100 df aic jcc fdc">
								<el-button type="success" class="btn" plain :icon="ArrowRight" @click="userToRight()">添加</el-button>
								<el-button type="danger" class="btn" plain :icon="ArrowLeft" @click="userToLeft()">移除</el-button>
							</div>
							<div style="width: 50%">
								<div class="role_button_group flex-c">
									<section class="flex-c">
										<label class="lable" style="margin: 0 10px; width: 36px">用户</label>
										<el-input placeholder="请输入用户" v-model="selectdDataFrom.userId"></el-input>
									</section>
									<div class="spc-button" style="margin-right: 5px"  @click="dialogdQuery">
										<svg-icon  iconName="search_icon"  tipLable="搜索"  iconSize="10"></svg-icon>
									</div>
									<div class="spc-button" @click="dialogdReset">
										<svg-icon  iconName="重置_icon"  tipLable="重置"  iconSize="10" ></svg-icon>
									</div>
								</div>
								<n-table ref="selectedUsersTable" :tableConfig="selectedUsersTableConfig" class="roleUserBindClass"></n-table>
							</div>
						</div>
					</div>
				</div>
			</div>
			<template #footer>
				<section class="section_option">
					<el-button class="dialogbtn"  @click="cancel" perms="cancle" round>取消</el-button>
					<el-button class="dialogbtn"  type="primary"  @click="save">保存</el-button>
				</section>
			</template>
		</el-dialog>
		<!-- 新增角色弹窗 -->
		<role-add ref="roleAdds" @queryList="queryList"></role-add>
		<!-- 编辑角色弹窗 -->
		<role-edit ref="roleEdits" @queryList="queryList"></role-edit>
		<!-- 角色表格 -->
		<section class="flex">
			<!-- 角色管理表格 -->
			<n-table ref="indexTable" :tableConfig="roleTableConfig" @handleRadioChange="showUsers" style="margin: 5px 30px 0 0; width: 75vw" class="indexTable" border>
			</n-table>
			<!-- 联动管理表格 -->
			<n-table ref="userTable" :tableConfig="roleLinkageTableConfig" style="margin-top: 5px; width: 23vw" class="roleLinkageTableConfigClass" border>
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
import { Refresh, Search, Plus } from '@element-plus/icons-vue';
import { getUsersByRoleCodeUrl } from '/@/api/consturl';

import { getUsersByRoleCode, getUserList } from '/@/api/admin/user';

import { clearFormData } from '/@/utils/jsOptions';
import { reactive, toRefs, ref, nextTick } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ArrowRight, ArrowLeft, User } from '@element-plus/icons-vue';

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
		cellClassName:({ row, column, rowIndex, columnIndex }: any) => {
			if (column.property === 'roleState') {
				if (row['roleState'] == 1) {
					return 'lose'
				} else {
					return 'valid'
				}
			}
		},
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
				icon: 'edit',
				click: (index: any, row: any) => {
					roleAdds.value.roleDataForm = JSON.parse(JSON.stringify(row));
					roleAdds.value.dialogVisible = true;
					roleAdds.value.dialogTitle = '编辑';
				},
			},
			{
				type: 'success',
				label: '查看',
				icon: 'show',
				click: (index: any, row: any) => {
					roleAdds.value.roleDataForm = JSON.parse(JSON.stringify(row));
					roleAdds.value.dialogVisible = true;
					roleAdds.value.dialogTitle = '查看';
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
	} as any,
	
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
	roleAdds.value.dialogTitle = '新增';
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
const setRole = async () => {
	let checkedData = indexTable.value.getCheckedData();
	if (checkedData == null) {
		return ElMessage({ message: '请选择角色', type: 'error' });
	}
	
	// debugger
	let selectUsersData = (await getUserList({userState: 0})).data;
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
	state?.userListData?.forEach((object: any) => {
		roleUserList.push({ userId: object.userId });
	});
	let data = {
		id: indexTable.value.getCheckedData().id,
		roleUserList,
	};
	console.log(data, roleUserList);
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
	state.userListData = state.userListData.filter((x:any) => !arrIdList.includes(x.userId));
	state.selectedUsersTableConfig.data = state.selectedUsersTableConfig.data.filter((x:any) => !arrIdList.includes(x.userId));
	selectedUsersTable.value.setTableData(state.selectedUsersTableConfig.data);
	selectUsersTable.value.setTableData(state.selectUsersTableConfig.data);
};
const dialogQuery = async () => {
	let checkedData = indexTable.value.getCheckedData();
	if (checkedData == null) {
		return ElMessage({ message: '请选择角色', type: 'error' });
	}
	console.log(321111,'state.dialogFromData',state.dialogFromData);
	
	let selectUsersData = (await getUserList({...state.dialogFromData, userState: 0})).data;
	// 已选择table数据
	// 去除掉相同数据
	let arrIdList = state.userListData.map((x:any) => x.userId);
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
	let data: any= [];
	state.userListData.forEach((element: any) => {
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

<style lang="scss" scoped>

.role {
	background-color: #fff;
	padding: 20px;
	border-radius: 10px;
	.button_group {
		margin-top: 5px;
		padding-left: 20px;
	}
	.select_group {
		label {
			margin-right: 10px;
			color: #606266;
		}
	}
	}
	.role_button_group{
		margin-bottom: 20px;
	}
	.btn{
		margin: 10px;
	}
::v-deep(.el-table__row .lose) {
  color: #EB715E !important;
}
::v-deep(.el-table__row .valid){
  color: #72BD1D !important;
}
</style>