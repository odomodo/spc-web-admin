<!--
 * @Author: 曾宇奇
 * @Date: 2021-04-15 14:39:03
 * @LastEditTime: 2022-04-20 13:32:31
 * @LastEditors: zhuangxingguo
 * @FilePath: \vue-next-admin\src\views\home\index.vue
-->

<template>
	<!-- 菜单新增弹框 -->
	<el-dialog :title="dialogTitle" v-model="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" width="25%">
		<div class="dialog_paramsSet">
			<section class="section_input">
			<el-row>
					<el-col :span="5"><i class="required">*</i>参数类型 :</el-col>
					<el-col :span="19">
						<el-select v-model="paramsDataForm.dataType" >
							<el-option v-for="item in dataTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
						</el-select>
					</el-col>
				</el-row>
				<el-row >
					<el-col :span="5"><i class="required">*</i>数据编号 :</el-col>
					<el-col :span="19">
						<el-input autocomplete="off"   v-model="paramsDataForm.dataCode" disabled></el-input>
					</el-col>
				</el-row>
				<el-row >
					<el-col :span="5"><i class="required">*</i>数据名称 :</el-col>
					<el-col :span="19">
						<el-input autocomplete="off"  v-model="paramsDataForm.dataName"></el-input>
					</el-col>
				</el-row>
				<el-row >
					<el-col :span="5">描述 :</el-col>
					<el-col :span="19">
						<el-input autocomplete="off" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea"  v-model="paramsDataForm.remarks"></el-input>
					</el-col>
				</el-row>
			</section>
			<section class="section_option">
				<el-button color="#5781C1"  @click="editSave(paramsDataForm)">保存</el-button>
				<el-button   @click="cancel">取消</el-button>
			</section>
		</div>
	</el-dialog>
</template>

<script setup lang="ts">
// 方法
import { queryList, editList } from '/@/api/base/paramsSet';

import { filterObj, clearFormData } from '/@/utils/jsOptions';
import { reactive, toRefs } from 'vue';
import { ElMessage } from 'element-plus';

const emit = defineEmits(['queryList']);
const state = reactive({
	dialogTitle: '编辑',
	dialogVisible: false,
	//配置父修改数据
	paramsDataForm: {
		dataCode: '', //数据编号
		dataType:0,
		dataName: '', //数据名称
		remarks: '', //描述
	} as any,
	// 上级编号下拉框数据
	dnData: [],
	selectList: [
		{ label: '系统类型', value: 0 },
		{ label: '业务类型', value: 1 },
	],
});
const { dialogTitle, dialogVisible, paramsDataForm, dnData, selectList } = toRefs(state);
const dataTypeOptions = [{
	value:0,
	label:'系统参数'
},{
	value:1,
	label:'控制项参数'
},{
	value:2,
	label:'不良参数'
},]
const queryDnData = async () => {
	// state.dnData = (await queryList('parent')).data;
};
//保存
const editSave = async (paramsDataForms: { [x: string]: any; }) => {
	const res: any = await editList('parent', paramsDataForms);
	if (res.code == 0) {
		ElMessage({
			message: res.msg,
			type: 'success',
			duration: 1500,
		});
		emit('queryList');
		// 清空表单
		clearFormData(paramsDataForm.value);
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
	state.paramsDataForm = {};
};

defineExpose({
	paramsDataForm,
	queryDnData,
	dialogVisible
})
</script>

// 自定义样式
<style lang="scss" scoped>
// 页面公共样式
// 页面样式
</style>

// 第三方样式
<style lang="scss" scoped>
::v-deep .el-dialog__body {
	display: flex;
	align-items: center;
	justify-content: center;
}
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
