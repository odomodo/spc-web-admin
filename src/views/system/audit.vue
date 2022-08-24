<!--
 * @Author: liuxinyi-yuhang 1029301987@qq.com
 * @Date: 2022-08-17 09:41:48
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @LastEditTime: 2022-08-19 15:35:15
 * @FilePath: \spc-web-admin\src\views\system\audit.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class='df box'>
    <n-table
      height="70vh"
     style="width: 320px;margin-right:10px; flex: auto;"
      ref="indexTable"
      :tableConfig="roleTableConfig"
      @handleRadioChange="showUsers"
    >
    </n-table>
    <div style="width: 800px; flex: auto; ">
        <div class="table-box">
          <el-table
            height="70vh"
            style="
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
            <el-table-column  prop="email" label="邮箱地址" />
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
                <div v-else>
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
  </div>
</template>

<script setup lang="ts">
import nTable from "/@/components/nTable/index.vue";
import roleDialog from "./role/roleDialog.vue";
import { findDeptList } from "/@/api/employee/employee.js";
import { roleAjaxList, sysUserGetUserList, roleSave, roleDelete, apiroleModify, apiroledelete } from "/@/api/controlChart/index.ts"
import { defnodelist, nodeuser, userpage, nodeuserModei, nodeuserdelete } from "/@/api/flow/index.ts"

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
const oldData = ref<any>({})
const handleCure = ref<any>(null)
const options = ref<any>([])
// 角色表格配置
const  roleTableConfig = ref<any>({
  height: '70vh',
  url: defnodelist(),
  param: {},
  //表格表头
  columns: [
    {
      prop: "nodeName",
      label: "审批组"
    },
  ],
  // highlightCurrentRow: true, //是否要高亮当前行
  showChoose: true, //是否显示选择框， 默认不显示
  // rowNumbers: true,
  highlightCurrentRow: true,
  showOperation: true, //是否显示操作字段
  singleSelect: true, //单选，复选，默认复选
  //操作按钮列表

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

// 显示指定角色的用户
const showUsers = async(data?: any) => {
  handleCure.value = data || handleCure.value 
  let res = await userpage(handleCure.value.id, {
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
      message: '请先选择审批组'
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
							const res = await nodeuserdelete(data.id)
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
  // let obj = {
  //   roleId: handleCure.value.id,
  //   userId: tableData.value[index].userId,
  //   id: row?.id,
  // }
  const tSpcFlowDefNodeId = handleCure.value.id
  const userIds = tableData.value[index].userId
  
  
  let res
  if (tableData.value[index].type === 'add') {
    res = await nodeuser(tSpcFlowDefNodeId, userIds)
  } else {
    res = await nodeuserModei(row?.id, {
      toUserId: row.userId,
      userId: oldData.value.userId,
    })
  }
  if (res.code === 0) {
    delete tableData.value[index].type
    tableData.value[index].id = res.data[0].id
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
  oldData.value = JSON.parse(JSON.stringify(row))
}
onMounted(async() => {
  const res = await sysUserGetUserList({
    userState: 0
  })
  options.value = res?.data
})
</script>

<style lang="scss" scoped>
.box{
  background: #FFFFFF;
  padding: 20px;
}
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