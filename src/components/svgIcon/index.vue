<!--
 * @Author: zhuangxingguo
 * @Date: 2022-04-20 09:16:42
 * @LastEditTime: 2022-04-20 13:32:31
 * @LastEditors: zhuangxingguo
 * @FilePath: \vue-next-admin\src\views\home\index.vue
-->

<template>
  <svg
    :class="['svg-icon', className]"
    :style="{
      width: iconSize + 'px',
      height: iconSize + 'px',
    }"
    aria-hidden="true"
  >
    <use :xlink:href="'#icon-' + iconName" :fill="color" />
  </svg>
</template>

<script lang="ts">
import { defineComponent, } from 'vue';
export default defineComponent({
  name: 'SvgIcon',
  props: {
    iconName: {
      type: String,
      required: true,
      default: '',
    },
    className: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '',
    },
    iconSize: {
      type: [Number, String],
      default: 14,
    },
  },
  setup() {
    return {};
  },
});
</script>

<style scope>
.svg-icon {
  fill: currentColor;
  vertical-align: middle;
}
</style>