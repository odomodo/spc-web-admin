<!--
 * @Author: 曾宇奇
 * @Date: 2021-04-15 14:39:03
 * @LastEditTime: 2022-06-29 14:21:40
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @FilePath: \vue-next-admin\src\views\home\index.vue
-->

<template>
  <el-row class="params_set">
    <el-col :span="10" class="params_set_parent">
      <!-- 编码搜索 -->
      <el-row class="parent_code" type="flex" align="center">
        <el-col :span="24" class="flex flex-c">
          <label style="width: 60px;">类型编号</label>
          <el-input autocomplete="off" placeholder="请输入类型编号" style="width: 130px;margin-right: 15px;" v-model="parentDataCode"  ></el-input>
          <label style="width: 60px">类型名称</label>
          <el-input autocomplete="off" placeholder="请输入类型名称" style="width: 130px" v-model="parentDateType"  ></el-input>
          <div class="spc-button">
          <div v-if="parentDateType ==''"><svg-icon iconName="search"  tipLable="搜索"  iconSize="15" @click="queryList('parent')"></svg-icon></div>
          <div v-else><svg-icon iconName="search"  tipLable="搜索"  iconSize="15"  @click="queryList('parent', parentDateType )"></svg-icon></div>
          </div>
          <div class="spc-button" >
            <svg-icon iconName="refresh"  tipLable="重置"  iconSize="15" @click="reset('parent')"></svg-icon>
          </div>
          <el-button
            color="#5781C1"
            class="spc-right"
            :icon="Plus"
            @click="addNewParent"
            perms="params_set_add"
            >新增</el-button
          >
        </el-col>
      </el-row>
      <!-- 新增父配置弹窗 -->
      <paramsSet-parent-add
        ref="paramsSetParentAdds"
        @queryList="queryList('parent',)"
      ></paramsSet-parent-add>
      <!-- 编辑父配置弹窗 -->
      <paramsSet-parent-edit
        ref="paramsSetParentEdits"
        @queryList="queryList('parent',)"
      ></paramsSet-parent-edit>
      <!-- 父配置表格 -->
      <n-table
        ref="parent"
        :tableConfig="parentTableConfig"
        @handleRadioChange="handleRadioChange"
        style="margin-top: 5px"
      ></n-table>
    </el-col>
    <el-col :span="12" :push="1" class="params_set_child">
      <!-- 编码搜索 -->
      <el-row class="child_code" type="flex" align="center">
        <el-col :span="24" class="flex flex-c">
          <label style="width: 80px">明细项编码</label>
          <el-input autocomplete="off" placeholder="请输入明细项编码" v-model="childDataCode"  style="width: 150px;margin-right: 15px;" :disabled="isdisable"></el-input>
          <label style="width: 92px">明细项编码值</label>
          <el-input autocomplete="off" placeholder="请输入明细项编码值" v-model="childDataType"  style="width: 150px;" :disabled="isdisable"></el-input>
        
          <div class="spc-button" >
          <div v-if="childDataCode !== ''"><svg-icon iconName="search"  tipLable="搜索"  @click="queryList('child', false, childDataCode)"></svg-icon></div>
          <div v-else><svg-icon iconName="search"  tipLable="搜索"  @click="queryList('child', false, childDataType)"></svg-icon></div>
            
          </div>
          <div class="spc-button" @click="reset('child')">
            <svg-icon iconName="refresh"  tipLable="重置" ></svg-icon>
          </div>
          <el-button
            color="#5781C1"
            class="spc-right"
            :icon="Plus"
            @click="addNewChild"
            perms="params_set_item_add"
            :disabled="isdisable"
            >新增</el-button
          >
        </el-col>
      </el-row>
      <!-- 新增子配置弹窗 -->
      <paramsSet-child-add
        ref="paramsSetChildAdds"
        @queryList="queryList('child', )"
        :params="params"
      ></paramsSet-child-add>
      <!-- 编辑子配置弹窗 -->
      <paramsSet-child-edit
        ref="paramsSetChildEdits"
        @queryList="queryList('child')"
      ></paramsSet-child-edit>
      <!-- 子配置表格 -->
      <n-table
        ref="child"
        :tableConfig="childTableConfig"
        style="margin-top: 5px"
      ></n-table>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import nTable from "/@/components/nTable/index.vue";
import paramsSetParentAdd from "./paramsSet/paramsSet_parent_add.vue";
import paramsSetParentEdit from "./paramsSet/paramsSet_parent_edit.vue";
import paramsSetChildAdd from "./paramsSet/paramsSet_child_add.vue";
import paramsSetChildEdit from "./paramsSet/paramsSet_child_edit.vue";
import { Plus } from "@element-plus/icons-vue";
// 方法
import { getParamsListUrl, delList } from "/@/api/base/paramsSet";

import { reactive, toRefs, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

const parent = ref();
const child = ref();
const paramsSetParentAdds = ref();
const paramsSetChildAdds = ref();
const paramsSetParentEdits = ref();
const paramsSetChildEdits = ref();

const state = reactive({
  parentDataCode: "", //数据编号
  parentDateType: '', //类型名称
  childDataCode: "", //明细项编码
  childDataType: '', //明细项编码值
  // 父表格配置
  parentTableConfig: {
    height: "70vh",
    url: getParamsListUrl("parent"),
    //表格表头
    columns: [
      {
        prop:'dataType',
        label:'参数类型',
        formatter(row: any, column: any, cellValue: number, index: any) {
              if (cellValue == 0) {
                return "系统参数";
              } else if (cellValue == 1) {
                return "控制项参数";
              }  else {
                return "不良参数";
              }
            }
      },
      {
        prop: "dataCode",
        label: "类型编号",
      },
      {
        prop: "dataName",
        label: "类型名称",
      },
      {
        prop: 'remarks',
        label: '描述',
      }

    ],
    showOperation: true, //是否显示操作字段
    //rowNumbers: true, //是否显示行数
    showPagination: true, //分页
    showChoose: true, //是否显示选择框， 默认不显示
    singleSelect: true, //单选，复选，默认复选
    //操作按钮列表
    options: [
      {
        type: "success",
        icon: "edit",
        label: "编辑",
        perms: "params_set_edit",
        click: (index: any, row: any) => {
          paramsSetParentEdits.value.paramsDataForm = { ...row };
          paramsSetParentEdits.value.queryDnData();
          paramsSetParentEdits.value.dialogVisible = true;
        },
      },
      {
        type: "danger",
        label: "删除",
        icon: "delete",
        perms: "params_set_delete",
        click: (index: any, row: { id: any }) => {
          ElMessageBox.confirm("确定删除?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(async () => {
              const res: any = await delList("parent", row.id);
              queryList("parent");
              ElMessage({
                type: "success",
                message: res.msg,
              });
            })
            .catch(() => {
              ElMessage({
                type: "info",
                message: "已取消删除",
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
  // 子表格配置
  childTableConfig: {
    height: "70vh",
    url: getParamsListUrl("child"),
    initLoadFlag: false, // 初始不渲染表格
    data: [],
    //表格表头
    columns: [
      {
        prop: "valueCode",
        label: "明细项编码",
        minWidth: 150,
      },
      {
        prop: "valueName",
        label: "明细项编码值",
        minWidth: 150,
      },
      {
        prop: "valueSort",
        label: "显示顺序",
        minWidth: 150,
      },

      {
        prop: "ifAvailable",
        label: "是否可用",
        minWidth: 150,
        formatter(row: any, column: any, cellValue: number, index: any) {
              return cellValue == 0 ? "是" : "否";
            }
      },
      {
        prop: "ifEdit",
        label: "是否可编辑",
        minWidth: 150,
        formatter(row: any, column: any, cellValue: number, index: any) {
              return cellValue == 0 ? "是" : "否";
            }
      },
      {
        prop: "ifDelete",
        label: "是否可删除",
        minWidth: 150,
        formatter(row: any, column: any, cellValue: number, index: any) {
              return cellValue == 0 ? "是" : "否";
            }
      },
    ],
    showOperation: true, //是否显示操作字段
    rowNumbers: true, //是否显示行数
    showPagination: true, //分页
    //操作按钮列表
    options: [
      {
        type: "success",
        label: "编辑",
        icon: "edit",
        perms: "params_set_item_edit",
        click: (index: any, row: any) => {
          paramsSetChildEdits.value.paramsDataForm = { ...row };
          paramsSetChildEdits.value.dialogVisible = true;
        },
      },
      {
        type: "danger",
        label: "删除",
        icon: "delete",
        perms: "params_set_item_delete",
        click: (index: any, row: { id: any,ifDelete: string }) => {
          if(row.ifDelete == '1'){
             return  ElMessage({
                type: "success",
                message: '无法删除',
              });
          }
          ElMessageBox.confirm("确定删除?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(async () => {
              const res:any = await delList("child", row.id);
              queryList("child");
              ElMessage({
                type: "success",
                message: res.msg,
              });
            })
            .catch(() => {
              ElMessage({
                type: "info",
                message: "已取消删除",
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
  isdisable: true, //是否禁用子表格
  params: {}, //父表格传子表格参数
});
const {
  parentDataCode,
  childDataCode,
  parentTableConfig,
  childTableConfig,
  isdisable,
  params,
  parentDateType,
  childDataType
} = toRefs(state);

// 父表格单选点击
const handleRadioChange = (v: { dataCode: any; id: any; factoryCode: any }) => {
  state.childDataCode = "";
  queryList("child", v.dataCode, "change");
  state.params = {
    dataTypeId: v.id,
    dataTypeCode: v.dataCode,
    factoryCode: v.factoryCode,
  };
  state.isdisable = false;
};
// 根据数据编号查询列表
const queryList = function (
  type: string,
  code?: string | boolean,
  name?: string | null | undefined
) {
  if (name == "change") name = null;
  if(type == "parent"){
    parent.value.find({ code:parentDataCode,name:parentDateType })
  }else if(type == 'child'){
    if(!arguments[1]){
        child.value.find({ code:childDataCode, name: childDataType})
    } else {
      child.value.find({ parentId: code,code: name });
    }
    
  }

};
// 父新增
const addNewParent = async () => {
  paramsSetParentAdds.value.dialogVisible = true;
  paramsSetParentAdds.value.paramsDataForm = {
    dataCode: '', //数据编号
		dataType: 0,
		dataName: '', //数据名称
		remarks: '', //描述
  };
  paramsSetParentAdds.value.queryDnData();
};
// 子新增
const addNewChild = async () => {
  paramsSetChildAdds.value.dialogVisible = true;
  paramsSetChildAdds.value.paramsDataForm = {
    valueCode: '', //明细项编码
		valueName: '', //明细项编码值
		ifAvailable: '1', //是否可用
		valueSort: '', //显示顺序
		ifEdit: '1', //是否可编辑
		ifDelete: '1', //是否可删除
  };
};
// 重置
const reset = (type: string) => {
  if (type == "parent") {
    state.parentDataCode = "";
    state.parentDateType = ""
    queryList("parent");
  } else {
    state.childDataCode = "";
    state.childDataType = "";
    
    queryList("child");
  }
};
</script>
<style scoped lang="scss">
.params_set{
  background-color: #FFFFFF;
  
  .params_set_parent{
    margin: 15px;
  }
  .params_set_child{
    margin: 15px;
  }
}
</style>