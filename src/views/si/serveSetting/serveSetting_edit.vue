<!--
 * @Autor: 曾宇奇
 * @Date: 2021-06-16 09:02:47
 * @LastEditTime: 2022-07-04 09:00:21
 * @LastEditors: Administrator 848563840@qq.com
 * @FilePath: \vue-next-admin\src\views\home\index.vue
-->

<template>
	<!-- 服务配置编辑弹框 -->
	<el-dialog :title="dialogTitle" v-model="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" width="80%">
		<div class="dialog_serveSetting">
			<section class="section_input">
				<el-row class='spc-el-row'>
					<el-col :span="4"> <i class="required">*</i>服务代码 :</el-col>
					<el-col :span="8">
						<el-input autocomplete="off" v-model="serveSettingForm.serviceCode" disabled></el-input>
					</el-col>
					<el-col :span="4">服务名称 :</el-col>
					<el-col :span="8">
						<el-input autocomplete="off" v-model="serveSettingForm.serviceName"></el-input>
					</el-col>
				</el-row>

				<el-row class='spc-el-row'>
					<el-col :span="4"><i class="required">*</i>服务类型 :</el-col>
					<el-col :span="8">
						<el-select style="width: 100%" placeholder="请选择" disabled v-model="serveSettingForm.serviceType" @change="serviceTypeChange">
							<el-option :label="item.label" :value="item.value" v-for="item in selectList" :key="item.value" />
						</el-select>
					</el-col>
				</el-row>

				<el-row class='spc-el-row'>
					<el-col :span="4"> 服务类路径 : </el-col>
					<el-col :span="20" style="text-align: left">
						<el-input autocomplete="off" :disabled="checkShow" v-model="serveSettingForm.serviceUrl"></el-input>
					</el-col>
				</el-row>
				<el-row class='spc-el-row'>
					<el-col :span="4">服务方法名 : </el-col>
					<el-col :span="20">
						<el-input autocomplete="off" :disabled="checkShow" v-model="serveSettingForm.serviceMethod"></el-input>
					</el-col>
				</el-row>
				<el-row class='spc-el-row'>
					<el-col :span="4">服务说明 :</el-col>
					<el-col :span="20" style="text-align: left">
						<el-input autocomplete="off" v-model="serveSettingForm.serviceDescript"></el-input>
					</el-col>
				</el-row>
			</section>
			<section class="section_textarea">
				<el-row class='spc-el-row'>
					<el-col :span="4">测试参数 : </el-col>
					<el-col :span="20">
						<el-input type="textarea" :disabled="checkShow" :autosize="{ minRows: 3, maxRows: 5 }" v-model="serveSettingForm.serviceParams">
						</el-input>
					</el-col>
				</el-row>
			</section>

			<section class="section_textarea">
				<el-row class='spc-el-row'>
					<el-col :span="4"> SQL : </el-col>
					<el-col :span="20">
						<el-input type="textarea" :disabled="!checkShow" v-model="serveSettingForm.sqlContent" :autosize="{ minRows: 3, maxRows: 5 }"> </el-input>
					</el-col>
				</el-row>
			</section>

			<section class="section_option">
				<el-button type="primary"  @click="editSave(serveSettingForm)" perms="save">保存</el-button>
				<el-button type="primary"  @click="cancel" perms="cancle">取消</el-button>
			</section>
		</div>
	</el-dialog>
</template>

<script setup lang="ts">
// 方法
import { clearFormData } from '/@/utils/jsOptions';
import { editList, } from '/@/api/si/serveSetting';
import { reactive, toRefs } from 'vue';
import { ElMessage } from 'element-plus';

const state = reactive({
	dialogTitle: '接口配置',
	dialogVisible: false,
	checkShow: false,
	// 服务配置编辑数据
	serveSettingForm: {} as any,
	selectList: [
		{ label: 'SQL', value: 0 },
		{ label: 'JAVA', value: 1 },
	],
});
const { selectList, serveSettingForm, checkShow, dialogTitle, dialogVisible } = toRefs(state);
const emit = defineEmits(['queryList']);
const serviceTypeChange = (value: number) => {
	if (value == 1) state.checkShow = false;
	else state.checkShow = true;
};

// 保存
const editSave = async (serveSettingForm: { [x: string]: string }) => {
	const res: any = await editList(serveSettingForm);
	if (res.code == 0) {
		ElMessage({
			message: res.msg,
			type: 'success',
			duration: 1500,
		});
		emit('queryList');
		// 清空表单
		clearFormData(serveSettingForm);
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
};
defineExpose({
	dialogVisible,
	serveSettingForm,
	checkShow
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
