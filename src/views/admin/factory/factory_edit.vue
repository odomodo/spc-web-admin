<!--
 * @Author: 曾宇奇
 * @Date: 2021-04-15 14:39:03
 * @LastEditTime: 2022-04-20 13:32:31
 * @LastEditors: zhuangxingguo
 * @FilePath: \vue-next-admin\src\views\home\index.vue
-->

<template>
	<!-- 菜单新增弹框 -->
	<el-dialog :title="dialogTitle" v-model="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" width="66%">
		<div class="dialog_factory">
			<section class="section_input">
				<el-row class='spc-el-row'>
					<el-col :span="4"><i class="required">*</i>工厂模型编号 :</el-col>
					<el-col :span="8">
						<el-input :disabled="true" autocomplete="off" v-model="factoryDataForm.factoryCode"></el-input>
					</el-col>
					<el-col :span="4"><i class="required">*</i>工厂模型名称 :</el-col>
					<el-col :span="8">
						<el-input autocomplete="off" v-model="factoryDataForm.factoryName"></el-input>
					</el-col>
				</el-row>

				<el-row class='spc-el-row'>
					<el-col :span="4"> 产商代码 : </el-col>
					<el-col :span="8">
						<el-input autocomplete="off" v-model="factoryDataForm.businessCode"></el-input>
					</el-col>
					<el-col :span="4"> 产地代码 : </el-col>
					<el-col :span="8">
						<el-input autocomplete="off" v-model="factoryDataForm.placeOriginCode"></el-input>
					</el-col>
				</el-row>
				<el-row class='spc-el-row'>
					<el-col :span="4">
						<i class="required">*</i>
						数据库IP :
					</el-col>
					<el-col :span="8">
						<el-input autocomplete="off" v-model="factoryDataForm.dataBaseIp"></el-input>
					</el-col>
					<el-col :span="4">
						<i class="required">*</i>
						数据库端口 :
					</el-col>
					<el-col :span="8">
						<el-input autocomplete="off" v-model="factoryDataForm.dataBasePort"></el-input>
					</el-col>
				</el-row>
				<el-row class='spc-el-row'>
					<el-col :span="4">
						<i class="required">*</i>
						连接用户名 :
					</el-col>
					<el-col :span="8">
						<el-input autocomplete="off" v-model="factoryDataForm.dataBaseUser"></el-input>
					</el-col>
					<el-col :span="4">
						<i class="required">*</i>
						连接密码 :
					</el-col>
					<el-col :span="8">
						<el-input autocomplete="off" v-model="factoryDataForm.dataBasePwd"></el-input>
					</el-col>
				</el-row>
				<el-row class='spc-el-row'>
					<el-col :span="4">
						<i class="required">*</i>
						数据库名 :
					</el-col>
					<el-col :span="8">
						<el-input autocomplete="off" v-model="factoryDataForm.dataBaseName"></el-input>
					</el-col>
					<el-col :span="4">
						<i class="required">*</i>
						模式schema名 :
					</el-col>
					<el-col :span="8">
						<el-input autocomplete="off" v-model="factoryDataForm.databaseSchema"></el-input>
					</el-col>
				</el-row>
				<el-row class='spc-el-row'>
					<el-col :span="4"> <i class="required">*</i>启用状态 :</el-col>
					<el-col :span="20" style="text-align: left">
						<el-switch v-model="factoryDataForm.factoryState"> </el-switch>
					</el-col>
				</el-row>
			</section>
			<section class="section_textarea">
				<el-row class='spc-el-row'>
					<el-col :span="4"> 备注 : </el-col>
					<el-col :span="20">
						<el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5 }" v-model="factoryDataForm.description"> </el-input>
					</el-col>
				</el-row>
			</section>
			<section class="section_option flex-c-c">
				<el-button type="primary" size="small" @click="editSave(factoryDataForm)">保存</el-button>
				<el-button type="primary" size="small" @click="cancel">取消</el-button>
			</section>
		</div>
	</el-dialog>
</template>

<script setup lang="ts">
import { reactive, onMounted, watch, toRefs, defineExpose } from 'vue';
import { editList, getAreaDnList } from '/@/api/admin/factory';
import { ElMessage } from 'element-plus';
const emit = defineEmits(['queryList']);
const state = reactive({
	dialogTitle: '工厂修改',
	dialogVisible: false,
	parentId: true,
	dnData: {
		areaDnList: [],
		factoryTypeList: [
			{ keyValue: 0, keyName: '地区' },
			{ keyValue: 1, keyName: '工厂' },
		],
	},
	// 工厂新增数据
	factoryDataForm: {} as any,
});
const { dialogTitle, dialogVisible, parentId, factoryDataForm, dnData } = toRefs(state);
watch(() => state.factoryDataForm.factoryType, (newValue: number) => {
	if (newValue == 1) {
		state.parentId = false;
	} else {
		state.parentId = true;
		state.factoryDataForm.parentId = null;
	}
});

// 保存
const editSave = async (factoryDataForm: { factoryName: string | null; factoryState: number }) => {
	if (factoryDataForm.factoryName == null || factoryDataForm.factoryName == '') {
		return ElMessage({
			message: '请填写工厂模型名称',
			type: 'error',
		});
	}

	let factoryState = factoryDataForm.factoryState;
	if (factoryDataForm.factoryState) {
		factoryDataForm.factoryState = 0;
	} else {
		factoryDataForm.factoryState = 1;
	}
	// this.$delete(state.factoryDataForm, "hasChildren");
	// this.$delete(state.factoryDataForm, "hasMenu");
	// this.$delete(state.factoryDataForm, "addUserId");
	// this.$delete(state.factoryDataForm, "addTime");
	const res: any = await editList(factoryDataForm);

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
			duration: 3000,
		});
	}
	factoryDataForm.factoryState = factoryState;
};
// 取消
const cancel = () => {
	state.dialogVisible = false;
};
// 数据加载
const load = async () => {
	state.dnData.areaDnList = (await getAreaDnList()).data;
};
onMounted(() => {
	load();
});
defineExpose({
	factoryDataForm,
	dialogVisible,
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
