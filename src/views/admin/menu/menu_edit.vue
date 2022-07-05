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
					<el-col :span="4"><i class="required">*</i>菜单编号 :</el-col>
					<el-col :span="8">
						<el-input :disabled="true" autocomplete="off" v-model="menuDataForm.menuCode"></el-input>
					</el-col>
					<el-col :span="4"><i class="required">*</i>菜单名称 :</el-col>
					<el-col :span="8">
						<el-input autocomplete="off" v-model="menuDataForm.menuName"></el-input>
					</el-col>
				</el-row>
				<el-row class='spc-el-row'>
					<el-col :span="4"> 菜单路径 : </el-col>
					<el-col :span="8" style="text-align: left">
						<el-input autocomplete="off" v-model="menuDataForm.menuUrl"></el-input>
					</el-col>
					<el-col :span="4"> 上级菜单 : </el-col>
					<el-col :span="8" style="text-align: left">
						<n-tree-select
							ref="treeSelect"
							style="width: 100%"
							:propes="options"
							:values="valueId"
							:options="treeData"
							:clearable="true"
							:accordion="true"
							@getValue="getValue($event)"
						></n-tree-select>
					</el-col>
				</el-row>
				<el-row class='spc-el-row'>
					<el-col :span="4"> 菜单图标 : </el-col>
					<el-col :span="8">
						<el-input autocomplete="off" v-model="menuDataForm.menuIcon"></el-input>
					</el-col>
					<el-col :span="4"> <i class="required">*</i>菜单顺序 : </el-col>
					<el-col :span="8">
						<el-input type="number" autocomplete="off" v-model="menuDataForm.menuSort"></el-input>
					</el-col>
				</el-row>
				<el-row class='spc-el-row'>
					<el-col :span="4"> <i class="required">*</i>启用状态 :</el-col>
					<el-col :span="8" style="text-align: left">
						<el-switch v-model="menuDataForm.menuState"> </el-switch>
					</el-col>
					<el-col :span="4"> <i class="required">*</i>是否可见 :</el-col>
					<el-col :span="8" style="text-align: left">
						<el-switch v-model="menuDataForm.menuVisible"> </el-switch>
					</el-col>
				</el-row>
			</section>
			<section class="section_textarea">
				<el-row class='spc-el-row'>
					<el-col :span="4"> 备注 : </el-col>
					<el-col :span="20">
						<el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5 }" v-model="menuDataForm.remark"> </el-input>
					</el-col>
				</el-row>
			</section>
			<section class="section_option flex-c-c">
				<el-button type="primary"  @click="editSave(menuDataForm)">保存</el-button>
				<el-button type="primary"  @click="cancel">取消</el-button>
			</section>
		</div>
	</el-dialog>
</template>

<script setup lang="ts">
// 组件
import nTreeSelect from '/@/components/nTreeSelect/index.vue';

// 方法
import { editList, findMenuList } from '/@/api/admin/menu';
import { reactive, toRefs } from 'vue';
import { ElMessage } from 'element-plus';
const state = reactive({
	dialogTitle: '菜单编辑',
	dialogVisible: false,
	// 树形结构相关参数
	treeData: [],
	valueId: '',
	options: {
		value: 'id',
		children: 'children',
		label: 'menuName',
	},
	// 菜单新增数据
	menuDataForm: {
		menuCode: null, // 菜单编码
		menuName: null, // 菜单名称
		menuUrl: null, // 菜单路径
		parentId: null, // 上级菜单
		menuIcon: null, // 菜单图标
		menuSort: null, // 菜单顺序
		menuState: true, //启用状态
		menuVisible: true, //是否可见
		remark: null, //备注
	} as any,
});
const { dialogTitle, dialogVisible, treeData, valueId, options, menuDataForm } = toRefs(state);
const emit = defineEmits(['queryList']);
// 上级菜单
const getValue = (value: string) => {
	state.menuDataForm.parentId = value;
	state.valueId = value;
};
// 保存
const editSave = async (menuDataForm: {
	menuName: string | null;
	menuSort: null;
	menuState: number;
	menuVisible: number;
	parentId: string | null;
}) => {
	if (menuDataForm.menuName == null || menuDataForm.menuName == '') {
		return ElMessage({
			message: '请填写菜单编号',
			type: 'error',
		});
	}
	if (menuDataForm.menuSort == null) {
		return ElMessage({
			message: '请填写菜单顺序',
			type: 'error',
		});
	}
	let menuState = menuDataForm.menuState;
	if (menuState) {
		menuDataForm.menuState = 0;
	} else {
		menuDataForm.menuState = 1;
	}
	let menuVisible = menuDataForm.menuVisible;
	if (menuVisible) {
		menuDataForm.menuVisible = 0;
	} else {
		menuDataForm.menuVisible = 1;
	}
	if (menuDataForm.parentId == null) menuDataForm.parentId = '';

	const res: any = await editList(menuDataForm);

	if (res.code == 0) {
		ElMessage({
			message: res.msg,
			type: 'success',
			duration: 1500,
		});
		emit('queryList');
		// 清空表单
		cancel();
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
const load = async () => {
	state.treeData = (await findMenuList()).data;
};
defineExpose({
	load,
	menuDataForm,
	getValue,
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
