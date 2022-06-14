<!--
 * @Author: 曾宇奇
 * @Date: 2021-03-24 14:23:41
 * @LastEditTime: 2022-06-14 09:50:00
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @Description: 角色管理/用户角色
 * @FilePath: \mes-ui\src\views\system\roleManagement.vue
-->
<template>
  <!-- 角色管理 -->
  <div class="role">
    <!-- 选择框组 -->
    <el-row>
      <el-col :span="6">
        <el-form-item label="角色">
          <el-input
            id="role"
            placeholder="请输入"
        ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="16">
        <el-button
          :icon="Search"
          @click="queryList"
          ></el-button>
      </el-col>
      <el-col :span="2">
        <el-button
        :icon="Plus"
        type="primary"
        @click="addNew"
        >新增
        </el-button>
      </el-col>
    </el-row>

    <roleDialog ref="RoleDialog"></roleDialog>
    <!-- 角色表格 -->
    <section class="flex">
      <!-- 角色管理表格 -->
      <n-table
        ref="indexTable"
        :tableConfig="roleTableConfig"
        @handleRadioChange="showUsers"
        style="margin:5px 10px 0 0;width:60vw;"
        border
      >
      </n-table>
      <el-table style="margin-top:5px;width:40vw;" ref="userTable">
        <el-table-column type="index"></el-table-column>
        <el-table-column  prop="用户工号" label="用户工号"></el-table-column>
        <el-table-column  prop="用户名称" label="用户名称"></el-table-column>
        <el-table-column label="操作">
          <template #header>
            <svg-icon
              :class="['curn']"
              :color="'#5781c1'"
              :iconName="'check'"
              :tipLable="`添加`"
              style="color: #5781c1"
              @click="handleClick()"
            ></svg-icon>
          </template>
        </el-table-column>
      </el-table>
      <!-- 联动管理表格 -->
      <!-- <n-table
        ref="userTable"
        :tableConfig="roleLinkageTableConfig"
        style="margin-top:5px;width:40vw;"
        border
      >
      </n-table> -->
    </section>

  </div>
</template>

<script setup lang="ts">
// 组件
import nTable from "/@/components/nTable/index.vue";
import roleDialog from "./role/roleDialog.vue";
import { findDeptList } from "/@/api/employee/employee.js";
import { queryDictionaryData } from "/@/api/admin/paramsSet";
// 方法
import { getRoleListUrl, delList, saveRoleUser } from "/@/api/system/role";
import { getUsersByRoleCodeUrl } from "/@/api/consturl.js";
import { getUsersByRoleCode, getUserList } from "/@/api/system/user.ts";
import { clearFormData } from "/@/utils/jsOptions";
import useCurrentInstance from "/@/utils/useCurrentInstance.ts"
import { ref, reactive, toRefs, h } from "vue"
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, Plus, Delete, MoreFilled, Refresh} from "@element-plus/icons-vue";
import type { FormInstance, FormRules } from 'element-plus'
const { proxy } = useCurrentInstance()
const emit = defineEmits(['queryList']);
const RoleDialog = ref<any>(null)
const indexTable = ref<any>(null)
const selectedUsersTable = ref<any>(null)
const selectUsersTable = ref<any>(null)
const userTable = ref<any>(null)


const dialogFromData = ref<any>({
  name: null,
  dept: null
})
const deptList = ref<any>([]) //部门
const selectUsersTableData = ref<any>([])
const selectedUsersTableData = ref<any>([])
const dialogVisible = ref<any>(false) //是否展示对话框
const dialogTitle = ref<any>("角色用户管理") //对话框标题
// 角色表格配置
const  roleTableConfig = ref<any>({
  height: '550px',
  url: getRoleListUrl(),
  //表格表头
  columns: [
    {
      prop: "roleCode",
      label: "角色ID"
    },
    {
      prop: "roleName",
      label: "角色名称"
    },
    {
      prop: "roleState",
      label: "状态",

      formatter(row: any, column: any, cellValue: any, index: any) {
        return cellValue == 1 ? "停用" : "启用";
      }
    },
    // {
    //   prop: "addTime",
    //   label: "创建时间"
    // },
    {
      prop: "addUserId",
      label: "创建人"
    },
    // {
    //   prop: "editTime",
    //   label: "更新时间"
    // },
    {
      prop: "editUserId",
      label: "更新人"
    }
  ],
  highlightCurrentRow: true, //是否要高亮当前行
  showChoose: true, //是否显示选择框， 默认不显示
  // rowNumbers: true,
  showOperation: true, //是否显示操作字段
  singleSelect: true, //单选，复选，默认复选
  //操作按钮列表
  options: [
    {
      type: "success",
      label: "编辑",
      icon: "edit",
      click: (index: any, row: any) => {
        let roleData = { ...row };
      }
    },
    {
      type: "danger",
      label: "删除",
      icon: "delete",
      perms: "sys_role_delete",
      click: (index: any, row: any) => {
        ElMessageBox.confirm("确定删除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(async () => {
            const res: any = await delList(row.id);
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
// 角色联动表格配置
const roleLinkageTableConfig = ref<any>({
  url: getUsersByRoleCodeUrl(),
  height: '550px',
  
  data: [{}],
  //表格表头
  columns: [
    {
      prop: "userId",
      label: "用户账号",
      slot: true,
      render:() => {
        return h("select")
      }
    },
    {
      prop: "userName",
      label: "用户名称",
      slot: true,
      render:() => {
        return h("select")
      }
    },
  ],
  // rowNumbers: true,
  showOperation: true, //是否显示操作字段
  rowNumbers: true,
  //操作按钮列表
  options: [
    {
      icon: 'check',
      label: "确定"
    },
    {
      icon: 'delete',
      label: "删除"
    }
  ],
  //操作按钮样式
  operationColumn: {
    ldata:{
      show: true,
      icon: 'plus',
      label: "添加",
      click:() => {
        console.log(123);
        
      }
    },
    // 样式
    style: {},
    // 属性
    attr: {}
  }
})

// 角色用户管理下拉框值
const roleUserManagementData = ref<any>({
  deptName: "",
  userName: ""
})
// 角色新增数据
const roleDataForm = ref<any>({
  roleCode: "", //角色编码
  roleName: "", //角色名称
  roleType: "", //角色类型
  roleState: "", //角色状态
  description: "", //角色描述
  remark: "" //角色备注
})
// 选中的角色
const roleSelected = ref<any>({
  roleCode: "", // 当前选中行的角色
  id: ""
})
// 角色总数据
const userListData = ref<any>([])
const selectdDataFrom = ref<any>({
  userId: null
})

// 新增
const addNew = () => {
  RoleDialog.value.dialogVisible = true;
  // RoleDialog.value.roleDataForm = clearFormData(
  //   RoleDialog.value.roleDataForm
  // );
  // RoleDialog.value.roleDataForm.roleState=0;
}
// 查询
const queryList = async() => {
  // indexTable.value.find(roleSelectData.value);
}
// 保存
const save = async() => {
  let roleUserList: Array<any> = [];
  userListData.value.forEach((object: any) => {
    roleUserList.push({ userId: object.userId });
  });
  let data = {
    id: indexTable.value.getCheckedData().id,
    roleUserList: roleUserList
  };
  const res: any = await saveRoleUser(data);
  if (res.code == 0) {
    ElMessage({
      message: res.msg,
      type: "success",
      duration: 1500
    });
    showUsers();
    dialogVisible.value = false;
  } else {
    ElMessage({
      message: res.msg,
      type: "error",
      duration: 3000
    });
  }
}
// 取消
const cancel = () => {
  dialogVisible.value = false;
}
// 显示指定角色的用户
const showUsers = async() => {
  console.log(321111);
  let checkedData = indexTable.value.getCheckedData();
  
}

const dialogReset = () => {
  dialogFromData.value.name = null;
  dialogFromData.value.dept=null;
}

const dialogdQuery = () => {
  if (userListData.value == [] || userListData.value.length == 0) {
    return;
  }
  if (
    selectdDataFrom.value.userId == null ||
    selectdDataFrom.value.userId == ""
  ) {
    return;
  }
  let data: Array<any> = [];
  userListData.value.forEach((element: any) => {
    if (element.userId.includes(selectdDataFrom.value.userId)) {
      data.push(element);
    }
  });
  selectedUsersTable.value.setTableData(data);
}
const dialogdReset = () => {
  selectdDataFrom.value.userId = null;
  selectedUsersTable.value.setTableData(userListData.value);
}
// 加载部门下拉框
const loadDeptList = async() => {
  deptList.value = (await findDeptList()).data;
}
</script>
