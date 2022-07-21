<!--
 * @Author: 曾宇奇
 * @Date: 2021-03-24 14:23:52
 * @LastEditTime: 2022-07-20 15:08:31
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
        <el-form-item label="用户名称/工号" class="item">
          <el-input
            id="user"
            v-model="queryForm.userName"
            clearable
            placeholder="请输入用户名称"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item label="状态" class="item">
          <el-select placeholder="请选择" v-model="queryForm.userState" clearable>
            <el-option label="有效" value="0"> </el-option>
            <el-option label="无效" value="1"> </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="14">
        <div class="flex-c">
          <el-button
            :icon="Search"
            @click="queryList"
            style="width: 30px; height:30px"
            ></el-button
          >
          <el-button
            :icon="Refresh"
            @click="reset"
            style="width: 30px; height:30px"
            ></el-button
          >
        </div>
      </el-col>
      <el-col :span="1">
        <el-button type="primary" @click="handleClick('add')">新增</el-button>
      </el-col>
    </el-row>
    <!-- 新增用户弹窗 -->
    <userDialog ref="UserAdd" @queryList="queryList"></userDialog>
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
const queryForm = ref<any>({
  userName: "", //用户名称
  userState: "" //用户状态
})
// 用户表格配置
const userTableConfig = reactive({
  url: getAdminListForUser(),
  param: {
    userName: queryForm.value.userName,
    userState: queryForm.value.userState,
  },
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
      minWidth: 80
    },
    {
      prop: "addUserName",
      label: "创建人",
      minWidth: 80
    },
    {
      prop: "addTime",
      label: "创建时间"
    },
    {
      prop: "editUserName",
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
      if (row['userState'] == 1) {
        return 'lose'
      } else {
        return 'valid'
      }
    }
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
        console.log(JSON.parse(JSON.stringify(row)));
        handleClick('edit', JSON.parse(JSON.stringify(row)))
      }
    },
    {
      label: "查看",
      icon:'show',
      click: (index: any, row: any) => {
        handleClick('show', JSON.parse(JSON.stringify(row)))
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


// 查询
const queryList = () => {
  indexTable.value.find({
    userName: queryForm.value.userName,
    userState: queryForm.value.userState,
  });
}
// 新增
const handleClick = (type: string, data?: any) => {
  console.log(type, data);
  
  const obj: any = {
    'add': () => {
      UserAdd.value.dialogVisible = true;
      UserAdd.value.dialogTitle = '新增用户'
    },
    'edit': () => {
      UserAdd.value.dialogVisible = true;
      UserAdd.value.dialogTitle = '编辑用户'
      data.comfirmPwd = data.userPwd
      UserAdd.value.userDataForm = { ...data }
    },
    'show': () => {
      UserAdd.value.dialogVisible = true;
      UserAdd.value.dialogTitle = '查看用户'
      data.comfirmPwd = data.userPwd
      UserAdd.value.userDataForm = { ...data }
    }
  }
  obj[type]()
}

// 重置
const reset = () => {
  queryForm.value = {}
  userTableConfig.param = {
    userName: '',
    userState: '',
  }
  indexTable.value.find({
    userName: '',
    userState: '',
  });
  // 清空下拉框数据
}

const handleRadioChange = ({ userId }: any) => {
  userId.value = userId;
}

onMounted(() => {
  // getDnList()
})
</script>
<style lang="scss" scoped>
::v-deep(.el-table__row .lose) {
  color: #EB715E !important;
}
::v-deep(.el-table__row .valid){
  color: #72BD1D !important;
}
.userManagement{
  padding: 20px;
  border-radius: 10px;
  background:#fff;
}
.item{
  margin-right: 10px;
}
</style>
