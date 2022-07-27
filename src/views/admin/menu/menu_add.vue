<!--
 * @Author: 曾宇奇
 * @Date: 2021-04-15 14:39:03
 * @LastEditTime: 2022-07-27 14:55:11
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @FilePath: \vue-next-admin\src\views\home\index.vue
-->

<template>
	<!-- 菜单新增弹框 -->
	<el-dialog :title="dialogTitle" v-model="dialogVisible" :close-on-click-modal="false" :close-on-press-escape="false" width="780px" destroy-on-close>
		<div class="dialog_factory">
			<el-form  :model="menuDataForm" label-width="80px" :rules="dialogTitle !== '用户查看' ? rules: ''" ref="ruleFormRef">
				<el-row>
					<el-col :span="12" class="item">
							<el-form-item label="菜单编号" prop="menuCode">
								<el-input :disabled="dialogTitle === '新增'" autocomplete="off"  v-model="menuDataForm.menuCode"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12" class="item">
							<el-form-item label="菜单名称" prop="menuName">
								<el-input autocomplete="off"  v-model="menuDataForm.menuName"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12" class="item">
							<el-form-item label="菜单路径" prop="menuUrl">
								<el-input  autocomplete="off"  v-model="menuDataForm.menuUrl"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12" class="item">
							<el-form-item label="上级菜单">
								<n-tree-select
									ref="treeSelect"
									style="width: 100%"
									:propes="options"
									:values="valueId"
									:options="treeData"
									:clearable="true"
									:accordion="true"
									@getValue="getValue"
								></n-tree-select>
							</el-form-item>
						</el-col>
						<el-col :span="12" class="item">
							<el-form-item label="菜单图标" prop="menuIcon">
								<el-input  autocomplete="off"  v-model="menuDataForm.menuIcon"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12" class="item">
							<el-form-item label="菜单顺序" prop="menuSort">
								<el-input  autocomplete="off"  v-model="menuDataForm.menuSort"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12" class="item">
							<el-form-item label="启用状态" prop="menuState">
								<el-switch v-model="menuDataForm.menuState"> </el-switch>
							</el-form-item>
						</el-col>
						<el-col :span="12" class="item">
							<el-form-item label="是否可见" prop="menuVisible">
								<el-switch v-model="menuDataForm.menuVisible"> </el-switch>
							</el-form-item>
						</el-col>
						<el-col :span="24" class="item">
							<el-form-item label="备注" prop="remark">
								<el-input type="textarea" :autosize="{ minRows: 3, maxRows: 5 }" v-model="menuDataForm.remark"> </el-input>
							</el-form-item>
						</el-col>
				</el-row>
			</el-form>
			<section class="section_option" v-if="dialogTitle !== '查看'">
				<el-button class="dialogbtn"  @click="cancel" perms="cancle" round>取消</el-button>
				<el-button class="dialogbtn"  type="primary"  @click="addSave(menuDataForm)">保存</el-button>
			</section>
			<section class="section_option" v-else>
				<el-button type="primary"  @click="cancel">返回</el-button>
			</section>
		</div>
	</el-dialog>
</template>

<script setup lang="ts">
// 组件
import nTreeSelect from '/@/components/nTreeSelect/index.vue';

// 方法
import { isContainChineseChar, hasChinase } from '/@/utils/jsOptions';
import { addList, findMenuList } from '/@/api/admin/menu';
import { reactive, ref, toRefs } from 'vue';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus'
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
const state = reactive({
	dialogTitle: '菜单新增',
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
const emit = defineEmits(['queryList']);
const { menuDataForm, options, valueId, treeData, dialogVisible, dialogTitle } = toRefs(state);
const treeSelect = ref();
// 上级菜单
const getValue = (value: string) => {
	state.menuDataForm.parentId = value;
	state.valueId = value;
};
// 保存
const addSave = async (menuDataForm: {
	menuCode: string | null;
	menuName: string | null;
	menuSort: null;
	menuState: number;
	menuVisible: number;
}) => {
	if (isContainChineseChar(state.menuDataForm.menuCode)) {
		return ElMessage({
			message: '菜单编号不能包含中文字符',
			type: 'error',
		});
	}
	if (menuDataForm.menuCode == null || menuDataForm.menuCode == '') {
		return ElMessage({
			message: '请填写菜单编号',
			type: 'error',
		});
	}
	if (menuDataForm.menuName == null || menuDataForm.menuName == '') {
		return ElMessage({
			message: '请填写菜单名称',
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
	console.log(menuDataForm, 'menuDataForm');
	const res: any = await addList(menuDataForm);
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
const initData = () => {
	state.menuDataForm = Object.assign(state.menuDataForm, {
		menuCode: null, // 菜单编码
		menuName: null, // 菜单名称
		menuUrl: null, // 菜单路径
		parentId: null, // 上级菜单
		menuIcon: null, // 菜单图标
		menuSort: null, // 菜单顺序
		menuState: true, //启用状态
		menuVisible: true, //是否可见
		remark: null, //备注
	})
	// state.menuDataForm = resizeForm.call(state, 'menuDataForm');
};
// 取消
const cancel = () => {
	state.dialogVisible = false;
	initData();
	treeSelect.value.clearHandle();
};
const load = async () => {
	state.treeData = (await findMenuList()).data;
};
defineExpose({
	load,
	initData,
	dialogVisible,
})
</script>

<style lang="scss" scoped>
// 页面公共样式
.required {
	color: red;
}
// 页面样式
.item {
	margin-bottom: 20px;
}
</style>
