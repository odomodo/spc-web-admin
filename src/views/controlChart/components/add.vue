<template>
  <div>
    <div  class='dialog'>
      <el-dialog
        :title="`控制图设置(${title})`"
        v-model="dialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @close="close"
        width="70%"
        @open="open"
      >
        <el-form :model="form" label-width="120px" :rules="rules" ref="ruleFormRef">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="控制图类型" prop="controlChartCode">
                <el-select v-model="form.controlChartCode" placeholder="请选择" @change="handleChange(form.controlChartCode)" :disabled="title === '编辑'">
                  <el-option  v-for="v in chartOptions" :label="v.valueName" :value="v.valueCode" :key="v.valueCode" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="检验项目" prop="inspcationCode">
                <el-select v-model="form.inspcationCode" placeholder="请选择" :disabled="title === '编辑'">
                  <el-option v-for="v in itemOptions" :label="v.inspectionName" :value="v.inspcationCode" :key="v.inspcationCode" />
                </el-select>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="8">
              <el-form-item label="邮件提醒设置" prop="inspcationCode">
                <el-button class="btn" @click="showEmail">设置</el-button>
              </el-form-item>
            </el-col> -->
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12" class="box1 box">
              <p class="title">基本信息</p>
              <div>
                <el-col :span="24" class="item">
                  <el-form-item label="规格上限" prop="usl">
                    <el-input v-model="form.usl" :disabled="NPC" />
                  </el-form-item>
                </el-col>
                <el-col :span="24" class="item">
                  <el-form-item label="目标值" prop="target">
                    <el-input v-model="form.target" :disabled="NPC" />
                  </el-form-item>
                </el-col>
                <el-col :span="24" class="item">
                  <el-form-item label="规格下限" prop="lsl">
                    <el-input v-model="form.lsl" :disabled="NPC" />
                  </el-form-item>
                </el-col>
                <el-col :span="24" class="item">
                  <el-form-item label="样本容量" prop="sampleSize">
                    <el-select v-model="form.sampleSize" :disabled="sampleSizeSelect" v-if="sampleSizeSelectOrInput">
                      <div v-for="i in 25" :key="i" >
                        <el-option :value="i" v-if="i > 1">{{i}}</el-option>
                      </div>
                    </el-select>
                    <el-input-number v-model="form.sampleSize"  v-else :disabled="sampleSizeSelect"/>
                  </el-form-item>
                </el-col>
                <el-col :span="24" class="item">
                  <el-form-item label="小数位数" prop="decimalPlaces">
                    <el-select v-model="form.decimalPlaces" :disabled="decimalPlacesDisable" >
                      <el-option v-for="i in 5" :key="i" :value="i">{{i}}</el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </div>
            </el-col>
            <el-col :span="12" class="box2 box">
              <p class="title">控制图信息</p>
              <div>
                <el-col :span="24" class="item">
                  <el-form-item  label="判异规则" prop="rules">
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
        <section class="section_option df jcfe">
          <el-button class="dialogbtn"  @click="cancel" perms="cancle" round>取消</el-button>
          <el-button class="dialogbtn" type="primary" @click="editSave(ruleFormRef)" perms="save" round >确定</el-button>
        </section>
      </el-dialog>
    </div>
    <emailDialog ref="EmailDialog"></emailDialog>
    <editoRule ref="EditoRule" @queryList="queryList" :editoData="editoData"></editoRule>
    <dialogEdito ref="DialogEdito" :dialogData="dialogData" @queryList="queryList1"></dialogEdito>
    
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, ref, onMounted, inject, defineEmits, watch } from "vue";
import { clearFormData, hasChinase } from "/@/utils/jsOptions.ts";
import { ElMessage } from "element-plus";
import { useStore } from '/@/store/index';
import { queryDictionaryData } from "/@/api/admin/paramsSet";
import { tspcInspectionFindList, tspcControlGroupItemSave, tspcControlGroupItemModify } from "/@/api/controlChart/index.ts";
import useCurrentInstance from "/@/utils/useCurrentInstance.ts"
import editoRule from "./editoRule.vue"
import dialogEdito from "./dialogEdito.vue"
import emailDialog from "./emailDialog.vue"

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
const ruleFormRef: any = ref(null)
const EmailDialog: any = ref(null)
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
const sampleSizeSelect = ref(false) // 样本容量的disable
const sampleSizeSelectOrInput = ref(false) // 样本容量选择还是输入 false: 输入， true: 选择
const decimalPlacesDisable = ref(false) // 小数位数的disable

const NPC = ref(false) // true:规格上限、规格下限、目标值、小数位不能选择, true: 相反

const editoData: any = ref({})
const dialogData: any = ref({})
const rules = ref<any>({
  controlChartCode: [
    { required: true, message: '请选择控制图', trigger: 'blur' },
  ],
  rules: [
    { required: true, message: '请选择判异规则', trigger: 'blur' },
  ],
  inspcationCode: [
    { required: true, message: '请选择检测项目', trigger: 'blur' },
  ],
  usl: [
    { required: true, message: '请输入', trigger: 'blur' },
    { validator: hasChinase, message: '不能包含中文字符', trigger: 'blur' },
  ],
  target: [
    { required: true, message: '请输入', trigger: 'blur' },
    { validator: hasChinase, message: '不能包含中文字符', trigger: 'blur' },
  ],
  lsl: [
    { required: true, message: '请输入', trigger: 'blur' },
    { validator: hasChinase, message: '不能包含中文字符', trigger: 'blur' },
  ],
})
const handleChange = (data: string) => {
  form.value.sampleSize = ''
  form.value.decimalPlaces = ''
  // 现在nP和C图时，检测项目必须填写，样本容量是输入值，不支持选择，必填，规格上限、规格下限、目标值、小数位不能选择、变灰色（只读）；
  if (data === 'NP' || data === 'C' ) {
    sampleSizeSelectOrInput.value = false
    rulesChange(true, ['sampleSize'])
    sampleSizeSelect.value = false
    selectNPC(true)
  } else {
    selectNPC(false)
  }
  // 选择Xbar-R,Xbar-S,中位数全距图时，检测项目、规格上限、规格下限、目标值，小数位必须填写，样本容量必须填写：2-25 不能选择1；
  if (data === 'Xbar_R' || data === 'Xbar_S' || data === 'X_R') {
    sampleSizeSelectOrInput.value = true
    rulesChange(true, ['sampleSize', 'decimalPlaces'])
    sampleSizeSelect.value = false
  }
  // 选择X-MR图时，检测项目，规格上限、规格下限、目标值，小数位必须填写，样本容量默认是1，必须是1，不允许修改；
  if (data === 'X_MR') {
    sampleSizeSelect.value = true
    form.value.sampleSize = 1
    rulesChange(true, ['decimalPlaces'])
  }
  // 选择P和U图时，检测项目必须填写，规格上限、规格下限、目标值、样本容量和小数位不能选择，变灰色（只读）;
  if (data === 'P' || data === 'U' ) {
    sampleSizeSelect.value = true
    form.value.decimalPlaces = ''
    form.value.sampleSize = ''
    rulesChange(false, ['decimalPlaces', 'sampleSize'])
    decimalPlacesDisable.value = true
  }

}

const selectNPC = (Bool: Boolean) => {
  if (Bool) {
    NPC.value = true
    decimalPlacesDisable.value = true
    rulesChange(false, ['usl', 'lsl', 'target', 'decimalPlaces'])
  } else {
    NPC.value = false
    decimalPlacesDisable.value = false
    rulesChange(true, ['usl', 'lsl', 'target', 'decimalPlaces'])
  }
}
const open = () => {
  if (props.title !== '新增') {
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
  } else {
    
  }
}

// 选择判异规则
const showEditoRule = () => {
  if (!form.value.controlChartCode) {
    ElMessage({
      type:'error',
      message: '请先选择控制图'
    })
    return
  }
  let arr = ['P', 'NP', 'U', 'C']
  if (arr.includes(form.value.controlChartCode)) {
    editoData.value.type = 2
  } else {
    editoData.value.type = 1
  }

  EditoRule.value.dialogVisible = true
  editoData.value.arr = form.value.itemDecRuleConfigList
}

// 显示邮件弹窗
const showEmail = () => {
  EmailDialog.value.dialogVisible = true
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
const editSave = async (formEl: any) => {
  if (!formEl) return
  await formEl.validate(async(valid: any, fields: any) => {
    if (valid) {
      console.log(...form.value?.arr0);
      console.log(...form.value?.arr1);
      const obj = {
        ...form.value,
        scpControlGroupId: rightData.value.id,
        tSpcControlGroupItemHierarchyList: [...form.value?.arr0, ...form.value?.arr1]}
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
    } else {
      console.log('error submit!',valid, fields)
    }
  })
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
  
  form.value[`arr${num}`]?.map(async(v: any) => {
    v.arr = (await queryDictionaryData(v.controlItemCode, '')).values
  })

  dialogData.value.type = num
  dialogData.value.arr = form.value[`arr${num}`]
  dialogData.value.title = num === 0 ? '控制项层级信息设置' : '数据点层次信息设置'
  DialogEdito.value.dialogVisible = true
}
const close = () => {
  form.value = {
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
  }
  sampleSizeSelect.value = false
  decimalPlacesDisable.value = false
  
}
const cancel = () => {
  dialogVisible.value = false
}

/**
 * type (Boolean): true 添加， false 删除
 * value (String): 规则变更item
 */
const rulesChange = (type: Boolean, value: any) => {
  value.map((v: any) => {
    if (type) {
      rules.value[v] = [
        { required: true, message: '请输入', trigger: 'blur' },
        { validator: hasChinase, message: '不能包含中文字符', trigger: 'blur' },
      ]
    } else {
      delete rules.value[v]
    }
  })
}
onMounted(async () => {
 chartOptions.value = (await queryDictionaryData("control_chart_type", "")).values
 itemOptions.value = (await tspcInspectionFindList()).data
})
defineExpose({
  dialogVisible,
  sampleSizeSelect,
  decimalPlacesDisable
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
    ::v-deepinput{
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
</style>
