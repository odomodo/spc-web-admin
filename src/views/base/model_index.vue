<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: 刘云辉
 * @Date: 2021-04-19 10:35:02
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @LastEditTime: 2022-05-13 10:46:53
-->
<template>
  <!-- 工步管理 -->
  <div class="modelManagement">
    <div class="select_group flex-c">
      <div class="select3 flex-c" style="margin-right: 10px">
        <label for="user" style="width:80px;">模型名称:</label>
        <el-input
          id="user"
          v-model="queryForm.modelName"
          size="small"
        ></el-input>
      </div>
      <div class="select3 flex-c" style="margin-right: 10px">
        <label for="user" style="width:40px;">状态:</label>
        <el-select style="width: 100%" v-model="queryForm.dataState" size="small">
          <el-option
            :label="item.keyName"
            :value="item.keyValue"
            v-for="item in dataStateList"
            :key="item.keyValue"
          >
          </el-option>
        </el-select>
      </div>
      <div class="select3 flex-c">
        <div class="spc-button" @click="queryList"><svg-icon  iconName="search"></svg-icon></div>
        <div class="spc-button" @click="reset"><svg-icon  iconName="refresh"></svg-icon></div>

        <div class="button_group button_groups">
        <el-button
          color="#5781C1"
          :icon="Plus"
          size="small"
          @click="addNew"
          perms="model_add"
          >新增</el-button
        >
        <el-button
        color="#5781C1"
          plain
          :icon="Upload"
          size="small"
          @click="importExcel"
          perms="model_import"
          >导入</el-button
        >
        <el-button
        color="#5781C1"
          plain
          :icon="Download"
          size="small"
          @click="exportExcel"
          perms="model_export"
          >导出</el-button
        >
    </div>
      </div>
      
    </div>
    <!-- 按钮组 -->
    
    <!-- 新增弹窗 -->
    <modelAdd ref="modelAdds"></modelAdd>

    <!-- 修改弹窗 -->
    <modelEdit ref="modelEdits"></modelEdit>
    <!-- 表格 -->
    <n-table
      ref="indexTable"
      :tableConfig="modelTableConfig"
      style="margin-top: 3px"
      border
    >
    </n-table>
    <!-- 导入弹窗 -->
    <commonImport ref="commonImports" :title="title"  @queryList="queryList"></commonImport>
  </div>
</template>
<script setup lang="ts">
// 组件
import nTable from "/@/components/nTable/index.vue";
import modelAdd from "./model/model_add.vue";
import modelEdit from "./model/model_edit.vue";
import commonImport from "./model/common_import.vue";
// 方法
import { getModelListUrl, deleted ,changeDataState,deletewithReal} from "/@/api/base/model";
import { clearFormData } from "/@/utils/jsOptions";
import { formatDates } from "/@/utils/formatTime"
import { reactive, toRefs, ref, RendererElement, RendererNode, VNode} from 'vue'
import { Plus,Upload,Download } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { download } from "/@/utils/http/request";




const modelAdds = ref()
const modelEdits = ref()
const indexTable = ref()
const commonImports = ref()
const changeDataStateHandle = (index: any, row: { modelLevel: number | null; modelName: any; dataState: number; id: any; }) =>{
      if (row.modelLevel == 0 || row.modelLevel == null) {
        return ElMessage({ message: "工厂不能进行禁用", type: "error" });
      }
      let dataStateTemp=null;
      let modelName=row.modelName;
      if(row.dataState==0){
        dataStateTemp=1;
      }
      if(row.dataState==1){
        dataStateTemp=0;
      }
      let param={
        id:row.id,
        dataState:dataStateTemp
      }
      ElMessageBox.confirm("确定"+((dataStateTemp==1)?"禁用":"启用")+modelName+"?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res: any = await changeDataState(param);//是否要修改数据状态
          queryList();
          ElMessage({
            type: "success",
            message: res.msg
          });
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "已取消"
          });
        });
    }
// 修改
   const edit=(index: any, row: { modelLevel: number | null; })=> {
      if (row.modelLevel == 0 || row.modelLevel == null) {
        return ElMessage({ message: "工厂不能进行编辑", type: "error" });
      }
      modelEdits.value.modelDataForm = { ...row };
      modelEdits.value.dialogVisible = true;
    }
  // 删除
   const deleteds=(index: any, row: { modelLevel: number | null; id: any; })=> {
      if (row.modelLevel == 0 || row.modelLevel == null) {
        return ElMessage({ message: "工厂不能进行删除", type: "error" });
      }
      deleteOrEnable("确认删除？", { id: row.id, dataState: 1 });
    }
const state = reactive({
	title:"工厂模型",
      //
      // 查询条件
      queryForm: {
        modelName: null,
        dataState: 0,
      } as any,
      dataStateList: [
        { keyName: '全部', keyValue: 2 },
        { keyName: '启用', keyValue: 0 },
        { keyName: '禁用', keyValue: 1 }
      ],
      // 表格配置
      modelTableConfig: {
        url: getModelListUrl(),
        treeProps: { children: "modelVoList", hasChildren: false }, //树节点
        //表格表头
        columns: [
          {
            prop: "modelName",
            label: '模型名称',
            minWidth: 200
          },
          {
            prop: "description",
            label: '描述'
          },
          {
            prop: "modelLevel",
            label: '模型类型',
            formatter(row: any, column: any, cellValue: number, index: any) {
              if (cellValue == 0) {
                return "工厂";
              } else if (cellValue == 1) {
                return "车间";
              } else if (cellValue == 2) {
                return "产线";
              } else {
                return "工位";
              }
            }
          },
          // {
          //   prop: "modelName",
          //   label: "接口服务",
          //
          // },
          {
            prop: "modelCode",
            label:'模型编码'
          },
          // {
          //   prop: "principal",
          //   label: "负责人"
          // },
          {
            prop: "dataState",
            label: '状态',
            formatter(row: any, column: any, cellValue: number, index: any) {
              return cellValue == 0 ? "启用": "禁用";
            }
          },
          {
            prop: "addTime",
            label: '创建时间',
            minWidth: 200,
            formatter(row: any, column: any, cellValue: any, index: any) {
              return formatDates(cellValue);
            }
          },
          {
            prop: "addUserId",
            label: '创建人'
          },
          {
            prop: "editTime",
            label: '更新时间',
            minWidth: 200,
            formatter(row: any, column: any, cellValue: any, index: any) {
              return formatDates(cellValue);
            }
          },
          {
            prop: "editUserId",
            label: '更新人'
          }
        ], //操作按钮列表
        options: [
          {
            type: "warning",
            label: '编辑',
            icon:'edit',
            click: edit,
            show:'-100',
            perms: "model_edit"
          },
          {
            type: "danger",
            label: "dateState,"+'禁用'+","+'启用'+"",
            show:"-100",
            click: changeDataStateHandle,
            perms: "model_edit"
          },
          {
            type: "danger",
            label: '删除',
            icon:'delete',
            show:'0',
            click: deleteds,
            perms: "model_delete"
          }
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
      }
})
const {title,queryForm,dataStateList,modelTableConfig }=toRefs(state)
// 查询
    const queryList=async()=> {
      indexTable.value.find(state.queryForm);
    }
    // 新增
    const addNew=()=> {
      modelAdds.value.dialogVisible = true;
    }
 // 启用
   const enable=(index: any, row: { id: any; })=> {
      deleteOrEnable("确认启用?", { id: row.id, dataState: 0 });
    }
// 修改删除状态
   const deleteOrEnable=(tips: string | VNode<RendererNode, RendererElement, { [key: string]: any; }> | undefined, row: { id: any; dataState: number; })=> {
      ElMessageBox.confirm(tips, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          //const res = await deleted(row);//逻辑删除
          const res = await deletewithReal(row);//物理删除
          queryList();
         ElMessage({
            type: "success",
            message: res.msg
          });
        })
        .catch(() => {
          ElMessage({
            type: "info",
            message: "已取消"
          });
        });
    }

	const importExcel=()=>{
        commonImports.value.dialogVisible = true;
      }
    const exportExcel=async()=>{
       ElMessageBox.confirm("确定导出数据？", "提示", {
         confirmButtonText: "确定",
         cancelButtonText: "取消",
         type: "warning"
       }).then(async () => {
         state.queryForm.startIndex=indexTable.value.currentPage_;
         state.queryForm.currPage=indexTable.value.currentPage_;
         state.queryForm.pageSize=indexTable.value.tableConfig_.pageSize;
      download('/web/base/model/exportQuality.do',
                {...state.queryForm},
                `工厂模型_${new Date().getTime()}.xlsx`)
       }).catch(function() {});

      }
    // 重置
   const reset=()=> {
      // 清空查询条件数据
      state.queryForm = clearFormData(state.queryForm);
      queryList();
    }
</script>

<style scoped lang="scss">
.button_groups {
  position: absolute;
  right: 15px;
}

</style>
