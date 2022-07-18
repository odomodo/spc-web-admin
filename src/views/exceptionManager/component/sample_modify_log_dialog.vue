<!--
* @Author: zhuangxingguo
* @Date: 2022/06/20 17:25:33
 * @LastEditTime: 2022-07-15 15:15:16
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
* @FilePath: 
-->
<template>
	<div class="modify-log">
		<el-dialog v-model="modifyLogVisible" title="样本修改记录" :width="600" :show-close="true" :close-on-click-modal="false">

			<el-col :span="24">
				<el-row>
					<el-col :span="12" v-if="modifyLogForm.hasOwnProperty('controlChartConfigCode')">
						<label> 图形编码</label><label> {{ modifyLogForm.controlChartConfigCode }} </label>
					</el-col>
					<el-col :span="12" v-if="modifyLogForm.hasOwnProperty('addUserId')">
						<label> 修改人</label><label> {{ modifyLogForm.addUserId }}</label>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12" v-if="modifyLogForm.hasOwnProperty('addTime')">
						<label> 修改时间</label><label> {{ modifyLogForm.addTime }} </label>
					</el-col>

					<el-col :span="12" v-if="modifyLogForm.hasOwnProperty('inputUser')">
						<label>录入人 </label><label> {{ modifyLogForm.inputUser }}</label>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12" v-if="modifyLogForm.hasOwnProperty('controlChartCode')">
						<label> 图形类型</label><label>{{ modifyLogForm.controlChartCode }} </label>
					</el-col>

					<el-col :span="12" v-if="modifyLogForm.hasOwnProperty('inspcationCode')">
						<label>检测项目 </label><label>{{ modifyLogForm.inspcationCode }} </label>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12" v-if="modifyLogForm.hasOwnProperty('entryTime')">
						<label> 录入时间</label><label>{{ modifyLogForm.entryTime }} </label>
					</el-col>
					<el-col :span="12" v-if="modifyLogForm.hasOwnProperty('spare1')">
						<label>数据点序号 </label><label>{{ modifyLogForm.spare1 }} </label>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12" v-if="modifyLogForm.hasOwnProperty('originalSample')">
						<label>修改前 </label>
						<p v-if="['X_MR', 'Xbar_S', 'MR', 'Xbar_R'].includes(modifyLogForm.controlChartCode)">
							<ul>
								<li v-for="(item, i) in modifyLogForm.originalSample.split(',')" :key="i">
									<label>样本{{ i + 1 }}</label
									><label>{{ item }}</label>
								</li>
							</ul>
						</p>
						<p v-if="['P', 'U', 'NP', 'C'].includes(modifyLogForm.controlChartCode)">
							<ul>
								<li><label>抽检数</label><label>{{modifyLogForm.originalCheckNumber}}</label></li>
								<li>
									<label>{{ modifyLogForm.controlChartCode == 'NP' ? '不合格品数' : ( modifyLogForm.controlChartCode == 'C' ? '缺陷数' : '不合格品数') }}</label
									><label>{{ modifyLogForm.originalSample }}</label>
								</li>
							</ul>
						</p>
					</el-col>
					<el-col :span="12" v-if="modifyLogForm.hasOwnProperty('currentSample')">
						<label>修改后 </label>
						<p v-if="['X_MR', 'Xbar_S', 'MR', 'Xbar_R'].includes(modifyLogForm.controlChartCode)">
							<ul v-if="modifyLogForm.currentSample.split(',')[0] != ''">
								
								<li v-for="(item, i) in modifyLogForm.currentSample.split(',')" :key="i">
									<label>样本{{ i + 1 }}</label
									><label>{{ item }}</label>
								</li>
							</ul>
							<ul v-else>
								<li>
									<label>数据已删除</label>
								</li>
							</ul>
						</p>
						<p v-if="['P', 'U', 'NP', 'C'].includes(modifyLogForm.controlChartCode)">
							<ul v-if="modifyLogForm.currentSample.split(',')[0] != ''">
							<li><label>抽检数</label><label>{{modifyLogForm.currentCheckNumber}}</label></li>
								<li>
									<label >{{ modifyLogForm.controlChartCode == 'NP' ? '不合格品数' : ( modifyLogForm.controlChartCode == 'C' ? '缺陷数' : '不合格品数') }}</label
									><label>{{ modifyLogForm.currentSample }}</label>
								</li>
							</ul>
							<ul v-else>
								<li>
									<label>数据已删除</label>
								</li>
							</ul>
						</p>
					</el-col>
				</el-row>
			</el-col>
			<template #footer>
				<span class="dialog-footer">
					<el-button type="primary" @click="oNclickVisible" round>返回</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { modifyLogInterface } from './type';
const modifyLogVisible = ref<boolean>(false);

const oNclickVisible = () => {
	modifyLogVisible.value = false;
	modifyLogForm.value = {
	controlChartCode:'',
	originalSample:'',	
    currentSample:''
}
};

const modifyLogForm = ref<modifyLogInterface>({
	controlChartCode:'',
	originalSample:'',
    currentSample:'',
	currentCheckNumber: '',
	originalCheckNumber: '',
});

defineExpose({
	modifyLogVisible,
	modifyLogForm,
});
</script>
<style scoped lang="scss">
.modify-log {
	:deep(.el-divider--horizontal) {
		margin: 6px 0;
	}
	.el-row {
		width: 535px;
		label {
			line-height: 35px;
			margin-left: 20px;
		}
		.el-col {
			ul {
				height: 100%;
				margin: 0;
				padding: 0;
			}

			li {
				margin-left: 50px;
				height: 28px;
				line-height: 28px;
				list-style-type: none;
				box-sizing: border-box;
				background-color: #fbfcfd;
				cursor: pointer;
			}
		}
	}
}
.dialog-footer {
  margin-top: 20px;
	border-top: 1px solid #E1E5EB;
	padding-top: 20px;
	display: flex;
	justify-content: flex-end;
	button{
		width: 84px;
		height: 38px;
	}
}
</style>
