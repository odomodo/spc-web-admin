<!--
 * @Author: liuxinyi-yuhang 1029301987@qq.com
 * @Date: 2022-05-17 15:11:22
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @LastEditTime: 2022-06-08 11:32:37
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
      @close="close"
      @open="open"
    >
      <el-form  label-width="120px"  ref="ruleFormRef">
        <el-row>
          <el-col :span="20" class="item">
            <el-form-item label="收件人Email地址"></el-form-item>
          </el-col>
          <el-col :span="2" style="margin-bottom: 10px">
            <el-button :icon="Plus">添加收件人</el-button>
          </el-col>
          <el-col :span="24" style="margin-bottom: 10px">
            <el-input
                :rows="10"
                type="textarea"
                placeholder="Please input"
              />
          </el-col>
          <el-col :span="12">
            <el-form-item label="发送次数" prop="">
              <el-input-number v-model="form.sampleSize" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发送邮件频率" prop="">
              <el-input-number v-model="form.sampleSize" /> 小时发送一次
            </el-form-item>
          </el-col>
        </el-row>
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
import tableData from '../tableData.ts'
import { ruleItem } from '../type'
import { Search, Plus, Delete, MoreFilled} from "@element-plus/icons-vue";
import { tSpcControlGroupAjaxList, tSpcControlGroupSave, tSpcControlGroupModify } from "/@/api/controlChart/index.ts"

const emit = defineEmits(['queryList']);
const { proxy } = useCurrentInstance()
const dialogVisible = ref(false)
const form = ref<any>({
  sampleSize: ''
})
const rules = reactive({

})
const editSave = async() => {

}
const handleSelectionChange = (val: ruleItem[]) => {
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