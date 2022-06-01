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
					<el-col :span="8"><i class="required">*</i>参数类型 :</el-col>
					<el-col :span="16">
						<el-select v-model="paramsDataForm.dataType" >
							<el-option v-for="item in dataTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
						</el-select>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8"><i class="required">*</i>数据编号 :</el-col>
					<el-col :span="16">
						<el-input autocomplete="off" size="small" v-model="paramsDataForm.dataCode"></el-input>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8"><i class="required">*</i>数据名称 :</el-col>
					<el-col :span="16">
						<el-input autocomplete="off" size="small" v-model="paramsDataForm.dataName"></el-input>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8">描述 :</el-col>
					<el-col :span="16">
						<el-input
							autocomplete="off"
							:autosize="{ minRows: 2, maxRows: 4 }"
							type="textarea"
							size="small"
							v-model="paramsDataForm.remarks"
						></el-input>
					</el-col>
				</el-row>
			</section>
			<section class="section_option flex-c-c">
				<el-button color="#5781C1" size="small" @click="addSave(paramsDataForm)">保存</el-button>
				<el-button size="small" @click="cancel">取消</el-button>
			</section>
		</div>
	</el-dialog>
</template>

<script setup lang="ts">
// 方法
import { addList, queryParentData } from '/@/api/base/paramsSet';
import { clearFormData, isContainChineseChar } from '/@/utils/jsOptions';
import { reactive, toRefs, defineExpose } from 'vue';
import { ElMessage } from 'element-plus';

const emit = defineEmits(['queryList']);
const state = reactive({
	dialogTitle: '新增',
	dialogVisible: false,
	//配置父新增数据
	paramsDataForm: {
		dataCode: '', //数据编号
		dataType: '',
		dataName: '', //数据名称
		remarks: '', //描述
	} as any,
	// 上级编号下拉框数据
	dnData: [] as any,
});
const { dialogTitle, dialogVisible, paramsDataForm, dnData } = toRefs(state);
const queryDnData = async () => {
	state.dnData = await queryParentData();
};

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
//保存
const addSave = async (paramsDataForm: { [x: string]: string; dataType?: any; dataCode?: any }) => {
	if (!paramsDataForm.dataName || !paramsDataForm.dataCode) {
		ElMessage({
			message: '数据类型或数据编号不能为空!',
			type: 'error',
			duration: 3000,
		});
		return;
	}
	if (isContainChineseChar(state.paramsDataForm.dataCode)) {
		return ElMessage({
			message: '数据编号不能包含中文字符',
			type: 'error',
		});
	}

	let _paramsDataForm = { ...paramsDataForm };

	const res: any = await addList('parent', _paramsDataForm);
	if (res.code == 0) {
		ElMessage({
			message: res.msg,
			type: 'success',
			duration: 1500,
		});
		emit('queryList');
		// 清空表单
		clearFormData(paramsDataForm);
		state.dialogVisible = false;
	} else {
		ElMessage({
			message: res.msg,
			type: 'error',
			duration: 1500,
		});
		emit('queryList');
		// 清空表单
		clearFormData(paramsDataForm);
		state.dialogVisible = false;
	}
};
// 取消
const cancel = () => {
	state.dialogVisible = false;
	state.paramsDataForm = {
		dataCode: '', //数据编号
		dataType: '0',
		dataName: '', //数据名称
		remarks: '', //描述
	};
};
defineExpose({
	dialogVisible,
	paramsDataForm,
	queryDnData,
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
>>> .el-dialog__body {
	display: flex;
	align-items: center;
	justify-content: center;
}
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
