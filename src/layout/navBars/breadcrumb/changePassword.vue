<!--
 * @Author: your name
 * @Date: 2021-04-15 14:39:31
 * @LastEditTime: 2022-08-08 09:51:58
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \mes-ui\src\views\system\components\user_add.vue
-->

<template>
  <!-- 用户新增弹窗 -->
  <el-dialog
    title="修改密码"
    v-model="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @open="open"
    @close="close"
    width="440px"
  >
    <div class="dialog_user">
      <section class="section_input">
        <el-form :model="userDataForm" :rules="rules" label-width="80px" ref="ruleFormRef">
          <el-row>
            <el-col :span="24">
              <el-form-item prop="userId" label="原密码 ">
                <el-input
                  autocomplete="off"
                  v-model.trim="userDataForm.userId"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="userId" label="新密码">
                <el-input
                  autocomplete="off"
                  v-model.trim="userDataForm.userId"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </section>
      <section class="section_option df jcfe">
        <el-button class="dialogbtn"  @click="cancel" perms="cancle" round>取消</el-button>
          <el-button class="dialogbtn" type="primary" @click="addSave(ruleFormRef)" perms="save" round >确定</el-button>
      </section>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { filterObj, isContainChineseChar, emailChane } from "/@/utils/jsOptions";
import { addList, getUserIdList, getFactoryDnList, sysUserSysSave, sysUserModify } from "/@/api/system/user.ts";
import useCurrentInstance from "/@/utils/useCurrentInstance.ts"
import { ref, reactive, toRefs, onMounted } from "vue"
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus'
const emit = defineEmits(['queryList']);

const { proxy } = useCurrentInstance()
const ruleFormRef = ref<any>(null)
const rules = ref<FormRules>({
  userId: [
    { required: true, message: '请输入', trigger: 'blur' },
  ],
  userName: [
    { required: true, message: '请输入', trigger: 'blur' },
  ],
})

const dialogVisible = ref(false)
const options = ref<Array<any>>([])
const userDataForm = ref<any>({
})

// 保存
const addSave = async(formEl: any) => {
  if (!formEl) return
  await formEl.validate(async(valid: any, fields: any) => {
    if (valid) {
  }})

}
// 取消
const cancel = () =>{
  dialogVisible.value= false;
}
const close = () => {

}
const open = () => {
}
defineExpose({
  dialogVisible,
  userDataForm,
})
</script>
<style lang="scss" scoped>
// 页面公共样式
.required {
  color: red;
}
// 页面样式
</style>

<style lang="scss" scoped>
</style>
<style lang="scss" scoped>

::v-deep(.el-row ){
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 15px;
  .el-col {
    padding: 10px;
  }
}
::v-deep(input:-webkit-autofill) {
  box-shadow: 0 0 0px 1000px #c7c6c6 inset !important;
  // -webkit-text-fill-color: #ededed !important;
  -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
  background-color: transparent;
  background-image: none;
  transition: background-color 50000s ease-in-out 0s;
}
</style>