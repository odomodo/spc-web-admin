<!--
 * @Author: 
 * @Date: 2022-04-20 09:16:42
 * @LastEditTime: 2022-04-20 13:32:31
 * @LastEditors: zhuangxingguo
 * @FilePath: \vue-next-admin\src\views\home\index.vue
-->

<template>
  <div :val="value_">
    <div>
      <el-radio v-model="type" label="1" size="small" border>每周</el-radio>
    </div>
    <div>
      <el-radio v-model="type" label="5" size="small" border>不指定</el-radio>
    </div>
    <div>
      <el-radio v-model="type" label="2" size="small" border>周期</el-radio>
      <span style="margin-left: 10px; margin-right: 5px">从星期</span>
      <el-input-number
        @change="type = '2'"
        v-model="cycle.start"
        :min="1"
        :max="7"
        size="small"
        style="width: 100px"
      ></el-input-number>
      <span style="margin-left: 5px; margin-right: 5px">至星期</span>
      <el-input-number
        @change="type = '2'"
        v-model="cycle.end"
        :min="2"
        :max="7"
        size="small"
        style="width: 100px"
      ></el-input-number>
    </div>
    <div>
      <el-radio v-model="type" label="3" size="small" border>循环</el-radio>
      <span style="margin-left: 10px; margin-right: 5px">从星期</span>
      <el-input-number
        @change="type = '3'"
        v-model="loop.start"
        :min="1"
        :max="7"
        size="small"
        style="width: 100px"
      ></el-input-number>
      <span style="margin-left: 5px; margin-right: 5px">开始，每</span>
      <el-input-number
        @change="type = '3'"
        v-model="loop.end"
        :min="1"
        :max="7"
        size="small"
        style="width: 100px"
      ></el-input-number>
      天执行一次
    </div>
    <div>
      <el-radio v-model="type" label="7" size="small" border>指定周</el-radio>
      <span style="margin-left: 10px; margin-right: 5px">本月第</span>
      <el-input-number
        @change="type = '7'"
        v-model="week.start"
        :min="1"
        :max="4"
        size="small"
        style="width: 100px"
      ></el-input-number>
      <span style="margin-left: 5px; margin-right: 5px">周，星期</span>
      <el-input-number
        @change="type = '7'"
        v-model="week.end"
        :min="1"
        :max="7"
        size="small"
        style="width: 100px"
      ></el-input-number>
    </div>
    <div>
      <el-radio v-model="type" label="6" size="small" border>本月最后一个</el-radio>
      <span style="margin-left: 10px; margin-right: 5px">星期</span>
      <el-input-number
        @change="type = '6'"
        v-model="last"
        :min="1"
        :max="7"
        size="small"
        style="width: 100px"
      ></el-input-number>
    </div>
    <div>
      <el-radio v-model="type" label="4" size="small" border>指定</el-radio>
      <el-checkbox-group v-model="appoint" style="margin-left: 50px; line-height: 25px">
        <el-checkbox
          @change="type = '4'"
          v-for="i in 7"
          :key="i"
          :label="i"
        ></el-checkbox>
      </el-checkbox-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs,  computed, watch, } from "vue";
const emit = defineEmits(["cronDetails"]);
const props = defineProps({
  values: {
    type: String,
    default: "*",
  },
});
const state = reactive({
  type: "1", // 类型
  cycle: {
    // 周期
    start: 0,
    end: 0,
  },
  loop: {
    // 循环
    start: 0,
    end: 0,
  },
  week: {
    // 指定周
    start: 0,
    end: 0,
  },
  work: 0,
  last: 0,
  appoint: [] as number[], // 指定
});
const { type, cycle, loop, week, work, last, appoint } = toRefs(state);
const value_ = computed(() => {
  let result = [];
  switch (state.type) {
    case "1": // 每秒
      result.push("*");
      break;
    case "2": // 年期
      result.push(`${state.cycle.start}-${state.cycle.end}`);
      break;
    case "3": // 循环
      result.push(`${state.loop.start}/${state.loop.end}`);
      break;
    case "4": // 指定
      result.push(state.appoint.join(","));
      break;
    case "6": // 最后
      result.push(`${state.last === 0 ? "" : state.last}L`);
      break;
    case "7": // 指定周
      result.push(`${state.week.start}#${state.week.end}`);
      break;
    default:
      // 不指定
      result.push("?");
      break;
  }
  emit("cronDetails", result.join(""));
  return result.join("");
});
const updateVal = () => {
  if (!props.values) {
    return;
  }
  if (props.values === "?") {
    state.type = "5";
  } else if (props.values.indexOf("-") !== -1) {
    // 2周期
    if (props.values.split("-").length === 2) {
      state.type = "2";
      state.cycle.start = Number(props.values.split("-")[0]);
      state.cycle.end = Number(props.values.split("-")[1]);
    }
  } else if (props.values.indexOf("/") !== -1) {
    // 3循环
    if (props.values.split("/").length === 2) {
      state.type = "3";
      state.loop.start = Number(props.values.split("/")[0]);
      state.loop.end = Number(props.values.split("/")[1]);
    }
  } else if (props.values.indexOf("*") !== -1) {
    // 1每
    state.type = "1";
  } else if (props.values.indexOf("L") !== -1) {
    // 6最后
    state.type = "6";
    state.last = Number(props.values.replace("L", ""));
  } else if (props.values.indexOf("#") !== -1) {
    // 7指定周
    if (props.values.split("#").length === 2) {
      state.type = "7";
      state.week.start = Number(props.values.split("#")[0]);
      state.week.end = Number(props.values.split("#")[1]);
    }
  } else if (props.values.indexOf("W") !== -1) {
    // 8工作日
    state.type = "8";
    state.work = Number(props.values.replace("W", ""));
  } else {
    // *
    state.type = "4";
    state.appoint = props.values.split(",").map(Number);
  }
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
.el-checkbox + .el-checkbox {
  margin-left: 10px;
}
</style>
