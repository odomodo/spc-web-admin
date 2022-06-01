<!--
 * @Author: your name
 * @Date: 2021-04-15 14:39:31
 * @LastEditTime: 2022-05-26 15:36:00
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \mes-ui\src\views\system\components\user_add.vue
-->

<template>
  <!-- 用户新增弹窗 -->
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="70%"
  >
    <div class="dialog_user">
      <section class="section_input">
        <el-form :model="userDataForm" :rules="rules">
          <el-row>
            <el-col :span="12">
              <el-form-item prop="userId" label="用户ID">
                <el-select
                  placeholder="请选择"
                  size="mini"
                  v-model="userDataForm.userId"
                  style="width:100%"
                  @change="handleChange"
                  filterable
                >
                  <el-option
                    :label="item.empCode"
                    :value="item.empCode"
                    v-for="(item, index) in dnData.userIdList"
                    :key="index"
                  >
                    <span style="float:left">{{ item.empName }}</span>
                    <span style="float:right; color: #8492a6; font-style: 14px;">{{
                      item.empCode
                    }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="userName" label="用户名称">
                <el-input
                  autocomplete="off"
                  v-model="userDataForm.userName"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="deptName" label="部门">
                <el-input
                  autocomplete="off"
                  v-model="userDataForm.deptName"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="modelName" label="车间">
                <el-input
                  autocomplete="off"
                  v-model="userDataForm.modelName"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="userPwd" label="用户密码">
                <el-input
                  autocomplete="off"
                  v-model="userDataForm.userPwd"
                  show-password
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="comfirmPwd" label="确认密码">
                <el-input
                  autocomplete="off"
                  v-model="userDataForm.comfirmPwd"
                  show-password
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="identificatCode" label="用户识别码">
                <el-input
                  autocomplete="off"
                  v-model="userDataForm.identificatCode"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="userState" label="启用状态">
                <el-switch v-model="userDataForm.userState"></el-switch>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </section>
      <section class="section_textarea">
        <el-row>
          <el-col :span="4">
            备注 :
          </el-col>
          <el-col :span="20">
            <el-input
              type="textarea"
              v-model="userDataForm.description"
              :autosize="{ minRows: 3, maxRows: 5 }"
            >
            </el-input>
          </el-col>
        </el-row>
      </section>
      <section class="section_option flex-c-c">
        <el-button type="primary" size="mini" @click="addSave()" perms="save"
          >保存</el-button
        >
        <el-button type="primary" size="mini" @click="cancel" perms="cancle">取消</el-button>
      </section>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">


import { filterObj, isContainChineseChar } from "/@/utils/jsOptions";
import { addList, getUserIdList } from "/@/api/system/user.ts";
import useCurrentInstance from "/@/utils/useCurrentInstance.ts"
import { ref, reactive, toRefs } from "vue"
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus'
const { proxy } = useCurrentInstance()
const rules = reactive<FormRules>({
  userId: [
    { required: true, message: '请输入', trigger: 'blur' },
  ],
  userName: [
    { required: true, message: '请输入', trigger: 'blur' },
  ],
  userPwd: [
    { required: true, message: '请输入', trigger: 'blur' },
  ],
  comfirmPwd: [
    { required: true, message: '请输入', trigger: 'blur' },
  ],
  userState: [
    { required: true, message: '请输入', trigger: 'blur' },
  ],
  
})

const dialogTitle = ref("用户新增")
const dialogVisible = ref(false)
const dnData = ref<any>({
  userIdList: []
})
const userDataForm = ref<any>({
  userId: "", //用户Id
  userName: "", //用户名称
  userPwd: "", //用户密码
  comfirmPwd: "", //确认密码
  deptId: "", //部门Id
  deptCode: "", //部门编码
  workshopId: "", //车间Id
  workshopCode: "", //车间编码
  deptName: "", //部门名称
  modelName: "", //车间名称
  identificatCode: "", //用户识别码
  userState: true, //用户状态
  description: "" //备注
})

// 选择联动
const handleChange = (v: any) => {
  const {
    deptName,
    modelName,
    deptId,
    deptCode,
    workShopId,
    workShopCode,
    empName
  } = dnData.value.userIdList.find((item: any) => item.empCode == v);
  userDataForm.value.deptName = deptName;
  userDataForm.value.modelName = modelName;
  userDataForm.value.deptId = deptId;
  userDataForm.value.deptCode = deptCode;
  userDataForm.value.workshopId = workShopId;
  userDataForm.value.workshopCode = workShopCode;
  userDataForm.value.userName = empName;
}
// 保存
const addSave = async() => {
  if(isContainChineseChar(userDataForm.value.userId)){
    return ElMessage({
      message: "用户id不能包含中文字符",
      type: "error"
    });
  }
  if (
    userDataForm.value.userId == "" ||
    userDataForm.value.userName == "" ||
    userDataForm.value.userPwd == "" ||
    userDataForm.value.comfirmPwd == ""
  ) {
    return ElMessage({
      message: "必填项不能为空",
      type: "error"
    });
  }
  if (userDataForm.value.comfirmPwd !== userDataForm.value.userPwd) {
    return ElMessage({
      message: "两次密码不一致 ",
      type: "error"
    });
  }
  
  let userState = userDataForm.value.userState;
  if (userState) {
    userDataForm.value.userState = 1;
  } else {
    userDataForm.value.userState = 0;
  }

  let filterData = filterObj(userDataForm.value, [
    "comfirmPwd",
    "deptName",
    "modelName"
  ]);
  const res = await addList(filterData);
  if (res.code == 0) {
    ElMessage({
      message: res.msg,
      type: "success",
      duration: 1500
    });
    proxy.queryList();
    dialogVisible.value= false;
  } else {
    ElMessage({
      message: res.msg,
      type: "error",
      duration: 3000
    });
  }
  userDataForm.value.userState = true;
}
// 取消
const cancel = () =>{
  dialogVisible.value= false;
}
// 获取下拉框列表
const getDnList = async() => {
  // 获取用户Id下拉框列表
  dnData.value.userIdList = await getUserIdList();
}
defineExpose({
  dialogVisible,
  getDnList
})
</script>
<style lang="scss" scoped>
// 页面公共样式
.required {
  color: red;
}
// 页面样式
</style>

<style lang="scss" scoped>
</style>
<style lang="scss" scoped>

::v-deep(.el-row ){
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 15px;
  .el-col {
    padding: 10px;
  }
}
</style>