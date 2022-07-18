<!--
 * @Author: Administrator 848563840@qq.com
 * @Date: 2022-05-26 09:20:20
 * @LastEditors: Administrator 848563840@qq.com
 * @LastEditTime: 2022-07-09 09:13:46
 * @FilePath: \chartc:\Users\Administrator\Desktop\share\code\spc-web-admin\src\layout\routerView\parent.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
	<div class="h100">
		<router-view v-slot="{ Component }">
			<!-- <transition :name="setTransitionName" mode="out-in"> -->
				<keep-alive :include="keepAliveNameList">
					<component :is="Component" :key="refreshRouterViewKey" class="w100" :style="{ minHeight }" />
				</keep-alive>
			<!-- </transition> -->
		</router-view>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs, reactive, getCurrentInstance, onBeforeMount, onUnmounted, nextTick, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from '/@/store/index';

// 定义接口来定义对象的类型
interface ParentViewState {
	refreshRouterViewKey: null | string;
	keepAliveNameList: string[];
}

export default defineComponent({
	name: 'layoutParentView',
	props: {
		minHeight: {
			type: String,
			default: '',
		},
	},
	setup() {
		const { proxy } = <any>getCurrentInstance();
		const route = useRoute();
		const store = useStore();
		const state = reactive<ParentViewState>({
			refreshRouterViewKey: null,
			keepAliveNameList: [],
		});
		// 设置主界面切换动画
		const setTransitionName = computed(() => {
			return store.state.themeConfig.themeConfig.animation;
		});
		// 获取布局配置信息
		const getThemeConfig = computed(() => {
			return store.state.themeConfig.themeConfig;
		});
		// 获取组件缓存列表(name值)
		const getKeepAliveNames = computed(() => {
			return store.state.keepAliveNames.keepAliveNames;
		});
		// 页面加载前，处理缓存，页面刷新时路由缓存处理
		onBeforeMount(() => {
			state.keepAliveNameList = getKeepAliveNames.value;
			proxy.mittBus.on('onTagsViewRefreshRouterView', (fullPath: string) => {
				state.keepAliveNameList = getKeepAliveNames.value.filter((name: string) => route.name !== name);
				state.refreshRouterViewKey = null;
				nextTick(() => {
					state.refreshRouterViewKey = fullPath;
					state.keepAliveNameList = getKeepAliveNames.value;
				});
			});
		});
		// 页面卸载时
		onUnmounted(() => {
			proxy.mittBus.off('onTagsViewRefreshRouterView');
		});
		// 监听路由变化，防止 tagsView 多标签时，切换动画消失
		watch(
			() => route.fullPath,
			() => {
				state.refreshRouterViewKey = route.fullPath;
			}
		);
		return {
			getThemeConfig,
			getKeepAliveNames,
			setTransitionName,
			...toRefs(state),
		};
	},
});
</script>
