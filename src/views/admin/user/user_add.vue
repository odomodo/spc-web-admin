<!--
 * @Author: 曾宇奇
 * @Date: 2021-04-15 14:39:03
 * @LastEditTime: 2022-07-27 13:53:36
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @FilePath: \vue-next-admin\src\views\home\index.vue
-->

<template>
	<!-- 用户新增弹窗 -->
	<el-dialog :title="dialogTitle" v-model="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" width="780px" @close="cancel">
		<div class="dialog_user">
			<section class="section_input">
				<el-form  :model="userDataForm" label-width="80px" :rules="dialogTitle !== '用户查看' ? rules: ''" ref="ruleFormRef">
					<el-row>
						<el-col :span="12" class="item"  :class="{item1: dialogTitle === '用户查看'}">
							<el-form-item label="用户账号" prop="userId" >
								<el-input autocomplete="off" v-if="dialogTitle === '用户新增'"  v-model.trim="userDataForm.userId" onfocus="this.removeAttribute('readonly');" ></el-input>
								<p v-else>{{userDataForm.userId}}</p>
							</el-form-item>
						</el-col>
						<el-col :span="12" class="item"  :class="{item1: dialogTitle === '用户查看'}">
							<el-form-item label="用户名称" prop="userName" >
								<el-input autocomplete="off" v-if="dialogTitle !== '用户查看'" v-model.trim="userDataForm.userName" onfocus="this.removeAttribute('readonly');" ></el-input>
								<p v-else>{{userDataForm.userName}}</p>
							</el-form-item>
						</el-col>
						<el-col :span="12" class="item"  :class="{item1: dialogTitle === '用户查看'}"  v-if="dialogTitle === '用户新增'">
							<el-form-item label="用户密码" prop="userPwd" >
								<el-input autocomplete="off" v-if="userDataForm" v-model="userDataForm.userPwd" show-password onfocus="this.removeAttribute('readonly');" ></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12" class="item"  :class="{item1: dialogTitle === '用户查看'}" v-if="dialogTitle === '用户新增'">
							<el-form-item label="确认密码" prop="comfirmPwd" >
								<el-input autocomplete="off" v-if="userDataForm" v-model="userDataForm.comfirmPwd" show-password onfocus="this.removeAttribute('readonly');" ></el-input>
								<p v-else>{{userDataForm.userName}}</p>
							</el-form-item>
						</el-col>
						<el-col :span="12" class="item"  :class="{item1: dialogTitle === '用户查看'}">
							<el-form-item label="启用状态" prop="userState" >
								<el-switch v-if="dialogTitle !== '用户查看'" v-model="userDataForm.userState" :active-value="0" :inactive-value="1"></el-switch>
								<p v-else>{{userDataForm.factoryState === 0 ? '启用' : '停用'}}</p>
							</el-form-item>
						</el-col>
						<el-col :span="12" class="item"  :class="{item1: dialogTitle === '用户查看'}" v-if="dialogTitle !== '用户新增'">
							<el-form-item label="用户识别码" prop="identificatCode" label-width="110px">
								<p>{{userDataForm.identificatCode}}</p>
							</el-form-item>
						</el-col>
						<el-col :span="12" class="item"  :class="{item1: dialogTitle === '用户查看'}">
							<el-form-item label="所属工厂" prop="factoryList" >
								<el-select v-if="dialogTitle !== '用户查看'" style="width: 100%" placeholder="请选择工厂" multiple v-model="userDataForm.factoryList">
									<el-option :label="item.factoryName" :value="item.factoryCode" v-for="(item, index) in dnData.factoryDnList" :key="index"> </el-option>
								</el-select>
								<p v-else>{{userDataForm.userName}}</p>
							</el-form-item>
						</el-col>
						<el-col :span="12" class="item"  :class="{item1: dialogTitle === '用户查看'}">
							<el-form-item label="联系方式" prop="contactWay" >
								<el-input autocomplete="off" v-if="dialogTitle !== '用户查看'" v-model="userDataForm.contactWay"></el-input>
								<p v-else>{{userDataForm.contactWay}}</p>
							</el-form-item>
						</el-col>
						<el-col :span="24" class="item"  :class="{item1: dialogTitle === '用户查看'}">
							<el-form-item label="备注" prop="contactWay" >
								<el-input  type="textarea" :autosize="{ minRows: 3, maxRows: 5 }"  v-if="dialogTitle !== '用户查看'" autocomplete="off" v-model="userDataForm.description"></el-input>
								<p v-else>{{userDataForm.description}}</p>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</section>
			<section class="section_option" v-if="dialogTitle !== '用户查看'">
				<el-button class="dialogbtn"  @click="cancel" perms="cancle" round>取消</el-button>
				<el-button class="dialogbtn"  type="primary"  @click="addSave(ruleFormRef)">保存</el-button>
			</section>
			<section class="section_option" v-else>
				<el-button class="dialogbtn" type="primary"  @click="cancel">返回</el-button>
			</section>
		</div>
	</el-dialog>
</template>

<script setup lang="ts">
// 方法
import { isContainChineseChar, hasChinase } from '/@/utils/jsOptions';
import { addList, getFactoryDnList } from '/@/api/admin/user';
import { reactive, toRefs, ref } from 'vue';
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus';

const emit = defineEmits(['queryList']);
const rules = reactive<FormRules>({
  userId: [
    { required: true, message: '请输入', trigger: 'blur' },
    { validator: hasChinase, message: '不能包含中文字符', trigger: 'blur' },
  ],
  userName: [
    { required: true, message: '请输入', trigger: 'blur' },
  ],
  userPwd: [
    { required: true, message: '请输入', trigger: 'blur' },
  ],
	comfirmPwd: [
    { required: true, message: '请输入', trigger: 'blur' },
  ],
	userState: [
    { required: true, message: '请输入', trigger: 'blur' },
  ],
	factoryList: [
    { required: true, message: '请输入', trigger: 'blur' },
  ],
})

const dialogTitle: any = ref('用户新增') 
const ruleFormRef: any = ref(null) 
const dialogVisible: any = ref(false) 
const userDataForm: any = ref({
		userId: null,
		userName: '', //用户名称
		userPwd: '', //用户密码
		comfirmPwd: null, //确认密码
		factoryList: [],
		identificatCode: null,
		userState: true,
		contactWay: null,
		description: null,
	})
const state = reactive({
	// 下拉框数据
	dnData: {
		factoryDnList: [] as Array<any>, //工厂
	}
});
const {  dnData } = toRefs(state);
// 保存
const addSave = async (formEl: any) => {
	if (userDataForm.value.comfirmPwd !== userDataForm.value.userPwd) {
		return ElMessage({
			message: '两次密码不一致 ',
			type: 'error',
		});
	}
	if (!formEl) return
	await formEl.validate(async(valid: any, fields: any) => {
		if (valid) {
			const res: any = await addList(userDataForm.value);
			if (res.code === 0) {
				ElMessage({
					message: res.msg,
					type: 'success',
					duration: 1500,
				});
				emit('queryList');
				userDataForm.value = {};
				dialogVisible.value = false;
			} else {
				ElMessage({
					message: res.msg,
					type: 'error',
				});
			}
		}
	})
};
// 取消
const cancel = () => {
	dialogVisible.value  = false;
	userDataForm.value = {}
};

// 获取下拉框列表
const getDnList = async () => {
	// 获取工厂下拉框列表
	state.dnData.factoryDnList = (await getFactoryDnList()).data;
};

defineExpose({
	getDnList,
	userDataForm,
	dialogVisible,
	dialogTitle
});
</script>

<style lang="scss" scoped>

.item{
	margin-bottom: 20px;
	padding-right: 10px;
}
.item1{
	margin-bottom: 10px;
}
</style>
