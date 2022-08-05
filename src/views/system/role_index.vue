<!--
 * @Author: 曾宇奇
 * @Date: 2021-03-24 14:23:41
 * @LastEditTime: 2022-07-28 17:17:57
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @Description: 角色管理/用户角色
 * @FilePath: \mes-ui\src\views\system\roleManagement.vue
-->
<template>
  <!-- 角色管理 -->
  <div class="role">
    <!-- 选择框组 -->
    <div class="df jcsb" style="padding-right: 14px;width: 880px;">
      <div class="df">
        <div :span="6" style="margin-right:6px">
          <el-form-item label="角色">
            <el-input
              id="role"
              placeholder="请输入"
              clearable
              v-model="roleName"
          ></el-input>
          </el-form-item>
        </div>
        <div :span="7">
          <div class="spc-button"  @click="queryList">
            <svg-icon iconName="search_icon" tipLable="搜索" iconSize="10"></svg-icon>
          </div>
        </div>
      </div>
      <div :span="2" style="margin-left: 40px;">
      <el-button type="primary" @click="addNew"><i><svg-icon iconName="新增_icon" tipLable="新增" iconSize="10" style="margin-right: 5px;"></svg-icon></i> 新增</el-button>
      </div>
    </div>

    <roleDialog ref="RoleDialog" @queryList="queryList"></roleDialog>
    <!-- 角色表格 -->
    <section class="flex">
      <!-- 角色管理表格 -->
      <n-table
        ref="indexTable"
        :tableConfig="roleTableConfig"
        @handleRadioChange="showUsers"
        style="margin:5px 10px 0 0;width:880px; flex: none"
      >
      </n-table>
      <div style="width: 465px;margin-left:60px; flex: auto; ">
        <div class="table-box">
          <el-table
            height="70vh"
            style="margin-top:5px;
            overflow-y:scroll; overflow-x:hidden" ref="userTable" :data="tableData"
            :header-cell-style="{ height: '50px', padding: '2px', backgroundColor: '#f0f0f0', color: '#313233' }"
            :row-style="{ height: '50px' }"
            :cell-style="{ padding: '3px' }"
            align="center"
			      header-align="center"
          >
            <el-table-column type="index"></el-table-column>
            <el-table-column  prop="userId" label="用户工号">
              <template #default="scope">
                <el-select v-if="scope.row.type === 'add' || scope.row.type === 'edit'" v-model="tableData[scope.$index]['userId']" @change="selectChange(scope.$index)">
                  <el-option :value="i.userId" :label="`${i.userId}(${i.userName})`"  v-for="i in options" :key="i.userId"></el-option>
                </el-select>
                <span v-else>{{tableData[scope.$index]['userId']}}</span>
              </template>
            </el-table-column>
            <el-table-column  prop="userName" label="用户名称" />
            <el-table-column fixed="right" header-align="center" align="center" disabled="false" width="120px">
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
                <div v-if="scope.row.type === 'add' || scope.row.type === 'edit'">
                  <svg-icon
                      iconName="check"
                      style="color: #5781c1; margin-right: 10px;margin-left: 10px;"
                      @click="save(scope.$index, scope.row)"
                    ></svg-icon>
                  <svg-icon
                    iconName="close"
                    style="color: #5781c1; margin-right: 10px;margin-left: 10px;"
                    @click="handleClick('delete', scope.row, scope.$index)"
                  ></svg-icon>
                </div>
                <div v-else="false">
                  <svg-icon
                    iconName="edit"
                    style="color: #5781c1; margin-right: 10px;margin-left: 10px;"
                    @click="save1(scope.$index, scope.row)"
                  ></svg-icon>
                  <svg-icon
                    :color="'#5781c1'"
                    :iconName="'delete'"
                    style="color: #5781c1; margin-right: 10px;margin-left: 10px;"
                    @click="handleClick('delete', scope.row, scope.$index)"
                  ></svg-icon>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination" style="padding: 14px 20px 5px 0px">
          <el-pagination
            @size-change="tableChange"
            @current-change="tableChange"
            :page-size="tableConfig_.pageSize"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="pageConfig.total"
          >
          </el-pagination>
        </div>
        
      </div>
    </section>

  </div>
</template>
<script lang="ts">
export default {
    name: "user_index",
};
</script>
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
  height: '70vh',
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
  highlightCurrentRow: true,
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
        row.roleType = row.roleType + ''
        RoleDialog.value.roleDataForm = JSON.parse(JSON.stringify(row));
      }
    },
    {
      type: "success",
      label: "查看",
      icon: "show",
      click: (index: any, row: any) => {
        RoleDialog.value.dialogVisible = true;
        RoleDialog.value.dialogTitle = '查看';
        row.roleType = row.roleType + ''
        RoleDialog.value.roleDataForm = JSON.parse(JSON.stringify(row));
      }
    },
    // {
    //   type: "danger",
    //   label: "删除",
    //   icon: "delete",
    //   perms: "sys_role_delete",
    //   click: (index: any, row: any) => {
    //     ElMessageBox.confirm("确定删除?", "提示", {
    //       confirmButtonText: "确定",
    //       cancelButtonText: "取消",
    //     })
    //       .then(async () => {
    //         const res: any = await roleDelete(row.id);
    //         indexTable.value.reload();
    //         ElMessage({
    //           type: "success",
    //           message: res.msg
    //         });
    //       })
    //       .catch(() => {
    //         ElMessage({
    //           type: "info",
    //           message: "已取消删除"
    //         });
    //       });
    //   }
    // }
  ],
  //操作按钮样式
  operationColumn: {
    // 样式
    style: {
      width: '140px'
    },
    // 属性
    attr: {}
  }
})


// 新增
const addNew = () => {
  RoleDialog.value.dialogVisible = true;
  RoleDialog.value.dialogTitle = '新增';
  RoleDialog.value.roleDataForm.roleState = 0
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
const handleClick = (type: string, data?: any, index?: any) => {
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
        if(data.type === 'edit') {
          delete data.type
          return
        }
        if (!data.id) {
          tableData.value.splice(index, 1)
          return
        }
        
        ElMessageBox.confirm('确定删除?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
					})
						.then(async () => {
							const res = await apiroledelete(data.id)
              if (res.code == 0) {
                ElMessage({
                  message: res.msg,
                  type: "success",
                });
                tableData.value.splice(index, 1)
              } else {
                ElMessage({
                  message: res.msg,
                  type: "error",
                  duration: 3000
                });
              }
						})
						.catch(() => {
							ElMessage({
								type: 'info',
								message: '已取消删除',
							});
						});


        
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
  if (!row.userId) {
    return 
  }
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
  if (res.code === 0) {
    delete tableData.value[index].type
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
const save1 = async(index: number, row?: any) => {
  row.type = 'edit'
}
onMounted(async() => {
  const res = await sysUserGetUserList({
    userState: 0
  })
  options.value = res?.data
})
</script>
<style lang="scss" scoped>
.table-box{
  padding-right: 14px;
	border-right: 1px solid #F0F2F5;
	border-bottom: 1px solid #F0F2F5;
}
.role{
  padding: 20px;
  border-radius: 10px;
  background:#fff;
}
::v-deep(.pagination){
  display: flex;
	flex-direction: row-reverse;
}
::v-deep(.pagination .el-pagination ){
	float: none !important;
	display: flex;
	// flex-direction: row-reverse;
	margin-top: 15px;
}

::v-deep(.el-table__row .lose) {
  color: #EB715E !important;
}
::v-deep(.el-table__row .valid){
  color: #72BD1D !important;
}
.curn{
	cursor: pointer;
}
::v-deep(.el-table .el-table__header-wrapper ){
	border-radius: 8px 8px 0px 0px !important;
}
</style>