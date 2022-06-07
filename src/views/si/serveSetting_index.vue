<!--
 * @Autor: 曾宇奇
 * @Date: 2021-06-16 09:02:47
 * @LastEditTime: 2022-04-20 13:32:31
 * @LastEditors: zhuangxingguo
 * @FilePath: \vue-next-admin\src\views\home\index.vue
-->

<template>
  <!--  服务配置 -->
  <div class="serveSetting">
    <div class="select_group flex-c">
      <div class="flex-c" style="margin-right: 10px">
        <label>服务代码:</label>
        <el-input
          v-model="queryParams.serviceCode"
          placeholder="请输入"
          
        ></el-input>
      </div>
      <div class="flex-c" style="margin-right: 10px">
        <label>服务名称:</label>
        <el-input
          v-model="queryParams.serviceName"
          placeholder="请输入"
          
        ></el-input>
      </div>

      <div class="flex-c" style="margin-right: 10px">
        <label>创建时间:</label>
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
        
        perms="serveSetting_add"
        @click="addNew"
        >新增</el-button
      >
      <!-- <n-button
        type="info"
        plain
        icon="el-icon-upload2"
        
        perms="serveSetting_import"
        >导入</n-button
      >
      <n-button
        type="warning"
        plain
        icon="el-icon-download"
        
        perms="serveSetting_export"
        >导出</n-button
      > -->
      <el-button
        @click="serviceTests"
        type="warning"
        plain
        :icon="User"
        
        perms="serveSetting_test"
        >测试</el-button
      >
    </div>
    <!-- 新增弹窗 -->
    <serveSettingAdd ref="serveSettingAdds" @queryList="queryList"></serveSettingAdd>
    <!-- 修改弹窗 -->
    <serveSettingEdit ref="serveSettingEdits" @queryList="queryList"></serveSettingEdit>
    <!-- 表格 -->
    <n-table
      ref="serveSettingTable"
      :tableConfig="serveSettingTableConfig"
      style="margin-top: 5px"
      border
      @handleRadioChange="handleRadioChange"
    >
    </n-table>
  </div>
</template>

<script setup lang="ts">
import nTable from "/@/components/nTable/index.vue";
import serveSettingAdd from "./serveSetting/serveSetting_add.vue";
import serveSettingEdit from "./serveSetting/serveSetting_edit.vue";
// 方法
import { delList, getServeSetting, serviceTest } from "/@/api/si/serveSetting";
import { reactive, toRefs, ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Plus, Search, Refresh, User } from "@element-plus/icons-vue";
const serveSettingAdds = ref();
const serveSettingEdits = ref();
const serveSettingTable = ref();
const state = reactive({
  // 查询参数
  queryParams: {
    serviceName: "", //服务名称
    serviceCode: "", //服务代码
    startTime: "", //开始时间
    endTime: "", //结束时间
  },
  // 服务设置表格配置项
  serveSettingTableConfig: {
    url: getServeSetting(),
    //表格表头
    columns: [
      {
        prop: "serviceName",
        label: "服务接口名称",
      },
      {
        prop: "serviceCode",
        label: "服务接口代码",
      },
      {
        prop: "serviceType",
        label: "服务类型",
        formatter(row: any, column: any, cellValue: number, index: any) {
          if (cellValue == 0) return "SQL";
          if (cellValue == 1) return "JAVA";
        },
      },
      {
        prop: "serviceUrl",
        label: "服务类路径",
      },
      {
        prop: "serviceMethod",
        label: "服务方法名",
      },
      {
        prop: "serviceDescript",
        label: "服务接口说明",
      },
      {
        prop: "sqlContent",
        label: "SQL内容",
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
    showOperation: true, //是否显示操作字段
    showChoose: true, //是否显示选择框， 默认不显示
    singleSelect: true,
    rowNumbers: true, //是否显示行数
    showBatchDelete: false, //是否批量删除
    options: [
      {
        type: "warning",
        label: "编辑",
        perms: "serveSetting_edit",
        click: (index: any, row: { serviceType: number }) => {
          const editRow = { ...row };
          serveSettingEdits.value.serveSettingForm = editRow;

          if (row.serviceType == 0) serveSettingEdits.value.checkShow = true;
          else serveSettingEdits.value.checkShow = false;

          serveSettingEdits.value.dialogVisible = true;
        },
      },
      {
        type: "danger",
        label: "删除",
        perms: "serveSetting_delete",
        click: (index: any, row: { id: any }) => {
          ElMessageBox.confirm("确定删除?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(async () => {
              const res:any = await delList(row.id);

              serveSettingTable.value.reload();
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
  id: null,
});
const { queryParams, serveSettingTableConfig, id } = toRefs(state);

// 查询
const queryList = () => {
  serveSettingTable.value.find(state.queryParams);
};
// 重置
const reset = () => {
  state.queryParams = Object.assign(state.queryParams, {
    serviceName: "",
    serviceCode: "",
    startTime: "",
    endTime: "",
  });
  queryList();
};
// 新增
const addNew = () => {
  serveSettingAdds.value.dialogVisible = true;
};
//选中一行触发
const handleRadioChange = ({ ids }: any) => {
  state.id = ids;
};
//测试
const serviceTests = async () => {
  ElMessageBox.confirm("确定测试?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const res:any = await serviceTest(state.id);
      if (res.code == 0) {
        ElMessage({
          type: "success",
          message: "测试成功，返回：" + res.msg,
          duration: 5000,
        });
        serveSettingTable.value.reload();
      } else {
        ElMessage({
          message: res.msg,
          type: "error",
          duration: 5000,
        });
        serveSettingTable.value.reload();
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

<style scoped lang="scss">
.required {
  color: red;
}
.serveSetting {
  .button_group {
    margin-top: 5px;
    padding-left: 20px;
  }
  .select_group {
    padding: 5px 0 0 20px;
    label {
      width: 80px;
      margin-right: 10px;
      font-size: 13px;
      color: #606266;
    }
  }
}

>>> .el-input__inner {
  border-radius: 4px;
}
</style>
