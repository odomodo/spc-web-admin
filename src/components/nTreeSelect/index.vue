<!--
 * @Author: your name
 * @Date: 2021-04-25 10:34:35
 * @LastEditTime: 2022-06-09 14:22:21
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \apc-web-admin\src\components\content\nSelectTree.vue
-->


<template>
  <el-select v-model="valueTitle" :clearable="clearable" @clear="clearHandle">
    <el-option :value="valueTitle" :label="valueTitle">
      <el-tree
        id="tree-option"
        ref="selectTree"
        :accordion="accordion"
        :data="options"
        :props="propes"
        :node-key="propes.value"
        :default-expanded-keys="defaultExpandedKey"
        @node-click="handleNodeClick"
      >
      </el-tree>
    </el-option>
  </el-select>
</template>
<script setup lang="ts">
import { reactive,onMounted,toRefs,nextTick,ref, defineExpose,watch} from 'vue';
const props = defineProps({
    /* 配置项 */
    propes: {
      type: Object,
      default: () => {
        return {
          value: "id", // ID字段名
          label: "title", // 显示名称
          children: "children" // 子级字段名
        };
      }
    },
    /* 选项列表数据(树形结构的对象数组) */
    options: {
      type: Array,
      default: () => {
        return [];
      }
    },
    /* 初始值 */
    values: {
      type: String,
      default: () => {
        return null;
      }
    },
    /* 可清空选项 */
    clearable: {
      type: Boolean,
      default: () => {
        return true;
      }
    },
    /* 自动收起 */
    accordion: {
      type: Boolean,
      default: () => {
        return false;
      }
    }
})

const state = reactive({
    valueId: props.values, // 初始值
    valueTitle: "",
    defaultExpandedKey: []
}) as any
const { valueTitle,defaultExpandedKey,} =toRefs(state)
const selectTree = ref()
const emit = defineEmits(['getValue'])
// 初始化值
  const initHandle=()=> {
    if (state.valueId) {
      state.valueTitle = selectTree.value.getNode(state.valueId)?.data[
        props.propes.label
      ]; // 初始化显示
      selectTree.value.setCurrentKey(state.valueId); // 设置默认选中
      state.defaultExpandedKey = [state.valueId]; // 设置默认展开
    }
    nextTick(() => {
      let scrollWrap:any = document.querySelectorAll(
        ".el-scrollbar .el-select-dropdown__wrap"
      )[0];
      let scrollBar = document.querySelectorAll(
        ".el-scrollbar .el-scrollbar__bar"
      );
      scrollWrap.style.cssText =
        "margin: 0px; max-height: none; overflow: hidden;";
      scrollBar.forEach((ele:any) => (ele.style.width = 0));
    });
  }
  // 切换选项
  const handleNodeClick=(node:any)=> {
      state.valueTitle = node[props.propes.label];
      state.valueId = node[props.values];
      emit("getValue", node.id);
      state.defaultExpandedKey = [];
    }
    // 清除选中
   const clearHandle=()=> {
      state.valueTitle = "";
      state.valueId = null;
      state.defaultExpandedKey = [];
      clearSelected();
      emit("getValue", null);
    }
    /* 清空选中样式 */
   const clearSelected=()=> {
      let allNode = document.querySelectorAll("#tree-option .el-tree-node");
      allNode.forEach(element => element.classList.remove("is-current"));
    }

onMounted(()=>{
    initHandle();
})
watch( () => props.values,()=> {
  state.valueId = props.values;
      initHandle();
})
defineExpose({clearHandle})
</script>
<style lang="scss" scoped>
.el-select-dropdown__item{
  height: auto;
  padding:0;
}
</style>