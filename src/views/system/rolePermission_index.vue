<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: 曾宇奇
 * @Date: 2021-06-01 10:05:30
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @Description: 角色权限
 * @LastEditTime: 2022-06-16 17:08:18
-->
<template>
  <!-- 角色管理 -->
  <div class="role-permission">
    <el-row>
      <el-col :span="6">
        <el-form-item label="角色名称" style="margin-right:10px">
          <el-input v-model="queryData.code" size="mini" placeholder="请输入"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="16">
        <el-form-item>
          <el-button :icon="Search" @click="queryList()"></el-button>
        </el-form-item>
      </el-col>
      <el-col :span="1">
        <el-button type="primary" @click="handleClick('add')">新增</el-button>
      </el-col>
    </el-row>
    <!-- 角色表格 -->
    <el-row style="margin-top:5px">
      <el-col>
        <!-- 角色管理表格 -->
        <n-table
          ref="indexTable"
          :tableConfig="indexRoleTableConfig"
          class="roleTableConfigClass"
          border
        >
        </n-table>
      </el-col>
    </el-row>
    <permissionDialog ref="RoleDialog" @queryList="queryList"></permissionDialog>
  </div>
</template>
<script setup lang="ts">
  // 组件
import permissionDialog from "./permission/permissionDialog.vue";
import nTable from "/@/components/nTable/index.vue";
import { Search, Plus, Delete, MoreFilled, Refresh} from "@element-plus/icons-vue";
// 方法
import {
  getRoleList,
  getPermissionData,
  saveData
} from "/@/api/system/rolePermission.js";
import useCurrentInstance from "/@/utils/useCurrentInstance.ts"
import { rolePermissionItemajaxList, rolePermissionItemdelete } from "/@/api/controlChart/index.ts"
import { ref, reactive, toRefs, onMounted } from "vue"
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus'
const { proxy } = useCurrentInstance()
const emit = defineEmits(['queryList']);
const RoleDialog: any = ref(null)
// 角色表格配置
const indexRoleTableConfig = ref<any>({
  height: "600px",
  url: rolePermissionItemajaxList(),
  //表格表头
  columns: [
    {
      prop: "roleCode",
      label: "角色编码"
    },
    {
      prop: "roleName",
      label: "角色名称"
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
    options: [
    {
      label: "编辑",
      icon:'edit',
      click: (index: any, row: any) => {
        RoleDialog.value.dialogVisible = true
        RoleDialog.value.dialogTitle = '编辑'
        RoleDialog.value.roleDataForm = JSON.parse(JSON.stringify(row))
        RoleDialog.value.selectChange()
      }
    },
    {
      label: "查看",
      icon:'show',
      click: (index: any, row: any) => {
        RoleDialog.value.dialogVisible = true
        RoleDialog.value.dialogTitle = '查看'
        RoleDialog.value.roleDataForm = JSON.parse(JSON.stringify(row))
        RoleDialog.value.selectChange()
      }
    },
    {
      label: "删除",
      icon:'delete',
      click: async(index: any, row: any) => {
        const res = await rolePermissionItemdelete(row.id)
        if (res.flag) {
          ElMessage({ 
            type: 'success',
            message: '操作成功'
          })
          queryList()
        } else {
          ElMessage({ 
            type: 'error',
            message: res?.msg
          })
        }
      }
    },
  ],
  //操作按钮样式
  operationColumn: {
    // 样式
    style: {},
    // 属性
    attr: {}
  },
  showOperation: true, //是否显示操作字段
  singleSelect: true, //单选，复选，默认复选
})
// 角色联动表格配置
const roleLinkageTableData = ref<any>([])

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

// 查询
const queryList = async() => {
  indexTable.value.find({
    roleName: queryData.value.code
  })
}
const handleClick = async(data: string) => {
  let obj: any = {
    'add': () => {
      RoleDialog.value.dialogVisible = true;
      RoleDialog.value.dialogTitle = '新增'
    }
  }
  obj[data]()
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

onMounted(() => {
})
</script>