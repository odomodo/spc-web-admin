<template>
	<!-- 菜单新增弹框 -->
	<el-dialog :title="dialogTitle" v-model="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" width="40%">
		<div class="dialog_paramsSet">
			<section class="section_input">
				<el-row class='spc-el-row'>
					<el-col :span="8">子编号 :</el-col>
					<el-col :span="16">
						<el-input autocomplete="off" size="small" v-model="paramsDataForm.valueCode"></el-input>
					</el-col>
				</el-row>
				<el-row class='spc-el-row'>
					<el-col :span="8">名称 :</el-col>
					<el-col :span="16">
						<el-input autocomplete="off" size="small" v-model="paramsDataForm.valueName"></el-input>
					</el-col>
				</el-row>
				<el-row class='spc-el-row'>
					<el-col :span="8">描述 :</el-col>
					<el-col :span="16">
						<el-input autocomplete="off" size="small" v-model="paramsDataForm.description"></el-input>
					</el-col>
				</el-row>
				<el-row class='spc-el-row'>
					<el-col :span="8">排序 :</el-col>
					<el-col :span="16">
						<el-input autocomplete="off" size="small" v-model="paramsDataForm.valueSort"></el-input>
					</el-col>
				</el-row>
			</section>
			<section class="section_option flex-c-c">
				<el-button type="primary" size="small" @click="addSave(paramsDataForm)">保存</el-button>
				<el-button type="primary" size="small" @click="cancel">取消</el-button>
			</section>
		</div>
	</el-dialog>
</template>

<script setup lang="ts">
// 方法
import { addList } from '/@/api/admin/paramsSet';

import { clearFormData, isContainChineseChar } from '/@/utils/jsOptions';
import { reactive, toRefs,defineExpose } from 'vue';
import { ElMessage } from 'element-plus';

const props = defineProps({
	params: {
		type: Object,
		default() {
			return {};
		},
	},
});
const emit = defineEmits(['queryList']);
const state = reactive({
	dialogTitle: '新增',
	dialogVisible: false,
	//配置子新增数据
	paramsDataForm: {
		valueCode: '', //子编号
		valueName: '', //名称
		description: '', //描述
		valueSort: '', //排序
	} as any,
});
const { dialogTitle, dialogVisible, paramsDataForm } = toRefs(state);
//保存
const addSave = async (paramsDataForm: { [x: string]: string }) => {
	if (isContainChineseChar(state.paramsDataForm.valueCode)) {
		return ElMessage({
			message: '子编号不能包含中文字符',
			type: 'error',
		});
	}

	const res = await addList('child', { ...paramsDataForm, ...props.params });
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
	dialogVisible,
	paramsDataForm
})
</script>

// 自定义样式
<style lang="scss" scoped>
// 页面公共样式
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
