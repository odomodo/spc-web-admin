<template>
  <!-- 用户新增弹窗 -->
  <el-dialog
    title="查看用户"
    v-model="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @open="open"
    @close="close"
    width="738px"
  >
    <div class="dialog_user">
      <section class="section_input">
        <el-form :model="userDataForm" label-width="90px" ref="ruleFormRef">
          <el-row>
            <el-col :span="12">
              <el-form-item prop="userId" label="工号 ">
                <p >{{userDataForm.userId}}</p>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="userName" label="用户名称">
                <p >{{userDataForm.userName}}</p>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="userPwd" label="用户密码">
                <p >{{userDataForm.userPwd}}</p>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="comfirmPwd" label="确认密码">
                <p >{{userDataForm.comfirmPwd}}</p>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="comfirmPwd" label="所属工厂">
                <p>{{userDataForm.factoryCode}}</p>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="emailAddress" label="邮箱地址">
                  <p>{{userDataForm.emailAddress}}</p>
                </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="userState" label="启用状态">
                <p>{{userDataForm.userState === 0 ? '有效': '失效'}}</p>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="description" label="备注">
                <p>{{userDataForm.description}}</p>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </section>
      <section class="section_option df">
        <el-button class="dialogbtn"  @click="cancel" type="primary" perms="save" round>返回</el-button>
      </section>
    </div>
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
const dialogVisible = ref(false)
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

// 取消
const cancel = () =>{
  dialogVisible.value= false;
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
}
defineExpose({
  dialogVisible,
  userDataForm,
})
</script>