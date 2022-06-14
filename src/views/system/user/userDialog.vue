<!--
 * @Author: your name
 * @Date: 2021-04-15 14:39:31
 * @LastEditTime: 2022-06-14 13:40:43
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
    @close="close"
    width="40%"
  >
    <div class="dialog_user">
      <section class="section_input">
        <el-form :model="userDataForm" :rules="rules" label-width="90px">
          <el-row>
            <el-col :span="12">
              <el-form-item prop="userId" label="工号 ">
                <el-input
                  autocomplete="off"
                  v-model="userDataForm.userId"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="userName" label="用户名称">
                <el-input
                  type="text"
                  auto-complete=“off”
                  autocomplete="off"
                  v-model="userDataForm.userName"
                  readonly
                  onfocus="this.removeAttribute('readonly');" 
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="userPwd" label="用户密码">
                <el-input
                  type="text"
                  auto-complete=“off”
                  autocomplete="off"
                  v-model="userDataForm.userPwd"
                  clearable 
                  show-password
                  onfocus="this.removeAttribute('readonly');" 
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="comfirmPwd" label="确认密码">
                <el-input
                  autocomplete="off"
                  v-model="userDataForm.comfirmPwd"
                  clearable 
                  show-password
                  onfocus="this.removeAttribute('readonly');"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="comfirmPwd" label="所属工厂">
                <el-select v-model="userDataForm.factoryCode">
                  <el-option v-for="i in options" :key="i.id" :value="i.factoryCode" :label="i.factoryName"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="userState" label="启用状态">
                <el-switch v-model="userDataForm.userState"></el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="emailAddress" label="邮箱地址">
                <el-input
                  autocomplete="off"
                  v-model="userDataForm.emailAddress"
                ></el-input>
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
      <section class="section_option df jcfe" v-if="dialogTitle !== 'show'">
        <el-button class="dialogbtn"  @click="cancel" perms="cancle" round>取消</el-button>
          <el-button class="dialogbtn" type="primary" @click="addSave" perms="save" round >确定</el-button>
      </section>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { filterObj, isContainChineseChar } from "/@/utils/jsOptions";
import { addList, getUserIdList, getFactoryDnList, sysUserSysSave, sysUserModify } from "/@/api/system/user.ts";
import useCurrentInstance from "/@/utils/useCurrentInstance.ts"
import { ref, reactive, toRefs, onMounted } from "vue"
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
  emailAddress: [
    { required: true, message: '请输入', trigger: 'blur' },
  ]
})

const dialogTitle = ref("")
const dialogVisible = ref(false)
const dnData = ref<any>({
  userIdList: []
})
const options = ref<Array<any>>([])
const userDataForm = ref<any>({
  userId: "", //用户Id
  userName: "", //用户名称
  userPwd: "", //用户密码
  comfirmPwd: "", //确认密码
  factoryCode: '', // 工厂编码
  emailAddress: '',// 邮箱
  userState: true, //用户状态
  description: "" //备注
})

// 保存
const addSave = async() => {
  if(isContainChineseChar(userDataForm.value.userId)){
    return ElMessage({
      message: "用户id不能包含中文字符",
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
    userDataForm.value.userState = 0;
  } else {
    userDataForm.value.userState = 1;
  }
  let res
  if (dialogTitle.value.indexOf('新增') > -1) {
    res =  await sysUserSysSave(userDataForm.value)
  } else {
    res =  await sysUserModify(userDataForm.value)
  } 
  if (res.code == 0) {
    ElMessage({
      message: res.msg,
      type: "success",
      duration: 1500
    });
    dialogVisible.value = false
    proxy.queryList();
  } else {
    ElMessage({
      message: res.msg,
      type: "error",
      duration: 3000
    });
  }
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
const close = () => {
  userDataForm.value = {}
}
onMounted(async() => {
  options.value = (await getFactoryDnList())?.data
})
defineExpose({
  dialogVisible,
  dialogTitle,
  userDataForm,
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
::v-deep(input:-webkit-autofill) {
  box-shadow: 0 0 0px 1000px #c7c6c6 inset !important;
  // -webkit-text-fill-color: #ededed !important;
  -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
  background-color: transparent;
  background-image: none;
  transition: background-color 50000s ease-in-out 0s;
}
</style>