<template>
	<el-header class="layout-header" :height="setHeaderHeight" v-show="!isTagsViewCurrenFull">
		<NavBarsIndex />
	</el-header>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from '/@/store/index';
import NavBarsIndex from '/@/layout/navBars/index.vue';
export default defineComponent({
	name: 'layoutHeader',
	components: { NavBarsIndex },
	setup() {
		const store = useStore();
		// 设置 header 的高度
		const setHeaderHeight = computed(() => {
			let { isTagsview, layout } = store.state.themeConfig.themeConfig;
			if (isTagsview && layout !== 'classic') return '116px';
			else return '76px';
		});
		// 获取卡片全屏信息
		const isTagsViewCurrenFull = computed(() => {
			return store.state.tagsViewRoutes.isTagsViewCurrenFull;
		});
		return {
			setHeaderHeight,
			isTagsViewCurrenFull,
		};
	},
});
</script>
