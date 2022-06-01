<!--
 * @Author: your name
 * @Date: 2021-04-15 14:39:31
 * @Description: In User Settings Edit
 * @FilePath: \mes-ui\src\views\system\components\user_add.vue
-->

<template>
  <!-- 用户编辑弹窗 -->
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="70%"
  >
    <div class="dialog_user">
      <section class="section_input">
        <el-row>
          <el-col :span="4"><i class="required">*</i>用户ID :</el-col>
          <el-col :span="8">
            <el-select
              placeholder="请选择"
              size="mini"
              v-model="userDataForm.userId"
              style="width:100%"
              disabled
            >
              <el-option
                :label="item.empName"
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
          </el-col>
          <el-col :span="4"><i class="required">*</i>用户名称 :</el-col>
          <el-col :span="8">
            <el-input
              autocomplete="off"
              v-model="userDataForm.userName"
              disabled
            ></el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">部门 :</el-col>
          <el-col :span="8">
            <el-input
              autocomplete="off"
              v-model="userDataForm.deptName"
              disabled
            ></el-input>
          </el-col>
          <el-col :span="4">车间 :</el-col>
          <el-col :span="8">
            <el-input
              autocomplete="off"
              v-model="userDataForm.modelName"
              disabled
            ></el-input>
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col :span="4">用户密码 :</el-col>
          <el-col :span="8">
            <el-input
              autocomplete="off"
              v-model="userDataForm.userPwd"
              show-password
              disabled
            ></el-input>
          </el-col>
          <el-col :span="4">确认密码 :</el-col>
          <el-col :span="8">
            <el-input
              autocomplete="off"
              v-model="userDataForm.comfirmPwd"
              show-password
              disabled
            ></el-input>
          </el-col>
        </el-row> -->
        <el-row>
          <el-col :span="4">用户识别码 :</el-col>
          <el-col :span="8">
            <el-input
              autocomplete="off"
              v-model="userDataForm.identificatCode"
              disabled
            ></el-input>
          </el-col>
          <el-col :span="4"><i class="required">*</i>启用状态 :</el-col>
          <el-col :span="8" style="text-align: left;">
            <el-switch v-model="userDataForm.userState"></el-switch>
          </el-col>
        </el-row>
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
        <el-button
          type="primary"
          size="mini"
          @click="editSave()"
          perms="save"
          >保存</el-button
        >
        <el-button type="primary" size="mini" @click="cancel" perms="cancle"
          >取消</el-button
        >
      </section>
    </div>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive, toRefs, onMounted } from "vue"
import { ElMessage, ElMessageBox } from 'element-plus';
import { filterObj, isContainChineseChar } from "/@/utils/jsOptions";
import { addList, getUserIdList, editList } from "/@/api/system/user.ts";
import useCurrentInstance from "/@/utils/useCurrentInstance.ts"

const { proxy } = useCurrentInstance()
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

// 保存
const editSave = async() => {
  if (
    userDataForm.value.userPwd == "" ||
    userDataForm.value.comfirmPwd == "" ||
    userDataForm.value.identificatCode == ""
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
  userDataForm.value.userState
    ? (userDataForm.value.userState = 0)
    : (userDataForm.value.userState = 1);

  let filterData = filterObj(userDataForm.value, [
    "comfirmPwd",
    "deptName",
    "modelName"
  ]);
  const res: any = await editList(filterData);
  if (res.code == 0) {
    ElMessage({
      message: res.msg,
      type: "success",
      duration: 1500
    });
    proxy.parent.queryList();
    dialogVisible.value= false;
  } else {
    ElMessage({
      message: res.msg,
      type: "error",
      duration: 3000
    });
  }
  userDataForm.userState = true;
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
onMounted(() => {
  getDnList()
})
defineExpose({
  dialogVisible
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
>>>.el-input__inner {
  border-radius: 4px;
}
>>>.el-row {
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
</style>
