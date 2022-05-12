<!--
 * @Author: 熊长
 * @Date: 2021-05-17 14:40:28
 * @LastEditTime: 2022-05-11 14:24:58
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @packagenameion: In User Settings Edit
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
      <el-tab-pane label="方法配置">
        <div class="dialog_role_add">
          <el-row>
            <el-col :span="4"><i class="required">*</i>方法编码 :</el-col>
            <el-col :span="8">
              <el-input
                autocomplete="off"
                :disabled="true"
                v-model="paramsDataForm.methodCode"
              ></el-input>
            </el-col>

            <el-col :span="4"><i class="required">*</i>方法名称 :</el-col>
            <el-col :span="8">
              <el-input
                autocomplete="off"
                v-model="paramsDataForm.methodName"
              ></el-input>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="4"><i class="required">*</i>方法类型 : </el-col>
            <el-col :span="8" style="text-align: left">
               <el-select style="width:100%" placeholder="请选择"  v-model="paramsDataForm.methodType" value-key="value" :disabled="true">
                <el-option :label="item.label" :value="item.value" v-for="(item) in selectList" :key="item.value"/>
              </el-select>
            </el-col>

            <el-col :span="4">描述 :</el-col>
            <el-col :span="8">
              <el-input
                autocomplete="off"
                v-model="paramsDataForm.descript"
              ></el-input>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">包路径 :</el-col>
            <el-col :span="8">
              <el-input
                autocomplete="off"
                v-model="paramsDataForm.javaPackageName"
                :disabled="checkShow"
              ></el-input>
            </el-col>

            <el-col :span="4">类名 :</el-col>
            <el-col :span="8">
              <el-input
                autocomplete="off"
                v-model="paramsDataForm.javaClassName"
                :disabled="checkShow"
              ></el-input>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="4">方法名 :</el-col>
            <el-col :span="8">
              <el-input
                autocomplete="off"
                v-model="paramsDataForm.javaMethodName"
                :disabled="checkShow"
              ></el-input>
            </el-col>
          </el-row>

          <section class="section_textarea">
            <el-row>
              <el-col :span="4"> SQL : </el-col>
              <el-col :span="20">
                <el-input
                  type="textarea"
                  :disabled="!checkShow"
                  v-model="paramsDataForm.sqlContent"
                  :autosize="{ minRows: 3, maxRows: 5 }"
                >
                </el-input>
              </el-col>
            </el-row>
          </section>
        </div>
      </el-tab-pane>
      <el-tab-pane label="字段说明">
        <el-button type="primary" @click="addListRow" size="mini" perms="save"
          >添加</el-button
        >
        <el-table :data="paramsDataForm.sysWarnMethodParamList">
          <el-table-column label="序号" type="index" width="80">
          </el-table-column>
          <el-table-column label="字段">
            <template #default="scope" width="150">
              <el-input
                v-model="scope.row.fieldName"
                placeholder="请输入"
                size="mini"
                type="text"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="说明">
            <template #default="scope" width="150">
              <el-input
                v-model="scope.row.fieldDescript"
                placeholder="请输入"
                size="mini"
                type="text"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="类型">
            <template #default="scope" width="150">
              <el-select v-model="scope.row.fieldType" placeholder="请选择" size="mini">
                <el-option
                  :label="item.keyName"
                  :value="item.keyValue"
                  v-for="item in fieldTypeList"
                  :key="item.keyValue"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right">
            <template #default="scope" width="150">
              <el-button
                type="danger"
                plain
                perms="save"
                size="mini"
                @click="handleDelete(scope.$index)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <section class="section_option flex-c-c">
      <el-button type="primary" size="mini" @click="editSave(paramsDataForm)" perms="save"
        >保存</el-button
      >
      <el-button type="primary" size="mini" @click="cancel" perms="save">取消</el-button>
    </section>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue"
import { ElMessage, ElMessageBox } from 'element-plus';
// 组件
import nTable from "/@/components/nTable/index.vue";

// 方法
import { editWarnMethod} from "/@/api/system/warnMethod.js";
import { clearFormData } from "/@/utils/jsOptions.ts";
import useCurrentInstance from "/@/utils/useCurrentInstance.ts"

const { proxy } = useCurrentInstance()
const dialogTitle = ref("预警方法编辑")
const dialogVisible = ref(false)
const checkShow = ref(null)
// 字段说明
const paramsDataForm: any = ref({
  methodCode: "",
  methodName: "",
  methodType: "",
  descript: "", //描述
  javaPackageName: "",
  javaClassName: "",
  javaMethodName: "",
  sqlContent: "",
  sysWarnMethodParamList: [],
})
const selectList = ref([{"label":"SQL","value":0},{"label":"JAVA","value":1}])
const fieldTypeList = ref([
  { keyName: "输入", keyValue: 0 },
  { keyName: "输出", keyValue: 1 }
])
// 保存
const editSave = async(paramsDataForm: any) => {
  console.log (paramsDataForm.value);
  const res = await editWarnMethod(paramsDataForm);
  if (res.code == 0) {
    ElMessage({
      message: res.msg,
      type: "success",
      duration: 1500,
    });
    clearFormData(paramsDataForm.value);
    dialogVisible.value = false;
    proxy.parent.queryList();
    cancel();
  } else {
    ElMessage({
      message: res.msg,
      type: "error",
      duration: 3000,
    });
  }
}
// 删除字段说明
const handleDelete = (index: any) => {
  paramsDataForm.value.sysWarnMethodParamList.splice(index, 1);
}
// 添加字段说明
const addListRow = () => {
  paramsDataForm.value.sysWarnMethodParamList.push({
    fieldName: "",
    fieldpackagename: "",
    fieldType: "",
  });
}
const methodTypeChange = () =>{
  paramsDataForm.value.javaPackageName = " ";
  paramsDataForm.value.javaClassName = " ";
  paramsDataForm.value.javaMethodName = " ";
  paramsDataForm.value.sqlContent = " ";
}
// 返回
const cancel = () => {
  dialogVisible.value = false;
}
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
>>> .el-input__inner {
  border-radius: 4px;
}
>>> .el-row {
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
.section_option {
  margin-top: 20px;
}
</style>
