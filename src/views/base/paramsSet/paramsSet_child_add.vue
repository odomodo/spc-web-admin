<!--
* @Author: 曾宇奇
 * @Date: 2021-04-15 14:39:03
 * @LastEditTime: 2022-07-22 13:48:33
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
* @FilePath: \spc-web-admin\src\views\base\paramsSet/paramsSet_child_add
-->

<template>
	<!-- 菜单新增弹框 -->
	<el-dialog :title="dialogTitle" v-model="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" width="580px">
		<div class="dialog_paramsSet">
			<section class="section_input">
				<el-form :model="paramsDataForm" :rules="rules" label-width="120px" ref="ruleFormRef">
					<el-row>
						<el-col :span="24" class="item">
							<el-form-item label="明细项编码" prop="valueCode">
								<el-input :disabled="dialogTitle !== '新增'" autocomplete="off"  v-model="paramsDataForm.valueCode"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="24" class="item">
							<el-form-item label="明细项编码值" prop="valueName">
								<el-input  autocomplete="off"  v-model="paramsDataForm.valueName"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="24" class="item">
							<el-form-item prop="valueSort" label="显示顺序">
								<el-input  autocomplete="off"  v-model="paramsDataForm.valueSort"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="24" class="item">
							<el-form-item label="是否可用" prop="ifAvailable">
									<el-radio v-model="paramsDataForm.ifAvailable" label="0" >Y</el-radio>
									<el-radio v-model="paramsDataForm.ifAvailable" label="1" >N</el-radio>
							</el-form-item>
						</el-col>
						<!-- <el-col :span="24" class="item">
							<el-form-item label="是否可编辑" prop="ifEdit">
									<el-radio v-model="paramsDataForm.ifEdit" label="0" >Y</el-radio>
									<el-radio v-model="paramsDataForm.ifEdit" label="1" >N</el-radio>
							</el-form-item>
						</el-col>
						<el-col :span="24" class="item">
							<el-form-item label="是否可删除" prop="ifDelete">
									<el-radio v-model="paramsDataForm.ifDelete" label="0" >Y</el-radio>
									<el-radio v-model="paramsDataForm.ifDelete" label="1" >N</el-radio>
							</el-form-item>
						</el-col> -->
					</el-row>
				</el-form>
			</section>
			<section class="section_option df jcfe">
				<el-button  @click="cancel" class="dialogbtn" perms="cancle" round>取消</el-button>
				<el-button class="dialogbtn" type="primary"  @click="addSave()" perms="save" round>保存</el-button>
			</section>
		</div>
	</el-dialog>
</template>

<script setup lang="ts">
// 方法
import { addList, editList } from '/@/api/base/paramsSet';

import { clearFormData, isContainChineseChar, hasChinase, debounce } from '/@/utils/jsOptions';
import { reactive, toRefs, ref, getCurrentInstance  } from 'vue';
import { ElMessage } from 'element-plus';

const props = defineProps({
	params: {
		type: Object,
		default() {
			return {};
		},
	},
});
const ruleFormRef: any = ref(null)
const rules = reactive({
	valueCode: [
    { required: true, message: '请输入', trigger: 'blur' },
    { validator: hasChinase, message: '角色编码不能包含中文字符', trigger: 'blur' },
		{  max: 30, message: '不要超过30个字符', trigger: 'blur' },
  ],
  valueName: [
    { required: true, message: '请输入', trigger: 'blur' },
		{  max: 50, message: '不要超过30个字符', trigger: 'blur' },
  ],
	valueSort: [
    { required: true, message: '请输入', trigger: 'blur' },
		{ validator: hasChinase, message: '角色编码不能包含中文字符', trigger: 'blur' },
  ],
	ifAvailable: [
		{ required: true, message: '请输入', trigger: 'blur' },
	],
	ifEdit: [
		{ required: true, message: '请输入', trigger: 'blur' },
	],
	ifDelete: [
		{ required: true, message: '请输入', trigger: 'blur' },
	],
})
const emit = defineEmits(['queryList']);
const state = reactive({
	dialogTitle: '',
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
const addSave = debounce(async () => {
	await ruleFormRef.value.validate(async(valid: any, fields: any) => {
		if (valid) {
			const res: any = dialogTitle.value === '新增' 
			? await addList('child', {...paramsDataForm.value, ...props.params})
			: await editList('child', {...paramsDataForm.value, ...props.params})
			if (res.code == 0) {
				state.dialogVisible = false;
				ElMessage({
					message: res.msg,
					type: 'success',
					duration: 1500,
				});
				emit('queryList','','');
			} else {
				ElMessage({
					message: res.msg,
					type: 'error',
					duration: 3000,
				});
			}
		}
	})	
}, 500, false)


// 取消
const cancel = () => {
	state.dialogVisible = false;
	// 清空表单
	state.paramsDataForm = {
		valueCode: '', //明细项编码
		valueName: '', //明细项编码值
		ifAvailable: '1', //是否可用
		valueSort: '', //显示顺序
		ifEdit: '1', //是否可编辑
		ifDelete: '1', //是否可删除
	}
};

defineExpose({
	dialogVisible,
	paramsDataForm,
	dialogTitle
})
</script>

<style lang="scss" scoped>
// 页面公共样式
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
