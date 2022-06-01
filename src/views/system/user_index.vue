<!--
 * @Author: 曾宇奇
 * @Date: 2021-03-24 14:23:52
 * @LastEditTime: 2022-05-26 14:26:00
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @Description: 用户管理
 * @FilePath: \mes-ui\src\views\system\userManagement.vue
-->
<template>
  <!-- 用户管理 -->
  <div class="userManagement">
    <!-- 选择框组 -->
    <div class="select_group flex-c">
      <div class="select flex-c" style="margin-right: 10px">
        <label for="user">车间:</label>
        <el-select
          clearable
          placeholder="请选择"
          v-model="queryForm.workshopId"
        >
          <el-option
            :label="item.modelName"
            :value="item.id"
            v-for="(item, index) in dnData.workShopDnList"
            :key="index"
          >
            <span style="float:left">{{ item.modelName }}</span>
            <span style="float:right; color: #8492a6; font-style: 14px;">{{
              item.modelCode
            }}</span>
          </el-option>
        </el-select>
      </div>
      <div class="select flex-c" style="margin-right: 10px">
        <label for="user">部门:</label>
        <el-select clearable placeholder="请选择" v-model="queryForm.deptId" >
          <el-option
            :label="item.deptName"
            :value="item.id"
            v-for="(item, index) in dnData.detpDnList"
            :key="index"
          >
            <span style="float:left">{{ item.deptName }}</span>
            <span style="float:right; color: #8492a6; font-style: 14px;">{{
              item.deptCode
            }}</span>
          </el-option>
        </el-select>
      </div>
      <div class="select flex-c" style="margin-right: 10px">
        <label for="user">用户:</label>
        <el-input
          id="user"
          v-model="queryForm.userName"
          placeholder="请输入"
          
        ></el-input>
      </div>
      <div class="select flex-c">
        <label>状态:</label>
        <el-select placeholder="请选择" v-model="queryForm.userState" >
          <el-option label="停用" value="1"> </el-option>
          <el-option label="启用" value="0"> </el-option>
        </el-select>
      </div>
      <div class="flex-c">
        <el-button
          type="primary"
          icon="el-icon-search"
          
          perms="search"
          @click="queryList"
          >查询</el-button
        >
        <el-button
          type="default"
          plain
          icon="el-icon-refresh"
          
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
        perms="sys_user_add"
        @click="addNew"
        >新增</el-button
      >
      <el-button
        type="info"
        plain
        icon="el-icon-upload2"
        
        perms="sys_user_import"
        @click="importExcel"
        >导入</el-button
      >
      <el-button type="dark" icon="el-icon-setting"  @click="resetPwd" perms="sys_user_resetpwd"
        >重置密码</el-button
      >
    </div>
    <!-- 新增用户弹窗 -->
    <user-add ref="UserAdd"></user-add>
    <!-- 编辑用户弹窗 -->
    <user-edit ref="UserEdit"></user-edit>
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
    
    <!-- 导入弹窗 -->
    <userImport ref="UserImport" @queryList="queryList"></userImport>
  </div>
</template>

<script setup lang="ts">
// 组件
import nTable from "/@/components/nTable/index.vue";
import userAdd from "./user/user_add.vue";
import userEdit from "./user/user_edit.vue";
import userImport from "./user/user_import.vue";
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
const UserEdit = ref<any>(null)
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
      prop: "userId",
      label: "用户ID",
      minWidth: 80
    },
    {
      prop: "userName",
      label: "用户名称",
      minWidth: 80
    },
    {
      prop: "deptName",
      label: "部门",
      minWidth: 100
    },
    {
      prop: "workshopName",
      label: "车间",
      minWidth: 100
    },
    {
      prop: "roleName",
      label: "所属角色",
      minWidth: 100
    },
    // {
    //   prop: "contactWay",
    //   label: "联系方式"
    // },
    {
      prop: "userState",
      label: "状态",
      formatter(row: any, column: any, cellValue: any, index: any) {
        return cellValue == 1 ? "停用" : "启用";
      },
      minWidth: 80
    },
    // {
    //   prop: "addTime",
    //   label: "创建时间"
    // },
    {
      prop: "addUserId",
      label: "创建人",
      minWidth: 80
    },
    // {
    //   prop: "editTime",
    //   label: "更新时间"
    // },
    {
      prop: "editUserId",
      label: "更新人",
      minWidth: 80
    }
  ],
  showOperation: true, //是否显示操作字段
  showChoose: true, //是否显示选择框， 默认不显示
  singleSelect: true,
  rowNumbers: true, //是否显示行数
  showBatchDelete: false, //是否批量删除
  options: [
    {
      type: "success",
      label: "编辑",
      perms: "sys_user_edit",
      show: -100,
      click: (index: any, row: any) => {
        UserEdit.value.userDataForm = { ...row };
        UserEdit.value.userDataForm.modelName = row.workshopCode;
        UserEdit.value.userDataForm.deptName = row.deptCode;

        UserEdit.value.dialogVisible = true;
        if (row.userState == 1) {
          UserEdit.value.userDataForm.userState = false;
        } else {
          UserEdit.value.userDataForm.userState = true;
        }
      }
    },
    {
      type: "danger",
      label: "删除",
      show: -100,
      perms: "sys_user_delete",
      click: (index: any, row: any) => {
        if(row.userState==0){
          ElMessage({
              type: "error",
              message: "当前用户为启用状态，无法进行删除！"
            });
            return;
        }
        ElMessageBox.confirm("确定删除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(async () => {
            let idList = [];
            idList.push(row.userId);
            let userId = row.userId;
            const res = await delList(userId);
            indexTable.value.reload();
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

const dnData = ref<any>({
  workShopDnList: [],
  detpDnList: []
})
const queryForm = ref<any>({
  workshopId: "", //车间Id
  deptId: "", //部门Id
  userName: "", //用户名称
  userState: "" //用户状态
})
//导入
const importExcel = async() => {
  UserImport.value.dialogVisible = true;
}

//导出
const exportExcel = async() => {
  ElMessageBox.confirm("确定导出数据？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
    // .then(async () => {
    // this.download('/web/qua/qualityrestriction/importTemplate.do',
    //           {...this.queryForm},
    //           `导出数据_${new Date().getTime()}.xlsx`)
    // }).catch(function() {});
}
// 查询
const queryList = () => {
  indexTable.value.find(queryForm.value);
}
// 新增
const addNew = () => {
  UserAdd.value.dialogVisible = true;
  //UserAdd.value.getDnList();
  UserAdd.value.userDataForm = clearFormData(
    UserAdd.value.userDataForm
  );
  UserAdd.value.getDnList();
}

// 重置
const reset = () => {
  // 清空下拉框数据
  // this.userSelectData = clearFormData(this.queryForm);
  // this.queryList(this.queryForm);
}

// 获取下拉框列表
const getDnList = async() => {
  // 获取车间下拉框列表
  dnData.value.workShopDnList = await getWorkshopDnList();

  // 获取工厂下拉框列表
  dnData.value.detpDnList = await getDetpDnList();
}

const handleRadioChange = ({ userId }: any) => {
  userId.value = userId;
}

const resetPwd = async() => {
  ElMessageBox.confirm("确定重置密码?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(async () => {
      const res = await resetUserPwd(userId.value);
      if(res.code==0){
          ElMessage({
          type: "success",
          message: res.msg
        });
        indexTable.value.reload();
      }else{
        ElMessage({
          message: res.msg,
          type: "error",
          duration: 3000
        });
      }
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消重置"
      });
    });
}
onMounted(() => {
  getDnList()
})
</script>
<style lang="scss" scoped>
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
</style>
