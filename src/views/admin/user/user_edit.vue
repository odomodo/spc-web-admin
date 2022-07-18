<!--
 * @Author: 曾宇奇
 * @Date: 2021-04-15 14:39:03
 * @LastEditTime: 2022-07-04 09:00:08
 * @LastEditors: Administrator 848563840@qq.com
 * @FilePath: \vue-next-admin\src\views\home\index.vue
-->

<template>
	<!-- 用户新增弹窗 -->
	<el-dialog :title="dialogTitle" v-model="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" width="70%">
		<div class="dialog_user">
			<section class="section_input">
				<el-row class='spc-el-row'>
					<el-col :span="4"><i class="required">*</i>用户账号 :</el-col>
					<el-col :span="8">
						<el-input :disabled="true" autocomplete="off" v-model="userDataForm.userId" onfocus="this.removeAttribute('readonly');"></el-input>
					</el-col>
					<el-col :span="4"><i class="required">*</i>用户名称 :</el-col>
					<el-col :span="8">
						<el-input autocomplete="off" v-model="userDataForm.userName"></el-input>
					</el-col>
				</el-row>

				<el-row class='spc-el-row'>
					<el-col :span="4">用户识别码 :</el-col>
					<el-col :span="8">
						<el-input autocomplete="off" v-model="userDataForm.identificatCode" :disabled="true"></el-input>
					</el-col>
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
			<section class="section_option">
				<el-button type="primary"  @click="editSave(userDataForm)">保存</el-button>
				<el-button type="primary"  @click="cancel">取消</el-button>
			</section>
		</div>
	</el-dialog>
</template>

<script setup lang="ts">
import { editList, selectByUserIdList, getFactoryDnList } from '/@/api/admin/user';
import { reactive, toRefs } from 'vue';
import { ElMessage } from 'element-plus';

const emit = defineEmits(['queryList']);
const state = reactive({
	dialogTitle: '用户修改',
	dialogVisible: false,
	// 下拉框数据
	dnData: {
		factoryDnList: [] as Array<any>, //工厂
	},
	// 用户新增数据
	userDataForm: {
		userId: null,
		userName: null, //用户名称
		factoryList: [],
		identificatCode: null,
		userState: true,
		contactWay: null,
		description: null,
	},
});
const { dialogTitle, dialogVisible, dnData, userDataForm } = toRefs(state);

// 保存
const editSave = async (userDataForm: { userName?: any; userState: any }) => {
	if (userDataForm.userName == null || userDataForm.userName == '') {
		return ElMessage({
			message: '请填写用户账号 ',
			type: 'error',
		});
	}

	let { userState } = userDataForm;

	if (userState) {
		userDataForm.userState = 0;
	} else {
		userDataForm.userState = 1;
	}
	const res: any = await editList(userDataForm);
	if (res.code == 0) {
		ElMessage({
			message: res.msg,
			type: 'success',
			duration: 1500,
		});
		emit('queryList');
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

const loadFactoryList = async () => {
	state.userDataForm.factoryList = (await selectByUserIdList({ userId: state.userDataForm.userId })).data;
};
// 获取下拉框列表
const getDnList = async () => {
	// 获取工厂下拉框列表
	state.dnData.factoryDnList = (await getFactoryDnList()).data;
};
defineExpose({
	userDataForm,
	dialogVisible,
	getDnList
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
