<template>
  <div class=''>
    <el-dialog
      :title="`控制图设置(${title})`"
      v-model="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="close"
      width="70%"
    >
      <el-form :model="form" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="控制图类型">
              <el-select v-model="form.controlChartCode" placeholder="请选择">
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
                   <el-input-number v-model="form.sampleSize" :min="1" :max="10" @change="handleChange" />
                </el-form-item>
              </el-col>
              <el-col :span="24" class="item">
                <el-form-item label="小数位数" proo="decimalPlaces">
                  <el-input-number v-model="form.decimalPlaces" :min="1" :max="10" @change="handleChange" />
                </el-form-item>
              </el-col>
            </div>
          </el-col>
          <el-col :span="12" class="box2 box">
            <p class="title">基本信息</p>
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
                    <!-- <el-input v-model="form.name" disabled /> -->
                    <el-button class="btn">设置</el-button>
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
                    <el-button class="btn">计算</el-button>
                    <el-button class="btn">清除</el-button>
                  </div>
                </el-form-item>
              </el-col>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <section class="section_option flex-c-c">
        <el-button type="primary" @click="editSave" perms="save"
          >确定</el-button
        >
        <el-button type="primary" @click="cancel" perms="cancle">取消</el-button>
      </section>
    </el-dialog>
    <editoRule ref="EditoRule" @queryList="queryList" :editoData="editoData"></editoRule>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, ref, onMounted, inject, defineEmits, watch } from "vue";
import { ElMessage } from "element-plus";
import { useStore } from '/@/store/index';
import { queryDictionaryData } from "/@/api/admin/paramsSet";
import { tspcInspectionFindList, tspcControlGroupItemSave } from "/@/api/controlChart/index.ts";
import useCurrentInstance from "/@/utils/useCurrentInstance.ts"
import editoRule from "./editoRule.vue"
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
const rightData: any = inject('rightData')
const form = ref<any>({
  controlChartCode:'',
  inspcationCode: '',
  usl: '',
  target: '',
  lsl: '',
  sampleSize: '',
  decimalPlaces: '',
  uclX: '',
  clX: '',
  lclX: '',
  uclR: '',
  clR: '',
  lclR: '',
  rules: ''
})
const store = useStore();
const editoData: any = ref(null)
const handleChange = () => {}
onMounted(async () => {
 chartOptions.value = (await queryDictionaryData("control_chart_type", "")).values
 itemOptions.value = (await tspcInspectionFindList()).data
})
watch(
  () => props.addData,
  (ndata) => {
    form.value = ndata
    form.value.rules = (ndata.itemDecRuleConfigList?.map((v: any) => {
      return v.discriminationRuleCode
    }))?.join(',')
  }
)
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
const editSave = async () => {
  const obj = {...form.value, scpControlGroupId: rightData.value.id}
  const data = await tspcControlGroupItemSave(obj)
  if (data.flag) {
        ElMessage({
          type:'success',
          message: '新增成功'
        })
        emit('saveSuccess')
  } else {
    ElMessage({
      type:'error',
      message: data.msg
    })
  }
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

</style>