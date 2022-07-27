<!--
 * @Author: liuxinyi-yuhang 1029301987@qq.com
 * @Date: 2022-05-16 14:48:26
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @LastEditTime: 2022-07-26 10:19:11
 * @FilePath: \spc-web-admin\src\views\controlChart\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div  @click.stop.native="closeBox1" >
    <div class="df">
      <div  class="tree-style">
        <div class="custom-tree-container">
          <div class="block">
            <p class="title">控制组列表</p>
            <el-tree
              ref="treeRef"
              :data="dataTree"
              node-key="id"
              :expand-on-click-node="true"
              :filter-node-method="filterNode"
              :highlight-current="true"
              @node-click="nodeClick"
              class="treee"
            >
              <template #default="{ node, data }">
                <div @click="handClick(data)" class="custom-tree-node father">
                  <div style="display: flex; flex: 1; width: 0">
                    <div>
                      <!-- <el-icon ><folder /></el-icon> -->
                    </div>
                    <div
                      style="margin-left: 6px; white-space: nowrap; text-overflow: ellipsis"
                      :title="data.datasetName"
                    >
                      {{ data.groupName }}
                    </div>
                  </div>
                  <div class="child">
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
          <p @click="changeTree('删除')">删除</p>
        </div>
      </div>
      <div class="tablebox">
        <div class="control-main"  v-show="rightData">
        <div class="df jcsb aifs">
          <div class="df ">
            <el-form-item label="图形编码" label-width="80px" class="mr15">
              <el-input v-model="form.controlChartConfigCode"></el-input>
            </el-form-item>
            <el-form-item label="检测项目" label-width="80px" class="mr15">
              <el-select v-model="form.inspcationCode" placeholder="请选择" >
                <el-option v-for="v in itemOptions" :label="v.inspectionName" :value="v.inspcationCode" :key="v.inspcationCode" />
              </el-select>
            </el-form-item>
            <el-form-item label="图表" label-width="45px" class="mr10">
              <el-select v-model="form.controlChartCode" placeholder="请选择">
                <el-option  v-for="v in chartOptions" :label="v.valueName" :value="v.valueCode" :key="v.valueCode" />
              </el-select>
            </el-form-item>
            <div class="df">
              <div class="spc-button mr5"  @click="handClick">
                <svg-icon iconName="search_icon" tipLable="搜索" iconSize="10"></svg-icon>
              </div>
              <div class="spc-button" @click="reset" >
                <svg-icon iconName="重置_icon" tipLable="重置" iconSize="10"></svg-icon>
              </div>
            </div>
          </div>
          <el-button type="primary" @click="showAdd"><i><svg-icon iconName="新增_icon" tipLable="新增" iconSize="10" style="margin-right: 5px;"></svg-icon></i> 新增</el-button>
        </div>
          <nTable
            ref="indexTable"
            class="indexTable"
            :tableConfig="modelTableConfig"
            style="margin-top: 3px"
            border
          >
          </nTable>
        </div>
      </div>
    </div>
    <add ref="Add" @saveSuccess="saveSuccess" :title="addTitle" :addData="addData" />
    <TreeComponent
      ref="treecomponent"
      :title="title"
      :NodeData="NodeData"
      @queryList="queryList"
    ></TreeComponent>
  </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs, ref, onMounted, inject, watch, provide, readonly } from "vue";
import { ElMessage } from "element-plus";
import add from "./components/add.vue";
import nTable from "/@/components/nTable/index.vue";
import TreeComponent from "./components/TreeComponent.vue";
import useCurrentInstance from "/@/utils/useCurrentInstance.ts";
import type { ElTree } from "element-plus";
import { Search, Plus, Delete, MoreFilled } from "@element-plus/icons-vue";
import {
  tSpcControlGroupAjaxList,
  TSpcControlGroupItemAjaxList,
  TSpcControlGroupdelete,
  TSpcControlGroupItemdelete,
  tspcInspectionFindList,
} from "/@/api/controlChart/index.ts";
import { useRouter } from "vue-router";
import { useStore } from "/@/store/index";
import { queryDictionaryData } from "/@/api/admin/paramsSet";
const router = useRouter();
const form:any = ref({})
const filterText = ref("");
const treeRef = ref();
const { proxy } = useCurrentInstance();
const Add: any = ref(null);
const treecomponent: any = ref(null);
const store = useStore();
const box1Show: any = ref(false);
const dataTree: any = ref([
  {
    groupName: "宇航SPC系统",
    id: "0",
    type: "root",
    children: [],
  },
]);
const NodeData: any = ref(null);
const baseNodeData: any = ref(null);
const indexTable: any = ref(null);
const chartOptions: any = ref([]);
const itemOptions: any = ref([]);
const title = ref<string>("");
const addTitle = ref<string>("");
const addData = ref<object>({});

const rightData = ref<any>(null);
provide("rightData", readonly(rightData));
const modelTableConfig = reactive({
  url: TSpcControlGroupItemAjaxList(),
  param: { scpControlGroupId: rightData.value?.id },
  //表格表头
  columns: [
    {
      prop: "controlChartConfigCode",
      label: "编码",
      minWidth: 200,
    },
    {
      prop: "inspcationCode",
      label: "检测项目",
      formatter: (row: any, column: any, cellValue: any, index: any) => {
        let str = "";
        itemOptions.value?.map((v: any) => {
          if (v.inspcationCode === cellValue) {
            str = v.inspectionName;
          }
        });
        return str;
      },
    },
    {
      prop: "controlChartCode",
      label: "图表",
      formatter: (row: any, column: any, cellValue: any, index: any) => {
        let str = "";
        chartOptions.value?.map((v: any) => {
          if (v.valueCode === cellValue) {
            str = v.valueName;
          }
        });
        return str;
      },
    },
    {
      prop: "sampleSize",
      label: "样本容量",
    },
    {
      prop: "usl",
      label: "规格上限",
    },
    {
      prop: "target",
      label: "目标值",
    },
    {
      prop: "lsl",
      label: "规格下限",
    },
    {
      prop: "itemDecRuleConfigList",
      label: "判异规则",
      minWidth: 200,
      formatter(row: any, column: any, cellValue: any, index: any) {
        return row.itemDecRuleConfigList
          .map((v: any) => {
            return v.discriminationRuleCode;
          })
          .join(",");
      },
    },
    {
      prop: "editUserId",
      label: "更新用户",
    },
  ], //操作按钮列表
  options: [
    {
      type: "warning",
      label: "编辑",
      icon: "edit",
      click: (index: any, row: any) => {
        addTitle.value = "编辑";
        Add.value.dialogVisible = true;
        addData.value = JSON.parse(JSON.stringify(row));
        Add.value.sampleSizeSelect = true;
        Add.value.decimalPlacesDisable = true;
      },
      perms: "model_edit",
    },
    {
      type: "warning",
      label: "查看",
      icon: "show",
      click: (index: any, row: any) => {
          let routeUrl = router.resolve({
            path: "/inputDataShow/" + row.id,
          });
          window.open(routeUrl.href, "_blank");
        // paramsSetChildEdits.value.paramsDataForm = { ...row };
        // paramsSetChildEdits.value.dialogVisible = true;
      },
      perms: "model_edit",
    },
    {
      type: "warning",
      icon: "inputData",
      tipLable: "数据录入",
      click: (index: any, row: any) => {
        if (["X_MR", "Xbar_S", "MR", "Xbar_R"].includes(row.controlChartCode)) {
          let routeUrl = router.resolve({
            path: "/metrological/" + row.id,
          });
          window.open(routeUrl.href, "_blank");
        } else {
          let routeUrl = router.resolve({
            path: "/counting/" + row.id,
          });
          window.open(routeUrl.href, "_blank");
        }
        // paramsSetChildEdits.value.paramsDataForm = { ...row };
        // paramsSetChildEdits.value.dialogVisible = true;
      },
      perms: "model_edit",
    },
    {
      type: "warning",
      label: "删除",
      icon: "delete",
      click: async (index: any, row: any) => {
        const res = await TSpcControlGroupItemdelete(row.id);
        if (res.code === 0) {
          ElMessage({
            type: "success",
            message: res.msg,
          });
          handClick(rightData.value);
        } else {
          ElMessage({
            type: "error",
            message: res.msg,
          });
        }
      },
      perms: "model_edit",
    },
  ],
  //操作按钮样式
  operationColumn: {
    // 样式
    style: {
      width: '200px'
    },
    // 属性
    attr: {},
  },
  showOperation: true, //是否显示操作字段
  // showChoose: true, //是否显示选择框， 默认不显示
  singleSelect: true,
  showBatchDelete: false, //是否批量删除
});
onMounted(async () => {
  getList();
  chartOptions.value = (await queryDictionaryData("control_chart_type", "")).values || [];
  itemOptions.value = (await tspcInspectionFindList()).data || [];
});
const reset = () => {
  form.value = {}
  indexTable.value.find({
    scpControlGroupId: rightData.value?.id
  }, true);
}
// const edit = () => {}
const closeBox1 = () => {
  box1Show.value = false;
};
const showAdd = () => {
  if (rightData.value.children?.length > 0) {
    ElMessage({
      type: "error",
      message: "请选择最底层控制组",
    });
    return;
  }
  addData.value = {};
  addTitle.value = "新增";
  Add.value.dialogVisible = true;
};
const getList = async () => {
  tSpcControlGroupAjaxList().then((res: any) => {
    const arr = [
      {
        groupName: "宇航SPC系统",
        id: "0",
        type: "root",
        children: [...res.data],
      },
    ];
    dataTree.value = arr;
  });
};

const changeTree = async (type: string) => {
  if ((type === "修改" || type === "删除") && NodeData.value.id === "0") {
    ElMessage({
      type: "error",
      message: "无法改动根列表",
    });
    return;
  }
  if (type === "新增") {
    NodeData.value.groupName = "";
    NodeData.value.groupCode = "";
    NodeData.value.description = "";
  }
  if (type === "删除") {
    const res = await TSpcControlGroupdelete(NodeData.value.id);
    if (res.code === 0) {
      ElMessage({
        type: "success",
        message: res.msg,
      });
      recursionTree(dataTree.value, NodeData.value, (v: any, i: any) => {
        v.children.splice(i, 1);
      });
    } else {
      ElMessage({
        type: "error",
        message: res.msg,
      });
    }
  } else {
    treecomponent.value.dialogVisible = true;
    title.value = type;
  }
};

const nodeClick = () => {
  box1Show.value = false;
};

const addFolderWithType = (data: any, event: any) => {
  baseNodeData.value = data;
  NodeData.value = JSON.parse(JSON.stringify(data));
  let box1: any = document.querySelector(".box1");
  box1.style.top = event.clientY - 120 + "px";
  box1.style.left = event.clientX - 340 + "px";
  box1Show.value = true;
};

const queryList = (data: any) => {
  treecomponent.value.dialogVisible = false;
  console.log(baseNodeData.value, "baseNodeData.value");
  if (title.value === "新增") {
    baseNodeData.value.children = baseNodeData.value.children || [];
    delete data.data?.children;
    baseNodeData.value.children.push(data.data);
  } else {
    recursionTree(dataTree.value, data.data, (v: any, i: any) => {
      v.children[i] = data.data;
    });
  }
};
const handClick = (data?: any) => {
  data.id && (rightData.value = data);
  const param = {
    ...form.value,
    scpControlGroupId: rightData.value?.id
  };
  indexTable.value.find(param);
};

const filterNode = (value: any, dataTree: any) => {
  if (!value) return true;
  return dataTree.label.includes(value);
};
const saveSuccess = () => {
  Add.value.dialogVisible = false;
  indexTable.value.reload();
};

// 递归树形数据父节点，返回
const recursionTree = (arr: any, data: any, fn?: any) => {
  arr?.map((v: any) => {
    if (v.id === data.parentId) {
      v.children.map((j: any, i: any) => {
        if (j.id === data.id) {
          fn(v, i);
        }
      });
    } else {
      if (v.children && v.children.length > 0) {
        recursionTree(v.children, data, fn);
      }
    }
  });
};
watch(filterText, (val) => {
  treeRef.value!.filter(val);
});
</script>

<style lang="scss" scoped>
//@import url()
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
}

.btnadd {
  margin-bottom: 20px;
  margin-right: 14px;
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
.box1 {
  position: absolute;
  padding: 10px;
  background: #ffffff;
  width: 100%;
  box-shadow: 0px 2px 12px 0px rgba(9, 31, 65, 0.12);
  border-radius: 8px;
  right: 0;
  top: 30px;
  z-index: 999;
  width: 100px;
  p {
    height: 40px;
    line-height: 1px;
    text-align: center;
    line-height: 40px;
  }
  p:hover {
    height: 40px;
    background: #f0f4fa;
    border-radius: 8px;
  }
}
.tree-style {
  height: calc(100vh - 53px - 63px);
  margin-right: 20px;
  overflow-y: auto;
  background-color: #ffffff;
  position: relative;
  width: 320px;
  flex-shrink: 0;
  border: 1px solid #F0F2F5;
  border-radius: 12px 12px 0px 0px;
  line-height: 20px;
  .title{
    height: 52px;
    line-height: 52px;
    background: #FFFFFF;
    border-bottom: 1px solid #F0F2F5;
    text-align: center;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #313233;
  }
  .treee{
    padding:0 20px;
    margin-top: 30px;
    box-sizing: border-box;
  }
  ::v-deep(.el-tree-node__content){
    height: 36px !important;
    margin-bottom: 4px;
  }
}
.tablebox{
  flex: auto;
  width: 900px;
}
.control-main {
  background-color: #ffffff;
  height: 100%;
  border: 1px solid #F0F2F5;
  padding: 20px;
  border-radius: 12px;
  box-sizing: border-box;
}

.el-row {
  padding: 0 10px !important;
  position: absolute;
  left: 10px;
  top: 10px;
  bottom: 10px;
}
</style>
