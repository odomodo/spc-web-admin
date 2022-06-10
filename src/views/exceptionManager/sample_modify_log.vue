<!--
* @Author: zhuangxingguo
* @Date: 2022/06/10 09:29:19
* @LastEditTime: 2022/06/10 09:29:19
* @LastEditors: zhuangxingguo
* @FilePath: 
-->
<template>
	<el-row class="sample_modify_log">
		<el-col :span="24">
		<el-row>
			<el-col :span="3" class="flex flex-c mr20"><label style="width: 100px">图形编码</label><el-input /></el-col>
			<el-col :span="3" class="flex flex-c mr20"><label style="width: 100px">检测项目</label><el-input /></el-col>
			<el-col :span="3" class="flex flex-c mr20"><label style="width: 50px">图表</label><el-input /></el-col>
			<el-col></el-col>
		</el-row>
		</el-col>
		<el-col :span="24">
		<nTable ref="indexTable" />
		</el-col>
	</el-row>
</template>
<script setup lang="ts">
import nTable from "/@/components/nTable/index.vue";
import { ref, onMounted } from "vue";
import { queryDictionaryData } from "/@/api/admin/paramsSet";


const chartOptions = ref(null)

onMounted(async()=> {
chartOptions.value = (await queryDictionaryData("control_chart_type", "")).values
})
</script>

<style scoped lang="scss">

</style>
