<!--
 * @Author: liuxinyi-yuhang 1029301987@qq.com
 * @Date: 2022-05-17 15:11:22
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @LastEditTime: 2022-06-09 10:33:04
 * @FilePath: \spc-web-admin\src\views\controlChart\components\addTree.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class=''>
    <el-dialog
      :title="`新增`"
      v-model="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="580px"
      @close="close"
      @open="open"
    >
      <el-form label-width="90px"  ref="ruleFormRef" :model="form" :rules="rules">
        <el-form-item label="控制项编码">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="控制项名称">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label=" 明细项编码">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label=" 明细项编码值">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label=" 显示顺序">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="是否可用">
          <el-switch></el-switch>
        </el-form-item>
        <el-form-item label=" 是否可编辑">
          <el-switch></el-switch>
        </el-form-item>
        <el-form-item label=" 是否可删除">
          <el-switch></el-switch>
        </el-form-item>
      </el-form>
      
      <section class="section_option df jcfe">
        <el-button class="dialogbtn"  @click="cancel" perms="cancle" round>取消</el-button>
          <el-button class="dialogbtn" type="primary" @click="editSave" perms="save" round >确定</el-button>
      </section>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, ref, onMounted, inject, watch } from "vue";
import { ElMessage } from "element-plus";
import useCurrentInstance from "/@/utils/useCurrentInstance.ts"
import type { FormInstance, FormRules, ElTable } from 'element-plus'
import { Search, Plus, Delete, MoreFilled} from "@element-plus/icons-vue";
import { tSpcControlGroupAjaxList, tSpcControlGroupSave, tSpcControlGroupModify } from "/@/api/controlChart/index.ts"

const emit = defineEmits(['queryList']);
const { proxy } = useCurrentInstance()
const dialogVisible = ref(true)
const form = ref<any>({
  sampleSize: ''
})
const rules = reactive({

})
const editSave = async() => {

}
const handleSelectionChange = () => {
}
const cancel = () => {
  dialogVisible.value = false
}
const close = () => {
}
const open = () => {

}
const handleChange = () => {}
defineExpose({
  dialogVisible
})
</script>

<style lang='scss' scoped>


</style>