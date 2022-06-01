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
						<el-input autocomplete="off" v-model="roleDataForm.roleCode"></el-input>
					</el-col>
					<el-col :span="4"><i class="required">*</i>角色名称 :</el-col>
					<el-col :span="8">
						<el-input autocomplete="off" v-model="roleDataForm.roleName"></el-input>
					</el-col>
				</el-row>
				<el-row class='spc-el-row'>
					<el-col :span="4"> 角色类型 : </el-col>
					<el-col :span="8" style="text-align: left">
						<el-select style="width: 100%" placeholder="请选择" v-model="roleDataForm.roleType">
							<el-option label="系统管理员" value="0"> </el-option>
							<el-option label="工厂管理员" value="1"> </el-option>
						</el-select>
					</el-col>
					<el-col :span="4"> <i class="required">*</i>启用状态 :</el-col>
					<el-col :span="8" style="text-align: left">
						<el-switch v-model="roleDataForm.roleState"> </el-switch>
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
				<el-button type="primary" size="small" @click="addSave(roleDataForm)">保存</el-button>
				<el-button type="primary" size="small" @click="cancel">取消</el-button>
			</section>
		</div>
	</el-dialog>
</template>

<script setup lang="ts">
// 方法
import { clearFormData, isContainChineseChar } from '/@/utils/jsOptions';
import { addList } from '/@/api/admin/role';
import { reactive, toRefs,defineExpose } from 'vue';
import { ElMessage } from 'element-plus';
const emit = defineEmits(['queryList']);
const state = reactive({
	dialogTitle: '新增',
	dialogVisible: false,
	// 角色新增数据
	roleDataForm: {
		roleCode: '', //角色编码
		roleName: '', //角色名称
		roleType: '', //角色类型
		roleState: true, //角色状态
		description: '', //角色描述
		remark: '', //角色备注
	},
});
const { dialogVisible, roleDataForm, dialogTitle } = toRefs(state);
// 保存
const addSave = async (roleDataForm: { [x: string]: string; roleState?: any }) => {
	if (state.roleDataForm.roleCode == null || state.roleDataForm.roleCode == '') {
		return ElMessage({
			message: '请填写角色编码',
			type: 'error',
		});
	}
	if (isContainChineseChar(state.roleDataForm.roleCode)) {
		return ElMessage({
			message: '角色编码不能包含中文字符',
			type: 'error',
		});
	}
	if (state.roleDataForm.roleName == null || state.roleDataForm.roleName == '') {
		return ElMessage({
			message: '请填写角色名称',
			type: 'error',
		});
	}
	roleDataForm.roleState ? (roleDataForm.roleState = 0) : (roleDataForm.roleState = 1);
	const res: any = await addList(roleDataForm);

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
	state.roleDataForm.roleState = true;
	state.dialogVisible = false;
};
defineExpose({
	dialogVisible,
	roleDataForm
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
>>> .el-input__inner {
	border-radius: 4px;
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
</style>
