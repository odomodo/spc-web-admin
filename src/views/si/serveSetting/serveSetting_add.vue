<!--
 * @Autor: 曾宇奇
 * @Date: 2021-06-16 09:02:47
 * @LastEditTime: 2022-04-20 13:32:31
 * @LastEditors: zhuangxingguo
 * @FilePath: \vue-next-admin\src\views\home\index.vue
-->

<template>
	<!-- 服务配置新增弹框 -->
	<el-dialog :title="dialogTitle" v-model="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" width="80%">
		<div class="dialog_serveSetting">
			<section class="section_input">
				<el-row class='spc-el-row'>
					<el-col :span="4"><i class="required">*</i>服务代码 :</el-col>
					<el-col :span="8">
						<el-input autocomplete="off" v-model="serveSettingForm.serviceCode"></el-input>
					</el-col>
					<el-col :span="4">服务名称 :</el-col>
					<el-col :span="8">
						<el-input autocomplete="off" v-model="serveSettingForm.serviceName"></el-input>
					</el-col>
				</el-row>

				<el-row class='spc-el-row'>
					<el-col :span="4"><i class="required">*</i>服务类型 :</el-col>
					<el-col :span="8">
						<el-select style="width: 100%" placeholder="请选择" v-model="serveSettingForm.serviceType" @change="serviceTypeChange">
							<el-option label="SQL" value="0"> </el-option>
							<el-option label="Java" value="1"> </el-option>
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

			<section class="section_option flex-c-c">
				<el-button type="primary" size="small" @click="addSave(serveSettingForm)" perms="save">保存</el-button>
				<el-button type="primary" size="small" @click="cancel" perms="cancle">取消</el-button>
			</section>
		</div>
	</el-dialog>
</template>

<script setup lang="ts">
// 方法
import { clearFormData, isContainChineseChar } from '/@/utils/jsOptions';
import { addList } from '/@/api/si/serveSetting';
import { reactive, toRefs, defineExpose} from 'vue';
import { ElMessage, } from 'element-plus';
const state = reactive({
	dialogTitle: '接口配置',
	dialogVisible: false,
	checkShow: true,
	// 服务配置新增数据
	serveSettingForm: {
		serviceCode: '', //服务代码
		serviceName: '', //服务名称
		serviceType: '', //服务类型
		serviceUrl: '', //服务类路径
		serviceMethod: '', //服务方法
		serviceDescript: '', //服务说明
		serviceParams: '', //测试参数
		sqlContent: '', //SQL内容
	},
});
const { dialogTitle, dialogVisible,checkShow,serveSettingForm } = toRefs(state)
const emit = defineEmits(['queryList'])
const serviceTypeChange = (value: number) => {
	if (value == 1) state.checkShow = false;
	else state.checkShow = true;
};

// 保存
const addSave = async (serveSettingForm: { [x: string]: string; serviceCode?: any; }) => {
	if (serveSettingForm.serviceCode == '') {
		ElMessage({
			message: '必填项不能为空',
			type: 'error',
			duration: 3000,
		});
		return;
	}
	if (isContainChineseChar(serveSettingForm.serviceCode)) {
		return ElMessage({
			message: '服务代码不能包含中文字符',
			type: 'error',
		});
	}

	const res:any= await addList(serveSettingForm);
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
	clearFormData(state.serveSettingForm);
};
defineExpose({
	dialogVisible
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
