<!--
* @Author: zhuangxingguo
* @Date: 2022/06/20 17:25:33
* @LastEditTime: 2022/06/20 17:25:33
* @LastEditors: zhuangxingguo
* @FilePath: 
-->
<template>
	<div class="modify-log">
		<el-dialog v-model="modifyLogVisible" title="样本修改记录" :width="600" :show-close="false">
			<template #footer>
				<el-divider />
				<span class="dialog-footer">
					<el-button type="primary" @click="oNclickVisible" round>返回</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>
<script setup lang="ts">
import { ref } from 'vue';

const modifyLogVisible = ref<boolean>(false);

const oNclickVisible = () => {
	modifyLogVisible.value = false;
};
defineExpose({
	modifyLogVisible,
});
</script>
<style scoped lang="scss">
.modify-log {
	:deep(.el-divider--horizontal) {
		margin: 6px 0;
	}
}
</style>
