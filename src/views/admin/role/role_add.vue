<!--
 * @Author: 曾宇奇
 * @Date: 2021-04-15 14:39:03
 * @LastEditTime: 2022-07-28 14:49:50
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * 别问为什么新增跟编辑分开，问就是历史遗留 by-liuxinyi
 * 后期重构，编辑与新增用同一个组件 by-liuxinyi
 * @FilePath: \vue-next-admin\src\views\home\index.vue
-->

<template>
	<!-- 角色新增弹窗 -->
	<el-dialog :title="dialogTitle" v-model="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" width="780px" @close="cancel">
		<div class="dialog_role_add">
			<section class="section_input">
				<el-form :model="roleDataForm" label-width="80px" :rules="dialogTitle !== '查看' ? rules: ''" ref="ruleFormRef">
					<el-row>
						<el-col :span="12" class="item">
							<el-form-item label="角色编号" prop="roleCode">
								<el-input v-if="dialogTitle === '新增'" autocomplete="off"  v-model="roleDataForm.roleCode"></el-input>
								<p v-else>{{roleDataForm.roleCode}}</p>
							</el-form-item>
						</el-col>
						<el-col :span="12" class="item">
							<el-form-item label="角色名称" prop="roleName">
								<el-input v-if="dialogTitle !== '查看'" autocomplete="off" v-model="roleDataForm.roleName"></el-input>
								<p v-else>{{roleDataForm.roleName}}</p>
							</el-form-item>
						</el-col>
						<el-col :span="12" class="item">
							<el-form-item label="角色类型" prop="roleType">
									<el-select v-if="dialogTitle === '新增'" style="width: 100%" placeholder="请选择" v-model="roleDataForm.roleType">
									<el-option label="工厂管理员" :value="1"> </el-option>
								</el-select>
								<p v-else>{{roleDataForm.roleType}}</p>
							</el-form-item>
						</el-col>
						<el-col :span="12" class="item">
							<el-form-item label="启用状态" prop="roleState">
								<el-switch v-model="roleDataForm.roleState" :active-value="0" :inactive-value="1" v-if="dialogTitle !== '查看'"> </el-switch>
								<p v-else>{{roleDataForm.roleState}}</p>
							</el-form-item>
						</el-col>
						<el-col :span="24" class="item">
							<el-form-item label="角色描述" prop="description">
								<el-input type="textarea" v-model="roleDataForm.description" :autosize="{ minRows: 3, maxRows: 5 }" v-if="dialogTitle !== '查看'"> </el-input>
								<p v-else>{{roleDataForm.description}}</p>
							</el-form-item>
						</el-col>
						<el-col :span="24" class="item">
							<el-form-item label="备注" prop="remark">
								<el-input type="textarea" v-model="roleDataForm.remark" :autosize="{ minRows: 3, maxRows: 5 }" v-if="dialogTitle !== '查看'"> </el-input>
								<p v-else>{{roleDataForm.remark}}</p>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</section>
			<section class="section_option" v-if="dialogTitle !== '查看'">
				<el-button class="dialogbtn"  @click="cancel" perms="cancle" round>取消</el-button>
				<el-button class="dialogbtn"  type="primary"  @click="addSave(ruleFormRef)">保存</el-button>
			</section>
			<section class="section_option" v-else>
				<el-button type="primary"  @click="cancel">返回</el-button>
			</section>
		</div>
	</el-dialog>
</template>

<script setup lang="ts">
// 方法
import { clearFormData, isContainChineseChar, hasChinase } from '/@/utils/jsOptions';
import { addList, editList } from '/@/api/admin/role';
import { reactive, toRefs, ref } from 'vue';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus'
const emit = defineEmits(['queryList']);
const ruleFormRef = ref<any>(null)
const rules = reactive<FormRules>({
  roleCode: [
    { required: true, message: '请输入', trigger: 'blur' },
    { validator: hasChinase, message: '角色编码不能包含中文字符', trigger: 'blur' },
  ],
  roleName: [
    { required: true, message: '请输入', trigger: 'blur' },
  ],
  roleType: [
    { required: true, message: '请输入', trigger: 'blur' },
  ],
})
const roleDataForm: any =  ref({
	roleCode: '', //角色编码
	roleName: '', //角色名称
	roleType: '', //角色类型
	roleState: 0, //角色状态
	description: '', //角色描述
	remark: '', //角色备注
})
const dialogTitle =  ref('')
const dialogVisible = ref(false)
// 保存
const addSave = async (formEl: any) => {
	if (!formEl) return
	await formEl.validate(async(valid: any, fields: any) => {
		if (valid) {
			const res: any = dialogTitle.value === '新增' ? await addList(roleDataForm.value) : await editList(roleDataForm.value);
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
	dialogVisible.value = false
	roleDataForm.value = {}
};
defineExpose({
	dialogVisible,
	roleDataForm,
	dialogTitle
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
