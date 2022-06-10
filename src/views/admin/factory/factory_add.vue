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
						<el-input autocomplete="off" v-model="factoryDataForm.factoryCode"></el-input>
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
				<el-button type="primary"  @click="addSave(factoryDataForm)">保存</el-button>
				<el-button type="primary"  @click="cancel">取消</el-button>
			</section>
		</div>
	</el-dialog>
</template>

<script setup lang="ts">
import { onMounted, reactive, toRefs, watch, defineExpose } from 'vue';
import { ElMessage } from 'element-plus';
// 方法
import { clearFormData, isContainChineseChar } from '/@/utils/jsOptions';
import { addList, getFactoryDnList } from '/@/api/admin/factory';
const state = reactive({
	dialogTitle: '工厂新增',
	dialogVisible: false,
	parentId: true,
	dnData: {
		areaDnList: [],
		factoryDnList: [],
		factoryTypeList: [
			{ keyValue: 0, keyName: '地区' },
			{ keyValue: 1, keyName: '工厂' },
		],
	},
	// 工厂新增数据
	factoryDataForm: {
		dataBaseIp: null, //数据库IP
		dataBasePort: null, //数据库端口
		dataBaseUser: null, //连接用户名
		dataBasePwd: null, //连接密码
		dataBaseName: null, //数据库名
		databaseSchema: null, //模式Schema名
		factoryCode: null, //工厂模型编号
		factoryName: null, //工厂模型名称
		factoryType: null, //工厂模型类型
		parentId: null, //地区
		factoryState: true, //启用状态
		businessCode: null, //产商代码
		placeOriginCode: null, //产地代码
		dataSourceCfg: null, //数据源配置
		description: null, //备注
	} as any,
});
const { dialogTitle, dialogVisible, parentId, dnData, factoryDataForm } = toRefs(state);
const emit = defineEmits(['queryList']);

// 保存
const addSave = async (factoryDataForms: {
	[x: string]: string;
	factoryCode?: any;
	factoryName?: any;
	dataBaseIp?: any;
	dataBasePort?: any;
	dataBaseUser?: any;
	dataBasePwd?: any;
	dataBaseName?: any;
	databaseSchema?: any;
	factoryState?: any;
}) => {
	if (isContainChineseChar(factoryDataForm.value.factoryCode)) {
		return ElMessage({
			message: '工厂模型编号不能包含中文字符',
			type: 'error',
		});
	}
	if (factoryDataForms.factoryCode == null || factoryDataForms.factoryCode == '') {
		return ElMessage({
			message: '请填写工厂模型编号',
			type: 'error',
		});
	}
	if (factoryDataForms.factoryName == null || factoryDataForms.factoryName == '') {
		return ElMessage({
			message: '请填写工厂模型名称',
			type: 'error',
		});
	}
	if (factoryDataForms.dataBaseIp == null || factoryDataForms.dataBaseIp == '') {
		return ElMessage({
			message: '请填写数据库IP',
			type: 'error',
		});
	}
	if (factoryDataForms.dataBasePort == null || factoryDataForms.dataBasePort == '') {
		return ElMessage({
			message: '请填写数据库端口',
			type: 'error',
		});
	}
	if (factoryDataForms.dataBaseUser == null || factoryDataForms.dataBaseUser == '') {
		return ElMessage({
			message: '请填写连接用户名',
			type: 'error',
		});
	}
	if (factoryDataForms.dataBasePwd == null || factoryDataForms.dataBasePwd == '') {
		return ElMessage({
			message: '请填写连接密码',
			type: 'error',
		});
	}
	if (factoryDataForms.dataBaseName == null || factoryDataForms.dataBaseName == '') {
		return ElMessage({
			message: '请填写数据库名',
			type: 'error',
		});
	}

	if (factoryDataForms.databaseSchema == null || factoryDataForms.databaseSchema == '') {
		return ElMessage({
			message: '请填写数据库模式Schema名',
			type: 'error',
		});
	}

	if (factoryDataForms.factoryState) {
		factoryDataForms.factoryState = 0;
	} else {
		factoryDataForms.factoryState = 1;
	}

	const res: any = await addList(factoryDataForm);

	if (res.code == 0) {
		ElMessage({
			message: res.msg,
			type: 'success',
			duration: 1500,
		});
		// this.$parent.queryList();
		emit('queryList');
		dialogVisible.value = false;
	} else {
		ElMessage({
			message: res.msg,
			type: 'error',
			duration: 3000,
		});
	}
	clearFormData(factoryDataForms);
};
// 取消
const cancel = () => {
	dialogVisible.value = false;
};
// 数据加载
const load = async () => {
	//this.dnData.areaDnList = (await getAreaDnList()).data;
	dnData.value.factoryDnList = (await getFactoryDnList()).data;
};
const opendialogVisible = () => {
	dialogVisible.value = true;
};

onMounted(() => {
	load();
});

watch(() => state.factoryDataForm.factoryType,

	(newValue: number) => {
	if (newValue == 1) {
		parentId.value = false;
	} else {
		parentId.value = true;
		factoryDataForm.value.parentId = null;
	}
});

defineExpose({
	opendialogVisible,
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
