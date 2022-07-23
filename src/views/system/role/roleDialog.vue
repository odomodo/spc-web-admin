<!--
 * @Author: 曾宇奇
 * @Date: 2021-04-15 14:40:28
 * @LastEditTime: 2022-07-23 14:01:42
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
    @close="cancel"
    width="30%"
  >
    <div class="dialog_role_add">
      <section class="section_input">
        <el-form :model="roleDataForm" :rules="rules" ref="ruleFormRef">
          <el-row>
            <el-col :span="12" class="item">
              <el-form-item label="角色编号" prop="roleCode">
                <el-input
                    autocomplete="off"
                    v-model="roleDataForm.roleCode"
                    :disabled="dialogTitle !== '新增'"
                  ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="item">
              <el-form-item label="角色名称" prop="roleName">
                <el-input
                    autocomplete="off"
                    v-model="roleDataForm.roleName"
                  ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="item">
              <el-form-item label="角色类型" prop="roleType">
                <el-select v-model="roleDataForm.roleType" >
                  <el-option  value="2" label="普通用户"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="item">
              <el-form-item label="启用状态" prop="roleState">
                <el-switch v-model="roleDataForm.roleState" :inactive-value="1" :active-value="0"> </el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="24" class="item">
              <el-form-item label="角色描述">
                <el-input
                type="textarea"
                size="mini"
                v-model="roleDataForm.description"
                :autosize="{ minRows: 3, maxRows: 5 }"
              >
              </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </section>
      <section class="section_option df jcfe" v-if="dialogTitle !== '查看用户'">
        <el-button class="dialogbtn"  @click="cancel" perms="cancle" round>取消</el-button>
          <el-button class="dialogbtn" type="primary" @click="addSave(ruleFormRef)" perms="save" round >确定</el-button>
      </section>
    </div>
  </el-dialog>
</template>


<script setup lang="ts">

import { clearFormData, hasChinase } from "/@/utils/jsOptions.ts";
import { addList } from "/@/api/system/role.ts";
import useCurrentInstance from "/@/utils/useCurrentInstance.ts"
import { ref, reactive, toRefs, onMounted } from "vue"
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus'
import { queryDictionaryData } from "/@/api/admin/paramsSet";
import { roleSysRoleSave, roleModify } from "/@/api/controlChart/index.ts"
const { proxy } = useCurrentInstance()
const emit = defineEmits(['queryList']);
const dialogTitle = ref("新增")
const dialogVisible = ref(false)
const options = ref<Array<any>>([])
const ruleFormRef = ref<any>(null)
const rules = reactive<FormRules>({
  roleCode: [
    { required: true, message: '请输入', trigger: 'blur' },
    { validator: hasChinase, message: '角色编码不能包含中文字符', trigger: 'blur' },
  ],
  roleName: [
    { required: true, message: '请输入', trigger: 'blur' },
  ],
  roleType: [
    { required: true, message: '请选择', trigger: 'blur' },
  ],
  roleState: [
    { required: true, message: '请输入', trigger: 'blur' },
  ],
})
// 角色新增数据
const roleDataForm = ref<any>({
  roleCode: "", //角色编码
  roleName: "", //角色名称
  roleState: 0, //角色状态
  description: "", //角色描述
})

// 保存
const addSave = async(formEl: any) => {
  if (!formEl) return
  await formEl.validate(async(valid: any, fields: any) => {
    if (valid) {
      let res = dialogTitle.value === '新增' ? await roleSysRoleSave(roleDataForm.value) : await roleModify(roleDataForm.value)
      if (res.code == 0) {
        ElMessage({
          message: res.msg,
          type: "success",
        });
        emit('queryList');
        dialogVisible.value = false;
      } else {
        ElMessage({
          message: res.msg,
          type: "error",
          duration: 3000
        });
      }
    } else {
      console.log('error submit!', fields)
    }
  })

}
// 取消
const cancel = () => {
  dialogVisible.value = false;
  roleDataForm.value = {};
}
onMounted(async() => {
  options.value = (await queryDictionaryData('role_type'))?.values
})
defineExpose({
  dialogVisible,
  roleDataForm,
  dialogTitle
})
</script>
<style lang="scss" scoped>
.item{
  margin-bottom: 20px;
  padding-right: 10px;
}
</style>
