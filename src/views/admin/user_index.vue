<!--
 * @Author: 曾宇奇
 * @Date: 2021-04-15 14:39:03
 * @LastEditTime: 2022-07-28 16:30:13
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @FilePath: \vue-next-admin\src\views\home\index.vue
-->

<template>
	<!-- 用户管理 -->
	<div class="userManagement">
		<!-- 选择框组 -->
		<div class="select_group df aic jcsb mb20" style="padding-right: 14px">
			<div class="df aic">
				<div class="select3 flex-c" style="margin-right: 15px">
					<label for="user" style="width: 140px">用户名称/编号</label>
					<el-input id="user" v-model="userSelectData.userName" placeholder="请输入" onfocus="this.removeAttribute('readonly');"></el-input>
				</div>
				<div class="select3" style="margin-right: 5px">
					<label>状态</label>
					<el-select placeholder="请选择" v-model="userSelectData.userState">
						<el-option label="停用" value="1"> </el-option>
						<el-option label="启用" value="0"> </el-option>
						<el-option label="全部" value="2"> </el-option>
					</el-select>
				</div>
				<div class="spc-button" @click="reset">
					<svg-icon  iconName="重置_icon"  tipLable="重置"  iconSize="10" ></svg-icon>
				</div>
				<div class="spc-button" style="margin-right: 5px"  @click="queryList(userSelectData)">
					<svg-icon  iconName="search_icon"  tipLable="搜索"  iconSize="10"></svg-icon>
				</div>
				
			</div>
			<div class="df">
				<el-button  @click="resetPwd" perms="sys_user_resetpwd"><i><svg-icon iconName="重置密码_icon" iconSize="10" style="margin-right: 5px;"></svg-icon></i>重置密码</el-button>
				<el-button type="primary" @click="addNew" style="margin-right: 3px;"><i><svg-icon iconName="新增_icon"  iconSize="10" style="margin-right: 5px;"></svg-icon></i>新增</el-button>
				
			</div>
		</div>
		<!-- 按钮组 -->

		<!-- 新增用户弹窗 -->
		<user-add ref="userAdds" @queryList="queryList"></user-add>
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
const indexTable = ref();
const state = reactive({
	// 用户表格配置
	userTableConfig: {
		height: '70vh',
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
		cellClassName:({ row, column, rowIndex, columnIndex }: any) => {
			if (column.property === 'userState') {
				if (row['userState'] == 1) {
					return 'lose'
				} else {
					return 'valid'
				}
			}
		},
		//操作按钮列表
		options: [
			{
				type: 'success',
				label: '编辑',
				icon: 'edit',
				show: -100,
				click: (index: any, row: { userState: number; factoryCode: string | null }) => {
					userAdds.value.userDataForm = JSON.parse(JSON.stringify(row));
					userAdds.value.dialogVisible = true;
					userAdds.value.dialogTitle = '用户编辑';
					if (row.factoryCode != null && row.factoryCode.indexOf(',')) {
						userAdds.value.userDataForm.factoryList = row.factoryCode.split(',');
					} else {
						userAdds.value.userDataForm.factoryList = row.factoryCode;
					}
					userAdds.value.getDnList();
				},
			},
			{
				type: 'success',
				label: '查看',
				icon: 'show',
				show: -100,
				click: (index: any, row: { userState: number; factoryCode: string | null }) => {
					userAdds.value.userDataForm = JSON.parse(JSON.stringify(row));
					userAdds.value.dialogVisible = true;
					userAdds.value.dialogTitle = '用户查看';
					if (row.factoryCode != null && row.factoryCode.indexOf(',')) {
						userAdds.value.userDataForm.factoryList = row.factoryCode.split(',');
					} else {
						userAdds.value.userDataForm.factoryList = row.factoryCode;
					}
					userAdds.value.getDnList();
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
	userAdds.value.dialogTitle = '用户新增';
	userAdds.value.getDnList();
	userAdds.value.userDataForm = clearFormData(userAdds.value.userDataForm);
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
</style>

<style lang="scss" scoped>
::v-deep(.el-table__row .lose) {
  color: #EB715E !important;
}
::v-deep(.el-table__row .valid){
  color: #72BD1D !important;
}
</style>
