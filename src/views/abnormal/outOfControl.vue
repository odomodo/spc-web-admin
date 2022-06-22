<!--
 * @Author: 曾宇奇
 * @Date: 2021-04-15 14:39:03
 * @LastEditTime: 2022-06-20 15:36:18
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @FilePath: \vue-next-admin\src\views\home\index.vue
-->

<template>
  <div class="box">
    <el-table style="width: 100%" :data="tableData">
      <el-table-column type="index" width="50" />
      <el-table-column prop="date" label="状态"  />
      <el-table-column prop="date" label="编码"  />
      <el-table-column prop="date" label="检测项目"/>
      <el-table-column prop="date" label="图表"  />
      <el-table-column prop="date" label="序号"/>
      <el-table-column prop="date" label="操作" fixed="right">
        <template #default>
          <el-tooltip
            class="box-item"
            effect="dark"
            content="审批"
            placement="top"
          >
            <el-button >审批</el-button>
          </el-tooltip>
          <el-tooltip
            class="box-item"
            effect="dark"
            content="查看"
            placement="top"
          >
            <el-button >查看</el-button>
          </el-tooltip>
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
    <disposeDialog></disposeDialog>
  </div>
</template>

<script setup lang="ts">
import nTable from '/@/components/nTable/index.vue';
import { reactive, toRefs, ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {  Refresh, Search, Plus } from '@element-plus/icons-vue'
import disposeDialog from './components/disposeDialog.vue'
import { TSpcOutControlAuditajaxList } from "/@/api/controlChart/index.ts"

const indexTable = ref();
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
const tableChange = () => {

}
const queryList = async() => {
  const res = await TSpcOutControlAuditajaxList(pageConfig.value)
  tableData.value = res.data
}
onMounted(() => {
  queryList()
})
</script>

<style scoped lang="scss">
.box{
  padding: 10px;
  background:#fff;
  border-radius: 10px;
}
</style>