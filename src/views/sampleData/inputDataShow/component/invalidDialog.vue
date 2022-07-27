<!--
* @Author: zhuangxingguo
* @Date: 2022/06/14 14:05:48
 * @LastEditTime: 2022-07-26 09:45:51
 * @LastEditors: Administrator 848563840@qq.com
* @FilePath: 
-->

<template>
<div class="invalid-Dialog">
	<div class="ruleDialog">
		<el-dialog v-model="ruledialogVisible" :width="440">
			<!-- <el-row style="display: block"><el-col><svg-icon iconName="tip"></svg-icon><i>提示</i></el-col> <el-col><svg-icon calss="spc-right" iconName="close"></svg-icon></el-col> </el-row> -->
			<el-row class="rule-header"
				><el-col :span="23" class="rule-header-tip"><svg-icon iconName="tip"></svg-icon><label style="margin-left: 10px;font-size: 16px !important;">提示</label></el-col>
				<el-col :span="1"><svg-icon @click="closeVisible" calss="spc-right" iconName="close"></svg-icon></el-col>
			</el-row>
			<el-col class="rule-body">
				<el-row v-for="(items, i) in ruleform" :key="i" style="display: block">
				<el-col :span="24" v-if="String(i) == 'up' && size(ruleform.up) > 0">
					<i v-if="['X_MR', 'Xbar_S', 'MR', 'Xbar_R'].includes(chartType)">上图</i>
					<ul v-for="(item, ia) in items" :key="ia">
						<li>{{ ia }}: {{ items[ia] }}</li>
					</ul>
				</el-col>
				<el-col :span="24" v-if="String(i) == 'low' && size(ruleform.low) > 0">
					<i>下图</i>
					<ul v-for="(item, ia) in items" :key="ia">
						<li>{{ ia }}: {{ items[ia] }}</li>
					</ul>
				</el-col>
			</el-row>
			</el-col>
			
			<template #footer>
				<span class="dialog-footer">
					<el-button type="primary"  size="large" @click="oNclickVisible(1)" round>关闭</el-button>
				</span>
			</template>
		</el-dialog>
	</div>

	<div class="reviewDialog">
		<el-dialog v-model="reviewVisible" title="失控处理" :width="600" :close-on-click-modal="false">
			<el-row>
				<el-col :span="24" class="leftform">
					<el-form :model="handleform" ref="handleformRef" :label-width="80">
						<el-form-item label="序号" v-if="rowData.hasOwnProperty('spare1')"
							><div class="text_invalid">{{ rowData.spare1 }};</div>
						</el-form-item>
						<el-form-item label="样本" v-if="rowData.hasOwnProperty('sampleValues')"
							><div class="text_invalid">{{ rowData.sampleValues }};</div>
						</el-form-item>
						<el-form-item v-if="['X_MR', 'Xbar_S', 'MR', 'Xbar_R'].includes(chartType)" label="计算值">
							<div class="text_invalid" label="平均值" v-if="rowData.hasOwnProperty('averageValue')">平均值:{{ rowData.averageValue }};</div>
							<div class="text_invalid" label="极差值" v-if="rowData.hasOwnProperty('rangeValue')">极差值:{{ rowData.rangeValue }};</div>
							<div class="text_invalid" label="标准差" v-if="rowData.hasOwnProperty('standardDeviation')">
								标准差:{{ rowData.standardDeviation }};
							</div>
							<div class="text_invalid" label="最大值" v-if="rowData.hasOwnProperty('maximum')">最大值:{{ rowData.maximum }};</div>
							<div class="text_invalid" label="最小值" v-if="rowData.hasOwnProperty('minimum')">最小值:{{ rowData.minimum }};</div>
						</el-form-item>
						<el-form-item v-if="['P', 'U', 'NP', 'C'].includes(chartType)" label="计算值">
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
							<el-row v-for="(items, i) in ruleform" :key="i" style="display: block">
								<el-col :span="24" v-if="String(i) == 'up' && size(ruleform.up) > 0">
									<li class="text_invalid" v-if="['X_MR', 'Xbar_S', 'MR', 'Xbar_R'].includes(chartType)">上图:</li>
									<li class="text_invalid" v-for="(item, ia) in items" :key="ia">{{ ia }}: {{ item }}</li>
								</el-col>
								<el-col :span="24" v-if="String(i) == 'low' && size(ruleform.low) > 0">
									<li class="text_invalid">下图:</li>
									<li class="text_invalid" v-for="(item, ia) in items" :key="ia">{{ ia }}: {{ item }}</li>
								</el-col>
							</el-row>
						</el-form-item>
						<el-form-item label="失控原因" prop="outControlReason">
							<div class="text_invalid">{{ handleform.outControlReason }}</div>
						</el-form-item>
						<el-form-item label="原因分析" prop="reasonAnalysis">
							<div class="text_invalid">{{ handleform.reasonAnalysis }}</div>
						</el-form-item>
						<el-form-item label="处理措施" prop="treatMeasure">
							<div class="text_invalid">{{ handleform.treatMeasure }}</div>
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
							<div class="text_invalid" v-else>
								<div style="display: flex;" v-for="(items,index) in handleTableData" :key="index">
									<div v-for="(item,i) in items" :key="i">
										<el-row>
											<label v-if="String(i) == 'auditResult'">{{index + 1}}、{{item == 1 ? '同意' : '拒绝'}}；</label>
											<label v-if="String(i) == 'auditUser'">审核人: {{item}}；</label>
											<label v-if="String(i) == 'auditTime'">审核时间: {{item}}</label>
										</el-row>
									</div>
								</div>
							</div>
						</el-form-item>
					</el-form>
				</el-col>
			</el-row>
			<template #footer>

				<span class="dialog-footer">
					<el-button type="primary"  size="large" @click="oNclickVisible(8)" round>关闭</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, unref } from 'vue';
import { size } from 'lodash';
import { handleType } from '../../component/config/type';
import { outControlAdd, getOutAuditList } from '/@/api/inputData';
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
const reviewVisible_copy = ref(false);
const reviewVisible = ref(false);
const ruleform = <any>ref({ r0: {}, up: {}, low: {} });
const chartType = ref('');
const formLabelWidth = '40px';
const rowData = <any>ref(null);
const handleTableData = <any>ref([]);
const handleformRef = ref();
const handleform = ref<handleType>({
	spcControlGroupItemId: '',
	spcControlGroupItemDataGpId: '',
	spare1: 0, //序号
	handleUser: '',
	handleTime: '',
	reasonAnalysis: ''
});

// 判异规则处理
const rulefunction = (datas: any, index: number) => {
	ruleform.value = { r0: {}, up: {}, low: {} };
	datas.itemDecRuleConfigList.forEach((element: { discriminationRuleCode: string; nvalue: any; mvalue: any; kvalue: any }) => {
		if (size(datas.differentRulesUMap) > 0 && datas.differentRulesUMap.hasOwnProperty(element.discriminationRuleCode)) {
			if (element.discriminationRuleCode == 'R0') {
				if (datas.differentRulesUMap['R0'][index] == 1) {
					ruleform.value.up['R0'] = '超出规格限制;';
				}
			} else if (element.discriminationRuleCode == 'R1') {
				if (datas.differentRulesUMap['R1'][index] == 1) {
					ruleform.value.up['R1'] = `${element.nvalue}个点落在${element.kvalue}σ区以外;`;
				}
			} else if (element.discriminationRuleCode == 'R2') {
				if (datas.differentRulesUMap['R2'][index] == 1) {
					ruleform.value.up['R2'] = `连续${element.nvalue}个点落在中心线同一侧;`;
				}
			} else if (element.discriminationRuleCode == 'R3') {
				if (datas.differentRulesUMap['R3'][index] == 1) {
					ruleform.value.up['R3'] = `连续${element.nvalue}个点递增或递减;`;
				}
			} else if (element.discriminationRuleCode == 'R4') {
				if (datas.differentRulesUMap['R4'][index] == 1) {
					ruleform.value.up['R4'] = `连续${element.nvalue}个点中相邻点交替上下;`;
				}
			} else if (element.discriminationRuleCode == 'R5') {
				if (datas.differentRulesUMap['R5'][index] == 1) {
					ruleform.value.up['R5'] = `连续${element.nvalue}个点中有${element.mvalue}个点落在中心线同一侧的${element.kvalue}σ以外;`;
				}
			} else if (element.discriminationRuleCode == 'R6') {
				if (datas.differentRulesUMap['R6'][index] == 1) {
					ruleform.value.up['R6'] = `连续${element.nvalue}个点中有${element.mvalue}个点落在中心线的同一侧的${element.kvalue}σ;`;
				}
			} else if (element.discriminationRuleCode == 'R7') {
				if (datas.differentRulesUMap['R7'][index] == 1) {
					ruleform.value.up['R7'] = `连续${element.nvalue}个点落在中心线两侧的${element.kvalue}σ 区内;`;
				}
			} else if (element.discriminationRuleCode == 'R8') {
				if (datas.differentRulesUMap['R8'][index] == 1) {
					ruleform.value.up['R8'] = `连续${element.nvalue}个点落在中心线${element.kvalue}侧且无一在1σ 区内;`;
				}
			}
		}
		if (size(datas.differentRulesLMap) > 0 && datas.differentRulesLMap.hasOwnProperty(element.discriminationRuleCode)) {
			if (element.discriminationRuleCode == 'R1') {
				if (datas.differentRulesLMap['R1'][index] == 1) {
					ruleform.value.low['R1'] = `${element.nvalue}个点落在${element.kvalue}σ区以外;`;
				}
			} else if (element.discriminationRuleCode == 'R2') {
				if (datas.differentRulesLMap['R2'][index] == 1) {
					ruleform.value.low['R2'] = `连续${element.nvalue}个点落在中心线同一侧;`;
				}
			} else if (element.discriminationRuleCode == 'R3') {
				if (datas.differentRulesLMap['R3'][index] == 1) {
					ruleform.value.low['R3'] = `连续${element.nvalue}个点递增或递减;`;
				}
			} else if (element.discriminationRuleCode == 'R4') {
				if (datas.differentRulesLMap['R4'][index] == 1) {
					ruleform.value.low['R4'] = `连续${element.nvalue}个点中相邻点交替上下;`;
				}
			}
		}
	});
};
// 按钮控制
const oNclickVisible = (type: number) => {
	if (type == 1) {
		ruledialogVisible.value = false;
	} else if (type == 8) {
		resetForm();
		reviewVisible.value = false;
	}
};

//弹窗关闭
const closeVisible = () => {
	ruledialogVisible.value = false;
};

// 表单重置
const resetForm = () => {
	if (!handleformRef.value) return;
	handleformRef.value.resetFields();
	handleTableData.value = [];
	rowData.value = {};
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
@import '../../component/config/style.scss'
</style>