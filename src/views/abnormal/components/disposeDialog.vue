<!--
 * @Author: liuxinyi-yuhang 1029301987@qq.com
 * @Date: 2022-05-17 15:11:22
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @LastEditTime: 2022-06-09 09:38:23
 * @FilePath: \spc-web-admin\src\views\controlChart\components\addTree.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class=''>
    <el-dialog
      :title="`失控点处理审批`"
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
              {{}}
            </el-form-item>
          </el-col>
          <el-col :span="12" class="item">
            <el-form-item label="图形类型">
              {{}}
            </el-form-item>
          </el-col>
          <el-col :span="12" class="item" >
            <el-form-item label="数据点序号">
              {{}}
            </el-form-item>
          </el-col>
          <el-col :span="12" class="item">
            <el-form-item label="检测项目">
              {{}}
            </el-form-item>
          </el-col>
          <el-col :span="12" class="item">
            <el-form-item label="处理人">
              {{}}
            </el-form-item>
          </el-col>
          <el-col :span="12" class="item">
            <el-form-item label="处理时间">
              {{}}
            </el-form-item>
          </el-col>
          <el-col :span="24" class="item">
            <el-form-item label="失控原因">
              {{}}
            </el-form-item>
          </el-col>
          <el-col :span="24" class="item">
            <el-form-item label="处理措施">
              {{}}
            </el-form-item>
          </el-col>
          <el-col :span="24" class="item">
            <el-form-item label="审核结果">
              <el-radio-group  class="ml-4">
                <el-radio label="同意" size="large">Option 1</el-radio>
                <el-radio label="拒绝" size="large">Option 2</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="margin-bottom: 10px">
            <el-form-item label="审核依据">
              <el-input
                :rows="4"
                type="textarea"
                placeholder="Please input"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12" class="item">
            <el-form-item label="审核人">
              {{}}
            </el-form-item>
          </el-col>
          <el-col :span="12" class="item">
            <el-form-item label="审核时间">
              {{}}
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
.section_option{
  margin-top: 15px;
}

</style>