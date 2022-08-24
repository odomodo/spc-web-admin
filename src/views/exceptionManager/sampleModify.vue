<!--
* @Author: zhuangxingguo
* @Date: 2022/06/10 09:29:19
 * @LastEditTime: 2022-08-19 15:01:15
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
* @FilePath: 样本数据修改
-->
<template>
<div>
	<el-row class="sample_modify_log">
		<el-col :span="24" class="box1">
			<div class="df">
				<div :span="5" class="flex flex-c mr15"
					><label style="width: 80px" class="label">控制图编码</label><el-input placeholder="请输入图形编码" v-model="form.controlChartConfigCode"
				/></div>
				<div :span="5" class="flex flex-c mr15">
					<label style="width: 65px" class="label">数据点ID</label>
					<el-input placeholder="请输入数据点ID" v-model="form.id"/>
				</div>
				<div :span="5" class="flex flex-c mr5">
          <label style="width: 70px">显示范围</label>
					<el-select v-model="value1" placeholder="请选择">
						<el-option label="录入时间" value="entry" />
						<el-option label="抽样时间" value="sample" />
					</el-select>
        </div>
         <el-date-picker
            v-model="value2"
              type="datetimerange"
              range-separator="——"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
          />
				<div :span="5" class="flex flex-c ">
					<div class="spc-button mr5" @click="queryList">
						<svg-icon iconName="search_icon" tipLable="搜索" iconSize="10"></svg-icon>
					</div>
					<div class="spc-button" @click="reset">
						<svg-icon iconName="重置_icon" tipLable="重置" iconSize="10"></svg-icon>
					</div>
				</div>
			</div>
		</el-col>
		<el-col :span="24">
		<el-table height="75vh" :data="tableData" :header-cell-style="{ height: '50px', padding: '2px', backgroundColor: '#f0f0f0', color: '#313233' }"
			:row-style="{ height: '50px' }"
			:cell-style="{ padding: '3px' }" >
        <el-table-column type="index" label="序号" width="100px"></el-table-column>
        <el-table-column prop="sampleTime" label="抽样时间"></el-table-column>
        <el-table-column prop="entryTime" label="录入时间"></el-table-column>
        <el-table-column :prop="i.prop" :label="i.label" v-for="i in columns">
					<template #default="scope">
						<div v-if="scope.row.type === 'edit'">
							<el-input v-model="scope.row[i.prop]"></el-input>
						</div>
						<div v-else>{{scope.row[i.prop]}}</div>
					</template>
				</el-table-column>
        <el-table-column fixed="right" header-align="center" align="center" disabled="false" width="120px" label="操作">
					<template #default="scope">
						<div v-if="scope.row.type === 'edit'">
							<svg-icon
									iconName="check"
									style="color: #5781c1; margin-right: 10px;margin-left: 10px;"
									@click="save(scope.$index, scope.row)"
								></svg-icon>
							<svg-icon
								iconName="close"
								style="color: #5781c1; margin-right: 10px;margin-left: 10px;"
								@click="handleClick('delete', scope.row, scope.$index)"
							></svg-icon>
						</div>
						<div v-else>
							<svg-icon
								iconName="edit"
								style="color: #5781c1; margin-right: 10px;margin-left: 10px;"
								@click="save1(scope.$index, scope.row)"
							></svg-icon>
							<svg-icon
								:color="'#5781c1'"
								:iconName="'delete'"
								style="color: #5781c1; margin-right: 10px;margin-left: 10px;"
								@click="handleClick('delete', scope.row, scope.$index)"
							></svg-icon>
						</div>
					</template>
				</el-table-column>
      </el-table>
		</el-col>
	</el-row>
	<sample-modify-log ref="modifyLog" />
	</div>
</template>
<script lang="ts">
export default {
    name: "sample_date_edit_record",
};
</script>
<script setup lang="ts">
import nTable from '/@/components/nTable/index.vue';
import { ref, onMounted } from 'vue';
import { queryDictionaryData } from '/@/api/admin/paramsSet';;
import { tspcInspectionFindList, TSpcControlGroupItemDataGpsampleModifyDate, TSpcControlGroupItemDataGpruleOutSampleDate, TSpcControlGroupItemDataGpmodifyDate, TSpcControlGroupItemDataGpdeleteDate } from '/@/api/controlChart/index.ts';
import sampleModifyLog from './component/sample_modify_log_dialog.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
const itemOptions: any = ref(null);
const chartOptions: any = ref(null);
const columns = ref<any>([])
const tableData = ref<any>([])
const value1 = ref<any>()
const value2 = ref<any>()
const oldData = ref<any>()
const form = ref<any>({
	numberSize: 30000
});

const reset = () => {
  form.value = {
    numberSize: 30000
  }
}
const queryList = async() => {
  if (value1.value && value2.value) {
    form.value[value1.value + 'StartTime'] = value2.value
    form.value[value1.value + 'EndTime'] = value2.value
  }
  const res = await TSpcControlGroupItemDataGpsampleModifyDate(form.value)
  if(res.code === 0){
		columns.value = []
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
const handleClick = (type: string, data?: any, index?: any) => {
    let obj:any = {
      'delete': async () => {
        if(data.type === 'edit') {
					tableData.value[index] = JSON.parse(JSON.stringify(oldData.value))
          delete tableData.value[index].type
          return
        }
				if (data.status !== 0 || data.status !== 1 ) {
					ElMessage({
						type: 'error',
						message: '数据无法删除，正在处理',
					});
					return
				}
        ElMessageBox.confirm('确定删除?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
					})
						.then(async () => {
							const res = await TSpcControlGroupItemDataGpdeleteDate({id: data.id})
              if (res.code == 0) {
                ElMessage({
                  message: res.msg,
                  type: "success",
                });
                queryList()
              } else {
                ElMessage({
                  message: res.msg,
                  type: "error",
                  duration: 3000
                });
              }
						})
						.catch(() => {
							ElMessage({
								type: 'info',
								message: '已取消删除',
							});
						});
      }
    }
    obj[type]()
}
const save = async(index: number, row?: any) => {
	let str = columns.value.map((v: any)=> {
		return row[v.prop]
	}).join(',')
	let obj = JSON.parse(JSON.stringify(row))
	obj.sampleValues = str
  let res = await TSpcControlGroupItemDataGpmodifyDate({
		id: obj.id,
		sampleTime: obj.sampleTime,
		sampleValues: obj.sampleValues
	})
  if (res.code === 0) {
    delete tableData.value[index].type
    ElMessage({ 
      type: 'success',
      message: '操作成功'
    })
		queryList()
  } else {
		row = oldData.value
    ElMessage({ 
      type: 'error',
      message: res?.msg
    })
  }
}
const save1 = async(index: number, row?: any) => {
	if (row.status !== 0 || row.status !== 1 ) {
		ElMessage({
			type: 'error',
			message: '数据无法操作，正在处理',
		});
		return
	}
  row.type = 'edit'
	oldData.value = JSON.parse(JSON.stringify(row))
	
}
const doit = (row: any) => {
  ElMessageBox.confirm("确定要排除此条数据？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  })
    .then(async () => {
      const res:any = await TSpcControlGroupItemDataGpruleOutSampleDate({id: row.id});
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

const modifyLog = ref();
onMounted(async () => {
	chartOptions.value = (await queryDictionaryData('control_chart_type', '')).values;
	itemOptions.value = (await tspcInspectionFindList()).data;
});
</script>

<style scoped lang="scss">
.sample_modify_log {
	background-color: #fff;
	padding: 20px;
	border-radius: 10px;
}
.box1{
	margin-bottom: 20px;
}
.label{
	flex-shrink: 0;
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