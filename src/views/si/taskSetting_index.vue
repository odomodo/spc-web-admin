<!--
 * @Autor: 曾宇奇
 * @Date: 2021-06-16 15:32:47
 * @LastEditTime: 2022-07-18 11:39:22
 * @LastEditors: Administrator 848563840@qq.com
 * @FilePath: \vue-next-admin\src\views\home\index.vue
-->

<template>
  <!--  任务配置 -->
  <div class="taskSetting">
    <div class="select_group flex-c">
      <div class="flex-c" style="margin-right: 10px">
        <label style="width: 50px">任务:</label>
        <el-input
          v-model="queryParams.taskKey"
          placeholder="请输入"
          
        ></el-input>
      </div>
      <div class="flex-c" style="margin-right: 10px">
        <label style="width: 65px">创建时间:</label>
        <el-date-picker
          type="datetime"
          placeholder="开始时间"
          
          value-format="yyyy-MM-dd HH:mm:ss"
          v-model="queryParams.startTime"
        ></el-date-picker>
        <span style="font-weight: 700; margin: 0 10px">~</span>
        <el-date-picker
          type="datetime"
          placeholder="结束时间"
          
          value-format="yyyy-MM-dd HH:mm:ss"
          v-model="queryParams.endTime"
        ></el-date-picker>
      </div>
      <div class="flex-c" style="margin-right: 10px">
        <el-button
          type="primary"
          :icon="Search"
          
          perms="search"
          @click="queryList"
          >搜索</el-button
        >
        <el-button
          type="default"
          plain
          :icon="Refresh"
          
          perms="reset"
          @click="reset"
          >重置</el-button
        >
      </div>
    </div>
    <!-- 按钮组 -->
    <div class="button_group">
      <el-button
        type="success"
        plain
        :icon="Plus"
        
        perms="taskSetting_add"
        @click="addNew"
        >新增</el-button
      >
      <el-button
        type="info"
        plain
        :icon="CaretRight"
        
        perms="taskSetting_start"
        @click="offerId(currId, 'start')"
        >启动</el-button
      >
      <!-- <el-button
        type="warning"
        plain
        icon="el-icon-caret-bottom"
        
        perms="taskSetting_stopResume"
        @click="offerId(currId, 'stopResume')"
        >暂停/恢复</el-button
      > -->
      <el-button
        type="warning"
        plain
        :icon="RemoveFilled"
        
        perms="taskSetting_stop"
        @click="offerId(currId, 'delete')"
        >停止</el-button
      >

      <el-button
        type="danger"
        plain
        :icon="Remove"
        
        perms="taskSetting_stopAll"
        @click="deleteAllTasks"
        >停止所有</el-button
      >
    </div>
    <!-- 新增弹窗 -->
    <taskSettingAdd ref="taskSettingAdds" @queryList="queryList"></taskSettingAdd>
    <!-- 修改弹窗 -->
    <taskSettingEdit ref="taskSettingEdits" @queryList="queryList"></taskSettingEdit>
    <!-- 表格 -->
    <n-table
      ref="taskSettingTable"
      :tableConfig="taskSettingTableConfig"
      @handleRadioChange="handleRadioChange"
      style="margin-top: 5px"
      border
    >
    </n-table>
  </div>
</template>

<script setup lang="ts">
import nTable from "/@/components/nTable/index.vue";
import taskSettingAdd from "./taskSetting/taskSetting_add.vue";
import taskSettingEdit from "./taskSetting/taskSetting_edit.vue";
// 方法
import {
  delList,
  getTaskSetting,
  startTask,
  stopResumeTask,
  deleteTask,
  deleteAllTask,
} from "/@/api/si/taskSetting";
import { resizeForm, awaitWraper as to } from "/@/utils/jsOptions";
import { reactive, toRefs, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  Plus,
  Search,
  CaretRight,
  Remove,
  Refresh,
  RemoveFilled,
} from "@element-plus/icons-vue";
const taskSettingAdds = ref();
const taskSettingEdits = ref();
const taskSettingTable = ref();

const state = reactive({
  // 查询参数
  queryParams: {
    taskKey: "", //任务查询条件
    startTime: "", //开始时间
    endTime: "", //结束时间
  },
  // 服务设置表格配置项
  taskSettingTableConfig: {
    url: getTaskSetting(),
    //表格表头
    columns: [
      {
        prop: "serviceName",
        label: "服务名称",
      },
      {
        prop: "taskCode",
        label: "任务代码",
      },
      {
        prop: "taskName",
        label: "任务名称",
      },
      {
        prop: "cronDetail",
        label: "任务表达式",
      },
      {
        prop: "taskDescript",
        label: "任务说明",
      },
      {
        prop: "taskStatus",
        label: "状态",
        formatter(row: any, column: any, cellValue: number, index: any) {
          if (cellValue == 0) return "正常";
          if (cellValue == 1) return "启动";
          if (cellValue == 2) return "暂停";
        },
      },
      {
        prop: "addTime",
        label: "创建时间",
      },
      {
        prop: "addUserId",
        label: "创建人",
      },
    ],
    showChoose: true, //是否显示选择框， 默认不显示
    singleSelect: true, //单选，复选，默认复选
    showPagination: true, //是否显示分页
    showOperation: true, //是否显示操作字段
    rowNumbers: true, //是否显示行数
    //操作按钮列表
    options: [
      {
        type: "warning",
        label: "编辑",
        perms: "system_taskSetting_edit",
        click: (index: any, row: any) => {
          const editRow = { ...row };
          taskSettingEdits.value.getDnList();
          taskSettingEdits.value.taskSettingForm = editRow;
          taskSettingEdits.value.dialogVisible = true;
        },
      },
      {
        type: "danger",
        label: "删除",
        perms: "system_taskSetting_delete",
        click: (index: any, row: { id: any }) => {
          ElMessageBox.confirm("确定删除?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
          })
            .then(async () => {
              const res:any = await delList(row.id);
              taskSettingTable.value.reload();
              ElMessage({
                type: "success",
                message: res.msg,
              });
            })
            .catch(() => {
              ElMessage({
                type: "info",
                message: "已取消删除",
              });
            });
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
  },
  // 单选id
  currId: "",
});
const { queryParams, taskSettingTableConfig, currId } = toRefs(state);

// 查询
const queryList = () => {
  taskSettingTable.value.find(state.queryParams);
};
// 重置
const reset = () => {
  state.queryParams = resizeForm.call(this, "queryParams");
  queryList();
};
// 新增
const addNew = () => {
  taskSettingAdds.value.getDnList();
  taskSettingAdds.value.dialogVisible = true;
};
// 单选点击
const handleRadioChange = ({ id }: any) => {
  state.currId = id;
};
// 提供id
const offerId = (currId: string | null, type: string | number) => {
  //id非空判断
  if (currId == null || currId == "") {
    ElMessage({
      message: "操作错误，请先选中一笔数据",
      type: "error",
      duration: 1500,
    });
    return;
  }
  const status = {
    start: async (currId: any) => {
      ElMessageBox.confirm("确定启动选中的任务?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(async () => {
          let [err, res] = await to(startTask(currId));
          taskSettingTable.value.reload();
          //this.queryList();
          if (!err) {
            res
              ? ElMessage({
                  message: res.msg,
                  type: "success",
                  duration: 1500,
                })
              : ElMessage({
                  message: "未知错误",
                  type: "error",
                  duration: 1500,
                });
          } else {
            throw Error("error");
          }
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "已取消",
          });
        });
    },
    stopResume: async (currId: any) => {
      let [err, res] = await to(stopResumeTask(currId));
      //this.queryList();
      taskSettingTable.value.reload();
      if (!err) {
        res
          ? ElMessage({
              message: res.msg,
              type: "success",
              duration: 1500,
            })
          : ElMessage({
              message: "未知错误",
              type: "error",
              duration: 1500,
            });
      } else {
        throw Error("error");
      }
    },
    delete: async (currId: any) => {
      ElMessageBox.confirm("确定停止选中的任务?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(async () => {
          let [err, res] = await to(deleteTask(currId));
          //this.queryList();
          taskSettingTable.value.reload();
          if (!err) {
            res
              ? ElMessage({
                  message: res.msg,
                  type: "success",
                  duration: 1500,
                })
              : ElMessage({
                  message: "未知错误",
                  type: "error",
                  duration: 1500,
                });
          } else {
            throw Error("error");
          }
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "已取消",
          });
        });
    },
  };
  currId
    ? status[type](currId)
    : ElMessage({
        message: "请选择",
        type: "error",
        duration: 1500,
      });
};

//停止所有任务
const deleteAllTasks = () => {
  ElMessageBox.confirm("确定停止所有的任务?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  })
    .then(async () => {
      let [err, res] = await to(deleteAllTask());
      //this.queryList();
      taskSettingTable.value.reload();
      if (!err) {
        res
          ? ElMessage({
              message: res.msg,
              type: "success",
              duration: 1500,
            })
          : ElMessage({
              message: "未知错误",
              type: "error",
              duration: 1500,
            });
      } else {
        throw Error("error");
      }
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消",
      });
    });
};
</script>

<style lang="scss" scoped>
// 页面公共样式
.required {
  color: red;
}
.taskSetting {
  .button_group {
    margin-top: 5px;
    padding-left: 20px;
  }
  .select_group {
    padding: 5px 0 0 20px;
    label {
      //width: 65px;
      //margin-right: 10px;
      font-size: 13px;
      color: #606266;
    }
  }
}
</style>
<style lang="scss" scoped>
// 第三方样式
::v-deep .el-input__inner {
  border-radius: 4px;
}
</style>
