<!--
 * @Author: liuxinyi-yuhang 1029301987@qq.com
 * @Date: 2022-08-17 09:41:48
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @LastEditTime: 2022-08-24 16:23:23
 * @FilePath: \spc-web-admin\src\views\system\audit.vue
 * @Description: 流程代理
-->
<template>
  <div class='df box'>
		<div style="width: 990px; flex: auto; ">
			<p class="title">代理人</p>
			<div class="table-box">
				<el-table
					height="70vh"
					style="
					overflow-y:scroll; overflow-x:hidden" ref="userTable" :data="tableData1"
					:header-cell-style="{ height: '50px', padding: '2px', backgroundColor: '#f0f0f0', color: '#313233' }"
					:row-style="{ height: '50px' }"
					:cell-style="{ padding: '3px' }"
					highlight-current-row
					align="center"
					header-align="center"
					@current-change="handleCurrentChange"
				>
					<el-table-column header-align="center" label="选择" align="center" fixed="left" width="80" >
						<template #default="scope">
							<el-radio v-model="handleCure" :label="scope.row"><i></i></el-radio>
						</template>
					</el-table-column>
					<el-table-column  prop="agentUserId" label="用户工号">
						<template #default="scope">
							<el-select v-if="scope.row.type === 'add' || scope.row.type === 'edit'" v-model="tableData1[scope.$index]['agentUserId']" @change="selectChange1(scope.$index)">
								<el-option :value="i.userId" :label="`${i.userId}(${i.userName})`"  v-for="i in options" :key="i.userId"></el-option>
							</el-select>
							<span v-else>{{tableData1[scope.$index]['agentUserId']}}</span>
						</template>
					</el-table-column>
					<el-table-column  prop="userName" label="用户名称" />
					<el-table-column  prop="emailAddress" label="邮箱地址" />
					<el-table-column fixed="right" header-align="center" align="center" disabled="false" width="120px">
						<template #header>
							<svg-icon
								:class="['curn']"
								:color="'#5781c1'"
								:iconName="'plus'"
								:tipLable="`添加`"
								style="color: #5781c1"
								@click="handleClick1('add')"
							></svg-icon>
						</template>
						<template #default="scope">
							<div v-if="scope.row.type === 'add' || scope.row.type === 'edit'">
								<svg-icon
										iconName="check"
										style="color: #5781c1; margin-right: 10px;margin-left: 10px;"
										@click="save2(scope.$index, scope.row)"
									></svg-icon>
								<svg-icon
									iconName="close"
									style="color: #5781c1; margin-right: 10px;margin-left: 10px;"
									@click="handleClick1('delete', scope.row, scope.$index)"
								></svg-icon>
							</div>
							<div v-else>
								<svg-icon
									iconName="edit"
									style="color: #5781c1; margin-right: 10px;margin-left: 10px;"
									@click="save3(scope.$index, scope.row)"
								></svg-icon>
								<svg-icon
									:color="'#5781c1'"
									:iconName="'delete'"
									style="color: #5781c1; margin-right: 10px;margin-left: 10px;"
									@click="handleClick1('delete', scope.row, scope.$index)"
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
		<div style="width: 460px; flex: auto; ">
			<p class="title">被代理人</p>
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
					<el-table-column  prop="byAgentUserId" label="用户工号">
						<template #default="scope">
							<el-select v-if="scope.row.type === 'add' || scope.row.type === 'edit'" v-model="tableData[scope.$index]['userId']" @change="selectChange(scope.$index)">
								<el-option :value="i.userId" :label="`${i.userId}(${i.userName})`"  v-for="i in options" :key="i.userId"></el-option>
							</el-select>
							<span v-else>{{tableData[scope.$index]['byAgentUserId']}}</span>
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
import { roleAjaxList, sysUserGetUserList, TSpcProcessBrokerMainajaxList, TSpcProcessBrokerMainsave, TSpcProcessBrokerMainmodify, TSpcProcessBrokerajaxList, TSpcProcessBrokersave, TSpcProcessBrokermodify, TSpcProcessBrokerMaindelete, TSpcProcessBrokerdelete } from "/@/api/controlChart/index.ts"
// 方法
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
const tableData1 = ref<any>([])
const tableConfig_ = ref<any>({
  	pageSize: 15, //当设置了showPagination属性为true时，一页显示数据条数
		pageList: [15, 30, 90, 150, 240], //当设置了showPagination属性为true时，一页显示数据条数列表
})
const tableConfig_1 = ref<any>({
  	pageSize: 15, //当设置了showPagination属性为true时，一页显示数据条数
		pageList: [15, 30, 90, 150, 240], //当设置了showPagination属性为true时，一页显示数据条数列表
})
const pageConfig = ref<any>({
  total: 0,
  currPage: 1
})
const pageConfig1 = ref<any>({
  total: 0,
  currPage: 1
})
const oldData = ref<any>({})
const handleCure = ref<any>(null)
const options = ref<any>([])
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
      message: '请先选择代理人'
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
							const res = await TSpcProcessBrokerdelete({id: data.id})
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
const handleClick1 = (type: string, data?: any, index?: any) => {
  let obj:any = {
      'add': () => {
        tableData1.value.push({
          type: 'add',
					timer: new Date()
        })
      },
      'delete': async () => {
        if(data.type === 'edit') {
          delete data.type
          return
        }
        if (!data.id) {
          tableData1.value.splice(index, 1)
          return
        }
        
        ElMessageBox.confirm('确定删除?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
					})
						.then(async () => {
							const res = await TSpcProcessBrokerMaindelete({id: data.id})
              if (res.code == 0) {
                ElMessage({
                  message: res.msg,
                  type: "success",
                });
                tableData1.value.splice(index, 1)
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
const selectChange =(index: number) => {
  options.value.map((v: any) => {
    if (v.userId === tableData.value[index].userId) {
      tableData.value[index].userName = v.userName
    }
  })
}
const selectChange1 =(index: number) => {
  options.value.map((v: any) => {
    if (v.userId === tableData1.value[index].agentUserId) {
      tableData1.value[index].userName = v.userName
			tableData1.value[index].emailAddress = v.emailAddress
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
  const userIds = tableData.value[index].userId
  let res
  if (tableData.value[index].type === 'add') {
    res = await TSpcProcessBrokersave({
			agentUserId: handleCure.value.agentUserId,
			byAgentUserId: row.userId
		})
  } else {
    res = await TSpcProcessBrokermodify({
			id: row.id,
      agentUserId: handleCure.value.addUserId,
			byAgentUserId: row.byAgentUserId
    })
  }
  if (res.code === 0) {
    delete tableData.value[index].type
    tableData.value[index].byAgentUserId = res.data?.byAgentUserId
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

const save2 = async(index: number, row?: any) => {
  if (!row.agentUserId) {
    return 
  }
  const userIds = tableData1.value[index].agentUserId
  let res
  if (tableData1.value[index].type === 'add') {
    res = await TSpcProcessBrokerMainsave({
			agentUserId: userIds
		})
  } else {
    res = await TSpcProcessBrokerMainmodify({
      agentUserId: userIds,
			id: row?.id
    })
  }
  if (res.code === 0) {
    delete tableData1.value[index].type
    tableData1.value[index].id = res.data.id
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
const save3 = async(index: number, row?: any) => {
  row.type = 'edit'
  oldData.value = JSON.parse(JSON.stringify(row))
}
const queryTable1 = async () => {
	let res = await TSpcProcessBrokerMainajaxList({
    currPage: pageConfig1.value.currPage
  })
	tableData1.value = res?.data || []
}

const handleCurrentChange = async (data:any) => {
	handleCure.value = data
	let res = await TSpcProcessBrokerajaxList({
		agentUserId: data?.agentUserId
	})
	tableData.value = res?.data
}
onMounted(async() => {
  const res = await sysUserGetUserList({
    userState: 0
  })
  options.value = res?.data
	queryTable1()
})
</script>

<style lang="scss" scoped>
.title{
	margin-bottom: 24px;
	font-size: 16px;
	font-family: Microsoft YaHei;
	font-weight: 400;
	color: #313233;
	line-height: 24px;
}
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