<!--
 * @Author: 
 * @Date: 2022-04-20 09:16:42
 * @LastEditTime: 2022-07-04 08:58:34
 * @LastEditors: Xingguo Zhuang 848563840@qq.com
 * @FilePath: \vue-next-admin\src\views\home\index.vue
-->

<template>
  <div class="cron" :val="value_">
    <el-tabs v-model="activeName">
      <el-tab-pane label="秒" name="s">
        <second-and-minute
          :values="sVal"
          lable="秒"
          @cronDetails="svals"
        ></second-and-minute>
      </el-tab-pane>
      <el-tab-pane label="分" name="m">
        <second-and-minute
          :values="mVal"
          :lable="'分'"
          @cronDetails="smval"
        ></second-and-minute>
      </el-tab-pane>
      <el-tab-pane label="时" name="h">
        <hour :values="hVal" lable="时" @cronDetails="hvals"></hour>
      </el-tab-pane>
      <el-tab-pane label="日" name="d">
        <day :values="dVal" lable="日" @cronDetails="dvals"></day>
      </el-tab-pane>
      <el-tab-pane label="月" name="month">
        <month :values="monthVal" lable="月" @cronDetails="mvals"></month>
      </el-tab-pane>
      <el-tab-pane label="周" name="week">
        <week :values="weekVal" lable="周" @cronDetails="wvals"></week>
      </el-tab-pane>
      <el-tab-pane label="年" name="year">
        <year :values="yearVal" lable="年" @cronDetails="yvals"></year>
      </el-tab-pane>
    </el-tabs>
    <!-- table -->
    <el-table :data="tableData" size="small" border style="width: 100%">
      <el-table-column prop="sVal" label="秒" width="70"> </el-table-column>
      <el-table-column prop="mVal" label="分" width="70"> </el-table-column>
      <el-table-column prop="hVal" label="时" width="70"> </el-table-column>
      <el-table-column prop="dVal" label="日" width="70"> </el-table-column>
      <el-table-column prop="monthVal" label="月" width="70"> </el-table-column>
      <el-table-column prop="weekVal" label="周" width="70"> </el-table-column>
      <el-table-column prop="yearVal" label="年"> </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs, defineProps, computed, watch, nextTick } from "vue";
import SecondAndMinute from "./secondAndMinute.vue";
import hour from "./hour.vue";
import day from "./day.vue";
import month from "./month.vue";
import week from "./week.vue";
import year from "./year.vue";
import { ElMessage } from "element-plus";

const emit = defineEmits(["cron"]);
const props = defineProps({
  values: {
    type: String,
  },
});
const state = reactive({
  activeName: "s",
  sVal: "",
  mVal: "",
  hVal: "",
  dVal: "",
  monthVal: "",
  weekVal: "",
  yearVal: "",
});

const svals = (val: any) => {
  state.sVal = val;
};
const mvals = (val: any) => {
  state.monthVal = val;
};
const hvals = (val: any) => {
  state.hVal = val;
};
const dvals = (val: any) => {
  state.dVal = val;
};
const yvals = (val: any) => {
  state.yearVal = val;
};
const wvals = (val: any) => {
  state.weekVal = val;
};
const smval = (val: any) => {
  state.mVal = val;
};

const { activeName, sVal, mVal, hVal, dVal, monthVal, weekVal, yearVal } = toRefs(state);
const tableData = computed(() => {
  return [
    {
      sVal: state.sVal,
      mVal: state.mVal,
      hVal: state.hVal,
      dVal: state.dVal,
      monthVal: state.monthVal,
      weekVal: state.weekVal,
      yearVal: state.yearVal,
    },
  ];
});
const value_ = computed(() => {
  if (!state.dVal && !state.weekVal) {
    return "";
  }
  let v = `${state.sVal} ${state.mVal} ${state.hVal} ${state.dVal} ${state.monthVal} ${state.weekVal} ${state.yearVal}`;
  if (state.dVal === "?" && state.weekVal === "?") {
    nextTick(() => {
      ElMessage({ type: "error", message: "日期与星期不可以同时为“不指定”" });
    })
    
  }
  if (state.dVal !== "?" && state.weekVal !== "?") {
    nextTick(() => {
      ElMessage({ type: "error", message: "日期与星期必须有一个为“不指定”" });
    })
  }
  return v;
});

const updateVal = () => {
  if (!props.values) {
    return;
  }
  let arrays = props.values.split(" ");
  state.sVal = arrays[0];
  state.mVal = arrays[1];
  state.hVal = arrays[2];
  state.dVal = arrays[3];
  state.monthVal = arrays[4];
  state.weekVal = arrays[5];
  state.yearVal = arrays[6];
};

watch(
  () => props.values,
  () => {
    updateVal();
  }
);
updateVal();
</script>

<style lang="css">
.cron {
  text-align: left;
  padding: 10px;
  background: #fff;
  border: 1px solid #dcdfe6;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
}
</style>
