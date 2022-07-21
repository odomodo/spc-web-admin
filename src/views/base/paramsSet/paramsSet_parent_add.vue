<!--
 * @Author: 曾宇奇
 * @Date: 2021-04-15 14:39:03
 * @LastEditTime: 2022-07-21 10:55:07
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @FilePath: \vue-next-admin\src\views\home\index.vue
-->

<template>
	<!-- 菜单新增弹框 -->
	<el-dialog :title="dialogTitle" v-model="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" width="566px" @close="cancel">
		<div class="dialog_paramsSet">
			<section class="section_input">
				<el-form :model="paramsDataForm" label-width="90px" :rules="rules" ref="ruleFormRef">
					<el-row>
						<el-col :span="24" class="item">
							<el-form-item prop="dataType" label="参数类型">
								<el-select v-model="paramsDataForm.dataType" :disabled="dialogTitle !== '新增'" style="width: 100%">
									<el-option v-for="item in dataTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="24" class="item">
							<el-form-item prop="dataCode" label="数据编号">
								<el-input autocomplete="off"  v-model="paramsDataForm.dataCode" :disabled="dialogTitle !== '新增'"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="24" class="item">
							<el-form-item prop="dataType" label="数据名称">
								<el-input autocomplete="off"  v-model="paramsDataForm.dataName"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="24" class="item">
							<el-form-item prop="remarks"  label="描述">
								<el-input 
										autocomplete="off"
										:autosize="{ minRows: 4, maxRows: 8 }"
										type="textarea"
										v-model="paramsDataForm.remarks"
									></el-input>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</section>
			<section class="section_option">
				<el-button color="#5781C1"  @click="addSave()">保存</el-button>
				<el-button  @click="cancel">取消</el-button>
			</section>
		</div>
	</el-dialog>
</template>

<script setup lang="ts">
// 方法
import { addList, queryParentData, editList } from '/@/api/base/paramsSet';

import { clearFormData, isContainChineseChar, hasChinase, debounce } from '/@/utils/jsOptions';
import { reactive, toRefs, ref, getCurrentInstance } from 'vue';
import { ElMessage } from 'element-plus';

const emit = defineEmits(['queryList']);
const ruleFormRef = ref<any>(null)
const { proxy } = <any>getCurrentInstance();
const state = reactive({
	dialogTitle: '',
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
const rules = reactive({
	  dataCode: [
    { required: true, message: '请输入', trigger: 'blur' },
    { validator: hasChinase, message: '角色编码不能包含中文字符', trigger: 'blur' },
  ],
  dataName: [
    { required: true, message: '请输入', trigger: 'blur' },
  ],
	dataType: [
    { required: true, message: '请输入', trigger: 'blur' },
  ],
})
const dataTypeOptions = [{
	value:0,
	label:'系统参数'
},{
	value:1,
	label:'控制项参数'
},]
//保存
const addSave = debounce(async () => {
	await ruleFormRef.value.validate(async(valid: any, fields: any) => {
		if (valid) {
			const res: any = dialogTitle.value === '新增' 
			? await addList('parent', paramsDataForm.value)
			: await editList('parent', paramsDataForm.value)
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
					duration: 1500,
				});
			}
		}
	})
}, 500, false)

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
	dialogTitle
});
</script>

<style lang="scss" scoped>
// 页面公共样式
.required {
	color: red;
}
// 页面样式
</style>

<style lang="scss" scoped>
.item{
	margin-bottom: 20px;
}
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
