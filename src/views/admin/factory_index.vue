<!--
 * @Author: 曾宇奇
 * @Date: 2021-04-15 14:39:03
 * @LastEditTime: 2022-07-18 15:51:15
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @FilePath: \vue-next-admin\src\views\home\index.vue
-->

<template>
	<!-- 工厂管理 -->
	<div class="factory">
		<!-- 选择框组 -->
		<div class="select_group flex-c">
			<div class="select3">
				<label>状态:</label>
				<el-select placeholder="请选择" v-model="factorySelectData.factoryState">
					<el-option label="停用" value="1"> </el-option>
					<el-option label="启用" value="0"> </el-option>
					<el-option label="全部" value="2" selected="selected"> </el-option>
				</el-select>
			</div>

			<div class="spc-button">
				<svg-icon iconName="search_icon"  tipLable="搜索"  iconSize="12" @click="queryList(factorySelectData)"></svg-icon>
			</div>
			<div class="spc-button">
				<svg-icon iconName="重置_icon"  tipLable="重置"  iconSize="12" @click="reset"></svg-icon>
			</div>

			<el-button class="spc-right" style="right: 16px;" type="primary"  :icon="Plus" @click="addNew">新增</el-button>
		</div>

		<!-- 按钮组 -->
		<div class="button_group">
			<!-- <el-button type="info" plain icon="el-icon-upload2" 
        >导入</el-button
      >
      <el-button type="warning" plain icon="el-icon-download" 
        >导出</el-button
      > -->
		</div>
		<!-- 新增工厂弹窗 -->
		<factory-add ref="factoryAdds" @queryList="queryList"></factory-add>
		<!-- 工厂管理表格 -->
		<n-table ref="indexTable" :tableConfig="factoryTableConfig" style="margin-top: 5px"></n-table>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, toRefs } from 'vue';
import nTable from '/@/components/nTable/index.vue';
import { clearFormData } from '/@/utils/jsOptions';
import factoryAdd from './factory/factory_add.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Refresh, Search, Plus } from '@element-plus/icons-vue';
// 方法
import { getModelListUrl, deleteById, getAreaDnList, getFactoryDnList } from '/@/api/admin/factory';

const factoryAdds = ref();
const factoryEdits = ref();
const indexTable = ref();

const state = reactive({
	dialogVisible: false, //是否展示对话框
	isEdit: false, //是否进入编辑状态（编辑状态下禁止修改用户名称）
	// 表格配置
	factoryTableConfig: {
		url: getModelListUrl(),
		//表格表头
		columns: [
			{
				prop: 'factoryName',
				label: '工厂名称',
			},
			{
				prop: 'description',
				label: '描述',
			},
			// {
			// 	prop: 'businessCode',
			// 	label: '产商代码',
			// },
			// {
			// 	prop: 'placeOriginCode',
			// 	label: '产地代码',
			// },
			{
				prop: 'addTime',
				label: '创建时间',
			},
			{
				prop: 'addUserId',
				label: '创建人',
			},
			{
				prop: 'editTime',
				label: '更新时间',
			},
			{
				prop: 'editUserId',
				label: '更新人',
			},
			{
				prop: 'factoryState',
				label: '启用状态',

				formatter(row: any, column: any, cellValue: number, index: any) {
					return cellValue == 1 ? '停用' : '启用';
				},
			},
		],
		showPagination: true, //不分页
		showOperation: true, //是否显示操作字段
		//操作按钮列表
		options: [
			{
				type: 'warning',
				label: '编辑',
				icon: 'edit',
				click: (index: any, row: any) => {
					factoryAdds.value.dialogTitle = '工厂编辑';
					factoryAdds.value.dialogVisible = true;
					factoryAdds.value.factoryDataForm = JSON.parse(JSON.stringify(row))
				},
			},
			{
				type: 'danger',
				label: '删除',
				icon: 'delete',
				click: (index: any, row: any) => {
					ElMessageBox.confirm('确定删除?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
					})
						.then(async () => {
							const res: any = await deleteById(row);
							console.log(res);
							ElMessage({
								type: 'success',
								message: res.msg,
							});
							indexTable.value.reload();
						})
						.catch((err) => {
							console.log(321, err);
							
							ElMessage({
								type: 'info',
								message: '已取消删除',
							});
						});
				},
			},
		],
		//操作按钮样式
		operationColumn: {
			// 样式
			style: {},
			// 属性
			attr: {},
		},
	},
	// 工厂选择下拉框值
	factorySelectData: {
		factoryState: '2', //状态
	} as any,
	// 下拉框数据
	dnData: {
		areaDnList: [], //地区下拉框列表
		factoryDnList: [], //工厂下拉框列表
	},
	// 工厂新增数据
	factoryDataForm: {
		factoryCode: '', //工厂模型编号
		factoryName: '', //工厂模型名称
		factoryType: '', //工厂模型类型 (1--工厂 2--地区)
		factoryState: true, //启用状态
		businessCode: '', //产商代码
		placeOriginCode: '', //产地代码
		dataSourceCfg: '', //数据源配置
	},
});
const { dialogVisible, isEdit, factoryTableConfig, factorySelectData, dnData, factoryDataForm } = toRefs(state);
// 查询
const queryList = (factorySelectData?: { factoryState: string }) => {
	console.log(32111);
	indexTable.value.find(factorySelectData);
};
// 新增
const addNew = () => {
	factoryAdds.value.dialogTitle = '工厂新增';
	factoryAdds.value.dialogVisible = true;
};
// 重置
const reset = () => {
	// 清空下拉框数据
	state.factorySelectData = clearFormData(state.factorySelectData);
	state.factorySelectData.factoryState = '2';
	queryList(state.factorySelectData);
};
// 获取下拉框列表
const getDnList = async () => {
	// 获取地区下拉框列表
	//this.dnData.areaDnList = (await getAreaDnList()).data;
	// 获取工厂下拉框列表
	state.dnData.factoryDnList = (await getFactoryDnList()).data;
};
onMounted(() => {
	getDnList();
});
</script>

// 自定义样式
<style lang="scss" scoped>
.required {
	color: red;
}
.factory {
	background-color: #ffffff;
	.button_group {
		margin-top: 5px;
		padding-left: 20px;
	}
	.select_group {
		padding: 10px 0 0 20px;
		label {
			width: 34px;
			margin-right: 10px;
			font-size: 13px;
			color: #606266;
		}
	}
}
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
.el-select {
	margin-right: 3px;
}
</style>
