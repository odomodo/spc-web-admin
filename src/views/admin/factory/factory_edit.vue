<!--
 * @Author: 曾宇奇
 * @Date: 2021-04-15 14:39:03
 * @LastEditTime: 2022-07-04 08:59:38
 * @LastEditors: Administrator 848563840@qq.com
 * @FilePath: \vue-next-admin\src\views\home\index.vue
-->

<template>
	<!-- 菜单新增弹框 -->
	<el-dialog :title="dialogTitle" v-model="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" width="50%">
		<div class="dialog_factory">
			<section class="section_input">
				<el-row class='spc-el-row'>
					<el-col :span="4"><i class="required">*</i>工厂模型编号 :</el-col>
					<el-col :span="8">
						<el-input autocomplete="off" v-model="factoryDataForm.factoryCode"></el-input>
					</el-col>
					<el-col :span="4"><i class="required">*</i>工厂模型名称 :</el-col>
					<el-col :span="8">
						<el-input autocomplete="off" v-model="factoryDataForm.factoryName"></el-input>
					</el-col>
				</el-row>
				<el-row class='spc-el-row'>
					<el-col :span="4"> <i class="required">*</i>启用状态 :</el-col>
					<el-col :span="8" style="text-align: left">
						<el-switch v-model="factoryDataForm.factoryState"> </el-switch>
					</el-col>
					<el-col :span="4"> <i class="required">*</i>工厂地址 :</el-col>
					<el-col :span="8" style="text-align: left">
						<el-input v-model="factoryDataForm.factoryAddress"> </el-input>
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
				<el-button type="primary"  @click="editSave(factoryDataForm)">保存</el-button>
				<el-button type="primary"  @click="cancel">取消</el-button>
			</section>
		</div>
	</el-dialog>
</template>

<script setup lang="ts">
import { reactive, onMounted, watch, toRefs } from 'vue';
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
