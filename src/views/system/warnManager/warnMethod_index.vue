<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: 曾宇奇
 * @Date: 2021-05-12 17:13:58
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @LastEditTime: 2022-05-11 13:38:46
-->

<template>
  <div class="warnMethod">
    <!-- 选择框组 -->
    <div class="select_group flex-c">
      <div class="flex-c" style="">
        <label>预警方法：</label>
        <el-select
          placeholder="请输入或选择"
          v-model="queryForm.id"
          filterable
          allow-create
          clearable
          default-first-option
          size="mini"
        >
          <el-option
            v-for="item in warnMethodDownList"
            :key="item.id"
            :label="item.methodName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </div>
      <div class="flex-c">
        <label>方法类型：</label>
        <el-select placeholder="请选择" v-model="queryForm.methodType" size="mini">
          <el-option value="0" label="SQL"></el-option>
          <el-option value="1" label="JAVA"></el-option>
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
        <span style="font-weight: 700; margin: 0 10px">~</span>
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
          perms="search"
          @click="queryList(queryForm)"
          >查询</el-button
        >
        <el-button
          type="default"
          plain
          icon="el-icon-refresh"
          size="mini"
          perms="reset"
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
        icon="el-icon-plus"
        size="mini"
        perms="warnMethid_menu_add"
        @click="addNew"
        >新增</el-button
      >
      <el-button
        @click="methodTEST"
        type="warning"
        plain
        icon="el-icon-user"
        size="mini"
        perms="warnMethid_menu_test"
        >测试</el-button
      >
      <!-- <el-button
        type="info"
        plain
        icon="el-icon-upload2"
        size="mini"
        perms="warnMethid_menu_import"
        >导入</el-button
      >
      <el-button
        type="warning"
        plain
        icon="el-icon-download"
        size="mini"
        perms="warnMethid_menu_export"
        >导出</el-button
      > -->
    </div>

    <!-- 新增预警方法弹窗 -->
    <warn-item-add ref="warnItemADD" @queryList="queryList"></warn-item-add>
    <!-- 编辑预警方法弹窗 -->
    <warn-item-edit ref="warnItemEDIT"></warn-item-edit>
    <!-- <warn-item-edit ref="warnItemEdit" @queryList="queryList"></warn-item-edit> -->
    <!-- 预警方法表格 -->
    <n-table
      ref="warnMethodTable"
      :tableConfig="warnMethodTableConfig"
      style="margin-top: 5px"
      @handleRadioChange="handleRadioChange"
    ></n-table>

    <!-- 字段表格 -->
    <n-table
      ref="fieldTable"
      style="margin-top:30px;"
      :tableConfig="fieldTableConfig"
    ></n-table>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue"
import { ElMessage, ElMessageBox } from 'element-plus';
// 组件
import nTable from "/@/components/nTable/index.vue";
import warnItemAdd from "./warnMethod/warnMethod.add.vue";
import warnItemEdit from "./warnMethod/warnMethod.edit.vue";

// 方法
import {
  getWarnMethodList,
  getFieldList,
  getFieldListById,
  getWarnMethodDownList,
  deleteWarnMethod,
  methodTest
} from "/@/api/system/warnMethod.js";
import { resizeForm, filterObj } from "/@/utils/jsOptions.ts";
import { formatDate } from "/@/utils/index.js";
// 编辑
const edit = async(index:any, row: any) => {
	warnItemEDIT.value.dialogVisible = true;
	warnItemEDIT.value.paramsDataForm = filterObj({ ...row }, [
		"addTime",
		"addUserId",
		"editTime",
		"editUserId",
		""
	]);

	let arr = (await getFieldList({ ...row }.id)).data;
	warnItemEDIT.value.paramsDataForm.sysWarnMethodParamList = (
		await getFieldList({ ...row }.id)
	).data.map((item: any) =>
		filterObj(item, [
			"addTime",
			"addUserId",
			"editTime",
			"editUserId",
			"spare1",
			"spare2",
			"spare3"
		])
	);
	if(row.methodType==0) warnItemEDIT.value.checkShow = true;
	else warnItemEDIT.value.checkShow = false;
	warnItemEDIT.value.setTable();
}
onMounted(
	() => {
    getDnList();
	}
)
// 预警方法表格配置
const id = ref()
const fieldTable: any = ref(null)
const warnMethodTable: any = ref(null)
const warnItemADD:any = ref(null)
const warnItemEDIT:any = ref(null)
const warnMethodTableConfig:any = ref({
	url: getWarnMethodList(),
	height: 500,
	//表格表头
	columns: [
		{
			prop: "methodCode",
			label: "预警方法编号"
		},
		{
			prop: "methodName",
			label: "预警方法名称"
		},
		{
			prop: "methodType",
			label: "方法类型",
			formatter(row: any, column: any, cellValue: any, index: any) {
				if (cellValue == 0) return "SQL";
				if (cellValue == 1) return "JAVA";
			}
		},
		{
			prop: "javaPackageName",
			label: "包路径"
		},
		{
			prop: "javaClassName",
			label: "类名"
		},
		{
			prop: "javaMethodName",
			label: "方法名"
		},
		{
			prop: "sqlContent",
			label: "SQL"
		},
		{
			prop: "descript",
			label: "描述"
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
		}
		// {
		//   prop: "editTime",
		//   label: "更新时间",
		//   formatter(row: any, column: any, cellValue: any, index: any) {
		//     return formatDate(cellValue);
		//   },
		// },
		// {
		//   prop: "editUserId",
		//   label: "更新人",
		// },
	],
	showOperation: true, //是否显示操作字段
	showPagination: true, //分页
	rowNumbers: true, //是否显示行数
	showChoose: true, //是否显示选择框， 默认不显示
	singleSelect: true, //单选，复选，默认复选
	//操作按钮列表
	options: [
		{
			type: "warning",
			label: "编辑",
			click: edit,
			perms: "warnMethid_menu_edit"
		},
		{
			type: "danger",
			label: "删除",
			perms: "warnMethid_menu_delete",
			click: (_: any, row: any) => {
				ElMessageBox.confirm("确定删除?", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				})
					.then(async () => {
						const res = await deleteWarnMethod(row.id);
						warnMethodTable.value.reload();
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
})
// 字段表格配置
const fieldTableConfig: any = ref({
	url: getFieldListById(),
	initLoadFlag: false,
	height:200,
	//表格表头
	columns: [
		{
			prop: "fieldName",
			label: "字段"
		},
		{
			prop: "fieldDescript",
			label: "说明"
		},
		{
			prop: "fieldType",
			label: "类型",
			formatter(row: any, column: any, cellValue: any, index: any) {
				if (cellValue == 0) return "输入";
				if (cellValue == 1) return "输出";
			}
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
		}
		// {
		//   prop: "editTime",
		//   label: "更新时间",
		//   formatter(row: any, column: any, cellValue: any, index: any) {
		//     return formatDate(cellValue);
		//   },
		// },
		// {
		//   prop: "editUserId",
		//   label: "更新人",
		// },
	],
	showPagination: true, //分页
	rowNumbers: true //是否显示行数
})
// 预警方法下拉框值
const queryForm: any =  ref({
	id: "", //预防方法
	methodType: "",
	startDateTime: "", //开始时间
	endDateTime: "" //结束时间
})
//
// 已有数据
const list = ref([])
const warnMethodDownList: any = ref([]) //预警方法下拉数据
const currentRow = ref(null) //当前行

//选择预警组查出对应字段列表
const handleRadioChange = (v: any) =>{
	//alert(v.id)
	if (v && v.id) {
		id.value = v.id;
		queryFileListByWarnMethodId(v.id);
		
	}
}
//根据预警方法id查询字段列表
const queryFileListByWarnMethodId = (id: any) =>{
	fieldTable.value.find({ id });
}

// 查询
const queryList = (queryForm: any) => {
	//console.log(queryForm);
	warnMethodTable.value.find(queryForm);
}
// 新增
const addNew = () =>{
	warnItemADD.value.dialogVisible = true;
}

//测试
const methodTEST = async() => {
	if(id.value=='' || id.value == null) {
		return ElMessage({
			message: "操作错误： 请先选中一条数据",
			type: "error"
		});
	}

	ElMessageBox.confirm("确定测试?", "提示", {
		confirmButtonText: "确定",
		cancelButtonText: "取消",
		type: "warning"
	})
		.then(async () => {
			const res = await methodTest(id.value);
			if(res.code==0){
				warnMethodTable.value.reload();
				ElMessage({
					type: "success",
					message: '测试成功，返回：'+res.msg,
					duration: 5000
				});
			}else{
				warnMethodTable.value.reload();
				ElMessage({
					message: res.msg,
					type: "error",
					duration: 5000
				});
			}
		})
		.catch(() => {
			ElMessage({
				type: "info",
				message: "已取消"
			});
		});
}
// 重置
const reset = async () => {
	// 清空下拉框数据
	queryForm.value = resizeForm.call(this, "queryForm");
	queryList(queryForm.value);
}
// 获取下拉框列表
const getDnList = async() =>{
	// 获取预警项类型下拉框列表
	warnMethodDownList.value = (await getWarnMethodDownList()).data;
}
</script>

<style lang="scss" scoped>
// 页面公共样式
.required {
  color: red;
}
.warnMethod {
  .button_group {
    margin-top: 5px;
    padding-left: 20px;
  }
  .select_group {
    padding: 5px 0 0 20px;
    label {
      //width: 5px;
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
