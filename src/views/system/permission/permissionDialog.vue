<!--
 * @Author: 曾宇奇
 * @Date: 2021-04-15 14:40:28
 * @LastEditTime: 2022-07-23 14:17:38
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \mes-ui\src\views\system\components\role_add.vue
-->

<template>
  <!-- 角色新增弹窗 -->
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="cancel"
    width="745px"
  >
    <div class="dialog_role_add">
      <section class="section_input">
        <el-form :model="roleDataForm" :rules="rules" ref="ruleFormRef" label-width="80px">
          <el-row>
            <el-col :span="11" class="mr20"> 
              <el-col :span="24" class="item" style="width: 100%;">
                <el-form-item label="角色编号" prop="roleCode" >
                  <el-select v-if="dialogTitle !== '查看'"  style="width: 100%;" v-model="roleDataForm.roleCode" @change="selectChange" >
                    <el-option v-for="i in options" :key="i.id" :label="`${i.roleCode}(${i.roleName})`" :value="i.roleCode"></el-option>
                  </el-select>
                  <p v-else>{{roleDataForm.roleCode}}</p>
                </el-form-item>
              </el-col>
              <el-col :span="24" class="item" style="width: 100%;">
                <el-form-item label="角色名称" prop="roleName">
                  <el-input
                      v-if="dialogTitle !== '查看'"
                      disabled
                      autocomplete="off"
                      v-model="roleDataForm.roleName"
                    ></el-input>
                    <p v-else>{{roleDataForm.roleName}}</p>
                </el-form-item>
              </el-col>
              <el-col :span="24" class="item" style="width: 100%;">
                <el-form-item label="角色类型" prop="roleType">
                  <el-input v-model="roleDataForm.roleType" disabled v-if="dialogTitle !== '查看'"></el-input>
                  <p v-else>{{roleDataForm.roleType}}</p>
                </el-form-item>
              </el-col>
            </el-col>
            <el-col :span="11" class="box1">
              <p class="title">权限配置</p>
                <el-tree
                  style="margin-top: 20px;"
                  :disabled="dialogTitle === '查看'"
                  :data="tdata"
                  show-checkbox
                  :props="defaultProps"
                  node-key="id"
                  ref="tnode"
                />
            </el-col>
          </el-row>
        </el-form>
      </section>
      <section class="section_option df jcfe" v-if="dialogTitle !== '查看'">
        <el-button class="dialogbtn"  @click="cancel" perms="cancle" round>取消</el-button>
          <el-button class="dialogbtn" type="primary" @click="addSave(ruleFormRef)" perms="save" round >确定</el-button>
      </section>
    </div>
  </el-dialog>
</template>


<script setup lang="ts">

import { clearFormData, hasChinase } from "/@/utils/jsOptions.ts";
import useCurrentInstance from "/@/utils/useCurrentInstance.ts"
import { ref, reactive, toRefs, onMounted, watch } from "vue"
import { ElMessage, ElMessageBox } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus'
import { queryDictionaryData } from "/@/api/admin/paramsSet";
import { rolePermissionItemsaveSimple, roleModify, sysUserGetUserList, menuFindMenuList, roleFindList, rolePermissionItemmodify } from "/@/api/controlChart/index.ts"
const { proxy } = useCurrentInstance()
const emit = defineEmits(['queryList']);
const dialogTitle = ref("新增")
const dialogVisible = ref(false)
const options = ref<Array<any>>([])
const ruleFormRef = ref<any>(null)
const tnode = ref<any>(null)
const tdata = ref<Array<any>>([])
const defaultProps = {
  children: 'children',
  label: 'menuName',
}
const rules = reactive<FormRules>({
  roleCode: [
    { required: true, message: '请输入', trigger: 'blur' },
    { validator: hasChinase, message: '角色编码不能包含中文字符', trigger: 'blur' },
  ],
  roleName: [
    { required: true, message: '请输入', trigger: 'blur' },
  ],
  roleState: [
    { required: true, message: '请输入', trigger: 'blur' },
  ],
})
// 角色新增数据
const roleDataForm = ref<any>({
  roleCode: "", //角色编码
  roleName: "", //角色名称
  roleState: 0, //角色状态
  description: "", //角色描述
})

// 保存
const addSave = async(formEl: any) => {
  if (!formEl) return
  if (tnode.value.getCheckedKeys().length === 0) {
    ElMessage({
      type: 'error',
      message: '请选择权限配置'
    })
    return
  }
  await formEl.validate(async(valid: any, fields: any) => {
    if (valid) {
      const obj = {
        roleId: roleDataForm.value.id,
        checkMenuIds: tnode.value.getCheckedKeys(),
      }
      const res = await rolePermissionItemsaveSimple(obj)
      if (res.code === 0) {
        ElMessage({ 
          type: 'success',
          message: res?.msg
        })
      } else {
        ElMessage({ 
          type: 'error',
          message: res?.msg
        })
      }
      emit('queryList');
      dialogVisible.value = false;
    } else {
      console.log('error submit!', fields)
    }
  })

}
// 取消
const cancel = () => {
  roleDataForm.value = {};
  tdata.value = []
  dialogVisible.value = false;
}
const selectChange = async(data: any) => {
  options.value.map(v => {
    if (v.roleCode === data) {
      roleDataForm.value = v
    }
  })
  
  const res = await menuFindMenuList({roleId: roleDataForm.value.id})
  tdata.value = res.data.sysMenus
  tnode.value.setCheckedKeys(res.data.checkMenuIds)
}


onMounted(async() => {
  const res = await roleFindList({
    roleState: 0
  })
  options.value = res?.data
})
defineExpose({
  dialogVisible,
  roleDataForm,
  dialogTitle,
  selectChange
})
</script>
<style lang="scss" scoped>
.item{
  margin-bottom: 20px;
  margin-right: 10px;
}
.box1{
  max-height: 250px;
  border: 1px solid #E1E5EB;
  padding: 14px 20px;
  overflow-y: scroll;
  .title{
    border-bottom: 1px solid #E1E5EB;
    padding-bottom: 14px;
  }
}
</style>
