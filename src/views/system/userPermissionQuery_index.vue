<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: 曾宇奇
 * @Date: 2021-06-04 09:26:16
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @LastEditTime: 2022-05-31 15:01:33
-->

<template>
  <!-- 用户管理 -->
  <div class="user-permission">
    <!-- 选择框组 -->
    <div class="select_group flex-c">
      <div class="flex-c" style="margin-right:10px">
        <label>用户:</label>
        <el-input v-model="queryData.code" placeholder="请输入" size="mini"></el-input>
      </div>
      <div style="margin-right:10px">
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          perms="search"
          @click="queryList(queryData.code)"
          >搜索</el-button
        >
      </div>
      <div>
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
      <!-- <n-button type="primary" plain icon="el-icon-plus" size="mini" perms="userPermissionQuery_export"
        >导出</n-button
      > -->
    </div>
    <!-- 用户表格 -->
    <el-row style="">
      <el-col :span="8">
        <!-- 角色管理表格 -->
        <n-table
          ref="indexTable"
          :tableConfig="indexRoleTableConfig"
          @handleRadioChange="showUsers"
          border
        >
        </n-table>
      </el-col>
      <el-col :span="16">
        <el-table :data="userLinkageTableData" height="600px">
          <el-table-column
            label="管理模块"
            width="100px"
            prop="moduleName"
          ></el-table-column>
          <el-table-column
            label="功能名称"
            width="100px"
            prop="menuName"
          ></el-table-column>
          <el-table-column label="菜单" width="50px">
            <template #default="scope">
              <el-checkbox
                v-model="scope.row.perMenuId.checked"
              ></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="新增" width="50px">
            <template #default="scope">
              <el-checkbox
                v-if="scope.row.perAddId"
                v-model="scope.row.perAddId.checked"
              ></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="编辑" width="50px">
            <template #default="scope">
              <el-checkbox
                v-if="scope.row.perEditId"
                v-model="scope.row.perEditId.checked"
              ></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="删除" width="50px">
            <template #default="scope">
              <el-checkbox
                v-if="scope.row.perDeleteId"
                v-model="scope.row.perDeleteId.checked"
              ></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="导入" width="50px">
            <template #default="scope">
              <el-checkbox
                v-if="scope.row.perImportId"
                v-model="scope.row.perImportId.checked"
              ></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="导出" width="50px">
            <template #default="scope">
              <el-checkbox
                v-if="scope.row.perExportId"
                v-model="scope.row.perExportId.checked"
              ></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="其他">
            <template #default="scope">
              <el-checkbox-group v-model="scope.row.otherNames">
                <el-checkbox
                  v-for="(item, index) in scope.row.otherVos"
                  :label="item.permissionName"
                  :key="index"
                ></el-checkbox>
              </el-checkbox-group>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import nTable from "/@/components/nTable/index.vue";

// 方法
import { getUserList, getPermissionData } from "/@/api/system/userPermission.js";
import useCurrentInstance from "/@/utils/useCurrentInstance.ts"
import { ref, reactive, toRefs, onMounted } from "vue"
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus'
const { proxy } = useCurrentInstance()
const emit = defineEmits(['queryList']);
// 角色表格配置
const indexRoleTableConfig = ref({
  height: "600px",
  data: [],
  //表格表头
  columns: [
    {
      prop: "userId",
      label: "用户ID"
    },
    {
      prop: "userName",
      label: "用户名称"
    },
    {
      prop: "roleNames",
      label: "所属角色"
    }
  ],
  showChoose: true, //是否显示选择框， 默认不显示
  singleSelect: true, //单选，复选，默认复选
  showPagination: false
})
// 用户联动表格配置
const userLinkageTableData = ref([])

// 查询数据
const queryData = ref({
  code: ""
})
// 当前选中Id
const currId = ref("")
const indexTable = ref<any>(null)
// 查询
const queryList = async(code: any) => {
  indexTable.value.setTableData(await getUserList(code));
  userLinkageTableData .value= [];
}
// 重置
const reset = () => {
  // 清空输入框数据
  queryData.value.code = "";
  getList();
}
// 父表格点击
const showUsers = async({ userId }: any) => {
  currId.value = userId;
  userLinkageTableData .value= await getPermissionData(userId);
}
// 获取用户角色列表
const getList = async() => {
  indexTable.value.setTableData(await getUserList());
}
onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
.required {
  color: red;
}

.user-permission {
  .select_group {
    padding: 5px;
    label {
      width: 45px;
      //margin-right: 10px;
      font-size: 13px;
      color: #606266;
    }
  }
  .button_group {
    padding-left: 20px;
  }

  ::v-deep .el-table .el-table__header .cell {
    line-height: 15px;
    height: 15px;
  }
}
</style>

<style lang="scss" scoped>
::v-deep .el-input__inner {
  border-radius: 4px;
}
::v-deep .el-row {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 15px;
  .el-col {
    text-align: right;
    padding-right: 20px;
  }
}
::v-deep .el-table .cell {
  text-align: center;
}
.el-select {
  margin-right: 20px;
}
::v-deep .el-table__fixed::before,
::v-deep .el-table__fixed-right::before {
  position: fixed;
}

::v-deep .el-table .el-table__body .cell{
  height: 22px;
}

</style>
