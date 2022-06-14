<!--
 * @Author: zhuangxingguo
 * @Date: 2022-04-20 09:16:42
 * @LastEditTime: 2022-06-14 14:53:13
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @FilePath: \vue-next-admin\src\components\svgIcon\index.vue
-->

<template>
	<div v-if="tipLable != ''" style="display: inline">
		<el-tooltip :class="['svg-icon', className]" effect="dark" :content="tipLable" placement="bottom-start">
			<svg
				:class="['c-icon']"
				:style="{
					width: iconSize + 'px',
					height: iconSize + 'px',
				}"
				aria-hidden="true"
			>
				<use :xlink:href="'#icon-' + iconName" :fill="color" />
			</svg>
		</el-tooltip>
	</div>
	<svg
		v-else
		class=""
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
import { defineComponent, ref } from 'vue';
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
			default: '#5781c1',
		},
		iconSize: {
			type: [Number, String],
			default: 14,
		},
		tipLable: {
			type: String,
			default: '',
		},
	},
	setup() {
		
	},
});
</script>

<style scope>
.svg-icon {
	fill: currentColor;
	vertical-align: middle;
	cursor: pointer;
}

</style>
