import request from '/@/utils/http/request';

/**
 * 后端控制菜单模拟json，路径在 https://gitee.com/lyt-top/vue-next-admin-images/tree/master/menu
 * 后端控制路由，isRequestRoutes 为 true，则开启后端控制路由
 * @method getMenuAdmin 获取后端动态路由菜单(admin)
 * @method getMenuTest 获取后端动态路由菜单(test)
 */
// 获取路由
export const getRouters = () => {
	return request({
		url: "/web/system/menu/ajaxList.do",
		method: "get"
	});
};

// 获取权限按钮
export const getPermissionButton = (menuUrl: any) => {
	return request({
		url: "/web/sys/rolePermissionItem/getMenuFunctionPermissionByMenuId",
		method: "post",
		data: {
			menuUrl
		}
	});
};
