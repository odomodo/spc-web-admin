<!--
 * @Author: 朱发生
 * @Date: 2021-08-06 15:23:52
 * @LastEditTime: 2022-04-20 13:32:31
 * @LastEditors: zhuangxingguo
 * @FilePath: \vue-next-admin\src\views\home\index.vue
-->

<template>
  <!-- 用户管理 -->
  <div class="thirdSystemLog">
    <el-form
      :inline="true"
      ref="thirdSystemLogSelectData"
      :model="thirdSystemLogSelectData"
      label-width="100px"
    >
      <el-form-item label="接口代码：">
        <el-input
          v-model="thirdSystemLogSelectData.interfaceCode"
          placeholder="请输入"
          size="small"
        ></el-input>
      </el-form-item>
      <el-form-item label="接口所属：">
        <el-select
          v-model="thirdSystemLogSelectData.interfaceSystem"
          placeholder="请选择"
          size="small"
        >
          <el-option label="ERP" value="0"> </el-option>
          <el-option label="SAP" value="1"> </el-option>
          <el-option label="BPM" value="2"> </el-option>
          <el-option label="UNIFY" value="3"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="接口结果：">
        <el-select
          v-model="thirdSystemLogSelectData.interfaceResult"
          placeholder="请选择"
          size="small"
        >
          <el-option label="成功" value="0"> </el-option>
          <el-option label="失败" value="1"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="调用时间：">
        <el-date-picker
          type="datetime"
          placeholder="开始日期"
          size="small"
          value-format="yyyy-MM-dd HH:mm:ss"
          style="width: 180px"
          v-model="thirdSystemLogSelectData.startCallTime"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="~" label-width="20px">
        <el-date-picker
          type="datetime"
          placeholder="结束日期"
          size="small"
          value-format="yyyy-MM-dd HH:mm:ss"
          style="margin-right: 10px; width: 180px"
          v-model="thirdSystemLogSelectData.endCallTime"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :icon="Search"
          size="small"
          @click="queryList(thirdSystemLogSelectData)"
          >查询</el-button
        >
        <el-button :icon="Refresh" size="small" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 任务执行日志表格 -->
    <n-table
      ref="indexTable"
      :tableConfig="taskLogTableConfig"
      style="margin-top: 5px"
      border
    >
    </n-table>
  </div>
</template>
<script setup lang="ts">
import nTable from "/@/components/nTable/index.vue";

// 方法
import { getThirdSystemLog } from "/@/api/si/thirdSystemLog";
import { Search, Refresh } from "@element-plus/icons-vue";
import { clearFormData, resizeForm } from "/@/utils/jsOptions";
import { reactive, toRefs, ref } from "vue";
const indexTable = ref();
const state = reactive({
  // 用户表格配置
  taskLogTableConfig: {
    url: getThirdSystemLog(),
    //表格表头
    columns: [
      {
        prop: "interfaceCode",
        label: "接口代码",
      },
      {
        prop: "interfaceSystem",
        label: "接口所属",
        formatter(row: any, column: any, cellValue: number, index: any) {
          if (cellValue == 0) return "ERP";
          if (cellValue == 1) return "SAP";
          if (cellValue == 2) return "BPM";
          if (cellValue == 3) return "UNIFY";
        },
      },
      {
        prop: "introductionParam",
        label: "接口传入参数",
      },
      {
        prop: "returnValue",
        label: "接口返回值",
      },
      {
        prop: "resultHandling",
        label: "处理结果",
        formatter(row: any, column: any, cellValue: number, index: any) {
          return cellValue == 0 ? "成功" : "失败";
        },
      },
      {
        prop: "callTime",
        label: "调用时间",
      },
    ],

    //rowNumbers: true, //是否显示行数
    showBatchDelete: false, //是否批量删除
    pageSize: 20,
    pageList: [20, 40, 80, 160, 240],
  },
  // 用户选择下拉框值
  thirdSystemLogSelectData: {
    interfaceCode: "",
    interfaceSystem: null,
    interfaceResult: null,
    startCallTime: "", //执行开始时间
    endCallTime: "", //执行结束时间
  } as any,
});
const { taskLogTableConfig, thirdSystemLogSelectData } = toRefs(state);

// 查询
const queryList = (thirdSystemLogSelectData: any) => {
  indexTable.value.find(thirdSystemLogSelectData);
};

// 重置
const reset = async () => {
  //清空下拉框数据
  state.thirdSystemLogSelectData = clearFormData(state.thirdSystemLogSelectData);
  (state.thirdSystemLogSelectData.interfaceCode = ""),
    (state.thirdSystemLogSelectData.interfaceSystem = null);
  state.thirdSystemLogSelectData.interfaceResult = null;
  (state.thirdSystemLogSelectData.startCallTime = ""),
    (state.thirdSystemLogSelectData.endCallTime = "");

  queryList(state.thirdSystemLogSelectData);
};
</script>

<style scoped lang="scss"></style>
