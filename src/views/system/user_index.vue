<!--
 * @Author: 曾宇奇
 * @Date: 2021-03-24 14:23:52
 * @LastEditTime: 2022-06-10 10:07:24
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @Description: 用户管理/系统用户
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
            <el-option label="有效" value="1"> </el-option>
            <el-option label="无效" value="0"> </el-option>
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
    <userDialog ref="UserAdd"></userDialog>
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
import userDialog from "./user/userDialog.vue";;
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
      prop: "userId",
      label: "工号",
      minWidth: 100
    },
    {
      prop: "userState",
      label: "状态",
      formatter(row: any, column: any, cellValue: any, index: any) {
        return cellValue == 1 ? "失效" : "有效";
      },
      className: () => {return 123123},
      minWidth: 80
    },
    {
      prop: "addUserId",
      label: "创建人",
      minWidth: 80
    },
    {
      prop: "addTime",
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
  cellClassName:({ row, column, rowIndex, columnIndex }: any) => {
    if (column.property === 'userState') {
      console.log(column, rowIndex, columnIndex );
    }
    return '123123'
  },
  showOperation: true, //是否显示操作字段
  // showChoose: true, //是否显示选择框， 默认不显示
  singleSelect: true,
  rowNumbers: true, //是否显示行数
  showBatchDelete: false, //是否批量删除
  options: [
    {
      label: "编辑",
      icon:'edit',
      click: (index: any, row: any) => {
      }
    },
    {
      label: "查看",
      icon:'show',
      click: (index: any, row: any) => {
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
.userManagement{
  padding:10px;
  border-radius: 10px;
  background:#fff;
}
.item{
  margin-right: 10px;
}
</style>
