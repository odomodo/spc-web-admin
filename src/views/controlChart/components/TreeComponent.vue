<!--
 * @Author: liuxinyi-yuhang 1029301987@qq.com
 * @Date: 2022-05-17 15:11:22
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @LastEditTime: 2022-06-24 14:06:27
 * @FilePath: \spc-web-admin\src\views\controlChart\components\addTree.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class=''>
    <el-dialog
      :title="`控制组菜单（${title}）`"
      v-model="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="40%"
      @close="close"
      @open="open"
    >
      <el-form :model="form" label-width="120px" :rules="rules" ref="ruleFormRef">
        <el-form-item label="组名称" prop="groupName">
          <el-input v-model="form.groupName" />
        </el-form-item>
        <el-form-item label="组编码" prop="groupCode" >
          <el-input v-model="form.groupCode" :disabled="title !== '新增'"/>
        </el-form-item>
        <el-form-item label="描述信息" prop="description">
          <el-input v-model="form.description" />
        </el-form-item>
      </el-form>
      <section class="section_option flex-c-c">
        <el-button type="primary" @click="editSave(ruleFormRef)" perms="save"
          >保存</el-button
        >
        <el-button type="primary" @click="cancel" perms="cancle">取消</el-button>
      </section>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, ref, onMounted, inject } from "vue";
import { ElMessage } from "element-plus";
import useCurrentInstance from "/@/utils/useCurrentInstance.ts"
import type { FormInstance, FormRules } from 'element-plus'
import { tSpcControlGroupAjaxList, tSpcControlGroupSave, tSpcControlGroupModify } from "/@/api/controlChart/index.ts"
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  NodeData: {
    type: Object,
    default: () => {}
  }
})
const emit = defineEmits(['queryList']);
const { proxy } = useCurrentInstance()
const dialogVisible = ref(false)
const ruleFormRef = ref<FormInstance>()
const form = reactive({
  groupName: '',
  groupCode: '',
  description: ''
})
const rules = reactive<FormRules>({
  groupName: [
    { required: true, message: '请输入组名称', trigger: 'blur' },
  ],
  groupCode: [
    {
      required: true,
      message: '请输入组编码',
      trigger: 'change',
    }]
})
const editSave = async(formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async(valid, fields) => {
    if (valid) {
      let data = props.title === '新增'? await tSpcControlGroupSave({...props.NodeData, ...form, parentId: props.NodeData.id}) : await tSpcControlGroupModify({...props.NodeData, ...form})
      if (data.flag) {
        ElMessage({
          type:'success',
          message: data.msg
        })
        emit('queryList', data)
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
const cancel = () => {
  dialogVisible.value = false
}
const close = () => {
  form.groupName = ''
  form.groupCode = ''
  form.description = ''
}
const open = () => {
  form.groupName = props.NodeData.groupName || ''
  form.groupCode = props.NodeData.groupCode || ''
  form.description = props.NodeData.description || ''
}
const handleChange = () => {}
defineExpose({
  dialogVisible
})
</script>

<style lang='scss' scoped>
.section_option{
  margin-top: 15px;
}

</style>