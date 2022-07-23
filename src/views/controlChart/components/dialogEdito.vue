<!--
 * @Author: liuxinyi-yuhang 1029301987@qq.com
 * @Date: 2022-05-17 15:11:22
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @LastEditTime: 2022-07-22 16:26:52
 * @FilePath: \spc-web-admin\src\views\controlChart\components\addTree.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class=''>
    <el-dialog
      :title="dialogData.title || ''"
      v-model="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="742px"
      @close="close"
      @open="open"
    >
      <el-row :gutter="20" v-for="(v, i) in arr" :key="i" class="item">
        <el-col :span="11">
          <el-form-item label="控制项名称">
            <el-select v-model="v.controlItemCode" @change="selectChange(i)">
              <el-option v-for="j in options" :key="j.id" :label="j.dataName" :value="j.dataCode" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="控制项明细">
            <el-select v-model="v.controlItemValue">
              <el-option v-for="j in v.arr" :key="j.id" :label="j.valueName" :value="j.valueCode" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-button
            :icon="Delete"
            type="text"
            @click="DeleteItem(i)"
          />
        </el-col>
      </el-row>
      <el-button :icon="Plus" type="text" @click="addItem">添加控制项</el-button>
      <section class="section_option df jcfe">
          <el-button class="dialogbtn"  @click="cancel" perms="cancle" round>取消</el-button>
          <el-button class="dialogbtn" type="primary" @click="editSave" perms="save" round >确定</el-button>
        </section>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, ref, onMounted, inject, watch, nextTick } from "vue";
import { ElMessage } from "element-plus";
import useCurrentInstance from "/@/utils/useCurrentInstance.ts"
import type { FormInstance, FormRules, ElTable } from 'element-plus'
import { ruleItem } from '../type'
import { postDictionaryTypeFindList } from "/@/api/controlChart/index.ts"
import { Search, Plus, Delete, MoreFilled} from "@element-plus/icons-vue";
import { queryDictionaryData } from "/@/api/admin/paramsSet";
const props = defineProps({
  dialogData: {
    type: Object,
    default: () => {}
  }
})
const emit = defineEmits(['queryList']);
const { proxy } = useCurrentInstance()
const dialogVisible = ref(false)
const arr = ref<Array<any>>([])
const options = ref<Array<any>>([])

const editSave = async() => {
  let newArr = arr.value.filter(v => {
    return v.controlItemValue && v.controlItemCode
  })
  let newArr1 = [...new Set(arr.value.map(v => {
    return v.controlItemCode
  }))]
  if (newArr.length !== arr.value.length) {
    ElMessage({
      type:'error',
      message: '请补充完整控制项明细'
    })
    return
  }
  if (newArr1.length !== arr.value.length) {
    ElMessage({
      type:'error',
      message: '请不用选择重复控制项'
    })
    return
  }

  arr.value.map(v => {
    options.value.map(j => {
      if (v.controlItemCode === j.dataCode) {
        v.dataName = j.dataName
      }
    })
    v.type = props.dialogData.type
  })
  const obj = {
    arr: JSON.parse(JSON.stringify(arr.value)),
    type: props.dialogData.type
  }
  emit('queryList', obj)
  dialogVisible.value = false
}

const cancel = () => {
  dialogVisible.value = false
}
const close = () => {
  arr.value = []
  
}
const open = async() => {
  let data = await postDictionaryTypeFindList(1)
  for (let i = 0; i < data.data.length; i++) {
    for (let j = 0; j < props.dialogData.otherArr.length; j++) {
      if (props.dialogData.otherArr[j].controlItemCode === data.data[i].dataCode) {
        data.data.splice(i, 1)
        i > 0 && i--
      }
    }
  }
  options.value = data.data
  setTimeout(() => {
    arr.value = props.dialogData.arr || []
    console.log(arr.value, 'asdasd');
    arr.value.map(async v => {
      v.arr = (await queryDictionaryData(v.controlItemCode, '')).values
    })
  },0)
}
const handleChange = () => {}
const DeleteItem = (index: number) => {
  arr.value.splice(index, 1)
}
const addItem = () => {
  arr.value.push({})
}
const selectChange = async (num: number) => {
  arr.value[num].controlItemValue = '' 
  let data = (await queryDictionaryData(arr.value[num].controlItemCode, '')).values
  arr.value[num].arr = data
}
onMounted(async() => {

})
defineExpose({
  dialogVisible
})
</script>

<style lang='scss' scoped>
::v-deep(.el-overlay .el-overlay-dialog .el-dialog .el-dialog__body){
  padding: 32px !important;
}
.item{
  height: 80px;
  background: #FAFAFA;
  border-radius: 8px;
  padding-top: 25px;
  margin-bottom: 20px;
}
</style>