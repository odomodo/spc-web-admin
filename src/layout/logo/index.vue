<template>
	<div class="layout-logo" v-if="setShowLogo" >
		<img :src="logoMini" class="layout-logo-medium-img" />
		<svg-icon
			class="layout-navbars-breadcrumb-icon"
			:iconName="getThemeConfig.isCollapse ? 'expand' : 'fold'"
			:size="16"
			iconSize="20"
			@click="onThemeConfigChange"
		/>
	</div>
	<div class="layout-logo-size" v-else>
		<svg-icon
			class="layout-navbars-breadcrumb-icon"
			:iconName="getThemeConfig.isCollapse ? 'expand' : 'fold'"
			:size="16"
			iconSize="20"
			@click="onThemeConfigChange"
		/>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from '/@/store/index';

import logoMini from '/@/assets/logo.png';

export default defineComponent({
	name: 'layoutLogo',
	setup() {
		const store = useStore();
		// 获取布局配置信息
		const getThemeConfig = computed(() => {
			return store.state.themeConfig.themeConfig;
		});
		// 设置 logo 的显示。classic 经典布局默认显示 logo
		const setShowLogo = computed(() => {
			let { isCollapse, layout } = store.state.themeConfig.themeConfig;
			return !isCollapse || layout === 'classic' || document.body.clientWidth < 1000;
		});
		// logo 点击实现菜单展开/收起
		const onThemeConfigChange = () => {
			if (store.state.themeConfig.themeConfig.layout === 'transverse') return false;
			store.state.themeConfig.themeConfig.isCollapse = !store.state.themeConfig.themeConfig.isCollapse;
		};
		return {
			logoMini,
			setShowLogo,
			getThemeConfig,
			onThemeConfigChange,
		};
	},
});
</script>

<style scoped lang="scss">
.layout-logo {
	width: 220px;
	height: 50px;
	display: flex;
	margin-bottom: 15px;
	align-items: center;
	box-shadow: rgb(0 21 41 / 2%) 0px 1px 4px;
	color: var(--next-bg-main);
	font-size: 16px;
	font-weight: bold;
	cursor: pointer;
	animation: logoAnimation 0.3s ease-in-out;
	&:hover {
		svg-icon {
			color: var(--color-primary-light-2);
		}
	}
	&-medium-img {
		width: 86px;
		margin-left: 20px;
	}
	svg {
		margin-left:73px;
	}
}
.layout-logo-size {
	width: 100%;
	height: 50px;
	display: flex;
	cursor: pointer;
	align-items: center;
	justify-content: center;
	animation: logoAnimation 0.3s ease-in-out;
	&-img {
		width: 50px;
		margin: auto;
	}
	&:hover {
		img {
			animation: logoAnimation 0.3s ease-in-out;
		}
	}
}
</style>
