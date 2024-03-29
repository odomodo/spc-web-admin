<template>
	<div class="layout-search-dialog">
		<!-- <el-dialog v-model="isShowSearch" width="300px" destroy-on-close :modal="false" fullscreen :show-close="false"> -->
		<el-autocomplete
			v-model="menuQuery"
			:fetch-suggestions="menuSearch"
			:placeholder="$t('message.user.searchPlaceholder')"
			ref="layoutMenuAutocompleteRef"
			@select="onHandleSelect"
			@blur="onSearchBlur"
		>
			<template #default="{ item }">
				<div>
					<svg-icon :iconName="item.meta.icon" class="mr5" />
					{{ $t(item.meta.title) }}
				</div>
			</template>
			<template #append>
				<el-button @click="openSearch" :title="$t('message.user.title2')" style="width: 55px; background-color: #5781c1; height: 36px">
					<svg-icon style="color: #fff" iconName="search" tipLable="搜索" class="search"
				/></el-button>
			</template>
		</el-autocomplete>
		<!-- </el-dialog> -->
	</div>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent, ref, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useStore } from '/@/store/index';

// 定义接口来定义对象的类型
interface SearchState {
	isShowSearch: boolean;
	menuQuery: string;
	tagsViewList: object[];
}
interface Restaurant {
	path: string;
	meta: {
		title: string;
	};
}

export default defineComponent({
	name: 'layoutBreadcrumbSearch',
	setup() {
		const layoutMenuAutocompleteRef = ref();
		const { t } = useI18n();
		const store = useStore();
		const router = useRouter();
		const state = reactive<SearchState>({
			isShowSearch: false,
			menuQuery: '',
			tagsViewList: [],
		});
		// 搜索弹窗打开
		const openSearch = () => {
			state.menuQuery = '';
			state.isShowSearch = true;
			initTageView();
			nextTick(() => {
				layoutMenuAutocompleteRef.value.focus();
			});
		};
		// 搜索弹窗关闭
		const closeSearch = () => {
			state.isShowSearch = false;
		};
		// 菜单搜索数据过滤
		const menuSearch = (queryString: string, cb: Function) => {
			let results = queryString ? state.tagsViewList.filter(createFilter(queryString)) : state.tagsViewList;
			cb(results);
		};
		// 菜单搜索过滤
		const createFilter: any = (queryString: string) => {
			return (restaurant: Restaurant) => {
				return (
					restaurant.path.toLowerCase().indexOf(queryString.toLowerCase()) > -1 ||
					restaurant.meta.title.toLowerCase().indexOf(queryString.toLowerCase()) > -1 ||
					t(restaurant.meta.title).indexOf(queryString.toLowerCase()) > -1
				);
			};
		};
		// 初始化菜单数据
		const initTageView = () => {
			if (state.tagsViewList.length > 0) return false;
			store.state.tagsViewRoutes.tagsViewRoutes.map((v: any) => {
				if (!v.meta.isHide && v.meta.search) {
					state.tagsViewList.push({ ...v });
				}
			});
		};
		// 当前菜单选中时
		const onHandleSelect = (item: any) => {
			let { path, redirect } = item;
			if (item.meta.isLink && !item.meta.isIframe) window.open(item.meta.isLink);
			else if (redirect) router.push(redirect);
			else router.push(path);
			closeSearch();
		};
		// input 失去焦点时
		const onSearchBlur = () => {
			closeSearch();
		};
		return {
			layoutMenuAutocompleteRef,
			openSearch,
			closeSearch,
			menuSearch,
			onHandleSelect,
			onSearchBlur,
			...toRefs(state),
		};
	},
});
</script>

<style scoped lang="scss">
:deep(.el-input__inner) {
	height: 36px !important;
	line-height: 36px !important;
}
:deep(.layout-search-dialog) {
	line-height: 63px;
	// margin-top: 15px;
	z-index: 1;
	// ::v-deep(.el-dialog) {
	// 	box-shadow: unset !important;
	// 	border-radius: 0 !important;
	// 	background: rgba(0, 0, 0, 0.5);
	// }
	::v-deep(.el-autocomplete) {
		// width: 560px;
		position: absolute;
		// line-height: 63px;
		// margin-top: 15px;
		// align-items: center;
		right: 45px;
		transform: translateX(-50%);
	}
}
::v-deep(.el-button--default) {
	border-radius: 0 5px 5px 0;
}

::v-deep(el-input__wrapper) {
	border-radius: 5px 0 0 5px;
}
</style>
