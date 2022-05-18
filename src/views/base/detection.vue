<!--
 * @Author: liuxinyi-yuhang 1029301987@qq.com
 * @Date: 2022-05-16 13:13:13
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @LastEditTime: 2022-05-16 13:30:43
 * @FilePath: \spc-web-admin\src\views\base\detection.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
<div>
  <el-row class="params_set">
    <el-col :span="24" class="params_set_parent">
      <!-- 编码搜索 -->
      <el-row class="parent_code" type="flex" align="center">
        <el-col :span="6" class="flex flex-c">
          <label style="width: 100px">检验项目：</label>
          <el-input autocomplete="off" v-model="parentDataCode" size="small"></el-input>
        </el-col>
        <el-col :span="6" class="flex flex-c">
          <label style="width: 100px">检验规格：</label>
          <el-input autocomplete="off" v-model="parentDataCode" size="small"></el-input>
        </el-col>
        <el-col :span="6" class="flex flex-c">
          <div class="spc-button" @click="queryList('parent', '', parentDataCode)">
            <svg-icon iconName="search"></svg-icon>
          </div>
          <div class="spc-button" @click="reset('parent')">
            <svg-icon iconName="refresh"></svg-icon>
          </div>
          <el-button
            color="#5781C1"
            class="spc-right"
            :icon="Plus"
            size="small"
            @click="addNewParent"
            perms="params_set_add"
            >新增</el-button
          >
        </el-col>
      </el-row>
      <!-- 父配置表格 -->
      <n-table
        ref="parent"
        :tableConfig="parentTableConfig"
        @handleRadioChange="handleRadioChange"
        style="margin-top: 5px"
      ></n-table>
    </el-col>
  </el-row>
</div>
</template>

<script setup lang="ts">
import nTable from "/@/components/nTable/index.vue";
import paramsSetParentAdd from "./paramsSet/paramsSet_parent_add.vue";
import paramsSetParentEdit from "./paramsSet/paramsSet_parent_edit.vue";
import paramsSetChildAdd from "./paramsSet/paramsSet_child_add.vue";
import paramsSetChildEdit from "./paramsSet/paramsSet_child_edit.vue";
import { Plus } from "@element-plus/icons-vue";
// 方法
import { getParamsListUrl, delList } from "/@/api/base/paramsSet";

import { reactive, toRefs, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
</script>