<!--
 * @Author: liuxinyi-yuhang 1029301987@qq.com
 * @Date: 2022-08-08 13:23:32
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @LastEditTime: 2022-08-08 15:00:37
 * @FilePath: \spc-web-admin\src\views\base\email.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class='box'>
    <p class='title'>Email参数配置</p>
    <el-form :model="userDataForm" :rules="rules" label-width="120px" ref="ruleFormRef">
      <el-row>
        <el-col :span="12">
          <el-form-item label="SMTP服务器">
            <el-input></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="端口">
            <el-input></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="Email地址">
            <el-input></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="需要SMTP验证">
            <el-input></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="密码">
            <el-input></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="接受Email地址">
            <el-input></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <section class="df jcfe" >
      <el-button class="dialogbtn"  @click="cancel" perms="cancle" >测试</el-button>
        <el-button class="dialogbtn" type="primary" @click="addSave(ruleFormRef)" perms="save"  >保存</el-button>
    </section>
  </div>
</template>

<script>
  //import x from ''
  export default {
    components: {

    },
    data () {
      return {

      };
    },
    computed: {

    },
    methods: {

    },
  }
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