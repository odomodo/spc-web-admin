<!--
 * @Author: liuxinyi-yuhang 1029301987@qq.com
 * @Date: 2022-05-17 15:11:22
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @LastEditTime: 2022-06-06 10:28:24
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
      width="50%"
      @close="close"
      @open="open"
    >
      <el-row :gutter="20" v-for="(v, i) in arr" :key="i">
        <el-col :span="11">
          <el-form-item label="控制项名称">
            <el-select v-model="v.controlItemCode" @change="selectChange(i)">
              <el-option v-for="j in options" :key="j.id" :label="j.dataName" :value="j.dataCode" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11" v-if="dialogData.type === 0">
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
      <section class="section_option flex-c-c">
        <el-button type="info" @click="cancel" perms="cancle">取消</el-button>
        <el-button type="primary" @click="editSave" perms="save"
          >确定</el-button
        >
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
  

  console.log(newArr1, 'newArr1');
  
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
  let data = await postDictionaryTypeFindList(props.dialogData.query)
  options.value = data.data
  nextTick(() => {
    arr.value = props.dialogData.arr || []
  })
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
.section_option{
  margin-top: 15px;
}

</style>