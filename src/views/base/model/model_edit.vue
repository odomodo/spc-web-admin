<!--
 * @Author: 刘云辉
 * @Date: 2021-04-19 14:40:28
 * @LastEditTime: 2022-07-14 10:38:52
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
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
          <el-row class="spc-el-row">
            <el-col :span="4"><i class="required">*</i>模型编码 :</el-col>
            <el-col :span="8">
              <el-input
                :disabled="true"
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

          <el-row class="spc-el-row">
            <el-col :span="4"><i class="required">*</i>模型层级 : </el-col>
            <el-col :span="8" style="text-align: left">
              <el-select
                style="width: 100%"
                placeholder="请选择"
                v-model="modelDataForm.modelLevel"
                @change="modelLevelChange"
                :disabled="true"
                
              >
                <el-option
                  :label="item.keyName"
                  :value="item.keyValue"
                  v-for="item in modelLevelList"
                  :key="item.keyValue"
                >
                </el-option>
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
          <el-row class="spc-el-row">
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

          <!-- <el-row >
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
            <el-row class="spc-el-row">
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
        <!-- 产品表格 -->
        <div class="role_table_group flex-c">
          <!-- 产品表格表格 -->
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
    <section class="section_option">
      <el-button color="#5781C1"  @click="editSave" perms="save"
        >保存</el-button
      >
      <el-button type="primary"  @click="cancel" perms="cancle"
        >取消</el-button
      >
    </section>
  </el-dialog>
</template>

<script setup lang="ts">
// 组件
import nTable from "/@/components/nTable/index.vue";
import { queryDictionaryData } from "/@/api/base/paramsSet";

// 方法
import { findModelList, edit, findOne } from "/@/api/base/model";
// import { findModelWorkcenterList } from "@/api/base/modelWorkcenter";
import { findList } from "/@/api/base/productModel";
import { clearFormData } from "/@/utils/jsOptions";
import { reactive, toRefs, ref, watch } from "vue";
import { ElMessage } from "element-plus";

const emit = defineEmits(["queryList"]);
const workcenterTable = ref();
const workcenterLinkageTable = ref();
const productTable = ref();
const productLinkageTable = ref();
const state = reactive({
  dialogTitle: "工厂模型修改",
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
    data: [],
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
  modelLevelList: [
    { keyName: "车间", keyValue: 1 },
    { keyName: "产线", keyValue: 2 },
    { keyName: "工位", keyValue: 3 },
  ] as any,
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
    productModelList: [] as any,
    workcenterList: [] as any,
    modelCode: "", //模型编码
    modelName: "", //模型名称
    modelLevel: null, //模型层级
    parentModelId: "", //上级模型
    productLineCode: "", //产线编码
    principal: "", //负责人
    contactWay: "", //联系方式
    address: "", //地址
    description: "", //描述
  } as any,
});

const {
  dialogTitle,
  dialogVisible,
  disabled,
  modelList,
  workcenterList,
  productList,
  workcenterLinkageTableConfig,
  workcenterTableConfig,
  productLinkageTableConfig,
  modelDataForm,
  productTableConfig,
  modelLevelList,
} = toRefs(state);

watch(
  () => state.dialogVisible,
  (newValue) => {
    if (newValue) {
      // 层级下拉框逻辑处理
      let parentModelId = state.modelDataForm.parentModelId;
      modelLevelChange();
      state.modelDataForm.parentModelId = parentModelId;
      // 穿梭框数据处理
      loadEditData();
    }
  }
);

// 修改保存
const editSave = async () => {
  if (state.modelDataForm.modelName == null || state.modelDataForm.modelName == "") {
    return ElMessage({ message: "名称为空", type: "error" });
  }
  if (state.modelDataForm.modelLevel == null || state.modelDataForm.modelLevel == "") {
    return ElMessage({ message: "请选择模型层级", type: "error" });
  }
  if (
    state.modelDataForm.parentModelId == null ||
    state.modelDataForm.parentModelId == ""
  ) {
    return ElMessage({ message: "请选择模型层级", type: "error" });
  }
  state.modelDataForm.addTime = null;
  state.modelDataForm.editTime = null;
  state.modelDataForm.workcenterList = [];
  state.workcenterLinkageTableConfig.data.forEach(
    (object: { id: any; valueCode: any }) => {
      state.modelDataForm.workcenterList.push({
        workcenterId: object.id,
        workcenterCode: object.valueCode,
      });
    }
  );
  state.modelDataForm.productModelList = [];
  state.productLinkageTableConfig.data.forEach(
    (object: { id: any; productModelCode: any }) => {
      state.modelDataForm.productModelList.push({
        productModelId: object.id,
        productModelCode: object.productModelCode,
      });
    }
  );
  const res: any = await edit(state.modelDataForm);
  if (res.code == 0) {
    ElMessage({
      message: res.msg,
      type: "success",
      duration: 1500,
    });
    emit("queryList");
    // 清空表单
    clearFormData(state.modelDataForm);
    state.dialogVisible = false;
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
  state.modelDataForm.parentModelId = null;
  //产线编码是否禁用
  if (state.modelDataForm.modelLevel == 2) {
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
    (x: { id: any }) => !arrIdList.includes(x.id)
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
    (x: { id: any }) => !arrIdList.includes(x.id)
  );
  productLinkageTable.value.setTableData(state.productLinkageTableConfig.data);
  productTable.value.setTableData(state.productTableConfig.data);
};
// 修改逻辑数据前处理
const loadEditData = async () => {
  state.workcenterList = (await queryDictionaryData("workcenter", null)).values;
  state.workcenterTableConfig.data = state.workcenterList;
  state.productList = (await findList()).data;
  let modelData = (await findOne({ id: state.modelDataForm.id })).data;

  // 工作中心 已选择数据
  let productLinkageData = modelData.productModelList;
  productLinkageData = state.productList.filter((x: any) =>
    productLinkageData.some((y: { productModelId: any }) => y.productModelId === x.id)
  );
  state.productLinkageTableConfig.data = productLinkageData;
  // 重新渲染
  productLinkageTable.value.setTableData(productLinkageData);
  // 去除掉相同数据
  let productIdList = productLinkageData.map((x: { id: any }) => x.id);
  state.productTableConfig.data = state.productList.filter(
    (x: any) => !productIdList.includes(x.id)
  );
  productTable.value.setTableData(state.productTableConfig.data);

  // 工作中心 已选择数据
  let workcenterLinkageData = modelData.workstepList;
  workcenterLinkageData = state.workcenterList.filter((x: any) =>
    workcenterLinkageData.some((y: { workcenterId: any }) => y.workcenterId === x.id)
  );
  state.workcenterLinkageTableConfig.data = workcenterLinkageData;
  // 重新渲染
  workcenterLinkageTable.value.setTableData(workcenterLinkageData);
  // 去除掉相同数据
  let arrIdList = workcenterLinkageData.map((x: { id: any }) => x.id);
  state.workcenterTableConfig.data = state.workcenterList.filter(
    (x: any) => !arrIdList.includes(x.id)
  );
  workcenterTable.value.setTableData(state.workcenterTableConfig.data);
};
// 取消
const cancel = () => {
  state.dialogVisible = false;
};
defineExpose({
  dialogVisible,
  modelDataForm,
});
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
      margin: 20px 0 0 0;
    }
  }
}

</style>
