<!--
 * @Author: liuxinyi-yuhang 1029301987@qq.com
 * @Date: 2022-06-17 13:13:13
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @LastEditTime: 2022-07-18 14:42:40
 * @FilePath: \spc-web-admin\src\views\exceptionManager\doIt.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="box1">
    <el-row style="" class="mb20">
      <el-col>
        <el-button type="primary" @click="handleClick('add')"><i><svg-icon iconName="新增_icon" tipLable="重置" iconSize="10" style="margin-right: 5px;"></svg-icon></i> 新增</el-button>
      </el-col>
    </el-row>
    <nTable ref="indexTable" :tableConfig="roleTableConfig"></nTable>
    <el-dialog
      v-model="showDialog"
      :title="title"
      @close="close"
      width="30%"
    >
      <el-form :model="form" :rules="title !== '查看' && rules" ref="ruleFormRef">
        <el-row>
          <el-col :span="24" class="mb20">
            <el-form-item label="失控原因" prop="outControlReason">
              <el-input
                v-if="title !== '查看'"
                v-model="form.outControlReason"
                :rows="4"
                type="textarea">
              </el-input>
              <div v-else>
                {{form.outControlReason}}
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24" class="mb20">
            <el-form-item label="原因分析" prop="reasonAnalysis">
              <el-input
                v-if="title !== '查看'"
                v-model="form.reasonAnalysis"
                :rows="4"
                type="textarea">
              </el-input>
              <div v-else>
                {{form.reasonAnalysis}}
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24" class="mb20">
            <el-form-item label="改善措施" prop="treatMeasure">
              <el-input
                v-if="title !== '查看'"
                v-model="form.treatMeasure"
                :rows="4"
                type="textarea">
              </el-input>
              <div v-else>
                {{form.treatMeasure}}
              </div>
            </el-form-item>
          </el-col>
          
        </el-row>
      </el-form>
      <section class="section_option df jcfe" v-if="title !== '查看'">
        <el-button class="dialogbtn"  @click="handleClick('cancel')" perms="cancle" round>取消</el-button>
          <el-button class="dialogbtn" type="primary" @click="handleClick('addSave')" perms="save" round >确定</el-button>
      </section>
      <section class="section_option df jcfe" v-else>
        <el-button class="dialogbtn"  @click="handleClick('cancel')" type="primary" perms="save" round>返回</el-button>
      </section>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
// 组件
import nTable from "/@/components/nTable/index.vue";
import { TSpcTakeMeasuresave, exceptionManagementTSpcTakeMeasureajaxList, TSpcTakeMeasuremodify, TSpcTakeMeasuredelete } from "/@/api/controlChart/index.ts"
import { ref, reactive, toRefs, h, onMounted } from "vue"
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, Plus, Delete, MoreFilled, Refresh} from "@element-plus/icons-vue";
import type { FormInstance, FormRules } from 'element-plus'
import useCurrentInstance from "/@/utils/useCurrentInstance.ts"
const { proxy } = useCurrentInstance()
const indexTable = ref<any>(null)
const ruleFormRef = ref<any>(null)
// 角色表格配置
const  roleTableConfig = ref<any>({
  // height: '70vh',
  url: exceptionManagementTSpcTakeMeasureajaxList(),
  data: [],
  param: {},
  //表格表头
  columns: [
    {
      prop: "outControlReason",
      label: "失控原因",
    },
    {
      prop: "reasonAnalysis",
      label: "原因分析",
    },
    {
      prop: "treatMeasure",
      label: "改善措施",
    },
    
  ],
  // highlightCurrentRow: true, //是否要高亮当前行
  // showChoose: true, //是否显示选择框， 默认不显示
  rowNumbers: true,
  showOperation: true, //是否显示操作字段
  // singleSelect: true, //单选，复选，默认复选
  //操作按钮列表
  options: [
    {
      type: "success",
      label: "编辑",
      icon: "edit",
      click: (index: any, row: any) => {
        handleClick('edit', row)
      }
    },
    {
      type: "danger",
      label: "删除",
      icon: "delete",
      perms: "sys_role_delete",
      click: (index: any, row: any) => {
        ElMessageBox.confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        })
          .then(async () => {
            handleClick('delete', row)
          })
          .catch(() => {
            ElMessage({
              type: 'info',
              message: '已取消删除',
            });
          });
      }
    },
    {
      type: "danger",
      label: "查看",
      icon: "show",
      perms: "sys_role_delete",
      click: (index: any, row: any) => {
        handleClick('show', row)
      }
    },
  ],
  //操作按钮样式
  operationColumn: {
    // 样式
    style: {},
    // 属性
    attr: {}
  }
})
const rules = ref<any>({
  treatMeasure: [
    { required: true, message: '请输入', trigger: 'blur' },
    {  max: 1000, message: '不要超过1000个字符', trigger: 'blur' },
  ],
  outControlReason: [
    { required: true, message: '请输入', trigger: 'blur' },
    {  max: 500, message: '不要超过500个字符', trigger: 'blur' },
  ],
  reasonAnalysis: [
    { required: true, message: '请输入', trigger: 'blur' },
    {  max: 500, message: '不要超过500个字符', trigger: 'blur' },
  ],
})
const ELmessageshow = (res?: any,fn?:any) => {
  if (res.code == 0) {
    ElMessage({
      message: res.msg || '操作成功',
      type: "success",
    });
    fn()
  } else {
    ElMessage({
      message: res.msg,
      type: "error",
      duration: 3000
    });
  }
}
const showDialog = ref(false)
const title = ref('新增')
const form = ref<any>({})
const close = () => {
  form.value = {}
}
const handleClick = (type: string, data?: any) => {
  const obj: any = {
    'add': () => {
      showDialog.value = true;
      title.value = '新增'
    },
    'edit': () => {
      showDialog.value = true;
      title.value = '编辑'
      form.value = JSON.parse(JSON.stringify(data))
    },
    'show': () => {
      showDialog.value = true;
      title.value = '查看'
      form.value = JSON.parse(JSON.stringify(data))
      ruleFormRef.value.clearValidate()
    },
    'cancel': () => {
      showDialog.value = false;
    },
    'addSave': async () => {
      await ruleFormRef.value.validate(async(valid: any, fields: any) => {
      if (valid ) {
        const res = title.value === '新增' ? await TSpcTakeMeasuresave(form.value) : await TSpcTakeMeasuremodify(form.value)
        ELmessageshow(res,() => {
          showDialog.value = false;
          indexTable.value.reload();
        })
      }})
    },
    'delete': async () => {
      const res = await TSpcTakeMeasuredelete(data.id)
      ELmessageshow(res, () => {
        indexTable.value.reload();
      })
    }
  }
  obj[type]()
}

</script>
<style lang="scss" scoped>
.box1{
  padding: 20px;
  border-radius: 10px ;
  background:#fff;
  height: calc(100vh - 140px);
  overflow-y: scroll;
}
</style>