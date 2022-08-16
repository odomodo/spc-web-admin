<!--
 * @Author: liuxinyi-yuhang 1029301987@qq.com
 * @Date: 2022-08-08 13:23:32
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @LastEditTime: 2022-08-16 17:00:48
 * @FilePath: \spc-web-admin\src\views\base\email.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class='box'>
    <p class='title'>Email参数配置</p>
    <el-form :model="userDataForm" :rules="rules" label-width="120px" ref="ruleFormRef">
      <el-row>
        <el-col :span="12">
          <el-form-item label="SMTP服务器" prop="smtp" >
            <el-input v-model="userDataForm.smtp"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="端口" prop="port">
            <el-input v-model="userDataForm.port"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Email地址" prop="email">
            <el-input v-model="userDataForm.email"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="密码/授权码" prop="password">
            <el-input v-model="userDataForm.password"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="接受Email地址" prop="receiveEmail">
            <el-input
                v-model="userDataForm.receiveEmail"
                :rows="4"
                type="textarea"
                placeholder="请输入"
              />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <section class="df jcfe" >
      <el-button class="dialogbtn"  @click="addSave('测试')" perms="cancle" >测试</el-button>
        <el-button class="dialogbtn" type="primary" @click="addSave('保存')" perms="save"  >保存</el-button>
    </section>
  </div>
</template>

<script lang="ts" setup>
import {
  findOneFactoryCode,
  TScpEmailConfigsave,
  TScpEmailConfigmodify,
  TScpEmailConfigsendMail
} from "/@/api/controlChart/index.ts";
import { ElMessage, ElMessageBox } from "element-plus";
import { filterObj, isContainChineseChar, emailChane } from "/@/utils/jsOptions";
import { reactive, toRefs, ref, onMounted, inject, watch, provide, readonly } from "vue";
const factoryCode = sessionStorage.getItem('factoryCode')
const userDataForm = ref<any>({})
const ruleFormRef = ref<any>(null)
const rules = ref<any>({
  smtp: [
    { required: true, message: '请输入', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入', trigger: 'blur' },
    { validator: emailChane, message: '请输入正确的邮箱', trigger: 'blur' },
  ],
})
const target = ref(true)
const addSave = async(type: string) => {
  await ruleFormRef.value.validate(async(valid: any, fields: any) => {
    if (valid) {
      let obj: any = {
        '测试': async() => {
          const res = await TScpEmailConfigsendMail(userDataForm.value)
          if (res.code === 0) {
            ElMessage({
              type: "success",
              message: res.msg || '操作成功',
            });
          } else {
            ElMessage({
              type: "error",
              message: res.msg,
            });
          }
        },
        '保存': async() => {
          const res = target.value ? await TScpEmailConfigsave(userDataForm.value) : await TScpEmailConfigmodify(userDataForm.value)
          if (res.code === 0) {
            ElMessage({
              type: "success",
              message: res.msg || '操作成功',
            });
          } else {
            ElMessage({
              type: "error",
              message: res.msg,
            });
          }
        },
      }
      obj[type]()
    }
  })
}
onMounted(async() => {
  const res: any = await findOneFactoryCode({
    factoryCode
  })
  if (res.code === 0) {
    if (res.data) {
      target.value = false
      userDataForm.value = {...userDataForm.value, ...res.data}
    } else {
      target.value = true
    }
  }
})
</script>

<style lang='scss' scoped>
.box{
  width: 100%;
  min-height: 924px;
  background: #FFFFFF;
  border: 1px solid #F0F2F5;
  border-radius: 12px;
  padding: 80px 160px 0;
  .title{
    padding: 0 20px 30px;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #313233;
    border-bottom: 1px #F0F2F5 solid;
    margin-bottom: 30px;
  }
  .dialogbtn{
    width: 96px;
    height: 40px;
    border: 1px solid #5781C1;
    border-radius: 4px;
  }
}
.el-col{
  margin-bottom: 20px;
}
//@import url()

</style>