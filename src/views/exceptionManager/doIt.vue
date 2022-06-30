<!--
 * @Author: liuxinyi-yuhang 1029301987@qq.com
 * @Date: 2022-06-17 13:13:13
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @LastEditTime: 2022-06-27 09:27:16
 * @FilePath: \spc-web-admin\src\views\exceptionManager\doIt.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="box1">
    <el-row style="" class="mb20">
      <el-col>
        <el-button type="primary" :icon="Plus" @click="handleClick('add')">新增</el-button>
      </el-col>
    </el-row>
    <nTable ref="indexTable" :tableConfig="roleTableConfig"></nTable>
    <el-dialog
      v-model="showDialog"
      :title="title"
      @close="close"
      width="30%"
    >
      <el-form>
        <el-row>
          <el-col :span="24" class="mb20">
            <el-form-item label="失控原因">
              <el-input
                v-model="form.outControlReason"
                :rows="4"
                type="textarea">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" class="mb20">
            <el-form-item label="处理措施">
              <el-input
                v-model="form.treatMeasure"
                :rows="4"
                type="textarea">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <section class="section_option df jcfe" v-if="title !== '查看'">
        <el-button class="dialogbtn"  @click="handleClick('cancel')" perms="cancle" round>取消</el-button>
          <el-button class="dialogbtn" type="primary" @click="handleClick('addSave')" perms="save" round >确定</el-button>
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
// 角色表格配置
const  roleTableConfig = ref<any>({
  height: '550px',
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
      prop: "treatMeasure",
      label: "处理措施",
    },
  ],
  // highlightCurrentRow: true, //是否要高亮当前行
  // showChoose: true, //是否显示选择框， 默认不显示
  rowNumbers: true,
  showOperation: true, //是否显示操作字段
  singleSelect: true, //单选，复选，默认复选
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
        handleClick('delete', row)
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
    },
    'cancel': () => {
      showDialog.value = false;
    },
    'addSave': async () => {
      const res = title.value === '新增' ? await TSpcTakeMeasuresave(form.value) : await TSpcTakeMeasuremodify(form.value)
      ELmessageshow(res,() => {
        showDialog.value = false;
        indexTable.value.reload();
      })
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
  padding: 10px;
  border-radius: 10px ;
  background:#fff;
}
</style>