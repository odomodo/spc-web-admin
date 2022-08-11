<!--
 * @Author: liuxinyi-yuhang 1029301987@qq.com
 * @Date: 2022-08-09 14:07:41
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @LastEditTime: 2022-08-10 14:27:26
 * @FilePath: \spc-web-admin\src\views\home\model\nodo.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class='box'>
    <div class='head df aic'>
      <p class="goback">返回</p>
      <p class="title">未处理信息列表</p>
    </div>
    <div class="box1">
      <n-table
        ref="indexTable"
        :tableConfig="roleTableConfig"
      >
      </n-table>
    </div>
    <nodoDialog></nodoDialog>
  </div>
</template>

<script  lang="ts" setup>
import nTable from "/@/components/nTable/index.vue";
import { ref, reactive, toRefs, h, onMounted } from "vue"
import nodoDialog from "./nodoDialog.vue"
const indexTable = ref<any>(null)
const  roleTableConfig = ref<any>({
  height: '70vh',
  url: '',
  param: {},
  data:[{}],
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
  // showChoose: true, //是否显示选择框， 默认不显示
  // rowNumbers: true,
  highlightCurrentRow: true,
  showOperation: true, //是否显示操作字段
  // singleSelect: true, //单选，复选，默认复选
  //操作按钮列表
  options: [
    {
      type: "success",
      label: "审批",
      icon: "审批_icon",
      click: (index: any, row: any) => {
      }
    },
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
</script>

<style lang='scss' scoped>
.box{
  
background: #FFFFFF;
}
.head{
  width: 100%;
  height: 54px;
  border-bottom:1px solid #E1E5EB;
  margin-bottom: 34px;
  .goback{
    padding: 0 20px 0 40px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #626466;
  }
  .title{
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #313233;
    padding-left: 20px;
    border-left: 1px solid #E1E5EB;
  }
}
.box1{
  padding: 0 148px;
}
//@import url()

</style>