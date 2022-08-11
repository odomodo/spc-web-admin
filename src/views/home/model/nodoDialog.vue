<!--
 * @Author: your name
 * @Date: 2021-04-15 14:39:31
 * @LastEditTime: 2022-08-10 16:10:54
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
    @open="open"
    @close="close"
    width="620px"
  >
    <div class="dialog_user">
      <section class="section_input">
        <el-form :model="userDataForm" :rules="rules" label-width="110px" ref="ruleFormRef">
          <el-row>
            <el-col :span="12">
              <el-form-item prop="userId" label="图形编码 ">
                <p>{{userDataForm.userId}}</p>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="userName" label="图形类型">
                <p >{{userDataForm.userName}}</p>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="userPwd" label="数据点ID">
                <p>{{userDataForm.userPwd}}</p>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="comfirmPwd" label="检测项目">
                <p>{{userDataForm.comfirmPwd}}</p>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="comfirmPwd" label="处理人">
                <p>{{userDataForm.factoryCode}}</p>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="emailAddress" label="处理时间">
                  <p>{{userDataForm.emailAddress}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="userState" label="样本数据">
                <p>{{userDataForm.userState === 0 ? '有效': '失效'}}</p>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="description" label="失控信息">
                <p>{{userDataForm.description}}</p>
              </el-form-item>
            </el-col>
            
            <el-row>
              <div class="solid"></div>
              <el-col :span="24">
              <el-form-item prop="description" label="失控原因">
                <el-input
                  v-if="dialogTitle !== '查看用户'"
                  type="textarea"
                  v-model="userDataForm.description"
                  :autosize="{ minRows: 3, maxRows: 5 }"
                >
                </el-input>
                <p v-else>{{userDataForm.description}}</p>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="emailAddress" label="审核人">
                  <p>{{userDataForm.emailAddress}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="emailAddress" label="审核时间">
                  <p>{{userDataForm.emailAddress}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="emailAddress" label="审核结果">
                <el-radio-group v-if="true" v-model="userDataForm.emailAddress">
                  <el-radio label="1" size="large">同意</el-radio>
                  <el-radio label="2" size="large">拒绝</el-radio>
                </el-radio-group>
                <p v-else>{{userDataForm.emailAddress}}</p>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="emailAddress" label="原因分析人">
                <el-select v-if="true">
                </el-select>
                <p v-else>{{userDataForm.emailAddress}}</p>
              </el-form-item>
            </el-col>
            </el-row>
            <el-row>
              <div class="solid"></div>
              <el-col :span="24">
              <el-form-item prop="description" label="原因分析">
                <el-input
                  v-if="dialogTitle !== '查看用户'"
                  type="textarea"
                  v-model="userDataForm.description"
                  :autosize="{ minRows: 3, maxRows: 5 }"
                >
                </el-input>
                <p v-else>{{userDataForm.description}}</p>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="emailAddress" label="审核人">
                  <p>{{userDataForm.emailAddress}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="emailAddress" label="审核时间">
                  <p>{{userDataForm.emailAddress}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="emailAddress" label="审核结果">
                <el-radio-group v-if="true" v-model="userDataForm.emailAddress">
                  <el-radio label="1" size="large">同意</el-radio>
                  <el-radio label="2" size="large">拒绝</el-radio>
                </el-radio-group>
                <p v-else>{{userDataForm.emailAddress}}</p>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="emailAddress" label="原因分析人">
                <el-select v-if="true">
                </el-select>
                <p v-else>{{userDataForm.emailAddress}}</p>
              </el-form-item>
            </el-col>
            </el-row>
          </el-row>
        </el-form>
      </section>

    </div>
    <template #footer>
      <span class="section_option df jcfe">
        <el-button class="dialogbtn"  @click="cancel" perms="cancle" round>取消</el-button>
        <el-button class="dialogbtn" type="primary" @click="editSave" perms="save" round >确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { filterObj, isContainChineseChar, emailChane } from "/@/utils/jsOptions";
import { addList, getUserIdList, getFactoryDnList, sysUserSysSave, sysUserModify } from "/@/api/system/user.ts";
import useCurrentInstance from "/@/utils/useCurrentInstance.ts"
import { ref, reactive, toRefs, onMounted } from "vue"
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus'
const emit = defineEmits(['queryList']);

const { proxy } = useCurrentInstance()
const ruleFormRef = ref<any>(null)
const rules = ref<FormRules>({
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
    { validator: emailChane, message: '请输入正确的邮箱', trigger: 'blur' },
    
  ]
})

const dialogTitle = ref("用户新增")
const dialogVisible = ref(true)
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
  userState: 0, //用户状态
  description: "" //备注
})

// 保存
const addSave = async(formEl: any) => {
  if (!formEl) return
  await formEl.validate(async(valid: any, fields: any) => {
    if (valid) {
      if (userDataForm.value.comfirmPwd !== userDataForm.value.userPwd) {
        ElMessage({
          message: "两次密码不一致 ",
          type: "error"
        });
        return
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
        emit('queryList');
      } else {
        ElMessage({
          message: res.msg,
          type: "error",
          duration: 3000
        });
      }
  }})

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
  userDataForm.value = {
    userId: "", //用户Id
    userName: "", //用户名称
    userPwd: "", //用户密码
    comfirmPwd: "", //确认密码
    factoryCode: '', // 工厂编码
    emailAddress: '',// 邮箱
    userState: 0, //用户状态
    description: "" //备注
  }
}
const open = () => {
  userDataForm.value.factoryCode = sessionStorage.factoryCode

  setTimeout(() => {
    ruleFormRef.value.clearValidate()
  },0)
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
.solid{
  width: 100%;
  height: 1px;
  background-color:#E1E5EB;
  margin-bottom: 10px;
}
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