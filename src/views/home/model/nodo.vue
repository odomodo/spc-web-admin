<!--
 * @Author: liuxinyi-yuhang 1029301987@qq.com
 * @Date: 2022-08-09 14:07:41
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @LastEditTime: 2022-08-10 09:29:50
 * @FilePath: \spc-web-admin\src\views\home\model\nodo.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class='box'>
    <div class='head df aic'>
      <p class="goback">返回</p>
      <p class="title">未处理信息列表</p>
    </div>
  </div>
</template>

<script  lang="ts">
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
  
background: #FFFFFF;
}
.head{
  width: 100%;
  height: 54px;
  border-bottom:1px solid #E1E5EB;
  .goback{
    padding: 0 20px 0 40px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #626466;
  }
  .title{
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #313233;
    padding-left: 20px;
    border-left: 1px solid #E1E5EB;
  }
}
//@import url()

</style>