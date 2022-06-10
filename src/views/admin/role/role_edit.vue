<!--
 * @Author: 曾宇奇
 * @Date: 2021-04-15 14:39:03
 * @LastEditTime: 2022-04-20 13:32:31
 * @LastEditors: zhuangxingguo
 * @FilePath: \vue-next-admin\src\views\home\index.vue
-->

<template>
	<!-- 角色新增弹窗 -->
	<el-dialog :title="dialogTitle" v-model="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" width="66%">
		<div class="dialog_role_add">
			<section class="section_input">
				<el-row class='spc-el-row'>
					<el-col :span="4"><i class="required">*</i>角色编号 :</el-col>
					<el-col :span="8">
						<el-input autocomplete="off"  v-model="roleDataForm.roleCode" :disabled="true"></el-input>
					</el-col>
					<el-col :span="4"><i class="required">*</i>角色名称 :</el-col>
					<el-col :span="8">
						<el-input autocomplete="off"  v-model="roleDataForm.roleName"></el-input>
					</el-col>
				</el-row>
				<el-row class='spc-el-row'>
					<el-col :span="4"> 角色类型 : </el-col>
					<el-col :span="8" style="text-align: left">
						<el-select style="width: 100%" placeholder="请选择"  v-model="roleDataForm.roleType" value-key="value" :disabled="true">
							<el-option :label="item.label"  :value="item.value" v-for="item in selectList" :key="item.value" />
						</el-select>
					</el-col>
					<el-col :span="4"> <i class="required">*</i>启用状态 :</el-col>
					<el-col :span="8" style="text-align: left">
						<el-switch  v-model="roleDataForm.roleState"> </el-switch>
					</el-col>
				</el-row>
				<section class="section_textarea">
					<el-row class='spc-el-row'>
						<el-col :span="4"> 角色描述 : </el-col>
						<el-col :span="20">
							<el-input type="textarea" v-model="roleDataForm.description" :autosize="{ minRows: 3, maxRows: 5 }"> </el-input>
						</el-col>
					</el-row>
					<el-row class='spc-el-row'>
						<el-col :span="4"> 备注 : </el-col>
						<el-col :span="20">
							<el-input type="textarea" v-model="roleDataForm.remark" :autosize="{ minRows: 3, maxRows: 5 }"> </el-input>
						</el-col>
					</el-row>
				</section>
			</section>
			<section class="section_option flex-c-c">
				<el-button type="primary"  @click="addEdit(roleDataForm)">保存</el-button>
				<el-button type="primary"  @click="cancel">取消</el-button>
			</section>
		</div>
	</el-dialog>
</template>

<script setup lang="ts">
// 方法
import { clearFormData } from '/@/utils/jsOptions';
import { editList } from '/@/api/admin/role';
import { reactive, toRefs,defineExpose } from 'vue';
import { ElMessage } from 'element-plus';

const emit = defineEmits(['queryList']);
const state = reactive({
	dialogTitle: '编辑',
	dialogVisible: false,
	// 角色新增数据
	roleDataForm: {} as any,
	selectList: [
		{ label: '系统管理员', value: 0 },
		{ label: '工厂管理员', value: 1 },
	],
});
const { dialogTitle, dialogVisible, roleDataForm, selectList } = toRefs(state);
// 保存
const addEdit = async (roleDataForm: { [x: string]: string; roleState?: any }) => {
	if (state.roleDataForm.roleCode == null || state.roleDataForm.roleCode == '') {
		return ElMessage({
			message: '请填写角色编码',
			type: 'error',
		});
	}
	if (state.roleDataForm.roleName == null || state.roleDataForm.roleName == '') {
		return ElMessage({
			message: '请填写角色名称',
			type: 'error',
		});
	}
	if (roleDataForm.roleState == true) {
		roleDataForm.roleState = '0';
	} else if (roleDataForm.roleState == false) {
		roleDataForm.roleState = '1';
	}
	// if(roleDataForm.roleType = "系统管理员"){
	//   roleDataForm.roleType = 0;
	// }else if(roleDataForm.roleType = '工厂管理员'){
	//   roleDataForm.roleType = 1;
	// }
	const res: any = await editList(roleDataForm);
	if (res.code == 0) {
		ElMessage({
			message: res.msg,
			type: 'success',
			duration: 1500,
		});
		emit('queryList');
		// 清空表单
		clearFormData(roleDataForm);
		state.roleDataForm.roleState = true;
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
defineExpose({
	roleDataForm,
	dialogVisible
})
</script>

// 自定义样式
<style lang="scss" scoped>
// 页面公共样式
.required {
	color: red;
}
// 页面样式
</style>

// 第三方样式
<style lang="scss" scoped>
::v-deep .el-input__inner {
	border-radius: 4px;
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
</style>
