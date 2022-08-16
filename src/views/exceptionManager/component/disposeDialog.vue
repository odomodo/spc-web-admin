<!--
 * @Author: liuxinyi-yuhang 1029301987@qq.com
 * @Date: 2022-05-17 15:11:22
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @LastEditTime: 2022-08-11 10:34:08
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
      width="490px"
      @close="close"
      @open="open"
    >
      <el-form label-width="90px"  ref="ruleFormRef" :model="form" :rules="rules">
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
          <el-col :span="24" class="item" >
            <el-form-item label="原因分析">
              {{form.reasonAnalysis}}
            </el-form-item>
          </el-col>
          <el-col :span="24" class="item" >
            <el-form-item label="处理措施">
              {{form.treatMeasure}}
            </el-form-item>
          </el-col>
          <el-col :span="24" class="item"  :style="{marginBottom: title === '失控点处理查看' ? '' : '20px'}">
            <el-form-item label="审核结果" prop="auditResult" class="df aic">
              <el-switch
                v-if="title !== '失控点处理查看'"
                v-model="form.auditResult"
                :active-value="1"
                :inactive-value="0"
              />
              <span v-else>
                {{form.auditResult == 0 ? '不通过': '通过'}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="margin-bottom: 10px">
            <el-form-item label="审核依据">
              <el-input
                v-if="title !== '失控点处理查看'"
                v-model="form.auditBasis"
                :rows="4"
                type="textarea"
                placeholder="请输入"
              />
              <span v-else>{{form.auditBasis}}</span>
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
      
      <section class="section_option df jcfe" v-if=" title !== '失控点处理查看' ">
        <el-button class="dialogbtn"  @click="cancel" perms="cancle" round>取消</el-button>
        <el-button class="dialogbtn" type="primary" @click="editSave(ruleFormRef)" perms="save" round >确定</el-button>
      </section>
      <section class="section_option df jcfe" v-else>
        <el-button class="dialogbtn"  type="primary"  @click="cancel" perms="save" round>返回</el-button>
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
const ruleFormRef: any = ref(null)
const form = ref<any>({
  auditResult: 1
})
const rules = reactive({
  auditResult: [
    { required: true, message: '请选择', trigger: 'blur' },
  ],
})
const editSave = async(formEl: any) => {
  if (!formEl) return
  await formEl.validate(async(valid: any, fields: any) => {
    if (valid) {
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
    } else{
      console.log(123);
      
    }
  })
  
}
const handleSelectionChange = () => {
}
const cancel = () => {
  dialogVisible.value = false
  form.value = {}
}
const close = () => {
  form.value = {}
}
const open = () => {
  form.value.auditUser = form.value.auditUser || sessionStorage.userName
  form.value.editTime = form.value.editTime ?? formatDate(new Date(), 'YYYY-mm-dd HH:MM:SS')
  console.log(form.value);
  
}
const handleChange = () => {}
defineExpose({
  dialogVisible,
  form,
  title
})
</script>

<style lang='scss' scoped>
.item{
  margin-bottom: 10px;
}

</style>