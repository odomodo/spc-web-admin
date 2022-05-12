<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: 曾宇奇
 * @Date: 2021-05-10 10:21:22
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @LastEditTime: 2022-05-11 14:24:14
-->

<template>
  <!-- 预警项新增弹框 -->
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
          <el-col :span="4"><i class="required">*</i>预警编码:</el-col>
          <el-col :span="20">
            <el-input
              autocomplete="off"
              v-model="paramsDataForm.warnCode"
            ></el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><i class="required">*</i>预警名称:</el-col>
          <el-col :span="20">
            <el-input
              autocomplete="off"
              v-model="paramsDataForm.warnName"
            ></el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4"><i class="required">*</i>预警类型:</el-col>
          <el-col :span="8">
            <el-select placeholder="请选择" v-model="paramsDataForm.warnType">
              <el-option value="0" label="自动"></el-option>
              <el-option value="1" label="手动"></el-option>
            </el-select>
          </el-col>
          <el-col :span="4"><i class="required">*</i>启用状态:</el-col>
          <el-col :span="8">
            <el-select placeholder="请选择" v-model="paramsDataForm.itemState">
              <el-option value="0" label="启用"></el-option>
              <el-option value="1" label="禁用"></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">备注:</el-col>
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
        <el-button type="primary" size="mini" @click="addSave(paramsDataForm)" perms="save"
          >保存</el-button
        >
        <el-button type="primary" size="mini" @click="cancel" perms="cancle">取消</el-button>
      </section>
    </div>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, defineExpose } from "vue"

// 方法
import { addList } from "/@/api/system/warnItem";
import { resizeForm } from "/@/utils/jsOptions.ts";
import { ElMessage, ElMessageBox } from 'element-plus';
import useCurrentInstance from "/@/utils/useCurrentInstance.ts"

const { proxy } = useCurrentInstance()

const dialogTitle = ref('"预警项配置"')
const dialogVisible = ref(false)
const emit = defineEmits(["queryList"]);
const paramsDataForm: any = ref({
  warnName: "", //预警项名称
  warnCode: "", //预警项编码
  warnType: "", //预警项类型
  itemState: null, //启用类型
  itemRemark: "" //备注
})

//保存
const addSave = async (paramsDataForm: any) => {
  // if (this.regCode.test(paramsDataForm.value.warnCode)) {
  //   return this.$message({
  //     message: "编码不能存在汉字与逗号",
  //     type: "error"
  //   });
  // }
  if (
    paramsDataForm.value.warnCode == null ||
    paramsDataForm.value.warnCode == ""
  ) {
    return ElMessage({
      message: "预警项编码不能为空", type: "error" 
    })
  }
  if (
    paramsDataForm.value.warnName == null ||
    paramsDataForm.value.warnName == ""
  ) {
    return ElMessage({
      message: "预警项名称不能为空", type: "error" 
    })
  }
  if (
    paramsDataForm.value.warnType == null ||
    paramsDataForm.value.warnType == ""
  ) {
    return ElMessage({
      message: "预警项类型不能为空", type: "error" 
    })
  }
  if (
    paramsDataForm.value.itemState == null ||
    paramsDataForm.value.itemState == ""
  ) {
    return ElMessage({
      message: "预警项启用状态不能为空", type: "error" 
    })
  }
  const res: any = await addList(paramsDataForm);
  if (res.code == 0) {
    ElMessage({
      message: res.msg, type: "success", duration: 1500
    })
    proxy.parent.queryList();
    // 清空表单
    paramsDataForm.value = resizeForm.call(this, "paramsDataForm");
    dialogVisible.value = false;
  } else {
    ElMessage({
      message: res.msg, type: "error", duration: 1500
    })
    emit("queryList");
    // 清空表单
    paramsDataForm.value = resizeForm.call(this, "paramsDataForm");
    dialogVisible.value = false;
  }
}
// 取消
const cancel = () => {
  dialogVisible.value = false
  paramsDataForm.value = {}
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
