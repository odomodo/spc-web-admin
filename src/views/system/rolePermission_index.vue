<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: 曾宇奇
 * @Date: 2021-06-01 10:05:30
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @LastEditTime: 2022-05-27 15:31:08
-->
<template>
  <!-- 角色管理 -->
  <div class="role-permission">
    <!-- 选择框组 -->
    <div class="select_group flex-c">
      <div class="flex-c" style="margin-right:10px">
        <label>角色:</label>
        <el-input v-model="queryData.code" size="mini" placeholder="请输入"></el-input>
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
          @click="reset"
          perms="reset"
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
        perms="role_permission_add"
        @click="save(saveDataObj)"
        >保存</el-button
      >
      <!-- <n-button
        type="danger"
        icon="el-icon-delete"
        size="mini"
        perms="reset"
        @click="clearAll"
        >清除</n-button
      > -->
    </div>
    <!-- 角色表格 -->
    <el-row style="margin-top:5px">
      <el-col :span="5">
        <!-- 角色管理表格 -->
        <n-table
          ref="indexTable"
          :tableConfig="indexRoleTableConfig"
          @handleRadioChange="showUsers"
          class="roleTableConfigClass"
          border
        >
        </n-table>
      </el-col>
      <el-col :span="19">
        <el-table ref="linkTable" :data="roleLinkageTableData" height="600px">
          <el-table-column
            label="管理模块"
            width="100px"
            prop="moduleName"
          ></el-table-column>
          <el-table-column
            label="功能名称"
            width="180px"
            prop="menuName"
          ></el-table-column>
          <el-table-column label="菜单" width="50px">
            <template #header>
              <span @dblclick="dblclick('menu')">菜单</span>
            </template>
            <template #default="scope">
              <el-checkbox
                v-model="scope.row.perMenuId.checked"
                @change="checkRow($event, scope.row.perMenuId.permissionId)"
              ></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="新增" width="50px">
            <template #header>
              <span @dblclick="dblclick('add')">新增</span>
            </template>
            <template  #default="scope">
              <el-checkbox
                v-if="scope.row.perAddId"
                v-model="scope.row.perAddId.checked"
                @change="checkRow($event, scope.row.perAddId.permissionId)"
              ></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="编辑" width="50px">
            <template #header>
              <span @dblclick="dblclick('edit')">编辑</span>
            </template>
            <template #default="scope">
              <el-checkbox
                v-if="scope.row.perEditId"
                v-model="scope.row.perEditId.checked"
                @change="checkRow($event, scope.row.perEditId.permissionId)"
              ></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="删除" width="50px">
            <template #header>
              <span @dblclick="dblclick('del')">删除</span>
            </template>
            <template #default="scope">
              <el-checkbox
                v-if="typeof scope.row.perDeleteId != 'undefined'"
                v-model="scope.row.perDeleteId.checked"
                @change="checkRow($event, scope.row.perDeleteId.permissionId)"
              ></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="导入" width="50px">
            <template #header>
              <span @dblclick="dblclick('import')">导入</span>
            </template>
            <template #default="scope">
              <el-checkbox
                v-if="typeof scope.row.perImportId != 'undefined'"
                v-model="scope.row.perImportId.checked"
                @change="checkRow($event, scope.row.perImportId.permissionId)"
              ></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="导出" width="50px">
            <template #header>
              <span @dblclick="dblclick('export')">导出</span>
            </template>
            <template #default="scope">
              <el-checkbox
                v-if="typeof scope.row.perExportId != 'undefined'"
                v-model="scope.row.perExportId.checked"
                @change="checkRow($event, scope.row.perExportId.permissionId)"
              ></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="其他">
            <template #header>
              <span @dblclick="dblclick('other')">其他</span>
            </template>
            <template #default="scope">
              <el-checkbox-group v-model="scope.row.otherNames">
                <el-checkbox
                  v-for="(item, index) in scope.row.otherVos"
                  :label="item.permissionName"
                  :key="index"
                  @change="checkRow($event, item.permissionId)"
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
  // 组件
import nTable from "/@/components/nTable/index.vue";
import { findDeptList } from "/@/api/employee/employee.js";

// 方法
import {
  getRoleList,
  getPermissionData,
  saveData
} from "/@/api/system/rolePermission.js";
import useCurrentInstance from "/@/utils/useCurrentInstance.ts"
import { ref, reactive, toRefs, onMounted } from "vue"
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus'
const { proxy } = useCurrentInstance()
const emit = defineEmits(['queryList']);

// 角色表格配置
const indexRoleTableConfig = ref<any>({
  height: "600px",
  data: [],
  //表格表头
  columns: [
    {
      prop: "roleCode",
      label: "角色编码"
    },
    {
      prop: "roleName",
      label: "角色名称"
    }
  ],
  showChoose: true, //是否显示选择框， 默认不显示
  singleSelect: true, //单选，复选，默认复选
  showPagination: false
})
// 角色联动表格配置
const roleLinkageTableData = ref<any>([])
// 修改后的数据
const saveDataObj = ref<any>({
  roleId: "",
  permissionIds: []
})
// 查询数据
const queryData = ref<any>({
  code: ""
})
const indexTable = ref<any>(null)
// 当前选中Id
const currId = ref("")
const menuTempStat = ref(true)
const addTempStat = ref(true)
const editTempStat = ref(true)
const delTempStat = ref(true)
const importTempStat = ref(true)
const exportTempStat = ref(true)
const otherTempStat = ref(true)
const dblclick = (type: any) => {
  switch (type) {
    case "menu":
      roleLinkageTableData.value.forEach((item: any) => {
        if (menuTempStat.value) {
          if (item.perMenuId) {
            checkRow(true, item.perMenuId.permissionId);
            item.perMenuId.checked = true;
          }
        } else {
          if (item.perMenuId) {
            checkRow(false, item.perMenuId.permissionId);
            item.perMenuId.checked = false;
          }
        }
      });
      menuTempStat.value = !menuTempStat.value;
      break;
    case "add":
      roleLinkageTableData.value.forEach((item: any) => {
        if (addTempStat.value) {
          if (item.perAddId) {
            checkRow(true, item.perAddId.permissionId);
            item.perAddId.checked = true;
          }
        } else {
          if (item.perAddId) {
            checkRow(false, item.perAddId.permissionId);
            item.perAddId.checked = false;
          }
        }
      });
      addTempStat.value = !addTempStat.value;
      break;
    case "del":
      roleLinkageTableData.value.forEach((item: any) => {
        if (delTempStat.value) {
          if (item.perDeleteId) {
            checkRow(true, item.perDeleteId.permissionId);
            item.perDeleteId.checked = true;
          }
        } else {
          if (item.perDeleteId) {
            checkRow(false, item.perDeleteId.permissionId);
            item.perDeleteId.checked = false;
          }
        }
      });
      delTempStat.value = !delTempStat.value;
      break;
    case "import":
      roleLinkageTableData.value.forEach((item: any) => {
        if (importTempStat.value) {
          if (item.perImportId) {
            checkRow(true, item.perImportId.permissionId);
            item.perImportId.checked = true;
          }
        } else {
          if (item.perImportId) {
            checkRow(false, item.perImportId.permissionId);
            item.perImportId.checked = false;
          }
        }
      });
      importTempStat.value = !importTempStat.value;
      break;
    case "export":
      roleLinkageTableData.value.forEach((item: any) => {
        if (exportTempStat.value) {
          if (item.perExportId) {
            checkRow(true, item.perExportId.permissionId);
            item.perExportId.checked = true;
          }
        } else {
          if (item.perExportId) {
            checkRow(false, item.perExportId.permissionId);
            item.perExportId.checked = false;
          }
        }
      });
      exportTempStat.value = !exportTempStat.value;
      break;
    case "other":
      roleLinkageTableData.value.forEach((item: any) => {
        if (otherTempStat.value) {
          if (item.otherVos) {
          }
        } else {
          if (item.otherVos) {
          }
        }
      });
      otherTempStat.value = !otherTempStat.value;
      break;
    case "edit":
      roleLinkageTableData.value.forEach((item: any) => {
        if (editTempStat.value) {
          if (item.perEditId) {
            checkRow(true, item.perEditId.permissionId);
            item.perEditId.checked = true;
          }
        } else {
          if (item.perEditId) {
            checkRow(false, item.perEditId.permissionId);
            item.perEditId.checked = false;
          }
        }
      });
      editTempStat.value = !editTempStat.value;
      break;
    default:
      break;
  }
}
// 勾选多选框事件
const checkRow = (v: any, id: any) => {
  if (v) {
    if (!saveDataObj.value.permissionIds.includes(id))
      saveDataObj.value.permissionIds.push(id);
  } else {
    saveDataObj.value.permissionIds = saveDataObj.value.permissionIds.filter(
      (item: any) => item != id
    );
  }
}
// 查询
const queryList = async(code: any) => {
  indexTable.value.setTableData(await getRoleList(code));
  roleLinkageTableData.value = [];
}
// 重置
const reset = () => {
  // 清空输入框数据
  queryData.value.code = "";
  getList();
}
// 重置多选
const clearAll = () => {
  showUsers(currId.value);
}
// 保存
const save = async(data:any) => {
  console.log(data);
  const res = await saveData(data);
  if (res.flag) {
    ElMessage({
      type: "success",
      message: res.msg
    });
  } else {
    ElMessage({
      type: "error",
      message: res.msg
    });
  }
}
// 父表格点击
const showUsers = async ({ id }: any) => {
  currId.value = id;
  roleLinkageTableData.value =  await getPermissionData(id);
  //console.log(roleLinkageTableData.value);
  //根据左边角色数据， 遍历右边该角色的权限数据
  for (let item of roleLinkageTableData.value) {
    if (typeof item.perAddId != "undefined" && item.perAddId.checked) {
      //新增按钮
      saveDataObj.value.permissionIds.push(item.perAddId.permissionId);
    }
    if (typeof item.perMenuId != "undefined" && item.perMenuId.checked) {
      //菜单
      saveDataObj.value.permissionIds.push(item.perMenuId.permissionId);
    }
    if (typeof item.perEditId != "undefined" && item.perEditId.checked) {
      //修改按钮
      saveDataObj.value.permissionIds.push(item.perEditId.permissionId);
    }
    if (
      typeof item.perDeleteId != "undefined" &&
      item.perDeleteId.checked
    ) {
      //删除按钮
      saveDataObj.value.permissionIds.push(item.perDeleteId.permissionId);
    }
    if (
      typeof item.perImportId != "undefined" &&
      item.perImportId.checked
    ) {
      //导入按钮
      saveDataObj.value.permissionIds.push(item.perImportId.permissionId);
    }
    if (
      typeof item.perExportId != "undefined" &&
      item.perExportId.checked
    ) {
      //导出按钮
      saveDataObj.value.permissionIds.push(item.perExportId.permissionId);
    }
    if (item.otherVos) {
      //其它权限按钮遍历
      for (let k of item.otherVos) {
        if (k.checked) {
          saveDataObj.value.permissionIds.push(k.permissionId);
        }
      }
    }
  }
  saveDataObj.value.roleId = id;
}
// 获取用户角色列表
const getList = async() => {
  indexTable.value.setTableData(await getRoleList());
}
onMounted(() => {
  getList();
})
</script>