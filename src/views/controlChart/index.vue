<!--
 * @Author: liuxinyi-yuhang 1029301987@qq.com
 * @Date: 2022-05-16 14:48:26
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @LastEditTime: 2022-05-20 13:38:41
 * @FilePath: \spc-web-admin\src\views\controlChart\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-row :gutter="20" @click.stop.native="closeBox1">
    <el-col :span="5" class="tree-style">
        <div class="custom-tree-container">
          <div class="block">
            <el-tree
              ref="treeRef"
              :data="dataTree"
              node-key="id"
              :expand-on-click-node="true"
              :filter-node-method="filterNode"
              @node-click="nodeClick"
              class="treee"
              
            >
              <template #default="{ node, data }">
                <div
                  @click="handClick(data)"
                  class="custom-tree-node father"
                >
                  <div style="display: flex; flex: 1; width: 0">
                    <div>
                      <el-icon ><folder /></el-icon>
                    </div>
                    <div
                      style="
                        margin-left: 6px;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                      "
                      :title="data.datasetName"
                      >{{ data.groupName }}</div
                    >
                  </div>
                  <div class="child" >
                      <div class="el-dropdown-link" @click.stop>
                        <el-button
                          :icon="MoreFilled"
                          type="text"
                          @click="addFolderWithType(data, $event)"
                        />
                      </div>
                  </div>

                </div>
              </template>
            </el-tree>
          </div>
        </div>
        <div class="box1" v-show="box1Show">
          <p @click="changeTree('新增')">新增</p>
          <p @click="changeTree('修改')">修改</p>
          <p>删除</p>
        </div>
    </el-col>
    <el-col :span="19" v-show="rightData">
      <div class='control-main'>
        <el-button @click="showAdd" type="primary" :icon="Plus" class="btnadd">新增</el-button>
        <nTable 
          ref="indexTable"
          :tableConfig="modelTableConfig"
          style="margin-top: 3px"
          border>
        </nTable>
      </div>
    </el-col>
    <add ref="Add" @saveSuccess="saveSuccess" :title="addTitle" :addData="addData" />
    <TreeComponent ref="treecomponent" :title="title" :NodeData="NodeData" @queryList="queryList"></TreeComponent>
  </el-row>
</template>

<script lang="ts" setup>
import { reactive, toRefs, ref, onMounted, inject, watch , provide, readonly} from "vue";
import { ElMessage } from "element-plus";
import add from './components/add.vue'
import nTable from "/@/components/nTable/index.vue";
import TreeComponent from './components/TreeComponent.vue'
import useCurrentInstance from "/@/utils/useCurrentInstance.ts"
import type { ElTree } from 'element-plus'
import { Search, Plus, Delete, MoreFilled} from "@element-plus/icons-vue";
import { tSpcControlGroupAjaxList, TSpcControlGroupItemAjaxList } from "/@/api/controlChart/index.ts"


const filterText = ref('')
const treeRef = ref()
const { proxy } = useCurrentInstance()
const Add: any = ref(null)
const treecomponent: any = ref(null)
const box1Show: any= ref(false)
const dataTree: any = ref([
  {
    groupName: '控制组列表',
    id: "0",
    type: 'root',
    children: []
  }
])
const NodeData: any = ref(null)
const indexTable: any = ref(null)

const title= ref<string>('')
const addTitle = ref<string>('')
const addData = ref<object>({})

const rightData = ref<any>(null)
provide('rightData', readonly(rightData))
const  modelTableConfig = reactive({
  url: TSpcControlGroupItemAjaxList(),
  height: "70vh",
  param: {scpControlGroupId: rightData.value?.id},
  //表格表头
  columns: [
    {
      prop: "controlChartConfigCode",
      label: '编码',
      minWidth: 200
    },
    {
      prop: "inspcationCode",
      label: '检测项目'
    },
    {
      prop: "controlChartCode",
      label:'图表'
    },
    {
      prop: "sampleSize",
      label: '样本容量'
    },
     {
      prop: "usl",
      label: '规格上限'
    },
     {
      prop: "target",
      label: '目标值'
    },
     {
      prop: "lsl",
      label: '规格下限'
    },
    {
      prop: "itemDecRuleConfigList",
      label: '判异规则',
      minWidth: 200,
      formatter(row: any, column: any, cellValue: any, index: any) {
        return (row.itemDecRuleConfigList.map((v: any) => {
          return v.discriminationRuleCode
        })).join(",")
      }
    },
    {
      prop: "editUserId",
      label: '更新用户'
    }
  ], //操作按钮列表
  options: [
    {
      type: "warning",
      label: '编辑',
      icon:'edit',
      click: (index: any, row: any) => {
        addTitle.value = '编辑'
        Add.value.dialogVisible = true
        addData.value = row
        // paramsSetChildEdits.value.paramsDataForm = { ...row };
        // paramsSetChildEdits.value.dialogVisible = true;
      },
      show:'-100',
      perms: "model_edit"
    },
    {
      type: "warning",
      label: '查看',
      icon:'edit',
      click: (index: any, row: any) => {
        // paramsSetChildEdits.value.paramsDataForm = { ...row };
        // paramsSetChildEdits.value.dialogVisible = true;
      },
      show:'-100',
      perms: "model_edit"
    },
    {
      type: "warning",
      label: '查看',
      icon:'edit',
      click: (index: any, row: any) => {
        // paramsSetChildEdits.value.paramsDataForm = { ...row };
        // paramsSetChildEdits.value.dialogVisible = true;
      },
      show:'-100',
      perms: "model_edit"
    },
    {
      type: "warning",
      label: '删除',
      icon:'delete',
      click: (index: any, row: any) => {
        // paramsSetChildEdits.value.paramsDataForm = { ...row };
        // paramsSetChildEdits.value.dialogVisible = true;
      },
      show:'-100',
      perms: "model_edit"
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
onMounted(() => {
  getList()
})
// const edit = () => {}
const closeBox1 = () => {
  box1Show.value = false
}
const showAdd = () => {
  if (rightData.value.children?.length > 0) {
    ElMessage({
      type: 'error',
      message: '请选择最底层控制组'
    })
    return
  }
  addTitle.value = '新增'
  Add.value.dialogVisible = true
}
const getList = async () => {
  tSpcControlGroupAjaxList().then((res: any) => {
    const arr = [{
      groupName: '控制组列表',
      id: "0",
      type: 'root',
      children: [...res.data]
    }]
    dataTree.value = arr
  })
}

const changeTree = (type: string) => {
  if ((type === '修改' || type === '删除') && NodeData.value.id === '0') {
    ElMessage({
      type: 'error',
      message: '无法改动根列表'
    })
    return
  }
  if (type === '新增') {
    NodeData.value.groupName = ''
    NodeData.value.groupCode = ''
    NodeData.value.description = ''
  }
  treecomponent.value.dialogVisible = true
  title.value = type
}

const nodeClick = () => {
  box1Show.value = false
}

const addFolderWithType = (data: any, event: any) => {
  NodeData.value = JSON.parse(JSON.stringify(data))
  let box1: any = document.querySelector('.box1')
  box1.style.top = event.clientY - 90 + 'px'
  box1.style.left = event.clientX - 340 + 'px'
  box1Show.value = true
}

const queryList = () => {
  getList()
  treecomponent.value.dialogVisible = false
}
const handClick = (data: object) => {
  rightData.value = data
  modelTableConfig.param.scpControlGroupId = rightData.value?.id
  indexTable.value.reload();
}

const filterNode = (value: any, dataTree: any) => {
  if (!value) return true
  return dataTree.label.includes(value)
}
const saveSuccess = () => {
  Add.value.dialogVisible = false
  indexTable.value.reload();
}
watch(filterText, (val) => {
  treeRef.value!.filter(val)
})
</script>

<style lang='scss' scoped>
//@import url()
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
}

.btnadd{
  margin: 20px;
}
.custom-tree-node-list {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  
}

.father .child {
  /*display: none;*/
  visibility: hidden;
}

.father:hover .child {
  /*display: inline;*/
  visibility: visible;
}
.box1{
  position: absolute;
  padding: 8px;
  background: #FFFFFF;
  box-shadow: 0px 2px 12px 0px rgba(9, 31, 65, 0.12);
  border-radius: 8px;
  right: 0;
  top: 30px;
  z-index: 999;
  width: 100px;
  p{
    width: 84px;
    height: 40px;
    line-height: 1px;
    text-align: center;
    line-height: 40px;
  }
  p:hover{
    width: 84px;
    height: 40px;
    background: #F0F4FA;
    border-radius: 8px;
  }
}
.tree-style {
  padding: 10px !important;
  height: 100%;
  overflow-y: auto;
  background-color: #ffffff;
  position: relative;
}
.control-main{
  background-color: #ffffff;
  height: 100%;
}

.el-row{
  padding: 0 10px !important;
  position: absolute;
  left: 10px;
  top: 10px;
  bottom: 10px;
}

</style>