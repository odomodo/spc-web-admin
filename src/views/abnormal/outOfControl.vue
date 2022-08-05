<!--
 * @Author: 曾宇奇
 * @Date: 2021-04-15 14:39:03
 * @LastEditTime: 2022-07-28 17:27:34
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @LastEditors: 失控点管理
 * @FilePath: \vue-next-admin\src\views\home\index.vue
-->

<template>
  <div class="box">
    <el-table height="75vh" style="width: 100%; " :data="tableData" :cell-class-name="cellClassName"
    :header-cell-style="{ height: '50px', padding: '2px', backgroundColor: '#f0f0f0', color: '#313233' }"
    class="table-box"
			:row-style="{ height: '50px' }"
			:cell-style="{ padding: '3px' }">
      <el-table-column type="index" width="50" />
      <el-table-column prop="state" label="状态" :formatter="formatter"/>
      <el-table-column prop="controlChartConfigCode" label="编码"  />
      <el-table-column prop="inspcationCode" label="检测项目"/>
      <el-table-column prop="controlChartCode" label="图表"  />
      <el-table-column prop="spare1" label="序号"/>
      <el-table-column prop="date" label="操作" fixed="right" header-align="center" align="center">
        <template #default="scope">
          <svg-icon 
            @click="handleClick('审批', scope.row)"
            v-if="scope.row.state === 0"
            :class="['curn']"
            :iconName="`审批_icon`"
            :tipLable="`审批`"
          >
          </svg-icon>
          <svg-icon 
            v-else
            @click="handleClick('查看', scope.row)"
            :class="['curn']"
            :iconName="`查看_icon`"
            :tipLable="`查看`">
          </svg-icon>
      </template>
      </el-table-column>
    </el-table>
    <div style="padding: 0px 20px 5px 0px" class="pagination">
      <el-pagination
        @size-change="tableChange"
        @current-change="tableChange"
        :page-size="tableConfig_.pageSize"
        layout="total, , prev, pager, next, jumper"
        background
        :total="pageConfig.total"
      >
      </el-pagination>
    </div>
    
    <disposeDialog ref="DisposeDialog" @queryList="queryList"></disposeDialog>
  </div>
</template>

<script lang="ts">
export default {
    name: "outOfControl",
};
</script>
<script setup lang="ts">
import nTable from '/@/components/nTable/index.vue';
import { reactive, toRefs, ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {  Refresh, Search, Plus } from '@element-plus/icons-vue'
import disposeDialog from './components/disposeDialog.vue'
import { TSpcOutControlAuditajaxList } from "/@/api/controlChart/index.ts"
const indexTable = ref();
const DisposeDialog: any = ref(null)
const tableData = ref<Array<any>>([
])
const tableConfig_ = ref<any>({
  pageSize: 15, //当设置了showPagination属性为true时，一页显示数据条数
  pageList: [15, 30, 90, 150, 240], //当设置了showPagination属性为true时，一页显示数据条数列表
})
const pageConfig = ref<any>({
  total: 0,
  currPage: 1
})
const tableChange = (data: any) => {
  pageConfig.value.currPage = data
  queryList()
}
const formatter = (data: any) => {
  let str
  if (data.state === 0) {
    str = '未审批'
  } else {
    str = '已审核'
  }
  return str
}
const cellClassName = ({ row, column, rowIndex, columnIndex }: any) => {
  if (column.property === 'state') {
    if (row.state === 0 ) {
      return 'lose'
    } else {
      return 'valid'
    }
  }
  
}
const queryList = async() => {
  const res = await TSpcOutControlAuditajaxList(pageConfig.value)
  tableData.value = res.data
  delete res.data
  pageConfig.value = res
}
const handleClick = async(type: any, data?: any) => {
  let obj: any = {
    '审批': () => {
      DisposeDialog.value.dialogVisible = true
      DisposeDialog.value.form = JSON.parse(JSON.stringify(data))
      DisposeDialog.value.title = `失控点处理审批`
      
    },
    '查看': () => {
      DisposeDialog.value.dialogVisible = true
      DisposeDialog.value.form = JSON.parse(JSON.stringify(data))
      DisposeDialog.value.title = `失控点处理查看`
    }
  }
  obj[type]()
}
onMounted(() => {
  queryList()
})
</script>

<style scoped lang="scss">
.table-box{
  padding-right: 14px;
	border-right: 1px solid #F0F2F5;
	border-bottom: 1px solid #F0F2F5;
}
::v-deep(.el-table .el-table__header-wrapper ){
	border-radius: 8px 8px 0px 0px !important;
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
.box{
  padding: 20px;
  background:#fff;
  border-radius: 10px;
}
.curn{
  cursor: pointer;
}

::v-deep(.el-table){
	--el-table-border-color: #fff;
}
</style>