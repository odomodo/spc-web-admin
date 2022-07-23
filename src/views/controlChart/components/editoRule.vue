<!--
 * @Author: liuxinyi-yuhang 1029301987@qq.com
 * @Date: 2022-05-17 15:11:22
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @LastEditTime: 2022-07-22 15:52:29
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
      width="1225px"
      @close="close"
      @open="open"
    >
      <el-table
        :data="TableData"
        ref="multipleTableRef"
        @selection-change="handleSelectionChange"
        :header-cell-style="{ height: '40px', padding: '2px', backgroundColor: '#f0f0f0', color: '#313233' }"
			:row-style="{ height: '32px' }"
			:cell-style="{ padding: '3px' }"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="discriminationRuleCode" label="规则编码"  width="100"/>
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
import { deepClone } from '/@/utils/jsOptions'
import { tSpcControlGroupAjaxList, tSpcControlGroupSave, tSpcControlGroupModify } from "/@/api/controlChart/index.ts"
const basetabledata = deepClone(tableData)
const props = defineProps({
  editoData: {
    type: Object,
    default: () => {}
  }
})
const emit = defineEmits(['queryList']);
const { proxy } = useCurrentInstance()
const dialogVisible = ref(false)
const TableData: any = ref(basetabledata)
const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<ruleItem[]>([])

const editSave = async() => {
  if (multipleSelection.value.length <= 0) {
    errorMsg('请选择判异规则')
    return
  }
  let target = true
  let str = ''
  let Rarr = []
  for (let i = 0; i < multipleSelection.value.length; i++) {
    Rarr.push(multipleSelection.value[i]?.discriminationRuleCode)
    if (multipleSelection.value[i]?.nvalue < 0 || multipleSelection.value[i]?.mvalue < 0 || multipleSelection.value[i]?.kvalue < 0) {
      target = false
      str = 'm,n,k值不能为负数'
    }
    if (multipleSelection.value[i]?.kvalue > 3) {
      target = false
      str = 'k值不能大于3'
    }
    if (multipleSelection.value[i].kvalue && multipleSelection.value[i]?.mvalue > multipleSelection.value[i]?.nvalue) {
      target = false
      str = 'm值不能大于n值'
    }
  }
  if (props.editoData.type !== 2 && !Rarr.includes('R0')) {
    ElMessage({
      type: 'error',
      message: '请选择R0'
    })
    return
  }

  if (!target) {
    errorMsg(str)
  } else {
    emit('queryList', JSON.parse(JSON.stringify(multipleSelection.value)))
  }
  
}
const handleSelectionChange = (val: ruleItem[]) => {
  multipleSelection.value = val
}
const cancel = () => {
  dialogVisible.value = false
}
const close = () => {
  multipleTableRef.value!.clearSelection()
  TableData.value = deepClone(tableData)
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
    arr = arr.slice(1, 5)
  } else {
   arr.map((v: any, i: any) => {
    if (i === 0) {
      setTimeout(() => {
        multipleTableRef.value!.toggleRowSelection(v, true)
      },0)
    }
   })
  }
  TableData.value = arr
}
const errorMsg = (msg: any) => {
  ElMessage({
    type: 'error',
    message: msg
  })
}
const handleChange = () => {}
defineExpose({
  dialogVisible
})
</script>

<style lang="scss" scoped>
.table-box{
	padding-right: 14px;
	border-right: 1px solid #F0F2F5;
	border-bottom: 1px solid #F0F2F5;
}
.curn {
	cursor: pointer;
}
.disabled {
	cursor: not-allowed;
}
::v-deep(.pagination){
  display: flex;
	flex-direction: row-reverse;
}
::v-deep(.pagination .el-pagination ){
	float: none !important;
	display: flex;
	// flex-direction: row-reverse;
	margin-top: 15px;
}
::v-deep(.cell){
	text-align: center;
}
::v-deep(.el-table){
	--el-table-border-color: #fff;
}
::v-deep(.el-popper.is-dark){
    color: var(--el-text-color-primary) !important;
    background: var(--el-bg-color)  !important;
    border: 1px solid var(--el-text-color-primary)  !important;
}
</style>
