<!--
 * @Author: 曾宇奇
 * @Date: 2021-03-24 14:23:41
 * @LastEditTime: 2022-06-06 09:29:47
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @Description: 角色管理
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
            v-model="roleSelectData.roleName"
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
    <!-- 弹框 用户角色分配表格 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="70%"
    >
      <div class="dialog_role_management" v-if="dialogTitle === '角色用户管理'">
        <div class="flex-c-c">
          <div class="w-100 ">
            <div class="role_table_group flex-c">
              <div style="width:47%">
                <div class="role_button_group flex-c">
                  <section class="flex-c" style="margin-right:10px">
                    <el-row>
                      <el-col :span="8">
                        <el-input
                          placeholder="请输入用户"
                          
                          v-model="dialogFromData.name"
                        ></el-input>
                      </el-col>
                      <el-col :span="8" style="padding-left: 10px;">
                        <el-select   clearable filterable v-model="dialogFromData.dept" value-key="id">
                          <el-option
                            :label="item.deptName"
                            :value="item"
                            v-for="item in deptList"
                            :key="item.id"
                          >
                            <span style="float: left">{{ item.deptName }}</span>
                            <span style="float: right; color: #8492a6; font-style: 14px">{{
                  item.deptCode
                }}</span>
                          </el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="8">
                        <el-button
                          type="primary"
                          plain
                          
                          perms="search"
                          @click="dialogQuery"
                        >查询</el-button
                        >
                        <el-button
                        type="default"
                        plain
                        
                        perms="reset"
                        @click="dialogReset"
                        >重置</el-button
                        >
                      </el-col>
                    </el-row>

                  </section>

                </div>
                <n-table
                  ref="selectUsersTable"
                  :tableConfig="selectUsersTableConfig"
                ></n-table>
              </div>
              <div class="transfer_arrow h-100">
                <el-button
                  type="success"
                  plain
                  icon="el-icon-d-arrow-right"
                  
                  perms="save"
                  @click="userToRight()"
                  >添加</el-button
                >
                <el-button
                  type="danger"
                  plain
                  icon="el-icon-d-arrow-left"
                  class="del"
                  perms="save"
                  @click="userToLeft()"
                  >移除</el-button
                >
              </div>
              <div style="width:47%">
                <div class="role_button_group flex-c">
                  <section class="flex-c" style="margin-right:10px">
                    <label class="lable" style="margin: 0 10px;width: 36px;"
                      >用户</label
                    >
                    <el-input
                      placeholder="请输入用户"
                      
                      v-model="selectdDataFrom.userId"
                    ></el-input>
                  </section>
                  <el-button
                    type="primary"
                    plain
                    perms="search"
                    @click="dialogdQuery"
                    >查询</el-button
                  >
                  <el-button
                    type="default"
                    plain
                    perms="reset"
                    @click="dialogdReset"
                    >重置</el-button
                  >
                </div>
                <n-table
                  ref="selectedUsersTable"
                  :tableConfig="selectedUsersTableConfig"
                ></n-table>
              </div>
            </div>
            <div class="role_options_group flex-c-c" style="margin-top:20px;margin-bottom:20px;">
              <el-button type="primary"  @click="save" perms="save">保存</el-button>
              <el-button type="primary"  @click="cancel" perms="cancle"
                >取消</el-button
              >
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- 新增角色弹窗 -->
    <role-add ref="RoleAdd"></role-add>
    <!-- 编辑角色弹窗 -->
    <role-edit ref="RoleEdit"></role-edit>
    

    <!-- 角色表格 -->
    <section class="flex">
      <!-- 角色管理表格 -->
      <n-table
        ref="indexTable"
        :tableConfig="roleTableConfig"
        @handleRadioChange="showUsers"
        style="margin:5px 10px 0 0;width:75vw;"
        border
      >
      </n-table>
      <!-- 联动管理表格 -->
      <n-table
        ref="userTable"
        :tableConfig="roleLinkageTableConfig"
        style="margin-top:5px;width:25vw;"
        class="roleLinkageTableConfigClass"
        border
      >
      </n-table>
    </section>

  </div>
</template>

<script setup lang="ts">
// 组件
import nTable from "/@/components/nTable/index.vue";
import roleAdd from "./role/role_add.vue";
import roleEdit from "./role/role_edit.vue";
import { findDeptList } from "/@/api/employee/employee.js";

// 方法
import { getRoleListUrl, delList, saveRoleUser } from "/@/api/system/role";
import { getUsersByRoleCodeUrl } from "/@/api/consturl.js";
import { getUsersByRoleCode, getUserList } from "/@/api/system/user.ts";
import { clearFormData } from "/@/utils/jsOptions";
import useCurrentInstance from "/@/utils/useCurrentInstance.ts"
import { ref, reactive, toRefs } from "vue"
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, Plus, Delete, MoreFilled, Refresh} from "@element-plus/icons-vue";
import type { FormInstance, FormRules } from 'element-plus'
const { proxy } = useCurrentInstance()
const emit = defineEmits(['queryList']);
const RoleEdit = ref<any>(null)
const RoleAdd = ref<any>(null)
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
      perms: "sys_role_edit",
      click: (index: any, row: any) => {
        let roleData = { ...row };
        /* if (roleData.roleState == 0) {
          roleData.roleState = true;
        } else if (roleData.roleState == 1) {
          roleData.roleState = false;
        } */
        RoleEdit.value.roleDataForm = roleData;
        RoleEdit.value.dialogVisible = true;
      }
    },
    {
      type: "danger",
      label: "删除",
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
  height: 550,
  //表格表头
  columns: [
    {
      prop: "userId",
      label: "用户账号"
    },
    {
      prop: "userName",
      label: "用户名称"
    },

    // {
    //   prop: "addTime",
    //   label: "创建时间"
    // },
    {
      prop: "addUserId",
      label: "创建人"
    }
  ],
  initLoadFlag: false, //初始时是否加载表格数据，默认加载
  showOperation: false, //是否显示操作字段
  //操作按钮列表
  options: [
    {
      type: "success",
      label: "编辑"
    },
    {
      type: "danger",
      label: "删除"
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
// 待选择的用户列表
const selectUsersTableConfig = ref<any>({
  height: "550px",
  //表格表头
  columns: [
    {
      prop: "userId",
      label: "用户账号",

    },
    {
      prop: "userName",
      label: "用户名称",
    }
  ],

  data: [],
  initLoadFlag: false, //初始时是否加载表格数据，默认加载
  showChoose: true, //是否显示选择框， 默认不显示
  showPagination: false //分页
})
const selectedUsersTableConfig = ref<any>({
  height: "550px",
  columns: [
    {
      prop: "userId",
      label: "用户账号",
    },
    {
      prop: "userName",
      label: "用户名称",
    }
  ],
  data: [],
  initLoadFlag: false, //初始时是否加载表格数据，默认加载
  showChoose: true, //是否显示选择框， 默认不显示
  showPagination: false //分页
})
// 角色选择下拉框值
const roleSelectData = ref<any>({
  roleType: "", //类型
  roleName: "", //角色
  roleState: "" //状态
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
  RoleAdd.value.dialogVisible = true;
  RoleAdd.value.roleDataForm = clearFormData(
    RoleAdd.value.roleDataForm
  );
  RoleAdd.value.roleDataForm.roleState=0;
}
// 查询
const queryList = async() => {
  indexTable.value.find(roleSelectData.value);
}
// 重置
const reset = () => {
  clearFormData(roleSelectData.value);
  queryList();
}
// 打开角色用户弹框
const setRole = async() => {
  let checkedData = indexTable.value.getCheckedData();
  if (checkedData == null) {
    return ElMessage({ message: "请选择角色", type: "error" });
  }
  let selectUsersData = (await getUserList()).data;
  // 已选择table数据
  let existData = (
    await getUsersByRoleCode({ roleCode: checkedData.roleCode })
  ).data;
  selectedUsersTableConfig.value.data = existData;
  // 去除掉相同数据
  let arrIdList = existData.map((x: any) => x.userId);
  selectUsersTableConfig.value.data = selectUsersData.filter(
    (x: any)  => !arrIdList.includes(x.userId)
  );
  loadDeptList();
  dialogVisible.value = true;
  proxy.nextTick(() => {
    selectedUsersTable.value.setTableData(existData);
    userListData.value = existData;
    selectUsersTable.value.setTableData(
      selectUsersTableConfig.value.data
    );
  });
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
  let checkedData = indexTable.value.getCheckedData();
  userTable.value.find({ roleCode: checkedData.roleCode });
}
// 角色用户 添加
const userToRight = () => {
  selectUsersTable.value.getCheckedData().forEach((object: any) => {
    selectedUsersTableConfig.value.data.push(object);
  });

  let arrIdList = selectedUsersTableConfig.value.data.map((x: any) => x.userId);
  selectUsersTableConfig.value.data = selectUsersTableConfig.value.data.filter(
    (x: any) => !arrIdList.includes(x.userId)
  );
  selectedUsersTable.value.setTableData(
    selectedUsersTableConfig.value.data
  );
  selectUsersTable.value.setTableData(
    selectUsersTableConfig.value.data
  );
}

// 角色用户 移除
const userToLeft = () => {
  selectedUsersTable.value.getCheckedData().forEach((object: any) => {
    selectUsersTableConfig.value.data.push(object);
  });
  let arrIdList = selectUsersTableConfig.value.data.map((x: any) => x.userId);
  userListData.value = userListData.value.filter(
    (x: any) => !arrIdList.includes(x.userId)
  );
  selectedUsersTableConfig.value.data = selectedUsersTableConfig.value.data.filter(
    (x: any) => !arrIdList.includes(x.userId)
  );
  selectedUsersTable.value.setTableData(
    selectedUsersTableConfig.value.data
  );
  selectUsersTable.value.setTableData(
    selectUsersTableConfig.value.data
  );
}
const dialogQuery = async() => {
  let checkedData = indexTable.value.getCheckedData();
  if (checkedData == null) {
    return ElMessage({ message: "请选择角色", type: "error" });
  }
  let selectUsersData = (await getUserList({
    name: dialogFromData.value.name,
    title: dialogFromData.value.dept === null ? null : dialogFromData.value.dept.id
  })).data;
  // 已选择table数据
  // 去除掉相同数据
  let arrIdList = userListData.value.map((x: any) => x.userId);
  selectUsersTableConfig.value.data = selectUsersData.filter(
    (x: any) => !arrIdList.includes(x.userId)
  );
  proxy.nextTick(() => {
    selectUsersTable.value.setTableData(
      selectUsersTableConfig.value.data
    );
  });
}
const dialogReset = () => {
  dialogFromData.value.name = null;
  dialogFromData.value.dept=null;
  dialogQuery();
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
