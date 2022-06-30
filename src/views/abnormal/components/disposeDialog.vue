<!--
 * @Author: liuxinyi-yuhang 1029301987@qq.com
 * @Date: 2022-05-17 15:11:22
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @LastEditTime: 2022-06-27 16:04:39
 * @FilePath: \spc-web-admin\src\views\controlChart\components\addTree.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class=''>
    <el-dialog
      :title="title"
      v-model="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="40%"
      @close="close"
      @open="open"
    >
      <el-form label-width="90px"  ref="ruleFormRef">
        <el-row>
          <el-col :span="12" class="item">
            <el-form-item label="图形编码">
              {{form.controlChartConfigCode}}
            </el-form-item>
          </el-col>
          <el-col :span="12" class="item">
            <el-form-item label="图形类型">
              {{form.controlChartCode}}
            </el-form-item>
          </el-col>
          <el-col :span="12" class="item" >
            <el-form-item label="数据点序号">
              {{form.spare1}}
            </el-form-item>
          </el-col>
          <el-col :span="12" class="item">
            <el-form-item label="检测项目">
              {{form.inspcationCode}}
            </el-form-item>
          </el-col>
          <el-col :span="12" class="item">
            <el-form-item label="处理人">
              {{form.manageUser}}
            </el-form-item>
          </el-col>
          <el-col :span="12" class="item">
            <el-form-item label="处理时间">
              {{form.manageTime}}
            </el-form-item>
          </el-col>
          <el-col :span="24" class="item">
            <el-form-item label="失控原因">
              {{form.outControlReason}}
            </el-form-item>
          </el-col>
          <el-col :span="24" class="item">
            <el-form-item label="处理措施">
              {{form.treatMeasure}}
            </el-form-item>
          </el-col>
          <el-col :span="24" class="item">
            <el-form-item label="审核结果">
              <el-radio-group  class="ml-4" v-model="form.auditResult">
                <el-radio :label="1" size="large">同意</el-radio>
                <el-radio :label="0" size="large">拒绝</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="margin-bottom: 10px">
            <el-form-item label="审核依据">
              <el-input
                v-model="form.auditBasis"
                :rows="4"
                type="textarea"
                placeholder="Please input"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" class="item">
            <el-form-item label="审核人">
              {{form.auditUser}}
            </el-form-item>
          </el-col>
          <el-col :span="12" class="item">
            <el-form-item label="审核时间">
              {{form.editTime}}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      
      <section class="section_option df jcfe" v-if="title !== '失控点处理查看'">
        <el-button class="dialogbtn"  @click="cancel" perms="cancle" round>取消</el-button>
          <el-button class="dialogbtn" type="primary" @click="editSave" perms="save" round >确定</el-button>
      </section>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, ref, onMounted, inject, watch, computed } from "vue";
import { ElMessage } from "element-plus";
import useCurrentInstance from "/@/utils/useCurrentInstance.ts"
import { formatDate } from "/@/utils/formatTime.ts"

import type { FormInstance, FormRules, ElTable } from 'element-plus'
import { Search, Plus, Delete, MoreFilled} from "@element-plus/icons-vue";
import { TSpcOutControlAuditmodify } from "/@/api/controlChart/index.ts"

const emit = defineEmits(['queryList']);
const { proxy } = useCurrentInstance()
const dialogVisible = ref(false)
const title = ref('')

const form = ref<any>({
})
const rules = reactive({

})
const editSave = async() => {
  let res: any = await TSpcOutControlAuditmodify(form.value)
  if (res.code == 0) {
    dialogVisible.value = false
    ElMessage({
      type: 'success',
      message: res.msg
    })
    emit('queryList');
  } else {
    ElMessage({
      type: 'error',
      message: res.msg
    })
  }
}
const handleSelectionChange = () => {
}
const cancel = () => {
  dialogVisible.value = false
}
const close = () => {
  form.value = {}
}
const open = () => {
  form.auditUser = form.auditUser || sessionStorage.userName
  form.editTime = form.editTime ?? formatDate(new Date(), 'YYYY-mm-dd HH:MM:SS')
  
}
const handleChange = () => {}
defineExpose({
  dialogVisible,
  form,
  title
})
</script>

<style lang='scss' scoped>
.section_option{
  margin-top: 15px;
}

</style>