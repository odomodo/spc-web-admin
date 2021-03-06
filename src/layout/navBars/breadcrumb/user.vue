<template>
	<div class="layout-navbars-breadcrumb-user" :style="{ flex: layoutUserFlexNum }">
	<Search ref="searchRef" />
		<!-- <div class="layout-navbars-breadcrumb-user-icon" >
				<svg-icon iconName="sitting" iconSize="18" tipLable="配置功能" />
		</div> -->
		<div style="width: 100px; margin-left: 20px;">
			<el-dropdown :show-timeout="70" :hide-timeout="50" @command="onHandleCommandClick">
			<span class="layout-navbars-breadcrumb-user-link">
				<img :src="getUserInfos.photo" class="layout-navbars-breadcrumb-user-link-photo mr5" />
				{{ getUserInfos.userName === '' ? 'common' : getUserInfos.userName }}
				<el-icon class="el-icon--right">
					<svg-icon iconName="IconArrowDown" @click="onHandleCommandClick('logOut')" />
				</el-icon>
			</span>
			<!-- <template #dropdown>
				<el-dropdown-menu>
					<el-dropdown-item command="/home">{{ $t('message.user.dropdown1') }}</el-dropdown-item>
					<el-dropdown-item command="/personal">{{ $t('message.user.dropdown2') }}</el-dropdown-item>
					<el-dropdown-item divided command="logOut">{{ $t('message.user.dropdown5') }}</el-dropdown-item>
				</el-dropdown-menu>
			</template> -->
		</el-dropdown>
		</div>
		
		
	</div>
</template>

<script lang="ts">
import { ref, getCurrentInstance, computed, reactive, toRefs, onMounted, defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessageBox, ElMessage } from 'element-plus';
import screenfull from 'screenfull';
import { useI18n } from 'vue-i18n';
import { resetRoute } from '/@/router/index';
import { useStore } from '/@/store/index';
import other from '/@/utils/other';
import { Session, Local } from '/@/utils/storage';
import UserNews from '/@/layout/navBars/breadcrumb/userNews.vue';
import Search from '/@/layout/navBars/breadcrumb/search.vue';
import { reqLogout } from '/@/api/login';
import Cookies from "js-cookie";
export default defineComponent({
	name: 'layoutBreadcrumbUser',
	components: { UserNews, Search },
	setup() {
		const { t } = useI18n();
		const { proxy } = <any>getCurrentInstance();
		const router = useRouter();
		const store = useStore();
		const searchRef = ref();
		const state = reactive({
			isScreenfull: false,
			disabledI18n: 'zh-cn',
			disabledSize: 'large',
		});
		// 获取用户信息 vuex
		const getUserInfos = computed(() => {
			return <any>store.state.userInfos.userInfos;
		});
		// 获取布局配置信息
		const getThemeConfig = computed(() => {
			return store.state.themeConfig.themeConfig;
		});
		// 设置分割样式
		const layoutUserFlexNum = computed(() => {
			let num: string | number = '';
			const { layout, isClassicSplitMenu } = getThemeConfig.value;
			const layoutArr: string[] = ['defaults', 'columns'];
			if (layoutArr.includes(layout) || (layout === 'classic' && !isClassicSplitMenu)) num = '1';
			else num = '';
			return num;
		});
		// 全屏点击时
		const onScreenfullClick = () => {
			if (!screenfull.isEnabled) {
				ElMessage.warning('暂不不支持全屏');
				return false;
			}
			screenfull.toggle();
			screenfull.on('change', () => {
				if (screenfull.isFullscreen) state.isScreenfull = true;
				else state.isScreenfull = false;
			});
		};
		// 布局配置 icon 点击时
		const onLayoutSetingClick = () => {
			proxy.mittBus.emit('openSetingsDrawer');
		};
		// 下拉菜单点击时
		const onHandleCommandClick = async (path: string) => {
			if (path === 'logOut') {
				ElMessageBox({
					closeOnClickModal: false,
					closeOnPressEscape: false,
					title: '',
					message: t('message.user.logOutMessage'),
					showCancelButton: true,
					confirmButtonText: t('message.user.logOutConfirm'),
					cancelButtonText: t('message.user.logOutCancel'),
					beforeClose: (action, instance, done) => {
						if (action === 'confirm') {
							reqLogout().then((res) => {
								if (res.code == 0) {
									instance.confirmButtonLoading = true;
									instance.confirmButtonText = t('message.user.logOutExit');
									setTimeout(() => {
										done();
										setTimeout(() => {
											instance.confirmButtonLoading = false;
										}, 300);
									}, 700);
								}
							});
						} else {
							done();
						}
					},
				})
					.then(async () => {
						Session.clear(); // 清除缓存/token等
						Cookies.set("clusterGroupNo", "QAS_A", {expires: -1});
						await resetRoute(); // 删除/重置路由
						ElMessage.success(t('message.user.logOutSuccess'));
						setTimeout(() => {
							window.location.href = ''; // 去登录页
						}, 500);
					})
					.catch(() => {});
			} else {
				router.push(path);
			}
		};
		// 菜单搜索点击
		const onSearchClick = () => {
			searchRef.value.openSearch();
		};
		// 组件大小改变
		const onComponentSizeChange = (size: string) => {
			Local.remove('themeConfig');
			getThemeConfig.value.globalComponentSize = size;
			Local.set('themeConfig', getThemeConfig.value);
			initComponentSize();
			window.location.reload();
		};
		// 语言切换
		const onLanguageChange = (lang: string) => {
			Local.remove('themeConfig');
			getThemeConfig.value.globalI18n = lang;
			Local.set('themeConfig', getThemeConfig.value);
			proxy.$i18n.locale = lang;
			initI18n();
			other.useTitle();
		};
		// 设置 element plus 组件的国际化
		const setI18nConfig = (locale: string) => {
			proxy.mittBus.emit('getI18nConfig', proxy.$i18n.messages[locale]);
		};
		// 初始化言语国际化
		const initI18n = () => {
			switch (Local.get('themeConfig').globalI18n) {
				case 'zh-cn':
					state.disabledI18n = 'zh-cn';
					setI18nConfig('zh-cn');
					break;
				case 'en':
					state.disabledI18n = 'en';
					setI18nConfig('en');
					break;
				case 'zh-tw':
					state.disabledI18n = 'zh-tw';
					setI18nConfig('zh-tw');
					break;
			}
		};
		// 初始化全局组件大小
		const initComponentSize = () => {
			switch (Local.get('themeConfig').globalComponentSize) {
				case 'large':
					state.disabledSize = 'large';
					break;
				case 'default':
					state.disabledSize = 'default';
					break;
				case 'small':
					state.disabledSize = 'small';
					break;
			}
		};
		// 页面加载时
		onMounted(() => {
			if (Local.get('themeConfig')) {
				initI18n();
				initComponentSize();
			}
		});
		return {
			getUserInfos,
			onLayoutSetingClick,
			onHandleCommandClick,
			onScreenfullClick,
			onSearchClick,
			onComponentSizeChange,
			onLanguageChange,
			searchRef,
			layoutUserFlexNum,
			...toRefs(state),
		};
	},
});
</script>

<style scoped lang="scss">
.layout-navbars-breadcrumb-user {
	margin: 0;
	height: 63px;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	&-link {
		height: 100%;
		display: flex;
		align-items: center;
		white-space: nowrap;
		font-size: 16px;
		font-weight: 400;
		&-photo {
			width: 40px;
			height: 40px;
			border-radius: 100%;
		}
	}
	&-icon {
		padding: 5px 18px 0 18px;
		cursor: pointer;
		color: var(--next-bg-topBarColor);
		height: 50px;
		line-height: 50px;
		display: flex;
		align-items: center;
		&:hover {
			background: var(--next-color-user-hover);
			i {
				display: inline-block;
				animation: logoAnimation 0.3s ease-in-out;
			}
		}
	}
	::v-deep(.el-dropdown) {
		color: var(--next-bg-topBarColor);
	}
	::v-deep(.el-badge) {
		height: 40px;
		line-height: 40px;
		display: flex;
		align-items: center;
	}
	::v-deep(.el-badge__content.is-fixed) {
		top: 12px;
	}
	
}
</style>
