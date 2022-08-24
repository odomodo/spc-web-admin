<!--
* @Author: zhuangxingguo
* @Date: 2022/06/20 17:25:33
 * @LastEditTime: 2022-08-19 15:09:20
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
* @FilePath: 
-->
<template>
	<div class="modify-log">
		<el-dialog v-model="modifyLogVisible" title="样本数据排除" :width="'888px'" :show-close="true" :close-on-click-modal="false" @close="cancel">
      <div class="df aic jcc sear">搜索</div>
      <el-form label-width="90px" class="box1">
        <el-row>
          <el-col :span="12" class="item" style="padding-right: 16px">
            <el-form-item label="控制图编码" prop="controlChartConfigCode">
              <el-input placeholder="请输入图形编码" v-model="form.controlChartConfigCode"
            />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据点ID" prop="id">
              <el-input placeholder="请输入数据点ID" v-model="form.id"
            />
            </el-form-item>
          </el-col>
          <el-col :span="6" class="mr15">
            <el-form-item label="显示范围" prop="controlChartConfigCode">
              <el-select v-model="value1" placeholder="请选择">
                <el-option label="录入时间" value="entry" />
                <el-option label="抽样时间" value="sample" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-date-picker
              v-model="value2"
              type="datetimerange"
              range-separator="——"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            />
          </el-col>
          <el-col :span="5" class="flex flex-c ">
            <div class="spc-button mr5" @click="queryList">
              <svg-icon iconName="search_icon" tipLable="搜索" iconSize="10"></svg-icon>
            </div>
            <div class="spc-button" @click="reset">
              <svg-icon iconName="重置_icon" tipLable="重置" iconSize="10"></svg-icon>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <el-table :data="tableData" :header-cell-style="{ height: '50px', padding: '2px', backgroundColor: '#f0f0f0', color: '#313233' }"
			:row-style="{ height: '50px' }"
			:cell-style="{ padding: '3px' }" >
        <el-table-column type="index" label="序号" width="100px"></el-table-column>
        <el-table-column prop="sampleTime" label="抽样时间"></el-table-column>
        <el-table-column prop="entryTime" label="录入时间"></el-table-column>
        <el-table-column :prop="i.prop" :label="i.label" v-for="i in columns"></el-table-column>
        <el-table-column  label="操作" fixed="right">
          <template #default="scope">
            <svg-icon
								:class="['curn']"
								:color="'#C4C7CC'"
								iconName="delete"
								tipLable="delete"
								style="color: #c4c7cc; margin-left: 10px; margin-right: 10px"
                @click="doit(scope.row)"
							></svg-icon>
          </template>
        </el-table-column>
      </el-table>
			<template #footer>
				<section class="section_option df jcfe">
          <el-button class="dialogbtn"  @click="cancel" type="primary" perms="save" round>返回</el-button>
        </section>
			</template>
		</el-dialog>
	</div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import nTable from '/@/components/nTable/index.vue';
import {  TSpcControlGroupItemDataGpsampleModifyDate, TSpcControlGroupItemDataGpruleOutSampleDate } from '/@/api/controlChart/index.ts';
import { ElMessage, ElMessageBox } from 'element-plus';
const modifyLogVisible = ref<boolean>(false);
const form = ref<any>({
  numberSize: 30
})
const columns = ref<any>([])
const tableData = ref<any>([])
const value1 = ref<any>()
const value2 = ref<any>()
const reset = () => {
  form.value = {
    numberSize: 30000
  }
}
const queryList = async() => {
  if (value1.value && value2.value) {
    form.value[value1.value + 'StartTime'] = value2.value
    form.value[value1.value + 'EndTime'] = value2.value
    delete form.value.value1
    delete form.value.value2
  }
  const res = await TSpcControlGroupItemDataGpsampleModifyDate(form.value)
  if(res.code === 0){
    for (let i = 1; i <= res?.data?.sampleSize; i++) {
      let column = {
        prop: "sampleValues" + i,
        label: "样本" + i,
      };
      columns.value.push(column);
    }
    let arr = res?.data?.tSpcControlGroupItemDataGpList?.map((v: any, i: any) => {
      v.sampleValues.split(',').map((j: any, k: any) => {
        v[`sampleValues${k+1}`] = j
      })
      return v
    })
    tableData.value = arr
  }
  
};
const cancel = () => {
  modifyLogVisible.value = false;
  reset()
  tableData.value = []
}
const doit = (row: any) => {
  ElMessageBox.confirm("确定要排除此条数据？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  })
    .then(async () => {
      const res:any = await TSpcControlGroupItemDataGpruleOutSampleDate({
        id: row.id,
        spcControlGroupItemId: row.spcControlGroupItemId,
      });
      ElMessage({
        type: "success",
        message: res.msg,
      });
      queryList()
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "确认取消",
      });
    });
  
}
defineExpose({
	modifyLogVisible,
});
</script>
<style scoped lang="scss">
.sear{
  margin-bottom: 10px;
}
.box1{
  background: #FAFAFA;
  border: 1px solid #F0F2F5;
  border-radius: 8px;
  padding: 24px;
}
.item{
  margin-bottom: 20px;
}
</style>
<style lang="scss" scoped>
.table-box{
	padding-right: 14px;
	border-right: 1px solid #F0F2F5;
	border-bottom: 1px solid #F0F2F5;
}
::v-deep(.el-table .el-table__header-wrapper ){
	border-radius: 8px 8px 0px 0px !important;
}
.curn {
	cursor: pointer;
}
.disabled {
	cursor: not-allowed;
}
::v-deep(.pagination){
  display: flex;
	flex-direction: row-reverse;
}
::v-deep(.pagination .el-pagination ){
	float: none !important;
	display: flex;
	// flex-direction: row-reverse;
	margin-top: 15px;
}
::v-deep(.cell){
	text-align: center;
}
::v-deep(.el-table){
	--el-table-border-color: #fff;
}
::v-deep(.el-popper.is-dark){
    color: var(--el-text-color-primary) !important;
    background: var(--el-bg-color)  !important;
    border: 1px solid var(--el-text-color-primary)  !important;
}
</style>