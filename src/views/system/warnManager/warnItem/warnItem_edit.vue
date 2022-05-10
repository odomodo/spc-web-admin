<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: 曾宇奇
 * @Date: 2021-05-10 10:21:22
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @LastEditTime: 2022-05-09 16:19:53
-->

<template>
  <!-- 预警项编辑弹框 -->
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="50%"
  >
    <div class="dialog_warnItem_add">
      <section class="section_input">
        <el-row>
          <el-col :span="4"><i class="required">*</i>预警编码 :</el-col>
          <el-col :span="20">
            <el-input
              autocomplete="off"
              v-model="paramsDataForm.warnCode"
              disabled
            ></el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><i class="required">*</i>预警名称 :</el-col>
          <el-col :span="20">
            <el-input
              autocomplete="off"
              v-model="paramsDataForm.warnName"
            ></el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><i class="required">*</i>预警类型 :</el-col>
          <el-col :span="8">
            <el-select placeholder="请选择" v-model="paramsDataForm.warnType">
              <el-option
              :label="item.keyName"
              :value="item.keyValue"
              v-for="(item, index) in dnData.warnTypeDnList"
              :key="index"
            />
            </el-select>
          </el-col>
          <el-col :span="4"><i class="required">*</i>启用状态 :</el-col>
          <el-col :span="8">
            <el-select placeholder="请选择" v-model="paramsDataForm.itemState">
              <el-option
              :label="item.keyName"
              :value="item.keyValue"
              v-for="(item, index) in dnData.startStateDnList"
              :key="index"
            />
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">备注 :</el-col>
          <el-col :span="20">
            <el-input
              type="textarea"
              placeholder="请输入"
              v-model="paramsDataForm.itemRemark"
            ></el-input>
          </el-col>
        </el-row>
      </section>
      <section class="section_option flex-c-c">
        <el-button type="primary" size="mini" @click="editSave(paramsDataForm)" perms="save"
          >保存</el-button
        >
        <el-button type="primary" size="mini" @click="cancel" perms="cancle">取消</el-button>
      </section>
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
// 方法
import { editList } from "/@/api/system/warnItem.ts";
import { resizeForm } from "/@/utils/jsOptions.ts";
import { ref, reactive, defineEmits } from "vue"
import { ElMessage, ElMessageBox } from 'element-plus';
import useCurrentInstance from "/@/utils/useCurrentInstance.ts"

const { proxy } = useCurrentInstance()
const emit = defineEmits(["queryList"]);
const dialogTitle = ref("预警项配置")
const dialogVisible =  ref(false)
//新增数据
const paramsDataForm: any = ref({
  warnName: "", //预警项名称
  warnCode: "", //预警项编码
  warnType: "", //预警项类型
  itemState: "", //启用类型
  itemRemark: "" //备注
})
// 下拉框数据
const dnData = ref({
  startStateDnList: [
    { keyValue: 0, keyName: "启用" },
    { keyValue: 1, keyName: "禁用" }
  ],
  warnTypeDnList: [
    { keyValue: 0, keyName: "自动" },
    { keyValue: 1, keyName: "手动" }
  ],
})
//保存
const editSave = async(paramsDataForm: any) => {
  if (
    !paramsDataForm.warnName ||
    !paramsDataForm.warnCode 
    // !paramsDataForm.warnType ||
    // !paramsDataForm.itemState
  ) {
    ElMessage({
      message: "必填项不能为空!",
      type: "error",
      duration: 3000
    });
    return;
  }

  let _paramsDataForm = { ...paramsDataForm };
  //console.log(_paramsDataForm)
  _paramsDataForm.itemState = _paramsDataForm.itemState == "启用" ? 0 : 1;
  // /console.log(_paramsDataForm)
  paramsDataForm.value.addTime = null;
  paramsDataForm.value.editTime = null;
  const res = await editList(paramsDataForm);
  // const res = await editList(_paramsDataForm);
  if (res.code == 0) {
    ElMessage({
      message: res.msg,
      type: "success",
      duration: 1500
    });
    proxy.parent.queryList();
    // 清空表单
    paramsDataForm.value = resizeForm.call(this, "paramsDataForm");
    dialogVisible.value = false;
  } else {
    ElMessage({
      message: res.msg,
      type: "error",
      duration: 1500
    });
    emit("queryList");
    // 清空表单
    paramsDataForm.value = resizeForm.call(this, "paramsDataForm");
    dialogVisible.value = false;
  }
}
// 取消
const cancel = () =>{
  dialogVisible.value = false;
  paramsDataForm.value = {};
}
defineExpose({
  dialogVisible
})
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
>>> .el-dialog__body {
  display: flex;
  align-items: center;
  justify-content: center;
}
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
