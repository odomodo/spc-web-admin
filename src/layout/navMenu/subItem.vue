<!--
 * @Author: your name
 * @Date: 2022-04-25 10:18:18
 * @LastEditTime: 2022-07-21 10:33:10
 * @LastEditors: Administrator 848563840@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \spc-web-admin\src\layout\navMenu\subItem.vue
-->
<template>
	<div v-for="val in chils" class="parent">
		<el-sub-menu :index="val.path" :key="val.path" v-if="val.children && val.children.length > 0">
			<template #title>
				<svg-icon iconSize="16" :iconName="val.meta.icon" />
				<!-- <span>{{ $t(val.meta.title) }}</span> -->
				<span>{{ val.meta?.title }}</span>
			</template>
			<sub-item :chil="val.children" />
		</el-sub-menu>
		<template v-else>
			<el-menu-item :index="val.path" :key="val.path">
				<template v-if="!val.meta.isLink || (val.meta.isLink && val.meta.isIframe)">
					<svg-icon iconSize="16" :iconName="val.meta.icon" />
					<!-- <span>{{ $t(val.meta.title) }}</span> -->
					<span>{{ val.meta?.title }}</span>
				</template>
				<template v-else>
					<a :href="val.meta.isLink" target="_blank" rel="opener" class="w100">
						<svg-icon iconSize="16" :iconName="val.meta.icon" />
						{{ $t(val.meta.title) }}
					</a>
				</template>
			</el-menu-item>
		</template>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
export default defineComponent({
	name: 'navMenuSubItem',
	props: {
		chil: {
			type: Array,
			default: () => [],
		},
	},
	setup(props) {
		// 获取父级菜单数据
		const chils = computed(() => {
			return <any>props.chil;
		});
		return {
			chils,
		};
	},
});
</script>
<style lang="scss">

.el-menu-item {
	margin-bottom: 4px;
	color: #abaeb3;
	border-radius: 8px !important;
}

.el-sub-menu.is-active.is-opened .el-sub-menu__title{
	color:#abaeb3 !important;
	span{
		color:var(--next-span-bg-menuBarColor) !important;
	}
}

.el-sub-menu__title{
border-radius: 8px !important;
}
::v-deep(.el-popper.is-pure){
	left: 70px !important;
}
.parent{
	padding: 2px !important;
}
::v-deep(.el-menu--vertical){
	padding: 8px !important;
}
</style>
