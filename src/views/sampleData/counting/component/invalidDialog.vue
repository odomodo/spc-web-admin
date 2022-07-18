<!--
* @Author: zhuangxingguo
* @Date: 2022/06/14 14:05:48
 * @LastEditTime: 2022-07-18 10:25:27
 * @LastEditors: Administrator 848563840@qq.com
* @FilePath: 
-->

<template>
	<div class="ruleDialog">
		<el-dialog v-model="ruledialogVisible" :width="440">
			<!-- <el-row style="display: block"><el-col><svg-icon iconName="tip"></svg-icon><i>提示</i></el-col> <el-col><svg-icon calss="spc-right" iconName="close"></svg-icon></el-col> </el-row> -->
			<el-row class="rule-header"
				><el-col :span="23"><svg-icon iconSize="20" iconName="tip"></svg-icon><lable style="margin-left: 5px">提示</lable></el-col>
				<el-col :span="1"><svg-icon @click="closeRuleDialog" calss="spc-right" iconName="close"></svg-icon></el-col>
			</el-row>
			<el-col class="rule-body">
				<el-row style="display: block">
					<el-col :span="24" v-if="size(ruleform) > 0">
						<ul v-for="(item, ia) in ruleform" :key="ia">
							<li>{{ ia }}: {{ item }}</li>
						</ul>
					</el-col>
				</el-row>
			</el-col>
			<template #footer>
				<span class="dialog-footer">
					<el-button type="primary" style="width: 88px" size="large" @click="oNclickVisible(1)" round>去处理</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
	<div class="handleDialog">
		<el-dialog v-model="handleVisible" title="失控处理" :width="800" :close-on-click-modal="false">
			<el-row>
				<el-col :span="12" class="leftform">
					<el-form :model="handleform" ref="handleformRef">
						<el-form-item label="序号" v-if="rowData.hasOwnProperty('spare1')"
							><div class="text_invalid">{{ rowData.spare1 }}</div></el-form-item
						>
						<el-form-item label="抽检数" v-if="rowData.hasOwnProperty('checkNumber')"
							><div class="text_invalid">{{ rowData.checkNumber }}</div></el-form-item
						>
						<el-form-item label="样本" v-if="rowData.hasOwnProperty('sampleValues')"
							><div class="text_invalid">{{ rowData.sampleValues }}</div></el-form-item
						>
						<el-form-item
							:label="chartType == 'C' ? '缺陷数' : '缺陷率'"
							v-if="rowData.hasOwnProperty('defectsNumber') && ['NP', 'C'].includes(chartType)"
							><div class="text_invalid">{{ rowData.defectsNumber }}</div></el-form-item
						>
						<el-form-item label="不合格品率" v-if="rowData.hasOwnProperty('defectRate') && ['P', 'U'].includes(chartType)"
							><div class="text_invalid">{{ rowData.defectRate }}</div>
							%</el-form-item
						>
						<el-form-item prop="remark"
							>备注<el-input v-model="handleform.remark" type="textarea" placeholder="请输入备注" :autosize="{ minRows: 4, maxRows: 4 }"
						/></el-form-item>
					</el-form>
				</el-col>
				<el-col :span="1"><el-divider direction="vertical" /></el-col>
				<el-col :span="11" class="rightform">
					<el-form :model="handleform" :rules="handlerules" ref="handleformRef">
						<el-form-item label="失控信息">
							<el-row style="display: block">
								<el-col :span="24" v-if="size(ruleform) > 0">
									<li class="text_invalid" v-for="(item, ia) in ruleform" :key="ia">{{ ia }}: {{ item }}</li>
								</el-col>
							</el-row>
						</el-form-item>
						<el-form-item label="失控原因" prop="outControlReason">
							<el-input v-model="handleform.outControlReason" type="textarea" placeholder="请输入失控原因" :autosize="{ minRows: 4, maxRows: 5 }" />
						</el-form-item>
						<el-form-item label="处理措施" prop="treatMeasure">
							<el-input v-model="handleform.treatMeasure" type="textarea" placeholder="请输入处理措施" :autosize="{ minRows: 4, maxRows: 5 }" />
						</el-form-item>
						<el-form-item label="原因分析" prop="reasonAnalysis">
							<el-input v-model="handleform.reasonAnalysis" type="textarea" placeholder="请输入原因分析" :autosize="{ minRows: 4, maxRows: 5 }" />
						</el-form-item>
					</el-form>
				</el-col>
			</el-row>

			<template #footer>
				<span class="dialog-footer">
					<el-button type="primary" plain style="width: 88px" size="large" @click="oNclickVisible(3)" round>取消</el-button>
					<el-button type="primary" plain size="large" @click="oNclickVisible(4)" round>历史经验库</el-button>
					<el-button type="primary" style="width: 88px" size="large" @click="oNclickVisible(2)" round>提交</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
	<div class="expDialog">
		<el-dialog v-model="expVisible" title="历史经验库" :width="600">
			<el-row>
				<el-col :span="24">
					<el-table :data="expTableData" highlight-current-row style="width: 100%" @current-change="handleCurrentChange" :height="260">
						<el-table-column type="index" width="60">
							<template #default="scope">
								<el-radio v-model="selectionData_" :label="scope.row.id" @change="_handleRadioChange"><i></i></el-radio>
							</template>
						</el-table-column>
						<el-table-column property="outControlReason" label="失控原因" width="168" :show-overflow-tooltip="true" />
						<el-table-column property="treatMeasure" label="处理措施" width="166" :show-overflow-tooltip="true" />
						<el-table-column property="reasonAnalysis" label="原因分析" width="166" :show-overflow-tooltip="true" />
					</el-table>
				</el-col>
			</el-row>
			<template #footer>
				<span class="dialog-footer">
					<el-button type="primary" plain style="width: 88px" size="large" @click="oNclickVisible(5)" round>返回</el-button>
					<el-button type="primary" style="width: 88px" size="large" @click="oNclickVisible(6)" round>选择</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
	<div class="reviewDialog">
		<el-dialog v-model="reviewVisible_copy" title="失控处理" :before-close="closeVisible" :width="600" :close-on-click-modal="false">
			<el-row>
				<el-col :span="24" class="leftform">
					<el-form :model="handleform" ref="handleformRef">
						<el-form-item label="序号" v-if="rowData.hasOwnProperty('spare1')"
							><div class="text_invalid">{{ rowData.spare1 }}</div>
						</el-form-item>
						<el-form-item label="样本" v-if="rowData.hasOwnProperty('sampleValues')"
							><div class="text_invalid">{{ rowData.sampleValues }}</div>
						</el-form-item>

						<el-form-item>
							<div class="text_invalid" label="抽检数" v-if="rowData.hasOwnProperty('averageValue')">平均值:{{ rowData.averageValue }};</div>
							<div
								class="text_invalid"
								:label="chartType == 'C' ? '缺陷数' : '缺陷率'"
								v-if="rowData.hasOwnProperty('defectsNumber') && ['NP', 'C'].includes(chartType)"
							>
								{{ chartType == 'C' ? '缺陷数' : '缺陷率' }}:{{ rowData.defectsNumber }};
							</div>
							<div class="text_invalid" label="不合格品率" v-if="rowData.hasOwnProperty('defectRate') && ['P', 'U'].includes(chartType)">
								不合格品率:{{ rowData.defectRate }};
							</div>
						</el-form-item>

						<el-form-item label="备注" prop="remark"
							><div class="text_invalid">{{ handleform.remark }}</div></el-form-item
						>
						<el-divider />
						<el-form-item label="失控信息">
							<el-row style="display: block">
								<el-col :span="24" v-if="size(ruleform) > 0">
									<li class="text_invalid" v-for="(item, ia) in ruleform" :key="ia">{{ ia }}: {{ item }}</li>
								</el-col>
							</el-row>
						</el-form-item>
						<el-form-item label="失控原因" prop="outControlReason">
							<div class="text_invalid">{{ handleform.outControlReason }}</div>
						</el-form-item>
						<el-form-item label="处理措施" prop="treatMeasure">
							<div class="text_invalid">{{ handleform.treatMeasure }}</div>
						</el-form-item>
						<el-form-item label="原因分析" prop="reasonAnalysis">
							<div class="text_invalid">{{ handleform.reasonAnalysis }}</div>
						</el-form-item>
						<el-form-item label="处理人" prop="outControlReason">
							<div class="text_invalid">{{ handleform.handleUser }}</div>
						</el-form-item>
						<el-form-item label="处理时间" prop="treatMeasure">
							<div class="text_invalid">{{ handleform.handleTime }}</div>
						</el-form-item>
						<el-divider />
						<el-form-item label="审核结果" prop="treatMeasure">
							<div v-if="handleTableData.length == 0">未审核</div>
							<div style="margin-bottom: -88px" v-else>
								<el-table :data="handleTableData" highlight-current-row style="width: 100%" :height="200">
									<el-table-column label="序号" align="center" type="index" width="60" />
									<el-table-column property="auditUser" align="center" label="审核人" width="100" :show-overflow-tooltip="true" />
									<el-table-column property="auditTime" align="center" label="审核时间" width="230" :show-overflow-tooltip="true" />
									<el-table-column property="auditResult" align="center" label="审核结果" width="100" :show-overflow-tooltip="true">
										<template #default="scope">
											<div class="text_invalid" style="color: #72bd1d" disable-transitions v-if="scope.row['auditResult'] == 0">同意</div>
											<div class="text_invalid" style="color: #eb715e" disable-transitions v-if="scope.row['auditResult'] == 1">拒绝</div>
										</template>
									</el-table-column>
								</el-table>
							</div>
						</el-form-item>
					</el-form>
				</el-col>
			</el-row>
			<template #footer>
				<span class="dialog-footer">
					<el-button type="primary" plain style="width: 88px" size="large" @click="oNclickVisible(7)" round>返回</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
	<div class="reviewDialog">
		<el-dialog v-model="reviewVisible" title="失控处理" :width="600" :close-on-click-modal="false">
			<el-row>
				<el-col :span="24" class="leftform">
					<el-form :model="handleform" ref="handleformRef">
						<el-form-item label="序号" v-if="rowData.hasOwnProperty('spare1')"
							><div class="text_invalid">{{ rowData.spare1 }}</div>
						</el-form-item>
						<el-form-item label="样本" v-if="rowData.hasOwnProperty('sampleValues')"
							><div class="text_invalid">{{ rowData.sampleValues }}</div>
						</el-form-item>

						<el-form-item>
							<div class="text_invalid" label="抽检数" v-if="rowData.hasOwnProperty('averageValue')">平均值:{{ rowData.averageValue }};</div>
							<div
								class="text_invalid"
								:label="chartType == 'C' ? '缺陷数' : '缺陷率'"
								v-if="rowData.hasOwnProperty('defectsNumber') && ['NP', 'C'].includes(chartType)"
							>
								{{ chartType == 'C' ? '缺陷数' : '缺陷率' }}:{{ rowData.defectsNumber }};
							</div>
							<div class="text_invalid" label="不合格品率" v-if="rowData.hasOwnProperty('defectRate') && ['P', 'U'].includes(chartType)">
								不合格品率:{{ rowData.defectRate }};
							</div>
						</el-form-item>

						<el-form-item label="备注" prop="remark"
							><div class="text_invalid">{{ handleform.remark }}</div></el-form-item
						>
						<el-divider />
						<el-form-item label="失控信息">
							<el-row style="display: block">
								<el-col :span="24" v-if="size(ruleform) > 0">
									<li class="text_invalid" v-for="(item, ia) in ruleform" :key="ia">{{ ia }}: {{ item }}</li>
								</el-col>
							</el-row>
						</el-form-item>
						<el-form-item label="失控原因" prop="outControlReason">
							<div class="text_invalid">{{ handleform.outControlReason }}</div>
						</el-form-item>
						<el-form-item label="处理措施" prop="treatMeasure">
							<div class="text_invalid">{{ handleform.treatMeasure }}</div>
						</el-form-item>
						<el-form-item label="原因分析" prop="reasonAnalysis">
							<div class="text_invalid">{{ handleform.reasonAnalysis }}</div>
						</el-form-item>
						<el-form-item label="处理人" prop="outControlReason">
							<div class="text_invalid">{{ handleform.handleUser }}</div>
						</el-form-item>
						<el-form-item label="处理时间" prop="treatMeasure">
							<div class="text_invalid">{{ handleform.handleTime }}</div>
						</el-form-item>
						<el-divider />
						<el-form-item label="审核结果" prop="treatMeasure">
							<div class="text_invalid" v-if="handleTableData.length == 0">未审核</div>
							<div style="margin-bottom: -88px" v-else>
								<el-table :data="handleTableData" highlight-current-row style="width: 100%" :height="200">
									<el-table-column label="序号" align="center" type="index" width="60" />
									<el-table-column property="auditUser" align="center" label="审核人" width="100" :show-overflow-tooltip="true" />
									<el-table-column property="auditTime" align="center" label="审核时间" width="230" :show-overflow-tooltip="true" />
									<el-table-column property="auditResult" align="center" label="审核结果" width="100" :show-overflow-tooltip="true">
										<template #default="scope">
											<div class="text_invalid" style="color: #72bd1d" disable-transitions v-if="scope.row['auditResult'] == 1">同意</div>
											<div class="text_invalid" style="color: #eb715e" disable-transitions v-if="scope.row['auditResult'] == 0">拒绝</div>
										</template>
									</el-table-column>
								</el-table>
							</div>
						</el-form-item>
					</el-form>
				</el-col>
			</el-row>
			<template #footer>
				<span class="dialog-footer">
					<el-button type="primary" plain style="width: 88px" size="large" @click="oNclickVisible(8)" round>返回</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, unref } from 'vue';
import { size } from 'lodash';
import { handleType } from '../../component/config/type';
import { outControlAdd, getTakeMeasureList, getOutAuditList } from '/@/api/inputData';
import { ElMessage } from 'element-plus';

const props = defineProps({
	pid: {
		type: String,
		default: '',
	},
});
const emit = defineEmits(['errorArr', 'initCharts']);
const ruledialogVisible = ref(false);
const handleVisible = ref(false);
const expVisible = ref(false);
const selectionData_ = ref();
const reviewVisible_copy = ref(false);
const reviewVisible = ref(false);
const ruleform = <any>ref({ r0: {}, up: {}, low: {} });
const chartType = ref('');
const formLabelWidth = '40px';
const rowData = <any>ref(null);
const expTableData = <any>ref([]);
const handleTableData = <any>ref([]);
const handleformRef = ref();
const handleform = ref<handleType>({
	spcControlGroupItemId: '',
	spcControlGroupItemDataGpId: '',
	spare1: 0, //序号
	handleUser: '',
	handleTime: '',
	reasonAnalysis: '',
});
const handlerules = reactive({
	outControlReason: [{ required: true, message: '请输入失控原因', trigger: 'blur' }],
	treatMeasure: [{ required: true, message: '请输入采取措施', trigger: 'blur' }],
});

// 判异规则处理
const rulefunction = (datas: any, index: number) => {
	ruleform.value = {};
	datas.itemDecRuleConfigList.forEach((element: { discriminationRuleCode: string; nvalue: any; mvalue: any; kvalue: any }) => {
		if (size(datas.differentRulesUMap) > 0 && datas.differentRulesUMap.hasOwnProperty(element.discriminationRuleCode)) {
			if (element.discriminationRuleCode == 'R0') {
				if (datas.differentRulesUMap['R0'][index] == 1) {
					ruleform.value['R0'] = '超出规格限制;';
				}
			} else if (element.discriminationRuleCode == 'R1') {
				if (datas.differentRulesUMap['R1'][index] == 1) {
					ruleform.value['R1'] = `${element.nvalue}个点落在${element.kvalue}σ区以外;`;
				}
			} else if (element.discriminationRuleCode == 'R2') {
				if (datas.differentRulesUMap['R2'][index] == 1) {
					ruleform.value['R2'] = `连续${element.nvalue}个点落在中心线同一侧;`;
				}
			} else if (element.discriminationRuleCode == 'R3') {
				if (datas.differentRulesUMap['R3'][index] == 1) {
					ruleform.value['R3'] = `连续${element.nvalue}个点递增或递减;`;
				}
			} else if (element.discriminationRuleCode == 'R4') {
				if (datas.differentRulesUMap['R4'][index] == 1) {
					ruleform.value['R4'] = `连续${element.nvalue}个点中相邻点交替上下;`;
				}
			}
		}
	});
};

// 历史经验库，当前选择项
const currentRow = ref();
const handleCurrentChange = (val: any) => {
	currentRow.value = val;
};
const _handleRadioChange = () => {
	expTableData.foreach((item: any) => {
		if (item.id == selectionData_.value) {
			handleCurrentChange(item);
		}
	});
};
// 按钮控制
const oNclickVisible = (type: number) => {
	if (type == 1) {
		ruledialogVisible.value = false;
		handleVisible.value = true; /*  */
	} else if (type == 2) {
		if (!handleformRef.value) return;
		handleformRef.value.validate((valid: any) => {
			if (valid) {
				outControlAdd(handleform.value).then((res: any) => {
					OutAuditList();
					if (res.code == 0) {
						handleform.value.handleTime = res.data.manageTime;
						handleform.value.handleUser = res.data.manageUser;
						handleform.value.remark = res.data.remark;
						reviewVisible_copy.value = true;
						handleVisible.value = false;
					} else {
						handleVisible.value = false;
						ElMessage.error(res.msg);
					}
				});
			} else {
				return false;
			}
		});
	} else if (type == 3) {
		handleVisible.value = false;
		emit('errorArr');
		resetForm();
	} else if (type == 4) {
		TakeMeasureList();
		setTimeout(() => (expVisible.value = true), 500);
	} else if (type == 5) {
		expVisible.value = false;
	} else if (type == 6) {
		expVisible.value = false;
		handleform.value.outControlReason = currentRow.value.outControlReason;
		handleform.value.treatMeasure = currentRow.value.treatMeasure;
	} else if (type == 7) {
		resetForm();
		emit('errorArr');
		emit('initCharts', props.pid);
		reviewVisible_copy.value = false;
	} else if (type == 8) {
		resetForm();
		reviewVisible.value = false;
	}
};

//弹窗关闭
const closeRuleDialog = () => {
	ruledialogVisible.value = false;
};
const closeVisible = async (action: any, done: any) => {
	if (action == 'confirm') {
		return;
	} else {
		emit('initCharts', props.pid);
		reviewVisible_copy.value = false;
	}
};

// 表单重置
const resetForm = () => {
	if (!handleformRef.value) return;
	handleformRef.value.resetFields();
	handleTableData.value = [];
	rowData.value = {};
};

// 审核状态请求
const OutAuditList = () => {
	getOutAuditList(unref(rowData).id).then((res) => {
		handleTableData.value = res.data;
	});
};

// 历史经验库
const TakeMeasureList = () => {
	getTakeMeasureList().then((res: any) => {
		if (res.code == 0) {
			expTableData.value = res.data;
		} else {
			ElMessage.error(res.msg);
		}
	});
};

defineExpose({
	ruledialogVisible,
	rulefunction,
	chartType,
	rowData,
	handleform,
	reviewVisible,
	handleTableData,
});
</script>
<style scoped lang="scss">
.ruleDialog {
	font-family: Microsoft YaHei;

	font-weight: 400;
	// max-height: 0px !important;
	.rule-header {
		padding: 20px;
		height: 68px;
		border-bottom: #e1e5eb 1px solid;
		overflow: hidden;
		font-size: 16px;
		margin-bottom: 30px;
		color: #313233;
	}

	//弹窗样式
	:deep(.el-dialog) {
		border-radius: 10px;
		.el-dialog__body {
			padding: 0 !important;
			// max-height: calc(90vh - 553px) !important;
			min-height: 190px !important;
			overflow: hidden;
			margin-bottom: 15px;
		}

		.el-dialog__header {
			display: none;
		}
		.el-dialog__footer {
			border-top: #e1e5eb 1px solid;
			display: flex;
			height: 88px;
			align-items: center;
			justify-content: end;
			padding: 20px;
		}
	}
	.rule-body {
		margin: 0 52px 0 42px;
		max-height: 311px !important;
		overflow-y: auto;
		.el-col {
			float: none;
			i {
				font-size: 14px;
				// cursor: pointer;
				font-weight: bold;
			}

			ul {
				height: 100%;
				margin: 0;
				padding: 0;
			}

			li {
				display: inline-block;
				height: 28px;
				line-height: 28px;
				list-style-type: none;
				box-sizing: border-box;
				background-color: #fbfcfd;
				// cursor: pointer;
			}
		}
	}
}
.handleDialog {
	//弹窗样式
	:deep(.el-dialog) {
		border-radius: 10px;

		.el-dialog__header {
			height: 56px;
			padding: 5px 25px !important;
		}
		.el-dialog__footer {
			border-top: #e1e5eb 1px solid;
			display: flex;
			height: 100px;
			align-items: center;
			justify-content: end;
		}
	}
	.el-row {
		.el-col {
			:deep(.el-divider--vertical) {
				height: 475px;
			}
			float: none;
			i {
				font-size: 16px;
				// cursor: pointer;
				border: 1px;
			}

			ul {
				height: 100%;
				margin: 0;
				padding: 0;
				display: flex;
			}

			li {
				display: inline-block;
				height: 28px;
				line-height: 28px;
				list-style-type: none;
				box-sizing: border-box;
				background-color: #fbfcfd;
				// cursor: pointer;
			}
		}
	}
	.leftform {
		:deep(.el-form-item) {
			margin-bottom: 0 !important;
		}
	}
	.rightform {
		overflow: auto;
		max-height: 475px;
		:deep(.el-form-item--large) {
			margin-bottom: 20px;
		}
		:deep(.el-form-item__content) {
			display: block !important;
		}
	}
	:deep(.el-form-item--large) {
		margin-bottom: 1px;
	}
}
.expDialog {
	:deep(.el-dialog) {
		.el-table {
			border-bottom: 0;
		}
		.el-table .el-table__header-wrapper tr th {
			color: #313233;
			background-color: #f0f0f0 !important;
			height: 46px;
		}
		.el-table-fixed-column--right {
			background-color: #f0f0f0;
		}
		.el-table td.el-table__cell,
		.el-table th.el-table__cell.is-leaf {
			border-bottom: 0;
		}
	}
}

.reviewDialog {
	:deep(.el-dialog) {
		.el-dialog__body {
			max-height: 600px !important;
		}
		.el-dialog__footer {
			border-top: #e1e5eb 1px solid;
			display: flex;
			height: 100px;
			align-items: center;
			justify-content: end;
		}
		.el-table {
			border-bottom: 0;
		}
		.el-table .el-table__header-wrapper tr th {
			color: #313233;
			background-color: #f0f0f0 !important;
			height: 46px;
		}
		.el-table-fixed-column--right {
			background-color: #f0f0f0;
		}
		.el-table td.el-table__cell,
		.el-table th.el-table__cell.is-leaf {
			border-bottom: 0;
		}
	}
	:deep(.el-divider--horizontal) {
		margin: 6px 0;
	}
	:deep(.el-form-item--large) {
		margin-bottom: 1px;
	}
	.el-row {
		.el-col {
			:deep(.el-divider--vertical) {
				height: 384px;
			}
			float: none;
			i {
				font-size: 16px;
				// cursor: pointer;
				border: 1px;
			}

			ul {
				height: 100%;
				margin: 0;
				padding: 0;
			}

			li {
				display: inline-block;
				height: 28px;
				line-height: 28px;
				list-style-type: none;
				box-sizing: border-box;
				background-color: #fbfcfd;
				// cursor: pointer;
			}
		}
	}
	.text_invalid {
		font-size: 16px;
		margin-right: 5px;
	}
	ul {
		display: flex;
	}
	:deep(.el-divider--vertical) {
		height: 384px;
	}
}
</style>
