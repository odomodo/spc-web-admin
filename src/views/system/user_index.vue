<!--
 * @Author: 曾宇奇
 * @Date: 2021-03-24 14:23:52
 * @LastEditTime: 2022-06-02 11:00:09
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @Description: 用户管理
 * @FilePath: \mes-ui\src\views\system\userManagement.vue
-->
<template>
  <!-- 用户管理 -->
  <div class="userManagement">
    <!-- 选择框组 -->
    <el-row>
      <el-col :span="5">
        <el-form-item label="用户" class="item">
          <el-input
            id="user"
            v-model="queryForm.userName"
            placeholder="请输入用户名称"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="5">
        <el-form-item label="状态" class="item">
          <el-select placeholder="请选择" v-model="queryForm.userState" >
            <el-option label="停用" value="1"> </el-option>
            <el-option label="启用" value="0"> </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <div class="flex-c">
          <el-button
            :icon="Search"
            @click="queryList"
            ></el-button
          >
          <el-button
            :icon="Refresh"
            @click="reset"
            ></el-button
          >
        </div>
      </el-col>
      <el-col :span="1">
        <el-button type="primary" @click="handleClick('add')">新增</el-button>
      </el-col>
    </el-row>
    <!-- 新增用户弹窗 -->
    <user-add ref="UserAdd"></user-add>
    <!-- 用户管理表格 -->
    <n-table
      class="indexTable"
      ref="indexTable"
      :tableConfig="userTableConfig"
      style="margin-top: 5px;"
      border
      @handleRadioChange="handleRadioChange"
    >
    </n-table>
    
  </div>
</template>

<script setup lang="ts">
// 组件
import nTable from "/@/components/nTable/index.vue";
import userAdd from "./user/user_add.vue";;
import { Search, Plus, Delete, MoreFilled, Refresh} from "@element-plus/icons-vue";
// 方法
import {
  delList,
  getAdminList,
  getDetpDnList,
  getWorkshopDnList,
  resetUserPwd,
  exportUser,
  getAdminListForUser
} from "/@/api/system/user.ts";

import { clearFormData } from "/@/utils/jsOptions.ts";
import { ref, reactive, toRefs, onMounted } from "vue"
import { ElMessage, ElMessageBox } from 'element-plus';

import useCurrentInstance from "/@/utils/useCurrentInstance.ts"

const { proxy } = useCurrentInstance()
const UserAdd = ref<any>(null)
const indexTable = ref<any>(null)
const UserImport = ref<any>(null)
const userId = ref()

// 用户表格配置
const userTableConfig = ref<any>({
  url: getAdminListForUser(),
  //表格表头
  columns: [
    {
      prop: "userName",
      label: "用户名称",
      minWidth: 80
    },
    {
      prop: "roleName",
      label: "工号",
      minWidth: 100
    },
    {
      prop: "userState",
      label: "状态",
      formatter(row: any, column: any, cellValue: any, index: any) {
        return cellValue == 1 ? "停用" : "启用";
      },
      minWidth: 80
    },
    {
      prop: "addUserId",
      label: "创建人",
      minWidth: 80
    },
    {
      prop: "editTime",
      label: "创建时间"
    },
    {
      prop: "editUserId",
      label: "修改人",
      minWidth: 80
    },
    {
      prop: "editTime",
      label: "修改时间"
    },
  ],
  showOperation: true, //是否显示操作字段
  // showChoose: true, //是否显示选择框， 默认不显示
  singleSelect: true,
  rowNumbers: true, //是否显示行数
  showBatchDelete: false, //是否批量删除
  options: [
    {
      type: "success",
      label: "编辑",
      perms: "sys_user_edit",
      icon:'edit',
      show: -100,
      click: (index: any, row: any) => {
        // UserEdit.value.userDataForm = { ...row };
        // UserEdit.value.userDataForm.modelName = row.workshopCode;
        // UserEdit.value.userDataForm.deptName = row.deptCode;
        // UserEdit.value.dialogVisible = true;
        // if (row.userState == 1) {
        //   UserEdit.value.userDataForm.userState = false;
        // } else {
        //   UserEdit.value.userDataForm.userState = true;
        // }
      }
    },
    {
      type: "success",
      label: "编辑",
      perms: "sys_user_edit",
      icon:'edit',
      show: -100,
      click: (index: any, row: any) => {
        // UserEdit.value.userDataForm = { ...row };
        // UserEdit.value.userDataForm.modelName = row.workshopCode;
        // UserEdit.value.userDataForm.deptName = row.deptCode;
        // UserEdit.value.dialogVisible = true;
        // if (row.userState == 1) {
        //   UserEdit.value.userDataForm.userState = false;
        // } else {
        //   UserEdit.value.userDataForm.userState = true;
        // }
      }
    },
  ],
  //操作按钮样式
  operationColumn: {
    // 样式
    style: {},
    // 属性
    attr: {}
  }
})

const dnData = ref<any>({
  workShopDnList: [],
  detpDnList: []
})
const queryForm = ref<any>({
  userName: "", //用户名称
  userState: "" //用户状态
})

// 查询
const queryList = () => {
  indexTable.value.find(queryForm.value);
}
// 新增
const handleClick = (data?: any) => {
  UserAdd.value.dialogVisible = true;
  UserAdd.value.userDataForm = clearFormData(
    UserAdd.value.userDataForm
  );
}

// 重置
const reset = () => {
  // 清空下拉框数据
  // this.userSelectData = clearFormData(this.queryForm);
  // this.queryList(this.queryForm);
}

const handleRadioChange = ({ userId }: any) => {
  userId.value = userId;
}

onMounted(() => {
  // getDnList()
})
</script>
<style lang="scss" scoped>
.item{
  margin-right: 10px;
}
</style>
<!-- <style lang="scss" scoped>
// 页面公共样式
.required {
  color: red;
}
.userManagement {
  .button_group {
    margin-top: 5px;
    padding-left: 20px;
  }
  .select_group {
    padding: 5px 0 0 20px;
    label {
      width: 40px;
      //margin-right: 10px;
      font-size: 13px;
      color: #606266;
    }
  }
}
</style>

<style lang="scss" scoped>
>>>.el-input__inner {
  border-radius: 4px;
}
>>>.el-table th.is-leaf {
  border-bottom: 2px solid #ebeef5;
}
>>>.el-row {
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
</style> -->
