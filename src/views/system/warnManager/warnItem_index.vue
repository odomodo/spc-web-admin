<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: 曾宇奇
 * @Date: 2021-05-10 10:21:03
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @LastEditTime: 2022-05-09 16:14:28
-->

<template>
  <div class="warnItem">
    <!-- 选择框组 -->
    <div class="select_group flex-c">
      <div class="flex-c">
        <label style="width:75px;">预警项：</label>
        <el-input
          placeholder="请输入"
          v-model="queryForm.warnName"
          style="margin-right: 20px"
          size="mini"
        ></el-input>
      </div>
      <div class="flex-c">
        <label>预警项类型：</label>
        <el-select placeholder="请选择" v-model="queryForm.warnType" size="mini">
          <el-option value="0" label="自动"></el-option>
          <el-option value="1" label="手动"></el-option>
        </el-select>
      </div>
      <div class="flex-c">
        <label>创建时间：</label>
        <el-date-picker
          type="datetime"
          placeholder="开始日期"
          value-format="yyyy-MM-dd"
          v-model="queryForm.startDateTime"
          size="mini"
        ></el-date-picker>
        <span style="font-weight:700; margin:0 10px;">~</span>
        <el-date-picker
          type="datetime"
          placeholder="结束日期"
          value-format="yyyy-MM-dd"
          v-model="queryForm.endDateTime"
          size="mini"
        ></el-date-picker>
      </div>
      <div class="flex-c" style="margin-left: 10px;">
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="queryList()"
          >查询</el-button
        >
        <el-button
          type="default"
          plain
          icon="el-icon-refresh"
          size="mini"
          @click="reset"
          >重置</el-button
        >
      </div>
    </div>
    <!-- 按钮组 -->
    <div class="button_group">
      <el-button
        type="primary"
        plain
        size="mini"
        perms="warnItem_menu_add"
        @click="addNew"
        >新增</el-button
      >
    </div>
    <!-- 新增预警项弹窗 -->
    <warn-item-add ref="warnitemeadd"></warn-item-add>
    <!-- 编辑预警项弹窗 -->
    <warn-item-edit ref="warnitemedit"></warn-item-edit>
    <n-table
      ref="warnItemTable"
      :tableConfig="warnItemTableConfig"
      style="margin-top: 5px"
    ></n-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import nTable from "/@/components/nTable/index.vue";
import warnItemAdd from "./warnItem/warnItem_add.vue";
import warnItemEdit from "./warnItem/warnItem_edit.vue";

// 方法
import { WarnListUrl, delList } from "/@/api/system/warnItem.ts";
import { resizeForm } from "/@/utils/jsOptions.ts";
import { formatDate } from "/@/utils/index.js";
import { ElMessage, ElMessageBox } from 'element-plus';
const warnitemedit: any = ref(null);
const warnItemTable: any = ref(null);
const warnItemTableConfig: any = {
	height: "500px",
	url: WarnListUrl(),
	//表格表头
	columns: [
		{
			prop: "warnCode",
			label: "预警项编码"
		},
		{
			prop: "warnName",
			label: "预警项名称"
		},
		{
			prop: "warnType",
			label: "预警项类型",
			formatter(row: any, column: any, cellValue: any, index: any) {
				return cellValue == 0 ? "自动" : "手动";
			}
		},
		{
			prop: "itemState",
			label: "启用状态",
			formatter(row: any, column: any, cellValue: any, index: any) {
				return cellValue == 0 ? "启用" : "禁用";
			}
		},
		{
			prop: "itemRemark",
			label: "备注"
		},
		{
			prop: "addTime",
			label: "创建时间",
			formatter(row: any, column: any, cellValue: any, index: any) {
				return formatDate(cellValue);
			}
		},
		{
			prop: "addUserId",
			label: "创建人"
		},
		{
			prop: "editTime",
			label: "更新时间",
			formatter(row: any, column: any, cellValue: any, index: any) {
				return formatDate(cellValue);
			}
		},
		{
			prop: "editUserId",
			label: "更新人"
		}
	] as any,
	showOperation: true, //是否显示操作字段
	showPagination: true, //分页
	rowNumbers: true, //是否显示行数
	//操作按钮列表
	options: [
		{
			type: "warning",
			label: "编辑",
			perms: "warnItem_menu_edit",
			click: (_: any, row: any) => {
				warnitemedit.value.paramsDataForm = { ...row };
				warnitemedit.value.dialogVisible = true;
			}
		},
		{
			type: "danger",
			label: "删除",
			perms: "warnItem_menu_delete",
			click: (_: any, row: any) => {
				ElMessageBox.confirm("确定删除?", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				})
					.then(async () => {
						const res = await delList(row.id);
						warnItemTable.value.reload();
						ElMessage({
							type: "success",
							message: res.msg
						});
					})
					.catch(() => {
						ElMessage({
							type: "info",
							message: "已取消删除"
						});
					});
			}
		}
	],
	//操作按钮样式
	operationColumn: {
		// 样式
		style: {},
		// 属性
		attr: {}
	}
}
const warnitemeadd: any = ref()
// 预警项下拉框值
const queryForm: any = ref({
	warnName: "", //预警项名称
	warnType: "", //预警项类型
	startDateTime: "", //开始时间
	endDateTime: "" //结束时间
})
// 查询
const queryList = () => {
	warnItemTable.value.find(queryForm.value);
}
// 新增
const addNew = () => {
	console.log(warnitemeadd.value);
	
	warnitemeadd.value.dialogVisible = true;
}
// 修改
const edit = (index: any, row: any) => {
	warnitemedit.value.paramsDataForm = { ...row };
	warnitemedit.value.dialogVisible = true;
}
// 重置
const reset = () => {
	// 清空下拉框数据
	queryForm.value = resizeForm.call(this, "queryForm");
	queryList();
}
</script>
<style lang="scss" scoped>
// 页面公共样式
.required {
  color: red;
}
.warnItem {
  .button_group {
    margin-top: 5px;
    padding-left: 20px;
  }
  .select_group {
    padding: 5px 0 0 20px;
    label {
      //width: 65px;
      //margin-right: 10px;
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
::v-deep .el-table th.is-leaf {
  border-bottom: 2px solid #ebeef5;
}
::v-deep .el-row {
  // .flex(@justify-content:flex-start);
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
  margin-right: 20px;
}
</style>
