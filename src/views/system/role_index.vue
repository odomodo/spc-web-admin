<!--
 * @Author: 曾宇奇
 * @Date: 2021-03-24 14:23:41
 * @LastEditTime: 2022-06-20 14:15:51
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
            clearable
            v-model="roleName"
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

    <roleDialog ref="RoleDialog" @queryList="queryList"></roleDialog>
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
      <div>
        <el-table style="margin-top:5px;width:36vw; height: 550px;overflow:scroll" ref="userTable" :data="tableData">
          <el-table-column type="index"></el-table-column>
          <el-table-column  prop="userId" label="用户工号">
            <template #default="scope">
              <el-select v-model="tableData[scope.$index]['userId']" @change="selectChange(scope.$index)">
                <el-option :value="i.userId" :label="`${i.userId}(${i.userName})`"  v-for="i in options" :key="i.userId"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column  prop="userName" label="用户名称" />
          <el-table-column label="操作">
            <template #header>
              <svg-icon
                :class="['curn']"
                :color="'#5781c1'"
                :iconName="'plus'"
                :tipLable="`添加`"
                style="color: #5781c1"
                @click="handleClick('add')"
              ></svg-icon>
            </template>
            <template #default="scope">
              <div class="flex ">
                <svg-icon
                  :class="['curn', 'mr10']"
                  :color="'#5781c1'"
                  :iconName="'check'"
                  :tipLable="`确定`"
                  style="color: #5781c1"
                  @click="save(scope.$index, scope.row)"
                ></svg-icon>
                <svg-icon
                  :class="['curn']"
                  :color="'#5781c1'"
                  :iconName="'delete'"
                  :tipLable="`删除`"
                  style="color: #5781c1"
                  @click="handleClick('delete', scope.row)"
                ></svg-icon>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="tableChange"
          @current-change="tableChange"
          :page-size="tableConfig_.pageSize"
          layout="total, , prev, pager, next, jumper"
          :total="pageConfig.total"
          style="float: right"
        >
        </el-pagination>
      </div>

    </section>

  </div>
</template>

<script setup lang="ts">
// 组件
import nTable from "/@/components/nTable/index.vue";
import roleDialog from "./role/roleDialog.vue";
import { findDeptList } from "/@/api/employee/employee.js";
import { roleAjaxList, sysUserGetUserList, roleSave, roleDelete, apiroleModify, apiroledelete } from "/@/api/controlChart/index.ts"
// 方法
import { getRoleListUrl, delList, saveRoleUser } from "/@/api/system/role";
import { getUsersByRoleCodeUrl } from "/@/api/consturl.js";
import { getUsersByRoleCode, getUserList } from "/@/api/system/user.ts";
import { clearFormData } from "/@/utils/jsOptions";
import useCurrentInstance from "/@/utils/useCurrentInstance.ts"
import { ref, reactive, toRefs, h, onMounted } from "vue"
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, Plus, Delete, MoreFilled, Refresh} from "@element-plus/icons-vue";
import type { FormInstance, FormRules } from 'element-plus'
const { proxy } = useCurrentInstance()
const roleName = ref('')
const RoleDialog = ref<any>(null)
const indexTable = ref<any>(null)
const userTable = ref<any>(null)
const tableData = ref<any>([])
const tableConfig_ = ref<any>({
  	pageSize: 15, //当设置了showPagination属性为true时，一页显示数据条数
		pageList: [15, 30, 90, 150, 240], //当设置了showPagination属性为true时，一页显示数据条数列表
})
const pageConfig = ref<any>({
  total: 0,
  currPage: 1
})
const handleCure = ref<any>(null)
const options = ref<any>([])
// 角色表格配置
const  roleTableConfig = ref<any>({
  height: '550px',
  url: getRoleListUrl(),
  param: {},
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
    {
      prop: "addUserId",
      label: "创建人"
    },
    {
      prop: "editUserId",
      label: "更新人"
    }
  ],
  cellClassName:({ row, column, rowIndex, columnIndex }: any) => {
    if (column.property === 'roleState') {
      if (row['roleState'] == 1) {
        return 'lose'
      } else {
        return 'valid'
      }
    }
  },
  // highlightCurrentRow: true, //是否要高亮当前行
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
        RoleDialog.value.dialogVisible = true;
        RoleDialog.value.dialogTitle = '编辑';
        RoleDialog.value.roleDataForm = JSON.parse(JSON.stringify(row));
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
            const res: any = await roleDelete(row.id);
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


// 新增
const addNew = () => {
  RoleDialog.value.dialogVisible = true;
  RoleDialog.value.dialogTitle = '新增';
}
// 查询
const queryList = async() => {
  indexTable.value.find({
    roleName: roleName.value,
  });
}
// 显示指定角色的用户
const showUsers = async(data?: any) => {
  handleCure.value = data || handleCure.value 
  let res = await roleAjaxList({
    roleId: handleCure.value.id,
    currPage: pageConfig.value.currPage
  })
  res?.data?.map((v: any) => {
    options.value.map((j: any) => {
      if (j.userId === v.userId) {
        v.userName = j.userName
      }
    })
  })
  tableData.value = res.data
  pageConfig.value.total = res.total
}
const handleClick = (type: string, data?: any) => {
  if (!handleCure.value) {
    ElMessage({
      type: 'error',
      message: '请先选择角色'
    })
  } else {
    let obj:any = {
      'add': () => {
        tableData.value.push({
          type: 'add'
        })
      },
      'delete': async () => {
        const res = await apiroledelete(data.id)
        if (res.code == 0) {
          ElMessage({
            message: res.msg,
            type: "success",
          });
          showUsers()
        } else {
          ElMessage({
            message: res.msg,
            type: "error",
            duration: 3000
          });
        }
        
      }
    }
    obj[type]()
  }
}
const selectChange =(index: number) => {
  options.value.map((v: any) => {
    if (v.userId === tableData.value[index].userId) {
      tableData.value[index].userName = v.userName
    }
  })
}
const tableChange = async(data: any) => {
  pageConfig.value.currPage = data
  showUsers()
}
const save = async(index: number, row?: any) => {
  let obj = {
    roleId: handleCure.value.id,
    userId: tableData.value[index].userId,
    id: row?.id,
  }
  let res
  if (tableData.value[index].type === 'add') {
    res = await roleSave(obj)
  } else {
    res = await apiroleModify(obj)
  }
  if (res.flag) {
    tableData.value[index].type = 'edit'
    tableData.value[index].id = res.data.id
    ElMessage({ 
      type: 'success',
      message: '操作成功'
    })
  } else {
    ElMessage({ 
      type: 'error',
      message: res?.msg
    })
  }
}
onMounted(async() => {
  const res = await sysUserGetUserList()
  options.value = res?.data
})
</script>
<style lang="scss" scoped>
::v-deep(.el-table__row .lose) {
  color: #EB715E !important;
}
::v-deep(.el-table__row .valid){
  color: #72BD1D !important;
}
.curn{
	cursor: pointer;
}
</style>