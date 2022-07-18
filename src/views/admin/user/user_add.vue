<!--
 * @Author: 曾宇奇
 * @Date: 2021-04-15 14:39:03
 * @LastEditTime: 2022-07-14 10:33:04
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @FilePath: \vue-next-admin\src\views\home\index.vue
-->

<template>
	<!-- 用户新增弹窗 -->
	<el-dialog :title="dialogTitle" v-model="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" width="50%">
		<div class="dialog_user">
			<section class="section_input">
				<el-row class='spc-el-row'>
					<el-col :span="4"><i class="required">*</i>用户账号 :</el-col>
					<el-col :span="8">
						<el-input autocomplete="off" v-model.trim="userDataForm.userId" onfocus="this.removeAttribute('readonly');" ></el-input>
					</el-col>
					<el-col :span="4"><i class="required">*</i>用户名称 :</el-col>
					<el-col :span="8">
						<el-input autocomplete="off" v-model.trim="userDataForm.userName"></el-input>
					</el-col>
				</el-row>
				<el-row class='spc-el-row'>
					<el-col :span="4"><i class="required">*</i>用户密码 :</el-col>
					<el-col :span="8">
						<el-input autocomplete="off" v-model="userDataForm.userPwd" show-password onfocus="this.removeAttribute('readonly');" ></el-input>
					</el-col>
					<el-col :span="4"><i class="required">*</i>确认密码 :</el-col>
					<el-col :span="8">
						<el-input autocomplete="off" v-model="userDataForm.comfirmPwd" show-password></el-input>
					</el-col>
				</el-row>
				<el-row class='spc-el-row'>
					<el-col :span="4"><i class="required">*</i>启用状态 :</el-col>
					<el-col :span="8" style="text-align: left">
						<el-switch v-model="userDataForm.userState"></el-switch>
					</el-col>
				</el-row>
				<el-row class='spc-el-row'>
					<el-col :span="4">所属工厂 :</el-col>
					<el-col :span="8" style="text-align: left">
						<el-select style="width: 100%" placeholder="请选择工厂" multiple v-model="userDataForm.factoryList">
							<el-option :label="item.factoryName" :value="item.factoryCode" v-for="(item, index) in dnData.factoryDnList" :key="index"> </el-option>
						</el-select>
					</el-col>
					<el-col :span="4">联系方式 :</el-col>
					<el-col :span="8">
						<el-input autocomplete="off" v-model="userDataForm.contactWay"></el-input>
					</el-col>
				</el-row>
			</section>
			<section class="section_textarea">
				<el-row class='spc-el-row'>
					<el-col :span="4"> 备注 : </el-col>
					<el-col :span="20">
						<el-input type="textarea" v-model="userDataForm.description" :autosize="{ minRows: 3, maxRows: 5 }"> </el-input>
					</el-col>
				</el-row>
			</section>
			<section class="section_option df jcfe">
				<el-button type="primary"  @click="addSave(userDataForm)">保存</el-button>
				<el-button type="primary"  @click="cancel">取消</el-button>
			</section>
		</div>
	</el-dialog>
</template>

<script setup lang="ts">
// 方法
import { isContainChineseChar } from '/@/utils/jsOptions';
import { addList, getFactoryDnList } from '/@/api/admin/user';
import { reactive, toRefs } from 'vue';
import { ElMessage } from 'element-plus';

const emit = defineEmits(['queryList']);
const state = reactive({
	dialogTitle: '用户新增',
	dialogVisible: false,
	// 下拉框数据
	dnData: {
		factoryDnList: [] as Array<any>, //工厂
	},
	// 用户新增数据
	userDataForm: {
		userId: null,
		userName: '', //用户名称
		userPwd: '', //用户密码
		comfirmPwd: null, //确认密码
		factoryList: [],
		identificatCode: null,
		userState: true,
		contactWay: null,
		description: null,
	} as any,
});
const { dialogTitle, dialogVisible, dnData, userDataForm } = toRefs(state);
// 保存
const addSave = async (userDataForm: {
	userId: string | null;
	userName: string | null;
	userPwd: string | null;
	comfirmPwd: string | null;
	userState: number;
}) => {
	if (userDataForm.userId == null || userDataForm.userId == '') {
		return ElMessage({
			message: '请填写用户账号 ',
			type: 'error',
		});
	}
	if (isContainChineseChar(userDataForm.userId)) {
		return ElMessage({
			message: '用户账号不能为中文 ',
			type: 'error',
		});
	}
	if (userDataForm.userName == null || userDataForm.userName == '') {
		return ElMessage({
			message: '请填写用户名称 ',
			type: 'error',
		});
	}
	if (userDataForm.userPwd == null || userDataForm.userPwd == '') {
		return ElMessage({
			message: '请填写用户密码 ',
			type: 'error',
		});
	}
	if (userDataForm.comfirmPwd == null || userDataForm.comfirmPwd == '') {
		return ElMessage({
			message: '请填写确认密码 ',
			type: 'error',
		});
	}
	if (userDataForm.comfirmPwd !== userDataForm.userPwd) {
		return ElMessage({
			message: '两次密码不一致 ',
			type: 'error',
		});
	}
	let userState = userDataForm.userState;
	if (userState) {
		userDataForm.userState = 0;
	} else {
		userDataForm.userState = 1;
	}
	const res: any = await addList(userDataForm);
	if (res.code === 0) {
		ElMessage({
			message: res.msg,
			type: 'success',
			duration: 1500,
		});
		emit('queryList');
		state.userDataForm = {};
		state.dialogVisible = false;
	} else {
		ElMessage({
			message: res.msg,
			type: 'error',
		});
	}
	state.userDataForm.userState = true;
};
// 取消
const cancel = () => {
	state.dialogVisible = false;
};
// 获取下拉框列表
const getFactoryList = async () => {
	// 获取车间下拉框列表
	// this.dnData.workShopDnList = (await getWorkshopDnList()).data;
	// 获取工厂下拉框列表
	state.dnData.factoryDnList = (await getFactoryDnList()).data;
};

defineExpose({
	getFactoryList,
	userDataForm,
	dialogVisible
});
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
::v-deep(input:-webkit-autofill) {
  box-shadow: 0 0 0px 1000px #c7c6c6 inset !important;
  // -webkit-text-fill-color: #ededed !important;
  -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
  background-color: transparent;
  background-image: none;
  transition: background-color 50000s ease-in-out 0s;
}
</style>
