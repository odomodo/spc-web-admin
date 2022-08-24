<!--
 * @Author: liuxinyi-yuhang 1029301987@qq.com
 * @Date: 2022-05-17 15:11:22
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @LastEditTime: 2022-08-23 16:48:24
 * @FilePath: \spc-web-admin\src\views\controlChart\components\addTree.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class=''>
    <el-dialog
      :title="`邮件提醒设置`"
      v-model="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="50%"
      @close="cancel"
      @open="open"
    >
      <el-form  label-width="80px" :model="form" ref="ruleFormRef" :rules="rules">
        <el-row>
          <el-col :span="20" class="item">
            <el-form-item label="收件人Email地址" prop="receiveEmail" label-width="130px" ></el-form-item>
          </el-col>
          <el-col :span="2" style="margin-bottom: 10px">
            <el-button :icon="Plus" @click="handleClick">添加收件人</el-button>
          </el-col>
          <el-col :span="24" style="margin-bottom: 10px">
            <el-form-item prop="receiveEmail" label-width="0">
              <el-input
                v-model="form.receiveEmail"
                :rows="10"
                type="textarea"
                placeholder="Please input"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发送次数" prop="sendNumber">
              <el-input-number v-model="form.sendNumber" :min="1" :max="5" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发送邮件频率" prop="sendFrequency" label-width="120px">
              <el-input-number v-model="form.sendFrequency" style="margin-right: 6px" :min="1" :max="24" /> 小时发送一次
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <userDialog ref="userdialog" @queryList="queryList"></userDialog>
      <section class="section_option df jcfe">
        <el-button class="dialogbtn"  @click="cancel" perms="cancle" round>取消</el-button>
          <el-button class="dialogbtn" type="primary" @click="editSave(ruleFormRef)" perms="save" round >确定</el-button>
      </section>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, ref, onMounted, inject, watch } from "vue";
import { ElMessage } from "element-plus";
import useCurrentInstance from "/@/utils/useCurrentInstance.ts"
import type { FormInstance, FormRules, ElTable } from 'element-plus'
import tableData from '../tableData.ts'
import { ruleItem } from '../type'
import { Search, Plus, Delete, MoreFilled} from "@element-plus/icons-vue";
import userDialog from './userDialog.vue'
import { tSpcControlGroupAjaxList, tSpcControlGroupSave, tSpcControlGroupModify } from "/@/api/controlChart/index.ts"
const emit = defineEmits(['queryList']);
const { proxy } = useCurrentInstance()
const dialogVisible = ref(false)
const userdialog: any = ref(null)
const ruleFormRef: any = ref(null)

const form = ref<any>({
})
const rules = ref<any>({
   receiveEmail: [
    { required: true, message: '请选择', trigger: 'blur' },
  ],
  sendNumber: [
    { required: true, message: '请输入', trigger: 'blur' },
  ],
  sendFrequency: [
    { required: true, message: '请输入', trigger: 'blur' },
  ],
})
const cancel = () => {
  dialogVisible.value = false
  form.value = {}
}
const editSave = async(formEl: any) => {
   await formEl.validate(async(valid: any, fields: any) => {
    if (valid) {
      emit("queryList", form.value)
      cancel()
    }})

}
const handleClick = () => {
  userdialog.value.dialogVisible = true
  let arr = form.value?.receiveEmail?.split(',')
  userdialog.value.userDate = arr
  
}

const queryList = (data: any) => {
  form.value.receiveEmail = data
}
const close = () => {
}
const open = () => {
  console.log(form.value);
  
}
const handleChange = () => {}
defineExpose({
  dialogVisible,
  form
})
</script>

<style lang='scss' scoped>


</style>