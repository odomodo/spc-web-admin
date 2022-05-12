<template>
	<!-- 菜单新增弹框 -->
	<el-dialog :title="dialogTitle" v-model="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" width="50%">
		<div class="dialog_paramsSet">
			<section class="section_input">
				<el-row>
					<el-col :span="8"><i class="required">*</i>数据类型 :</el-col>
					<el-col :span="16">
						<el-select placeholder="请选择" size="small" v-model="paramsDataForm.dataType">
							<el-option label="系统类型" value="0" />
							<el-option label="业务类型" value="1" />
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
					<el-col :span="8">数据名称 :</el-col>
					<el-col :span="16">
						<el-input autocomplete="off" size="small" v-model="paramsDataForm.dataName"></el-input>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="8">上级编号 :</el-col>
					<el-col :span="16">
						<el-select placeholder="请选择" size="small" v-model="paramsDataForm.parentCode">
							<el-option
								:label="item.dataName"
								:value="[{ parentCode: item.dataCode }, { parentId: item.id }]"
								v-for="item in dnData"
								:key="item.dataCode"
							>
								<span style="float: left">{{ item.dataName }}</span>
								<span style="float: right; color: #8492a6; font-style: 14px">{{ item.dataCode }}</span>
							</el-option>
						</el-select>
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
import { addList, queryParentData } from '/@/api/admin/paramsSet';
import { clearFormData, isContainChineseChar } from '/@/utils/jsOptions';
import { reactive, toRefs,defineExpose } from 'vue';
import { ElMessage } from 'element-plus';

const emit = defineEmits(['queryList']);
const state = reactive({
	dialogTitle: '新增',
	dialogVisible: false,
	//配置父新增数据
	paramsDataForm: {
		dataType: '0', //数据类型
		dataCode: '', //数据编号
		dataName: '', //数据名称
		parentCode: '', //上级编号
		parentId: '',
		id: '',
	} as any,
	// 上级编号下拉框数据
	dnData: [] as any,
});
const { dialogTitle, dialogVisible, paramsDataForm, dnData } = toRefs(state);
const queryDnData = async () => {
	state.dnData = await queryParentData();
};
//保存
const addSave = async (paramsDataForm: { [x: string]: string; dataType?: any; dataCode?: any }) => {
	if (!paramsDataForm.dataType || !paramsDataForm.dataCode) {
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
	//_paramsDataForm.dataType = _paramsDataForm.dataType == "系统类型" ? 0 : 1;
	if (_paramsDataForm.parentCode) {
		_paramsDataForm.parentId = _paramsDataForm.parentCode[1].parentId;
		_paramsDataForm.parentCode = _paramsDataForm.parentCode[0].parentCode;
	}
	// Vue.delete(_paramsDataForm, "id");

	const res = await addList('parent', _paramsDataForm);
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
	state.paramsDataForm = {};
};
defineExpose({
	dialogVisible,
	paramsDataForm,
	queryDnData
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
