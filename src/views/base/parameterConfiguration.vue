<!--
 * @Author: liuxinyi-yuhang 1029301987@qq.com
 * @Date: 2022-06-08 15:56:32
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @LastEditTime: 2022-08-23 14:05:37
 * @FilePath: \spc-web-admin\src\views\base\parameterConfiguration.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <el-row >
      <el-col :span="12" class="df jcsa">
        <div class="df">
          <el-form-item label="控制项编码" style="margin-right: 10px">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="控制项名称">
            <el-input></el-input>
          </el-form-item>
          <div class="spc-button">
            <svg-icon iconName="search_icon"  tipLable="搜索"  iconSize="10" ></svg-icon>
          </div>
          <div class="spc-button" >
            <svg-icon iconName="重置_icon"  tipLable="重置"  iconSize="10"></svg-icon>
          </div>
        </div>
        <el-button
          color="#5781C1"
          :icon="Plus"
          perms="params_set_add"
          >新增</el-button
        >
      </el-col>
      <el-col :span="12" class="df jcsa">
        <div class="df">
          <el-form-item label="明细项编码" style="margin-right: 10px">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="明细项编码值">
            <el-input></el-input>
          </el-form-item>
          <div class="spc-button">
            <svg-icon iconName="search_icon"  tipLable="搜索"  iconSize="10" ></svg-icon>
          </div>
          <div class="spc-button" >
            <svg-icon iconName="重置_icon"  tipLable="重置"  iconSize="10"></svg-icon>
          </div>
        </div>
        <el-button
          color="#5781C1"
          :icon="Plus"
          perms="params_set_add"
          >新增</el-button
        >
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12" style="padding-right: 10px">
        <nTable 
          ref="parent"
          :tableConfig="tableConfig"
          style="margin-top: 5px">
        </nTable>
      </el-col>
      <el-col :span="12" style="padding-left: 10px">
        <nTable 
          ref="parent"
          :tableConfig="tableConfig"
          style="margin-top: 5px">
        </nTable>
      </el-col>
    </el-row>
    <parameterAdd></parameterAdd>
    <ItemAdd></ItemAdd>
  </div>
</template>
<script setup lang="ts">
import nTable from '/@/components/nTable/index.vue';
import { reactive, toRefs, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {  Refresh, Search, Plus } from '@element-plus/icons-vue'
import parameterAdd from './parameter/parameterAdd.vue'
import ItemAdd from './parameter/itemAdd.vue'

const indexTable = ref();
const tableConfig = ref({
  height: "70vh",
  url: '',
  //表格表头
  columns: [
    {
      prop:'dataType',
      label:'参数类型',
    },
    {
      prop: "dataCode",
      label: "类型编号",
    },
    {
      prop: "dataName",
      label: "类型名称",
    },
    {
      prop: 'remarks',
      label: '描述',
    }

  ],
  data:[],
  showOperation: true, //是否显示操作字段
  //rowNumbers: true, //是否显示行数
  showPagination: true, //分页
  showChoose: true, //是否显示选择框， 默认不显示
  singleSelect: true, //单选，复选，默认复选
  //操作按钮列表
  options: [
    {
      type: "success",
      icon: "edit",
      label: "编辑",
      perms: "params_set_edit",
      click: (index: any, row: any) => {
      },
    },
    {
      type: "danger",
      label: "删除",
      icon: "delete",
      perms: "params_set_delete",
      click: (index: any, row: { id: any }) => {
      },
    },
  ],
  //操作按钮样式
  operationColumn: {
    // 样式
    style: {},
    // 属性
    attr: {},
  },
})
</script>

<style scoped lang="scss">
.box{
  padding: 10px;
  background:#fff;
  border-radius: 10px;
}
.spc-button{
  width: 30px;
  height: 30px;
}
</style>