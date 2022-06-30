<!--
 * @Author: liuxinyi-yuhang 1029301987@qq.com
 * @Date: 2022-05-16 13:13:13
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @LastEditTime: 2022-06-29 16:27:49
 * @FilePath: \spc-web-admin\src\views\base\detection.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
<div class="box">
  <el-row class="params_set">
    <el-col :span="24" class="params_set_parent">
      <!-- 编码搜索 -->
      <el-row class="parent_code" type="flex" align="center">
        <el-col :span="6" class="flex flex-c mr20">
          <label style="width: 100px">检验项目：</label>
          <el-input autocomplete="off" v-model="form.inspectionName" ></el-input>
        </el-col>
        <el-col :span="6" class="flex flex-c">
          <label style="width: 100px">检验规格：</label>
          <el-input autocomplete="off" v-model="form.insectionStandard" ></el-input>
        </el-col>
        <el-col :span="6" class="flex flex-c">
          <div class="spc-button" @click="search()">
            <svg-icon iconName="search"  tipLable="搜索" ></svg-icon>
          </div>
          <div class="spc-button" @click="reset()">
            <svg-icon iconName="refresh"  tipLable="重置" ></svg-icon>
          </div>
          <el-button
            color="#5781C1"
            class="spc-right"
            :icon="Plus"
            @click="addNewParent"
            perms="params_set_add"
            >新增</el-button
          >
        </el-col>
      </el-row>
      <!-- 父配置表格 -->
      <n-table
        ref="indexTable"
        :tableConfig="modelTableConfig"
        style="margin-top: 15px"
      ></n-table>
    </el-col>
  </el-row>
  <detectionDialog ref="DetectionDialog" :title="title" @saveSuccess="reset" ></detectionDialog>
</div>
</template>

<script setup lang="ts">
import nTable from "/@/components/nTable/index.vue";
import { Plus } from "@element-plus/icons-vue";
import detectionDialog from './model/detection_dialog.vue'
import { queryDictionaryData } from "/@/api/admin/paramsSet";
import { reactive, toRefs, ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { TSpcInspectionAjaxList, TSpcInspectiondelete } from "/@/api/controlChart/index.ts"

const form: any = ref({})
const indexTable: any = ref(null)
const DetectionDialog: any = ref(null)
const options:any = ref([])
const title = ref<string>('')
const modelTableConfig = reactive({
  url: TSpcInspectionAjaxList(),
  height: "70vh",
  //表格表头
  columns: [
    {
      prop: "inspectionName",
      label: '检测项目',
    },
    {
      prop: "inspectionUnit",
      label:'检验单位',
      formatter: (row: any, column: any, cellValue: any, index: any) => {
        let str = ''
        options.value.map((v: any) => {
          if (v.valueCode === cellValue) {
            str = v.valueName
          }
        })
        return str
      }
    }
  ], //操作按钮列表
  options: [
    {
      type: "warning",
      label: '编辑',
      icon:'edit',
      formatter:function(index: any, row: any) {
        
      },
      click: function(index: any, row: any) {
        DetectionDialog.value.dialogVisible = true;
        DetectionDialog.value.form = JSON.parse(JSON.stringify(row));
        title.value = '编辑'
      },
    },
    {
      type: "warning",
      label: '删除',
      icon:'delete',
      click: async (index: any, row: any) => {
        const res = await TSpcInspectiondelete(row)
        if (res.flag) {
          ElMessage({
            type: "success",
            message: res.msg
          })
          indexTable.value.reload();
        } else {
          ElMessage({
            type: "error",
            message: res.msg
          })
        }
      },
    },
  ],
  //操作按钮样式
  operationColumn: {
    // 样式
    style: {},
    // 属性
    attr: {}
  },
  showPagination: false,
  showOperation: true, //是否显示操作字段
  // rowNumbers: true, //是否显示行数
  highlightCurrentRow: true //是否要高亮当前行
})

const search = () => {
  console.log(123);
  console.log(form.value);
  indexTable.value.find({
    inspectionName: form.value?.inspectionName,
    insectionStandard: form.value?.insectionStandard
  });
}
const reset = () => {
  form.value = {}
  indexTable.value.find({
    inspectionName: '',
    insectionStandard: '',
  });
}

const addNewParent = () => {
  title.value = '新增'
  DetectionDialog.value.dialogVisible = true;
}
onMounted(async() => {
  options.value = (await queryDictionaryData("unit", "")).values
})
</script>
<style scoped lang="scss">
.box{
  background: #fff;
  padding: 20px;
}
</style>