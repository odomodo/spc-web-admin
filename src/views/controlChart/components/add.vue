<template>
  <div>
    <div  class='dialog'>
      <el-dialog
        :title="`控制图设置(${title})`"
        v-model="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @close="close"
        width="100%"
        @open="open"
      >
        <el-form :model="form" label-width="120px">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="控制图类型">
                <el-select v-model="form.controlChartCode" placeholder="请选择" @change="handleChange(form.controlChartCode)">
                  <el-option  v-for="v in chartOptions" :label="v.valueName" :value="v.valueCode" :key="v.valueCode" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="检验项目">
                <el-select v-model="form.inspcationCode" placeholder="请选择">
                  <el-option v-for="v in itemOptions" :label="v.inspectionName" :value="v.inspcationCode" :key="v.inspcationCode" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12" class="box1 box">
              <p class="title">基本信息</p>
              <div>
                <el-col :span="24" class="item">
                  <el-form-item label="规格上限" proo="usl">
                    <el-input v-model="form.usl" />
                  </el-form-item>
                </el-col>
                <el-col :span="24" class="item">
                  <el-form-item label="目标值" proo="target">
                    <el-input v-model="form.target" />
                  </el-form-item>
                </el-col>
                <el-col :span="24" class="item">
                  <el-form-item label="规格下限" proo="lsl">
                    <el-input v-model="form.lsl" />
                  </el-form-item>
                </el-col>
                <el-col :span="24" class="item">
                  <el-form-item label="样本容量" proo="sampleSize">
                    <el-select v-model="form.sampleSize" :disabled="sampleSizeSelect" v-if="sampleSizeSelectOrInput">
                      <el-option v-for="i in 25" :key="i" :value="i">{{i}}</el-option>
                    </el-select>
                    <el-input-number v-model="form.sampleSize"  v-else :disabled="sampleSizeSelect"/>
                  </el-form-item>
                </el-col>
                <el-col :span="24" class="item">
                  <el-form-item label="小数位数" proo="decimalPlaces">
                    <el-select v-model="form.decimalPlaces" :disabled="!form.decimalPlaces" >
                      <el-option v-for="i in 5" :key="i" :value="i">{{i}}</el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="24" class="item">
                  <p class="p">注：选择检验项目成功后，自动创建编码</p>
                </el-col>
              </div>
            </el-col>
            <el-col :span="12" class="box2 box">
              <p class="title">控制图信息</p>
              <div>
                <el-col :span="24" class="item">
                  <el-form-item label="判异规则">
                    <div class="flex">
                      <el-input v-model="form.rules" disabled />
                      <el-button class="btn" @click="showEditoRule">设置</el-button>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="24" class="item">
                  <el-form-item label="控制图层次信息">
                    <div class="flex">
                      <el-input disabled v-model="form.spare1" />
                      <el-button class="btn" @click="dialogEditoShow(0)">设置</el-button>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="24" class="item">
                  <el-form-item label="数据点层次信息">
                    <div class="flex">
                      <el-input disabled v-model="form.spare2" />
                      <el-button class="btn"  @click="dialogEditoShow(1)">设置</el-button>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="24" class="item box3">
                  <el-form-item label="上图">
                    <div class="flex upchart">
                      <el-input v-model="form.uclX"  class="left nums" />
                      <el-input v-model="form.clX"  class="center nums" />
                      <el-input v-model="form.lclX"  class="right nums" />
                      <el-button class="btn">计算</el-button>
                      <el-button class="btn">清除</el-button>
                    </div>
                  </el-form-item>
                  <el-form-item label="下图">
                    <div class="flex">
                      <el-input v-model="form.uclR"  class="left nums" />
                      <el-input v-model="form.clR"  class="center nums" />
                      <el-input v-model="form.lclR"  class="right nums" />
                    </div>
                  </el-form-item>
                </el-col>
              </div>
            </el-col>
          </el-row>
        </el-form>
        <section class="section_option flex-c-c">
          <el-button type="info" @click="cancel" perms="cancle">取消</el-button>
          <el-button type="primary" @click="editSave" perms="save" >确定</el-button>
        </section>
      </el-dialog>
    </div>

    <editoRule ref="EditoRule" @queryList="queryList" :editoData="editoData"></editoRule>
    <dialogEdito ref="DialogEdito" :dialogData="dialogData" @queryList="queryList1"></dialogEdito>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, ref, onMounted, inject, defineEmits, watch } from "vue";
import { ElMessage } from "element-plus";
import { useStore } from '/@/store/index';
import { queryDictionaryData } from "/@/api/admin/paramsSet";
import { tspcInspectionFindList, tspcControlGroupItemSave, tspcControlGroupItemModify } from "/@/api/controlChart/index.ts";
import useCurrentInstance from "/@/utils/useCurrentInstance.ts"
import editoRule from "./editoRule.vue"
import dialogEdito from "./dialogEdito.vue"

import { ruleItem } from '../type'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  addData: {
    type: Object,
    default: () => {}
  }
})
const { proxy } = useCurrentInstance()
const emit = defineEmits(['saveSuccess']);
const dialogVisible = ref(false)
const chartOptions: any = ref(null)
const itemOptions: any = ref(null)
const EditoRule: any = ref(null)
const DialogEdito: any = ref(null)
const rightData: any = inject('rightData')
const form = ref<any>({
  controlChartCode:'',
  inspcationCode: '',
  usl: '',
  target: '',
  lsl: '',
  sampleSize: 5,
  decimalPlaces: 1,
  uclX: '',
  clX: '',
  lclX: '',
  uclR: '',
  clR: '',
  lclR: '',
  rules: '',
  arr0: [],
  arr1: [],
  spare1: '',
  spare2: '',
})
const sampleSizeSelect = ref(false) // 样本容量能否选择
const sampleSizeSelectOrInput = ref(false) // 样本容量选择还是输入 false: 输入， true: 选择
const editoData: any = ref(null)
const dialogData: any = ref({})
const handleChange = (data: string) => {
  if (data === 'P'|| data === 'U') {
    // 选择P图和U图时,样本容量和小数位是不能选择
    sampleSizeSelect.value = true
    form.value.sampleSize = ''
    form.value.decimalPlaces = ''
  } else if (data === 'NP' || data === 'C') {
    // 选择nP图和C图,样本容量是输入值,且小数位不能选择 
    sampleSizeSelect.value = false
    sampleSizeSelectOrInput.value = false
    form.value.decimalPlaces = ''
    form.value.sampleSize = 5
  } else if (data === 'X_MR') {
    sampleSizeSelect.value = true
    form.value.sampleSize = 1
    form.value.decimalPlaces = 1
  } else {
    // 选择XS\XR\中位数\XMR图,样本容量是选择值,且小数位必选
    form.value.decimalPlaces = 1
    sampleSizeSelect.value = false
    sampleSizeSelectOrInput.value = true
    form.value.sampleSize = 5
  }
}
const open = () => {
    form.value = props.addData
    form.value.rules = (props.addData.itemDecRuleConfigList?.map((v: any) => {
      return v.discriminationRuleCode
    }))?.join(',')
    form.value.arr0 = props.addData.tSpcControlGroupItemHierarchyList?.filter((v: any) => {
      return v.type === 0
    }) || []
    form.value.arr1 = props.addData.tSpcControlGroupItemHierarchyList?.filter((v: any) => {
      return v.type === 1
    }) || []
}
onMounted(async () => {
 chartOptions.value = (await queryDictionaryData("control_chart_type", "")).values
 itemOptions.value = (await tspcInspectionFindList()).data
})

const showEditoRule = () => {
  EditoRule.value.dialogVisible = true
  editoData.value = form.value.itemDecRuleConfigList
}
const queryList = (data: ruleItem[]) => {
  form.value.itemDecRuleConfigList = data
  form.value.rules = (data.map(v => {
    return v.discriminationRuleCode
  })).join(',')
  EditoRule.value.dialogVisible = false
}

const queryList1 = (data: any) => {
  form.value[`arr${data.type}`] = data.arr
  console.log(data.arr, 'data.arr');
  form.value[`spare${data.type + 1}`] = (data.arr.map((v: any) => {
    return v.dataName
  })).join(',')
}
const editSave = async () => {
  const obj = {
    ...form.value,
    scpControlGroupId: rightData.value.id,
    tSpcControlGroupItemHierarchyList: [...form.value.arr0, ...form.value.arr1]}
  const data = props.title === '新增' ? await tspcControlGroupItemSave(obj) : await tspcControlGroupItemModify(obj)
  if (data.flag) {
    ElMessage({
      type:'success',
      message: data.msg
    })
    emit('saveSuccess')
  } else {
    ElMessage({
      type:'error',
      message: data.msg
    })
  }
}
const dialogEditoShow = (num: number) => {
  if (!form.value.controlChartCode) {
    ElMessage({
      type:'error',
      message: '请先选择控制图'
    })
    return
  }
  // 弹窗请求参数
  let arr = ['P', 'NP', 'U', 'C']
  if (num === 1 && arr.includes(form.value.controlChartCode)) {
    dialogData.value.query = 2
  } else {
    dialogData.value.query = 1
  }
  console.log(form.value, 'form.valueform.value');
  
  form.value[`arr${num}`]?.map(async(v: any) => {
    v.arr = (await queryDictionaryData(v.controlItemCode, '')).values
  })

  dialogData.value.type = num
  dialogData.value.arr = form.value[`arr${num}`]
  dialogData.value.title = num === 0 ? '控制项层级信息设置' : '数据点层次信息设置'
  DialogEdito.value.dialogVisible = true
}
const close = () => {
  form.value = {}
}
const cancel = () => {
  dialogVisible.value = false
}
defineExpose({
  dialogVisible
})
</script>

<style lang='scss' scoped>
.title{
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #313233;
  border-bottom: 2px solid #F0F2F5;
  margin-right: 60px;
  margin-bottom: 10px;
  padding-bottom: 15px;
  padding-top: 55px;
}
.item{
  margin: 10px 0;
  .p{
    font-size: 14px;
    font-weight: 400;
    color: #EB715E;
    margin-top: 20px;
  }
}
.btn{
  margin-left: 10px;
}

.flex{
  .nums{
    width: 66px;
    position: relative;
    >>>input{
      padding-left: 16px;
    }
  }
  .left{
    border: none
  }
}

.box3{
  margin-top: 50px;
  .upchart{
    
    .left::before{
      content: "上控制限";
      position: absolute;
      top: -30px;
      left: 6px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #939599;
    }
    .center::before{
      content: "目标值";
      position: absolute;
      top: -30px;
      left: 6px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #939599;
    }
    .right::before{
      content: "下控制限";
      position: absolute;
      top: -30px;
      left: 6px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #939599;
    }
  }
}

//@import url()
.dialog ::v-deep(.el-dialog__header){
  background: #fff;
  border-radius: 0;
  padding-top: 100px;
  border-bottom: 1px solid #E1E5EB;
  margin-bottom: 40px;
  
}
.dialog ::v-deep(.el-dialog__headerbtn){
  top: 74px;
  right: 370px;
  font-size: var(--el-message-close-size,24px)

}
.dialog ::v-deep(.el-dialog__title){
  color: #626466 !important;
}
.dialog ::v-deep(.el-dialog__close){
  color: #626466 !important;
}
.dialog ::v-deep(.el-dialog){
  height: 100vh;
  border-radius: 0;
  padding: 0 340px;
}
.dialog ::v-deep(.section_option) {
  margin-top: 100px;
}
</style>
