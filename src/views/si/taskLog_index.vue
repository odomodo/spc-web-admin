
<!--
 * @Author: 朱发生
 * @Date: 2021-08-04 11:23:52
 * @LastEditTime: 2022-04-20 13:32:31
 * @LastEditors: zhuangxingguo
 * @FilePath: \vue-next-admin\src\views\home\index.vue
-->

<template>
  <!-- 用户管理 -->
  <div class="taskLog">
    <!-- 选择框组 -->
    <div class="select_group flex-c">
      <div class="flex-c" style="margin-right: 10px">
        <label style="width: 90px">任务代码：</label>
        <el-input
          v-model="taskLogSelectData.code"
          placeholder="请输入"
          
        ></el-input>
      </div>
      <div class="flex-c">
        <label for="user">执行结果：</label>
        <el-select
          v-model="taskLogSelectData.searchType"
          placeholder="请选择"
          
        >
          <el-option label="成功" value="0"> </el-option>
          <el-option label="失败" value="1"> </el-option>
        </el-select>
      </div>
      <div class="flex-c">
        <label style="width: 70px">执行时间：</label>
        <el-date-picker
          type="datetime"
          placeholder="开始日期"
          
          value-format="yyyy-MM-dd HH:mm:ss"
          style="width: 180px"
          v-model="taskLogSelectData.startDate"
        ></el-date-picker>
        <span style="font-weight: 700; margin: 0 10px">~</span>
        <el-date-picker
          type="datetime"
          placeholder="结束日期"
          
          value-format="yyyy-MM-dd HH:mm:ss"
          style="margin-right: 10px; width: 180px"
          v-model="taskLogSelectData.endDate"
        ></el-date-picker>
      </div>
      <div class="flex-c" style="margin-right: 10px">
        <el-button
          type="primary"
          :icon="Search"
          
          @click="queryList(taskLogSelectData)"
          >查询</el-button
        >
        <el-button type="default" plain :icon="Refresh"  @click="reset"
          >重置</el-button
        >
      </div>
    </div>

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
import { getTaskLog } from "/@/api/si/taskSetting";

import { clearFormData } from "/@/utils/jsOptions";
import { reactive, toRefs, ref } from "vue";
import { Search, Refresh } from "@element-plus/icons-vue";
const state = reactive({
  // 用户表格配置
  taskLogTableConfig: {
    url: getTaskLog(),
    //表格表头
    columns: [
      {
        prop: "taskCode",
        label: "任务代码",
      },
      {
        prop: "taskType",
        label: "任务类型",
        formatter(row: any, column: any, cellValue: number, index: any) {
          return cellValue == 0 ? "SQL" : "JAVA";
        },
      },
      {
        prop: "serverIp",
        label: "服务端IP",
      },
      {
        prop: "systemVersion",
        label: "系统版本",
      },
      {
        prop: "logMessage",
        label: "日志信息",
      },
      {
        prop: "excuteResult",
        label: "执行结果",
        formatter(row: any, column: any, cellValue: number, index: any) {
          return cellValue == 0 ? "成功" : "失败";
        },
      },
      {
        prop: "excuteTime",
        label: "执行时间",
      },
    ],

    //rowNumbers: true, //是否显示行数
    showBatchDelete: false, //是否批量删除
    pageSize: 20,
    pageList: [20, 40, 80, 160, 240],
  },
  // 用户选择下拉框值
  taskLogSelectData: {
    code: "",
    searchType: null,
    startDate: "", //执行开始时间
    endDate: "", //执行结束时间
  } as any,
});
const indexTable = ref();
const { taskLogTableConfig, taskLogSelectData } = toRefs(state);
// 查询
const queryList = (taskLogSelectData: any) => {
  indexTable.value.find(taskLogSelectData);
};

// 重置
const reset = async () => {
  //清空下拉框数据
  state.taskLogSelectData = clearFormData(state.taskLogSelectData);
  (state.taskLogSelectData.code = ""), (state.taskLogSelectData.searchType = null);
  (state.taskLogSelectData.startDate = ""), (state.taskLogSelectData.endDate = "");

  queryList(state.taskLogSelectData);
};
</script>
<style lang="scss" scoped>
// 页面公共样式
.required {
  color: red;
}
.taskLog {
  .select_group {
    padding: 10px 0 0 20px;
    label {
      //width: 65px;
      //margin-right: 10px;
      font-size: 13px;
      color: #606266;
    }
  }
}
</style>

// 第三方样式
<style lang="scss" scoped>
::v-deep .el-input__inner {
  border-radius: 4px;
}
::v-deep .el-table th.is-leaf {
  border-bottom: 2px solid #ebeef5;
}
::v-deep .el-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 15px;
  .el-col {
    text-align: right;
    padding-right: 20px;
  }
}
.el-select {
  margin-right: 10px;
}
</style>
