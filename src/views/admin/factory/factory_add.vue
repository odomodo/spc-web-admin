<!--
 * @Author: 曾宇奇
 * @Date: 2021-04-15 14:39:03
 * @LastEditTime: 2022-06-28 14:15:19
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * 别问为什么新增跟编辑分开，问就是历史遗留 by-liuxinyi
 * 后期重构，编辑与新增用同一个组件 by-liuxinyi
 * @FilePath: \vue-next-admin\src\views\home\index.vue
-->

<template>
	<!-- 菜单新增弹框 -->
	<el-dialog :title="dialogTitle" v-model="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" width="50%" @close="cancel">
		<div class="dialog_factory">
			<section class="section_input">
				<el-form :model="factoryDataForm" label-width="120px" :rules="rules" ref="ruleFormRef">
					<el-row>
						<el-col :span="12" class="item">
							<el-form-item label="工厂模型编号" prop="factoryCode">
								<el-input autocomplete="off" v-model="factoryDataForm.factoryCode" :disabled="dialogTitle !== '工厂新增'"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12" class="item">
							<el-form-item label="工厂模型名称" prop="factoryName">
								<el-input autocomplete="off" v-model="factoryDataForm.factoryName"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12" class="item">
							<el-form-item label="启用状态" prop="factoryState">
								<el-switch v-model="factoryDataForm.factoryState" :active-value="0" :inactive-value="1"> </el-switch>
							</el-form-item>
						</el-col>
						<el-col :span="12" class="item">
							<el-form-item label="工厂地址" prop="factoryAddress">
								<el-input v-model="factoryDataForm.factoryAddress"> </el-input>
							</el-form-item>
						</el-col>
						<el-col :span="24" class="item">
							<el-form-item label="备注" prop="description">
								<el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5 }" v-model="factoryDataForm.description"> </el-input>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</section>

			<section class="section_option flex-c-c">
				<el-button type="primary"  @click="addSave(ruleFormRef)">保存</el-button>
				<el-button type="primary"  @click="cancel">取消</el-button>
			</section>
		</div>
	</el-dialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, toRefs, watch, defineExpose, ref } from 'vue';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus'
// 方法
import { clearFormData, isContainChineseChar, hasChinase } from '/@/utils/jsOptions';
import { addList, getFactoryDnList, editList } from '/@/api/admin/factory';
const	dialogTitle = ref('')
const dialogVisible = ref(false)
const ruleFormRef = ref<any>(null)
const	factoryDataForm = ref<any>({
	factoryCode: '', //工厂模型编号
	factoryName: '', //工厂模型名称
	factoryState: 0, //启用状态
	description: '', //备注
})
const rules = reactive<FormRules>({
  factoryCode: [
    { required: true, message: '请输入', trigger: 'blur' },
    { validator: hasChinase, message: '角色编码不能包含中文字符', trigger: 'blur' },
  ],
  factoryName: [
    { required: true, message: '请输入', trigger: 'blur' },
  ],
  factoryAddress: [
    { required: true, message: '请输入', trigger: 'blur' },
  ],
})
const emit = defineEmits(['queryList']);
// 保存
const addSave = async (formEl: any) => {
	if (!formEl) return
	await formEl.validate(async(valid: any, fields: any) => {
		if (valid) {
			const res: any = dialogTitle.value === '工厂新增' ? await addList(factoryDataForm.value) : await editList(factoryDataForm.value); 
			if (res.code == 0) {
				ElMessage({
					message: res.msg,
					type: 'success',
					duration: 1500,
				});
				emit('queryList');
				dialogVisible.value = false;
			} else {
				ElMessage({
					message: res.msg,
					type: 'error',
					duration: 3000,
				});
			}
		}
	})
};
// 取消
const cancel = () => {
	dialogVisible.value = false;
	factoryDataForm.value = {}
};


onMounted(() => {
});

defineExpose({
	dialogVisible,
	dialogTitle,
	factoryDataForm,
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

<style lang="scss" scoped>
.item {
	margin-bottom: 20px;
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
