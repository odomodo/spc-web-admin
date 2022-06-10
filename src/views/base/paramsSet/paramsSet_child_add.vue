<!--
* @Author: 曾宇奇
 * @Date: 2021-04-15 14:39:03
* @LastEditTime: 2022/05/19 14:51:23
* @LastEditors: zhuangxingguo
* @FilePath: \spc-web-admin\src\views\base\paramsSet/paramsSet_child_add
-->

<template>
	<!-- 菜单新增弹框 -->
	<el-dialog :title="dialogTitle" v-model="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" width="25%">
		<div class="dialog_paramsSet">
			<section class="section_input">
				<el-row >
					<el-col :span="6"><i class="required">*</i>明细项编码 :</el-col>
					<el-col :span="18">
						<el-input autocomplete="off"  v-model="paramsDataForm.valueCode"></el-input>
					</el-col>
				</el-row>
				<el-row >
					<el-col :span="6"><i class="required">*</i>明细项编码值 :</el-col>
					<el-col :span="18">
						<el-input autocomplete="off"  v-model="paramsDataForm.valueName"></el-input>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="6"><i class="required">*</i>显示顺序 :</el-col>
					<el-col :span="18">
						<el-input autocomplete="off"  v-model="paramsDataForm.valueSort"></el-input>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="6"><i class="required">*</i>是否可用 :</el-col>
					<el-col :span="18">
						<el-radio v-model="paramsDataForm.ifAvailable" label="0" >Y</el-radio>
						<el-radio v-model="paramsDataForm.ifAvailable" label="1" >N</el-radio>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="6"><i class="required">*</i>是否可编辑 :</el-col>
					<el-col :span="18">
						<el-radio v-model="paramsDataForm.ifEdit" label="0" >Y</el-radio>
						<el-radio v-model="paramsDataForm.ifEdit" label="1" >N</el-radio>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="6"><i class="required">*</i>是否可删除 :</el-col>
					<el-col :span="18">
						<el-radio v-model="paramsDataForm.ifDelete" label="0" >Y</el-radio>
						<el-radio v-model="paramsDataForm.ifDelete" label="1" >N</el-radio>
					</el-col>
				</el-row>
			</section>
			<section class="section_option flex-c-c">
				<el-button color="#5781C1"  @click="addSave(paramsDataForm)">保存</el-button>
				<el-button  @click="cancel">取消</el-button>
			</section>
		</div>
	</el-dialog>
</template>

<script setup lang="ts">
// 方法
import { addList } from '/@/api/base/paramsSet';

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
		valueCode: '', //明细项编码
		valueName: '', //明细项编码值
		ifAvailable: '1', //是否可用
		valueSort: '', //显示顺序
		ifEdit: '1', //是否可编辑
		ifDelete: '1', //是否可删除
	} as any,
});
const { dialogTitle, dialogVisible, paramsDataForm } = toRefs(state);
//保存
const addSave = async (paramsDataForm: { [x: string]: string }) => {
	if (isContainChineseChar(state.paramsDataForm.valueCode)) {
		return ElMessage({
			message: '明细项编码不能包含中文字符',
			type: 'error',
		});
	}
	if (state.paramsDataForm.valueName == '') {
		return ElMessage({
			message: '明细项编码值不能为空',
			type: 'error',
		});
	}
	if (state.paramsDataForm.ifAvailable== '') {
		return ElMessage({
			message: '是否可用不能为空',
			type: 'error',
		});
	}
	if (state.paramsDataForm.valueSort== '') {
		return ElMessage({
			message: '显示顺序不能为空',
			type: 'error',
		});
	}
	if (state.paramsDataForm.ifEdit== '') {
		return ElMessage({
			message: '是否可编辑不能为空',
			type: 'error',
		});
	}
	if (state.paramsDataForm.ifDelete== '') {
		return ElMessage({
			message: '是否可删除不能为空',
			type: 'error',
		});
	}

	const res:any = await addList('child', { ...paramsDataForm, ...props.params });
	if (res.code == 0) {
		ElMessage({
			message: res.msg,
			type: 'success',
			duration: 1500,
		});
		emit('queryList','','');
		// 清空表单
		state.paramsDataForm = {
			valueCode: '', //明细项编码
			valueName: '', //明细项编码值
			ifAvailable: '1', //是否可用
			valueSort: '', //显示顺序
			ifEdit: '1', //是否可编辑
			ifDelete: '1', //是否可删除
		}
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
