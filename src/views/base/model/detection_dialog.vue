<!--
 * @Author: liuxinyi-yuhang 1029301987@qq.com
 * @Date: 2022-05-20 14:45:39
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @LastEditTime: 2022-07-18 15:59:36
 * @FilePath: \spc-web-admin\src\views\base\model\detection_dialog.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class=''>
    <el-dialog
      :title="`${title}`"
      v-model="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="close"
      width="461px"
    >
      <el-form :model="form" label-width="80px" :rules="rules" ref="ruleFormRef">
        <el-row :gutter="20">
          <el-col :span="24" class="mb20">
            <el-form-item label="检测编码" prop="inspcationCode">
              <el-input v-model="form.inspcationCode"  class="left nums" :disabled="title !== '新增'" />
            </el-form-item>
          </el-col>
          <el-col :span="24" class="mb20">
            <el-form-item label="检测项目" prop="inspectionName">
              <el-input v-model="form.inspectionName"  class="left nums" />
            </el-form-item>
          </el-col>
          <el-col :span="24" class="mb20">
            <el-form-item label="单位" prop="inspectionUnit">
              <el-select v-model="form.inspectionUnit" placeholder="请选择" style="width: 100%">
                <el-option  v-for="v in options" :label="v.valueName" :value="v.valueCode" :key="v.valueCode" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <section class="section_option df jcfe" >
        <el-button  @click="cancel" class="dialogbtn" perms="cancle" round>取消</el-button>
          <el-button class="dialogbtn" type="primary" @click="editSave(ruleFormRef)" perms="save" round >确定</el-button>
      </section>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, ref, onMounted, inject, watch } from "vue";
import { ElMessage } from "element-plus";
import type { FormInstance, FormRules } from 'element-plus'
import useCurrentInstance from "/@/utils/useCurrentInstance.ts"
import { queryDictionaryData } from "/@/api/admin/paramsSet";
import { TSpcInspectionSave, TSpcInspectionModify } from "/@/api/controlChart/index.ts";
import { clearFormData, hasChinase } from "/@/utils/jsOptions.ts";
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
})
const { proxy } = useCurrentInstance()
const emit = defineEmits(['saveSuccess']);
const dialogVisible = ref(false)
const options = ref<any[]>([])
const form = ref<any>({
})
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  inspcationCode: [
    { required: true, message: '请输入', trigger: 'blur' },
    { validator: hasChinase, message: '不能包含中文字符', trigger: 'blur' },
    {  max: 30, message: '不要超过30个字符', trigger: 'blur' },
  ],
  inspectionName: [
    { required: true, message: '请输入', trigger: 'blur' },
    {  max: 50, message: '不要超过50个字符', trigger: 'blur' },
  ],
  inspectionUnit: [
    { required: true, message: '请选择', trigger: 'blur' },
  ],
})

onMounted(async () => {
 options.value = (await queryDictionaryData("unit", "")).values
})
const editSave = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async(valid, fields) => {
    if (valid) {
      let data = props.title === '新增'
      ? await TSpcInspectionSave({ ...form.value})
      : await TSpcInspectionModify({...form.value})
      if (data.flag) {
        ElMessage({
          type:'success',
          message: `${props.title}成功`
        })
        dialogVisible.value = false
        emit('saveSuccess')
      } else {
        ElMessage({
          type:'error',
          message: data.msg
        })
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
const close = () => {
  form.value = {}
}
const cancel = () => {
  dialogVisible.value = false
}
defineExpose({
  dialogVisible,
  form
})
</script>

<style lang='scss' scoped>

</style>