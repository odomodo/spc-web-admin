<!--
 * @Author: liuxinyi-yuhang 1029301987@qq.com
 * @Date: 2022-05-17 15:11:22
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @LastEditTime: 2022-08-24 10:49:56
 * @FilePath: \spc-web-admin\src\views\controlChart\components\addTree.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class=''>
    <el-dialog
      :title="`选择收件人`"
      v-model="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="720px"
      @close="cancel"
      @open="open"
    >
      <el-row style="padding-right: 24px">
        <el-col :span="14">
          <el-form-item label="用户名称/工号" class="item">
            <el-input
              id="user"
              v-model="form.userName"
              clearable
              placeholder="请输入用户名称/工号"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <div :span="5" class="flex flex-c ">
            <div class="spc-button mr5"  @click="queryList">
              <svg-icon iconName="search_icon" tipLable="搜索" iconSize="10"></svg-icon>
            </div>
            <div class="spc-button" @click="reset">
              <svg-icon iconName="重置_icon"  tipLable="重置" iconSize="10"></svg-icon>
            </div>
          </div>
        </el-col>
      </el-row>
      <n-table
        class="indexTable"
        ref="indexTable"
        :tableConfig="userTableConfig"
        style="margin-top: 5px;"
        border
      >
      </n-table>
      <template #footer>
        <span class="section_option df jcfe">
          <el-button class="dialogbtn"  @click="cancel" perms="cancle" round>取消</el-button>
          <el-button class="dialogbtn" type="primary" @click="editSave" perms="save" round >确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { reactive, toRefs, ref, onMounted, inject, watch } from "vue";
import { ElMessage } from "element-plus";
import useCurrentInstance from "/@/utils/useCurrentInstance.ts"
import type { FormInstance, FormRules, ElTable } from 'element-plus'
import { ruleItem } from '../type'
import { Search, Plus, Delete, MoreFilled} from "@element-plus/icons-vue";
import { sysUserGetUserList1, tSpcControlGroupAjaxList, tSpcControlGroupSave, tSpcControlGroupModify } from "/@/api/controlChart/index.ts"
import nTable from "/@/components/nTable/index.vue";
const emit = defineEmits(['queryList']);
const { proxy } = useCurrentInstance()
const indexTable: any = ref(null)
const dialogVisible = ref(false)
const userDate = ref<any>(null)
// 用户表格配置
const userTableConfig = reactive({
  url: sysUserGetUserList1(),
  param: {
    userState: 0
  },
  //表格表头
  columns: [
    {
      prop: "userName",
      label: "用户名称",
    },
    {
      prop: "userId",
      label: "工号",
    },
    {
      prop: "emailAddress",
      label: "邮箱",
    },
  ],
  
  showChoose: true, //是否显示选择框， 默认不显示
  // singleSelect: true,
  // rowNumbers: true, //是否显示行数
  showBatchDelete: false, //是否批量删除

  //操作按钮样式
  operationColumn: {
    // 样式
    style: {},
    // 属性
    attr: {}
  }
})
const form = ref<any>({
})
const rules = reactive({

})
const editSave = async() => {
  let arr = indexTable.value.selectionData_?.map((v:any) => {
    return v.emailAddress
  }).join(",")
  emit('queryList', arr)
  dialogVisible.value = false
  indexTable.value.clearSelection()
}
const handleSelectionChange = (val: ruleItem[]) => {
}
const cancel = () => {
  dialogVisible.value = false
  indexTable.value.clearSelection()
}
const close = () => {
}
const open = () => {
  setTimeout(() => {
    let arr: any = [] 
    indexTable.value?.tableData?.map((v: any) => {
      userDate.value?.map((j: any) => {
        if (v.emailAddress === j) {
          arr.push(v)
        }
      })
    })
    arr.length > 0 && indexTable.value.toggleRowSelection(arr, true)
  }, 1200)
}
const handleChange = () => {}
const queryList = () => {
  indexTable.value.find({
  })
}
const reset = () => {
  form.value.userName = ''
  indexTable.value.find({
    userName: form.value.userName
  })
}
defineExpose({
  dialogVisible,
  userDate
})
</script>

<style lang='scss' scoped>


</style>