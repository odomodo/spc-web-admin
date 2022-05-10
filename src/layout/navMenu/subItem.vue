<!--
 * @Author: your name
 * @Date: 2022-04-25 10:18:18
 * @LastEditTime: 2022-04-28 13:31:30
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \spc-web-admin\src\layout\navMenu\subItem.vue
-->
<template>
	<template v-for="val in chils">
		<el-sub-menu :index="val.path" :key="val.path" v-if="val.children && val.children.length > 0">
			<template #title>
				<SvgIcon :name="val.meta.icon" />
				<!-- <span>{{ $t(val.meta.title) }}</span> -->
				<span>{{ val.meta?.title }}</span>
			</template>
			<sub-item :chil="val.children" />
		</el-sub-menu>
		<template v-else>
			<el-menu-item :index="val.path" :key="val.path">
				<template v-if="!val.meta.isLink || (val.meta.isLink && val.meta.isIframe)">
					<SvgIcon :name="val.meta.icon" />
					<!-- <span>{{ $t(val.meta.title) }}</span> -->.
					<span>{{ val.meta?.title }}</span>
				</template>
				<template v-else>
					<a :href="val.meta.isLink" target="_blank" rel="opener" class="w100">
						<SvgIcon :name="val.meta.icon" />
						{{ $t(val.meta.title) }}
					</a>
				</template>
			</el-menu-item>
		</template>
	</template>
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
