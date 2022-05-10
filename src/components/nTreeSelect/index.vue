<template>
  <el-select :value="valueTitle" :clearable="clearable" @clear="clearHandle">
    <el-option :value="valueTitle" :label="valueTitle">
      <el-tree
        id="tree-option"
        ref="selectTree"
        :accordion="accordion"
        :data="options"
        :props="props"
        :node-key="props.value"
        :default-expanded-keys="defaultExpandedKey"
        @node-click="handleNodeClick"
      >
      </el-tree>
    </el-option>
  </el-select>
</template>
<script setup lang="ts">
import { defineProps,reactive,onMounted,toRefs,nextTick,ref,defineEmits, defineExpose} from 'vue';
const props = defineProps({
    /* 配置项 */
    props: {
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
    value: {
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
    valueId: props.value, // 初始值
    valueTitle: "",
    defaultExpandedKey: []
}) as any
const { valueId,valueTitle,defaultExpandedKey,} =toRefs(state)
const selectTree = ref()
const emit = defineEmits(['getValue'])
// 初始化值
  const initHandle=()=> {
    if (state.valueId) {
      state.valueTitle = selectTree.value.getNode(state.valueId).data[
        props.props.label
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
      state.valueTitle = node[props.props.label];
      state.valueId = node[props.value];
      emit("getValue", state.valueId);
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

defineExpose({clearHandle})
</script>