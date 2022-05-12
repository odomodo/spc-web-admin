<!--
 * @Author: your name
 * @Date: 2021-03-20 16:26:25
 * @LastEditTime: 2022-05-09 15:19:56
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \mes-ui\src\components\content\nButton.vue
-->
<template>
  <el-button
    v-bind="$attrs"
    v-on="$listeners"
    :disabled="checkFunction(perms)"
  >
    {{
      $attrs.label ? $attrs.label : $slots.default ? $slots.default[0].text : ""
    }}
    <i :class="ricon" aria-hidden="true"></i>
  </el-button>
</template>

<script setup lang="ts">
import { hasPermission } from "/@/utils/permission.ts";
import { getPermissionKey } from "/@/utils/auth.ts";
import { useStore } from '/@/store/index';
const store = useStore();
const props = defineProps({
  ricon: {
    type: String
  },
  perms: {
    // 按钮权限标识，外部使用者传入
    type: String,
    default() {
      return "false";
    }
  }
})
const checkFunction: any = (perms: any) => {
  if(getPermissionKey()==="true"){ //工厂普通用户
    return !hasPermission(perms, store);
  }else{
    return false;
  }
}

</script>
