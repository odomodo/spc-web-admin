<!--
 * @Author: 曾宇奇
 * @Date: 2021-04-15 14:40:28
 * @LastEditTime: 2022-05-27 09:46:28
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \mes-ui\src\views\system\components\role_add.vue
-->

<template>
  <!-- 角色新增弹窗 -->
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="56%"
  >
    <div class="dialog_role_add">
      <section class="section_input">
        <el-row>
          <el-col :span="4"><i class="required">*</i>角色编号 :</el-col>
          <el-col :span="8">
            <el-input
              autocomplete="off"
              size="mini"
              v-model="roleDataForm.roleCode"
            ></el-input>
          </el-col>
          <el-col :span="4"><i class="required">*</i>角色名称 :</el-col>
          <el-col :span="8">
            <el-input
              autocomplete="off"
              size="mini"
              v-model="roleDataForm.roleName"
            ></el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4"> <i class="required">*</i>启用状态 :</el-col>
          <el-col :span="8" style="text-align: left;">
            <el-switch v-model="roleDataForm.roleState" :active-value="0"
                              :inactive-value="1"> </el-switch>
          </el-col>
        </el-row>
        <section class="section_textarea">
          <el-row>
            <el-col :span="4">
              角色描述 :
            </el-col>
            <el-col :span="20">
              <el-input
                type="textarea"
                size="mini"
                v-model="roleDataForm.description"
                :autosize="{ minRows: 3, maxRows: 5 }"
              >
              </el-input>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">
              备注 :
            </el-col>
            <el-col :span="20">
              <el-input
                type="textarea"
                size="mini"
                v-model="roleDataForm.remark"
                :autosize="{ minRows: 3, maxRows: 5 }"
              >
              </el-input>
            </el-col>
          </el-row>
        </section>
      </section>
      <section class="section_option flex-c-c">
        <el-button type="primary" size="mini" @click="addSave" perms="save"
          >保存</el-button
        >
        <el-button type="primary" size="mini" @click="cancel" perms="cancle">取消</el-button>
      </section>
    </div>
  </el-dialog>
</template>


<script setup lang="ts">
import { clearFormData,isContainChineseChar } from "/@/utils/jsOptions.ts";
import { addList } from "/@/api/system/role.ts";
import useCurrentInstance from "/@/utils/useCurrentInstance.ts"
import { ref, reactive, toRefs } from "vue"
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus'
const { proxy } = useCurrentInstance()
const emit = defineEmits(['queryList']);
const dialogTitle = ref("新增")
const dialogVisible = ref(false)
// 角色新增数据
const roleDataForm = ref<any>({
  roleCode: "", //角色编码
  roleName: "", //角色名称
  roleState: "", //角色状态
  description: "", //角色描述
  remark: "" //角色备注
})
// 保存
const addSave = async() => {
  if(isContainChineseChar(roleDataForm.value.roleCode)){
    return ElMessage({
      message: "角色编码不能包含中文字符",
      type: "error"
    });
  }
  if (
    roleDataForm.value.roleCode == null ||
    roleDataForm.value.roleCode == ""
  ) {
    return ElMessage({
      message: "请填写角色编码",
      type: "error"
    });
  }
  if (
    roleDataForm.value.roleName == null ||
    roleDataForm.value.roleName == ""
  ) {
    return ElMessage({
      message: "请填写角色名称",
      type: "error"
    });
  }
  roleDataForm.value.roleState
    ? (roleDataForm.roleState = 1)
    : (roleDataForm.roleState = 0);
  const res = await addList(roleDataForm.value);
  if (res.code == 0) {
    ElMessage({
      message: res.msg,
      type: "success",
      duration: 1500
    });
    emit('queryList');
    // 清空表单
    clearFormData(roleDataForm.value);
    roleDataForm.value.roleState = true;
    dialogVisible.value = false;
  } else {
    ElMessage({
      message: res.msg,
      type: "error",
      duration: 3000
    });
  }
}
// 取消
const cancel = () => {
  dialogVisible.value = false;
  roleDataForm.value = {};
}
defineExpose({
  dialogVisible,
  roleDataForm
})
</script>
