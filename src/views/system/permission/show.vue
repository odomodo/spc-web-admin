<!--
 * @Author: liuxinyi-yuhang 1029301987@qq.com
 * @Date: 2022-07-23 14:18:37
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @LastEditTime: 2022-07-23 14:43:07
 * @FilePath: \spc-web-admin\src\views\system\permission\show.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <!-- 角色新增弹窗 -->
  <el-dialog
    title="查看"
    v-model="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="cancel"
    width="460px"
  >
    <div class="dialog_role_add">
      <section class="section_input">
        <el-form  ref="ruleFormRef" label-width="80px">
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
      <section class="section_option df jcfe" >
          <el-button class="dialogbtn" type="primary" @click="cancel" perms="save" round >取消</el-button>
      </section>
    </div>
  </el-dialog>
</template>