<!--
 * @Autor: 曾宇奇
 * @Date: 2021-06-16 15:32:47
 * @LastEditTime: 2022-04-20 13:32:31
 * @LastEditors: zhuangxingguo
 * @FilePath: \vue-next-admin\src\views\home\index.vue
-->

<template>
  <!-- 任务配置编辑弹框 -->
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="80%"
  >
    <div class="dialog_taskSetting">
      <section class="section_input">
        <el-row class='spc-el-row'>
          <el-col :span="4"> <i class="required">*</i>任务代码 :</el-col>
          <el-col :span="8">
            <el-input
              autocomplete="off"
              v-model="taskSettingForm.taskCode"
              disabled
            ></el-input>
          </el-col>
          <el-col :span="4"><i class="required">*</i>任务名称 :</el-col>
          <el-col :span="8">
            <el-input autocomplete="off" v-model="taskSettingForm.taskName"></el-input>
          </el-col>
        </el-row>
        <el-row class='spc-el-row'>
          <el-col :span="4"><i class="required">*</i> 服务名称 : </el-col>
          <el-col :span="20" style="text-align: left">
            <el-select
              clearable
              placeholder="请选择"
              style="width: 100%"
              v-model="taskSettingForm.serviceId"
            >
              <el-option
                :label="item.serviceName"
                :value="item.id"
                v-for="(item, index) in ServeNameDnList"
                :key="index"
              >
                <span style="float: left">{{ item.serviceName }}</span>
                <span style="float: right; color: #8492a6; font-style: 14px">{{
                  item.serviceCode
                }}</span>
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row class='spc-el-row'>
          <el-col :span="4"><i class="required">*</i>cron表达式 : </el-col>
          <el-col :span="20">
            <el-input
              autocomplete="off"
              v-model="taskSettingForm.cronDetail"
              placeholder="选择任务周期生成Cron表达式"
              disabled
              size="small"
            >
            </el-input>
            <el-button :icon="Calendar" type="success" @click="cronShow"></el-button>
            <el-dialog
              title="选择Cron时间"
              v-model="cronVisible"
              @closed="cronVisible = false"
              append-to-body
              :modal="false"
              top="0"
              class="aaa"
            >
              <Cron
                v-if="cronVisible"
                :values="taskSettingForm.cronDetail"
                @cron="cron"
              />
              <div class="dialog-footer flex-c-c">
                <el-button type="primary" @click="cronCanel" size="small">确定</el-button>
                <el-button type="primary" @click="cronCanel" size="small">取消</el-button>
              </div></el-dialog
            >
          </el-col>
        </el-row>
      </section>
      <section class="section_textarea">
        <el-row class='spc-el-row'>
          <el-col :span="4">任务说明 : </el-col>
          <el-col :span="20">
            <el-input
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 5 }"
              v-model="taskSettingForm.taskDescript"
            >
            </el-input>
          </el-col>
        </el-row>
      </section>
      <section class="section_option flex-c-c">
        <el-button
          type="primary"
          size="small"
          @click="addSave(taskSettingForm)"
          perms="save"
          >保存</el-button
        >
        <el-button type="primary" size="small" @click="cancel" perms="cancle"
          >取消</el-button
        >
      </section>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
// 组件
import Cron from "/@/components/cron/index.vue";

// 方法
import { clearFormData } from "/@/utils/jsOptions";
import { editList, getServeNameDnList } from "/@/api/si/taskSetting";
import { reactive, toRefs, defineExpose } from "vue";
import { ElMessage } from "element-plus";
import { Calendar } from "@element-plus/icons-vue";
const emit = defineEmits(["queryList"]);
const state = reactive({
  dialogTitle: "编辑",
  cronVisible: false,
  dialogVisible: false,
  // 任务配置编辑数据
  taskSettingForm: {
    taskCode: "", //任务代码
    taskName: "", //任务名称
    serviceId: "", //服务名称
    cronDetail: "", //cron表达式
    taskDescript: "", //任务说明
  },
  //  服务名称下拉框数据
  ServeNameDnList: [] as any,
});
const {
  dialogTitle,
  cronVisible,
  taskSettingForm,
  ServeNameDnList,
  dialogVisible,
} = toRefs(state);

const cron = (val: any) => {
  state.taskSettingForm.cronDetail = val;
};
const cronCanel = () => {
  state.cronVisible = false;
};
const cronShow = () => {
  state.cronVisible = true;
};

// 保存
const addSave = async (taskSettingForm: any) => {
  if (
    !taskSettingForm.taskCode ||
    !taskSettingForm.taskName ||
    !taskSettingForm.serviceId ||
    !taskSettingForm.cronDetail
  ) {
    ElMessage({
      message: "必填项不能为空!",
      type: "error",
      duration: 3000,
    });
    return;
  }

  const res: any = await editList(taskSettingForm);
  if (res.code == 0) {
    ElMessage({
      message: res.msg,
      type: "success",
      duration: 1500,
    });
    emit("queryList");
    // 清空表单
    clearFormData(taskSettingForm);
    state.dialogVisible = false;
  } else {
    ElMessage({
      message: res.msg,
      type: "error",
      duration: 3000,
    });
  }
};
// 取消
const cancel = () => {
  state.dialogVisible = false;
  clearFormData(state.taskSettingForm);
};
// 获取下拉框数据
const getDnList = async () => {
  state.ServeNameDnList = await getServeNameDnList();
};
defineExpose({ getDnList, dialogVisible, taskSettingForm });
</script>

// 自定义样式
<style lang="scss" scoped>
// 页面公共样式
.required {
  color: red;
}
// 页面样式
</style>

// 第三方样式
<style lang="scss" scoped>
>>> .el-input__inner {
  border-radius: 4px;
}
>>> .el-row {
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
</style>
