<!--
 * @Author: 刘云辉
 * @Date: 2021-04-19 14:40:28
 * @LastEditTime: 2022-05-13 10:49:41
 * @LastEditors: zhaungxingguo
 * @Description: In User Settings Edit
 * @FilePath: \mes-ui\src\views\base\model\model_add.vue
-->

<template>
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="70%"
  >
    <el-tabs type="border-card">
      <el-tab-pane label="基本信息">
        <div class="dialog_role_add">
          <el-row class='spc-el-row'>
            <el-col :span="4"><i class="required">*</i>模型编码 :</el-col>
            <el-col :span="8">
              <el-input
                autocomplete="off"
                v-model="modelDataForm.modelCode"
                
              ></el-input>
            </el-col>

            <el-col :span="4"><i class="required">*</i>模型名称 :</el-col>
            <el-col :span="8">
              <el-input
                autocomplete="off"
                v-model="modelDataForm.modelName"
                
              ></el-input>
            </el-col>
          </el-row>

          <el-row class='spc-el-row'>
            <el-col :span="4"><i class="required">*</i>模型层级 : </el-col>
            <el-col :span="8" style="text-align: left">
              <el-select
                style="width: 100%"
                placeholder="请选择"
                v-model="modelDataForm.modelLevel"
                @change="modelLevelChange"
                
              >
                <el-option label="车间" value="1"> </el-option>
                <el-option label="产线" value="2"> </el-option>
                <el-option label="工位" value="3"> </el-option>
              </el-select>
            </el-col>

            <el-col :span="4"><i class="required">*</i>上级模型 : </el-col>
            <el-col :span="8">
              <el-select
                style="width: 100%"
                placeholder="请选择"
                
                v-model="modelDataForm.parentModelId"
              >
                <el-option
                  :label="item.modelName"
                  :value="item.id"
                  v-for="item in modelList"
                  :key="item.id"
                >
                  <span style="float: left">{{ item.modelName }}</span>
                  <span style="float: right; color: #8492a6; font-style: 14px">{{
                    item.modelCode
                  }}</span>
                </el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row class='spc-el-row'>
            <el-col :span="4">产线编码 :</el-col>
            <el-col :span="8">
              <el-input
                autocomplete="off"
                v-model="modelDataForm.productLineCode"
                :disabled="disabled"
                
              ></el-input>
            </el-col>

            <!-- <el-col :span="4">负责人 :</el-col>
            <el-col :span="8">
              <el-input
                autocomplete="off"
                v-model="modelDataForm.principal"
              ></el-input>
            </el-col> -->
          </el-row>

          <!-- <el-row class='spc-el-row'>
            <el-col :span="4">联系方式 :</el-col>
            <el-col :span="8">
              <el-input
                autocomplete="off"
                v-model="modelDataForm.contactWay"
              ></el-input>
            </el-col>

            <el-col :span="4">地址 :</el-col>
            <el-col :span="8">
              <el-input
                autocomplete="off"
                v-model="modelDataForm.address"
              ></el-input>
            </el-col>
          </el-row> -->

          <section class="section_textarea">
            <el-row class='spc-el-row'>
              <el-col :span="4"> 描述 : </el-col>
              <el-col :span="20">
                <el-input
                  type="textarea"
                  v-model="modelDataForm.description"
                  :autosize="{ minRows: 3, maxRows: 5 }"
                  
                >
                </el-input>
              </el-col>
            </el-row>
          </section>
        </div>
      </el-tab-pane>
      <el-tab-pane label="工作中心">
        <!-- 工作中心表格 -->
        <div class="role_table_group flex-c">
          <!-- 工作中心管理表格 -->
          <n-table
            ref="workcenterTable"
            :tableConfig="workcenterTableConfig"
            style="margin: 5px 10px 0 0; width: 50vw"
            border
            class="flex1"
          >
          </n-table>
          <div class="transfer_arrow h-100">
            <el-button
              type="success"
              @click="workcenterAdd"
              plain
              icon="el-icon-d-arrow-right"
              
              >添加</el-button
            >
            <el-button
              type="danger"
              @click="workcenterRemove"
              plain
              icon="el-icon-d-arrow-left"
              
              class="del"
              >移除</el-button
            >
          </div>
          <!-- 联动管理表格 -->
          <n-table
            ref="workcenterLinkageTable"
            :tableConfig="workcenterLinkageTableConfig"
            style="margin-top: 5px; width: 50vw"
            border
            class="flex1"
          >
          </n-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="产品型号">
        <!-- 产品型号表格 -->
        <div class="role_table_group flex-c">
          <!-- 产品型号表格 -->
          <n-table
            ref="productTable"
            :tableConfig="productTableConfig"
            style="margin: 5px 10px 0 0; width: 50vw"
            border
            class="flex1"
          >
          </n-table>
          <div class="transfer_arrow h-100">
            <el-button
              type="success"
              @click="productAdd"
              plain
              icon="el-icon-d-arrow-right"
              
              >添加</el-button
            >
            <el-button
              type="danger"
              @click="productRemove"
              plain
              icon="el-icon-d-arrow-left"
              
              class="del"
              >移除</el-button
            >
          </div>
          <!-- 联动管理表格 -->
          <n-table
            ref="productLinkageTable"
            :tableConfig="productLinkageTableConfig"
            style="margin-top: 5px; width: 50vw"
            border
            class="flex1"
          >
          </n-table>
        </div>
      </el-tab-pane>
    </el-tabs>
    <section class="section_option flex-c-c">
      <el-button type="primary"  perms="save" @click="addSave(modelDataForm)"
        >保存</el-button
      >
      <el-button type="primary"  perms="cancle" @click="cancel"
        >取消</el-button
      >
    </section>
  </el-dialog>
</template>

<script setup lang="ts">
// 组件
import nTable from "/@/components/nTable/index.vue";

// 方法
import { findModelList, add } from "/@/api/base/model";
import { findList } from "/@/api/base/productModel";
import { isContainChineseChar } from "/@/utils/jsOptions";
import { queryDictionaryData } from "/@/api/admin/paramsSet";
import { reactive, toRefs, ref, onMounted, inject } from "vue";
import { ElMessage } from "element-plus";

const workcenterTable = ref();
const workcenterLinkageTable = ref();
const productLinkageTable = ref();
const productTable = ref();
const emit = defineEmits(["queryList"]);
const reload: any = inject('reload')
const state = reactive({
  dialogTitle: "工厂模型新增",
  dialogVisible: false,
  disabled: true,
  // 上级模型下拉数据
  modelList: [] as any, //选择车间,获取工厂列表
  workcenterList: [],
  productList: [],
  workcenterLinkageTableConfig: {
    //表格表头
    columns: [
      {
        prop: "valueCode",
        label: "工作中心编码",
      },
    ],
    height: "360px",
    data: [],
    showChoose: true, //是否显示选择框， 默认不显示
    initLoadFlag: false,
    showPagination: false, //是否显示分页
    rowNumbers: true, //是否显示行数
  } as any,
  workcenterTableConfig: {
    //表格表头
    columns: [
      {
        prop: "valueCode",
        label: "工作中心编码",
      },
    ],
    height: "360px",
    showChoose: true, //是否显示选择框， 默认不显示
    showPagination: false, //是否显示分页
    initLoadFlag: false,
    rowNumbers: true, //是否显示行数
  } as any,
  productLinkageTableConfig: {
    //表格表头
    columns: [
      {
        prop: "productModelCode",
        label: "产品型号编码",
        minWidth: 100,
      },
      {
        prop: "abbreviation",
        label: "产品型号简称",
        minWidth: 100,
      },
    ],
    height: "360px",
    data: [],
    showChoose: true, //是否显示选择框， 默认不显示
    initLoadFlag: false,
    showPagination: false, //是否显示分页
    rowNumbers: true, //是否显示行数
  } as any,
  productTableConfig: {
    //表格表头
    columns: [
      {
        prop: "productModelCode",
        label: "产品型号编码",
        minWidth: 100,
      },
      {
        prop: "abbreviation",
        label: "产品型号简称",
        minWidth: 100,
      },
    ],
    height: "360px",
    showChoose: true, //是否显示选择框， 默认不显示
    showPagination: false, //是否显示分页
    initLoadFlag: false,
    rowNumbers: true, //是否显示行数
  } as any,
  //工厂建模新增数据
  modelDataForm: {
    productModelList: [], // 产品型号数据
    workcenterList: [], // 工作中心数据
    modelCode: "", //模型编码
    modelName: "", //模型名称
    modelLevel: "", //模型层级
    parentModelId: "", //上级模型
    productLineCode: "", //产线编码
    principal: "", //负责人
    contactWay: "", //联系方式
    address: "", //地址
    description: "", //描述
  } as any,
});

const {dialogTitle,dialogVisible,disabled,modelList,workcenterList,productList,workcenterLinkageTableConfig,workcenterTableConfig,productLinkageTableConfig,modelDataForm,productTableConfig,} = toRefs(state)
// 保存
const addSave = async (modelDataForm: {
  modelCode: string | null;
  modelName: string | null;
  modelLevel: string | null;
  parentModelId: string | null;
  workcenterList: { workcenterId: any; workcenterCode: any }[];
  productModelList: { productModelId: any; productModelCode: any }[];
}) => {
  if (isContainChineseChar(state.modelDataForm.modelCode)) {
    return ElMessage({
      message: "模型编码不能包含中文字符",
      type: "error",
    });
  }
  if (modelDataForm.modelCode == null || modelDataForm.modelCode == "") {
    return ElMessage({ message: "编码为空", type: "error" });
  }
  if (modelDataForm.modelName == null || modelDataForm.modelName == "") {
    return ElMessage({ message: "名称为空", type: "error" });
  }
  if (modelDataForm.modelLevel == null || modelDataForm.modelLevel == "") {
    return ElMessage({ message: "请选择模型层级", type: "error" });
  }
  if (modelDataForm.parentModelId == null || modelDataForm.parentModelId == "") {
    return ElMessage({ message: "请选择模型层级", type: "error" });
  }
  modelDataForm.workcenterList = [];
  state.workcenterLinkageTableConfig.data.forEach((object: { id: any; valueCode: any; }) => {
    modelDataForm.workcenterList.push({
      workcenterId: object.id,
      workcenterCode: object.valueCode,
    });
  });
  modelDataForm.productModelList = [];
  state.productLinkageTableConfig.data.forEach((object: { id: any; productModelCode: any; }) => {
    modelDataForm.productModelList.push({
      productModelId: object.id,
      productModelCode: object.productModelCode,
    });
  });
  const res:any = await add(modelDataForm);
  if (res.code == 0) {
    ElMessage({
      message: res.msg,
      type: "success",
      duration: 1500,
    });
    emit("queryList");
    cancel();
  } else {
    ElMessage({
      message: res.msg,
      type: "error",
      duration: 3000,
    });
  }
};
// 层级切换逻辑
const modelLevelChange = async () => {
  // 切换模型层级，清空上级数据
  state.modelDataForm.parentModelId = "";
  //产线编码是否禁用
  if (state.modelDataForm.modelLevel == "2") {
    state.disabled = false;
  } else {
    state.disabled = true;
  }
  //上级模型下拉数据重新获取
  if (state.modelDataForm.modelLevel == null || state.modelDataForm.modelLevel == "") {
    state.modelList = [];
  } else {
    state.modelList = (
      await findModelList({ modelLevel: state.modelDataForm.modelLevel })
    ).data;
  }
};
// 工作中心穿梭框 新增
const workcenterAdd = () => {
  workcenterTable.value.getCheckedData().forEach((object: any) => {
    state.workcenterLinkageTableConfig.data.push(object);
  });
  let arrIdList = workcenterTable.value.getCheckedData().map((x: { id: any }) => x.id);
  state.workcenterTableConfig.data = state.workcenterTableConfig.data.filter(
    (x: { id: any }) => !arrIdList.includes(x.id)
  );
  workcenterLinkageTable.value.setTableData(state.workcenterLinkageTableConfig.data);
  workcenterTable.value.setTableData(state.workcenterTableConfig.data);
};
// 工作中心穿梭框 移除
const workcenterRemove = () => {
  workcenterLinkageTable.value.getCheckedData().forEach((object: any) => {
    state.workcenterTableConfig.data.push(object);
  });
  let arrIdList = workcenterLinkageTable.value
    .getCheckedData()
    .map((x: { id: any }) => x.id);

  state.workcenterLinkageTableConfig.data = state.workcenterLinkageTableConfig.data.filter(
    (x: { id: any; }) => !arrIdList.includes(x.id)
  );
  workcenterLinkageTable.value.setTableData(state.workcenterLinkageTableConfig.data);
  workcenterTable.value.setTableData(state.workcenterTableConfig.data);
};
// 产品型号穿梭框 新增
const productAdd = () => {
  productTable.value.getCheckedData().forEach((object: any) => {
    state.productLinkageTableConfig.data.push(object);
  });
  let arrIdList = productTable.value.getCheckedData().map((x: { id: any }) => x.id);
  state.productTableConfig.data = state.productTableConfig.data.filter(
    (x: { id: any }) => !arrIdList.includes(x.id)
  );
  productLinkageTable.value.setTableData(state.productLinkageTableConfig.data);
  productTable.value.setTableData(state.productTableConfig.data);
};
// 产品型号穿梭框 移除
const productRemove = () => {
  productLinkageTable.value.getCheckedData().forEach((object: any) => {
    state.productTableConfig.data.push(object);
  });
  let arrIdList = productLinkageTable.value
    .getCheckedData()
    .map((x: { id: any }) => x.id);

  state.productLinkageTableConfig.data = state.productLinkageTableConfig.data.filter(
    (x: { id: any; }) => !arrIdList.includes(x.id)
  );
  productLinkageTable.value.setTableData(state.productLinkageTableConfig.data);
  productTable.value.setTableData(state.productTableConfig.data);
};
// 取消
const cancel = () => {
  // 清空表单
  state.modelDataForm = {
    productModelList: [], // 产品型号数据
    workcenterList: [], // 工作中心数据
    modelCode: "", //模型编码
    modelName: "", //模型名称
    modelLevel: "", //模型层级
    parentModelId: "", //上级模型
    productLineCode: "", //产线编码
    principal: "", //负责人
    contactWay: "", //联系方式
    address: "", //地址
    description: "", //描述
  };
  // clearFormData(this.modelDataForm);
  // workcenterLinkageTable.value.setTableData([]);
  // workcenterTable.value.setTableData(this.workcenterList);
  // productLinkageTable.value.setTableData([]);
  // productTable.value.setTableData(this.workcenterList);
  reload();
  state.dialogVisible = false;
};
// 数据加载
const loadList = async () => {
  // 工作中心
  state.workcenterList = (await queryDictionaryData("workcenter", "")).values;
  state.workcenterTableConfig.data = state.workcenterList;
  // 产品型号
  state.productList = (await findList()).data;
  state.productTableConfig.data = state.productList;
};
onMounted(() => {
  loadList();
});
defineExpose({
  dialogVisible
})
</script>

// 自定义样式
<style lang="scss" scoped>
// 页面公共样式
.required {
  color: red;
}
.el-select-dropdown__item {
  height: auto;
}
// 页面样式
</style>

// 第三方样式
<style lang="scss" scoped>
::v-deep .el-input__inner {
  border-radius: 4px;
}
::v-deep .el-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 15px;
  .el-col {
    text-align: right;
    padding-right: 20px;
  }
}
.role_table_group {
  .transfer_arrow {
    display: flex;
    flex-direction: column;
    margin-right: 10px;
    .del {
      margin: 10px 0 0 0;
    }
  }
}
.section_option {
  margin-top: 20px;
}
</style>
