<!--
 * @Author: liuxinyi-yuhang 1029301987@qq.com
 * @Date: 2022-05-17 15:11:22
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @LastEditTime: 2022-06-21 09:18:20
 * @FilePath: \spc-web-admin\src\views\controlChart\components\addTree.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class=''>
    <el-dialog
      :title="`设置判异规则 (右侧n、m、k值可修改)`"
      v-model="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="70%"
      @close="close"
      @open="open"
    >
      <el-table
        :data="TableData"
        ref="multipleTableRef"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="discriminationRuleCode" label="规则编码" />
        <el-table-column prop="currentRule" label="现行规则" >
          <template #default="scope">
            {{TableData[scope.$index].currentRule()}}
          </template>
        </el-table-column>
        <el-table-column prop="ruleBasis" label="规则依据" />
        <el-table-column prop="nvalue" label="n值" fixed="right"  width="80" >
          <template #default="scope">
            <el-input v-model="scope.row.nvalue" v-if="scope.row.hasOwnProperty('nvalue')"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="mvalue" label="m值" fixed="right"  width="80" >
          <template #default="scope">
            <el-input v-model="scope.row.mvalue" v-if="scope.row.hasOwnProperty('mvalue')"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="kvalue" label="k值" fixed="right"  width="80" >
          <template #default="scope">
            <el-input v-model="scope.row.kvalue"  v-if="scope.row.hasOwnProperty('kvalue')"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <section class="section_option flex-c-c">
        <el-button type="primary" @click="editSave" perms="save"
          >确定</el-button
        >
        <el-button type="primary" @click="cancel" perms="cancle">取消</el-button>
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
import { tSpcControlGroupAjaxList, tSpcControlGroupSave, tSpcControlGroupModify } from "/@/api/controlChart/index.ts"

const props = defineProps({
  editoData: {
    type: Object,
    default: () => {}
  }
})
const emit = defineEmits(['queryList']);
const { proxy } = useCurrentInstance()
const dialogVisible = ref(false)
const TableData = ref(tableData)
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<ruleItem[]>([])

const editSave = async() => {
  if (multipleSelection.value.length < 0) {
    ElMessage({
      type: 'error',
      message: '请选择规则'
    })
    return
  }
  emit('queryList', JSON.parse(JSON.stringify(multipleSelection.value)))
}
const handleSelectionChange = (val: ruleItem[]) => {
  multipleSelection.value = val
}
const cancel = () => {
  dialogVisible.value = false
}
const close = () => {
  multipleTableRef.value!.clearSelection()
  TableData.value = tableData
}
const open = () => {
      let arr = TableData.value?.map((v: any) => {
      props.editoData.arr?.map((j: any) => {
        if (v.discriminationRuleCode === j.discriminationRuleCode) {
          setTimeout(() => {
            multipleTableRef.value!.toggleRowSelection(v, true)
          }, 0);
          v = {...v, ...j}
        }
      })
      return v
    })
    if (props.editoData.type === 2) {
      arr = arr.slice(0, 4)
    }
    TableData.value = arr
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