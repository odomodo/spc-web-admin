import { RouteRecordRaw } from 'vue-router';

/**
 * 路由meta对象参数说明
 * meta: {
 *      title:          菜单栏及 tagsView 栏、菜单搜索名称（国际化）
 *      isLink：        是否超链接菜单，开启外链条件，`1、isLink:true 2、链接地址不为空`
 *      isHide：        是否隐藏此路由
 *      isKeepAlive：   是否缓存组件状态
 *      isAffix：       是否固定在 tagsView 栏上
 *      isIframe：      是否内嵌窗口，，开启条件，`1、isIframe:true 2、链接地址不为空`
 *      roles：         当前路由权限标识，取角色管理。控制路由显示、隐藏。超级管理员：admin 普通角色：common
 *      icon：          菜单、tagsView 图标，阿里：加 `iconfont xxx`，fontawesome：加 `fa xxx`
 * 		search: 		搜索框中是否出现，一级路由不出现
 * }
 */

/**
 * 定义动态路由
 * @description 未开启 isRequestRoutes 为 true 时使用（前端控制路由），开启时第一个顶级 children 的路由将被替换成接口请求回来的路由数据
 * @description 各字段请查看 `/@/views/system/menu/component/addMenu.vue 下的 ruleForm`
 * @returns 返回路由菜单数据
 */
export const dynamicRoutes: Array<RouteRecordRaw> = [
	{
		path: '/',
		name: '/',
		component: () => import('/@/layout/index.vue'),
		redirect: '/home',
		meta: {
			isKeepAlive: true,
		},
		children: [
			{
				path: '/home',
				name: 'home',
				component: () => import('/@/views/home/index.vue'),
				meta: {
					title: '首页',
					isLink: '',
					isHide: false,
					isKeepAlive: false,
					isAffix: false,
					isIframe: false,
					icon: 'menuIcon-home_icon',
					search: true
				},
			},
			
		]
	},
	{
		path: '/counting/:Id',
		name: 'counting',
		component: () => import('/@/views/sampleData/counting/index.vue'),
		meta: {
			title: '单项数据录入计数型',
			isHide: true,
			search: false
		},
	},
	{
		path: '/metrological/:Id',
		name: 'metrological',
		component: () => import('/@/views/sampleData/metrological/index.vue'),
		meta: {
			title: '单项数据录入计量型',
			isHide: true,
			search: false
		},
	},
	{
		path: '/inputDataShow/:Id',
		name: 'inputDataShow',
		component: () => import('/@/views/sampleData/inputDataShow/index.vue'),
		meta: {
			title: '数据录入查看',
			isHide: true,
			search: false
		},
	},
	{
		path: '/nodo',
		name: 'nodo',
		component: () => import('/@/views/home/model/nodo.vue'),
		meta: {
			title: '未处理',
			isHide: true,
			search: false
		},
	}
];

/**
 * 定义静态路由
 * @description 前端控制直接改 dynamicRoutes 中的路由，后端控制不需要修改，请求接口路由数据时，会覆盖 dynamicRoutes 第一个顶级 children 的内容（全屏，不包含 layout 中的路由出口）
 * @returns 返回路由菜单数据
 */
export const staticRoutes: Array<RouteRecordRaw> = [
	{
		path: '/login',
		name: 'login',
		component: () => import('/@/views/login/index.vue'),
		meta: {
			title: '登录',
		},
	},
	{
		path: '/404',
		name: 'notFound',
		component: () => import('/@/views/error/404.vue'),
		meta: {
			title: 'message.staticRoutes.notFound',
		},
	},
	{
		path: '/401',
		name: 'noPower',
		component: () => import('/@/views/error/401.vue'),
		meta: {
			title: 'message.staticRoutes.noPower',
		},
	},
	
	/**
	 * 提示：写在这里的为全屏界面，不建议写在这里
	 * 请写在 `dynamicRoutes` 路由数组中
	 */
	// {
	// 	path: '/visualizingDemo1',
	// 	name: 'visualizingDemo1',
	// 	component: () => import('/@/views/visualizing/demo1.vue'),
	// 	meta: {
	// 		title: 'message.router.visualizingLinkDemo1',
	// 	},
	// },
	// {
	// 	path: '/visualizingDemo2',
	// 	name: 'visualizingDemo2',
	// 	component: () => import('/@/views/visualizing/demo2.vue'),
	// 	meta: {
	// 		title: 'message.router.visualizingLinkDemo2',
	// 	},
	// },
];
