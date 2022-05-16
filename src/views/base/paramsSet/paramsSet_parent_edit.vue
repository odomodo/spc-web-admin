<template>
	<!-- 菜单新增弹框 -->
	<el-dialog :title="dialogTitle" v-model="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" width="40%">
		<div class="dialog_paramsSet">
			<section class="section_input">
				<el-row >
					<el-col :span="8">数据类型 :</el-col>
					<el-col :span="16">
						<el-select style="width: 100%" placeholder="请选择" size="small" v-model="paramsDataForm.dataType" value-key="value" :disabled="true">
							<el-option :label="item.label" :value="item.value" v-for="item in selectList" :key="item.value" />
						</el-select>
					</el-col>
				</el-row>
				<el-row >
					<el-col :span="8">数据编号 :</el-col>
					<el-col :span="16">
						<el-input autocomplete="off" size="small" v-model="paramsDataForm.dataCode" disabled></el-input>
					</el-col>
				</el-row>
				<el-row >
					<el-col :span="8">数据名称 :</el-col>
					<el-col :span="16">
						<el-input autocomplete="off" size="small" v-model="paramsDataForm.dataName"></el-input>
					</el-col>
				</el-row>
				<el-row >
					<el-col :span="8">上级编号 :</el-col>
					<el-col :span="16">
						<el-select placeholder="请选择" size="small" v-model="paramsDataForm.parentCode">
							<el-option :label="item.dataName" :value="item.dataCode" v-for="item in dnData" :key="item.dataCode">
								<span style="float: left">{{ item.dataName }}</span>
								<span style="float: right; color: #8492a6; font-style: 14px">{{ item.dataCode }}</span>
							</el-option>
						</el-select>
					</el-col>
				</el-row>
			</section>
			<section class="section_option flex-c-c">
				<el-button color="#5781C1" size="small" @click="editSave(paramsDataForm)">保存</el-button>
				<el-button  size="small" @click="cancel">取消</el-button>
			</section>
		</div>
	</el-dialog>
</template>

<script setup lang="ts">
// 方法
import { queryList, editList } from '/@/api/base/paramsSet';

import { filterObj, clearFormData } from '/@/utils/jsOptions';
import { reactive, toRefs,defineExpose } from 'vue';
import { ElMessage } from 'element-plus';

const emit = defineEmits(['queryList']);
const state = reactive({
	dialogTitle: '编辑',
	dialogVisible: false,
	//配置父修改数据
	paramsDataForm: {
		dataType: null, //数据类型
		dataCode: '', //数据编号
		dataName: '', //数据名称
		parentCode: '', //上级编号
	} as any,
	// 上级编号下拉框数据
	dnData: [],
	selectList: [
		{ label: '系统类型', value: 0 },
		{ label: '业务类型', value: 1 },
	],
});
const { dialogTitle, dialogVisible, paramsDataForm, dnData, selectList } = toRefs(state);
const queryDnData = async () => {
	state.dnData = (await queryList('parent')).data;
};
//保存
const editSave = async (paramsDataForm) => {
	paramsDataForm = filterObj(paramsDataForm, ['addTime']);

	const res: any = await editList('parent', paramsDataForm);
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
