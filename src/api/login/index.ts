import request from '/@/utils/http/request';

/**
 * 登录api接口集合
 * @method signIn 用户登录
 * @method signOut 用户退出登录
 */
export function useLoginApi() {
	return {
		signIn: (params: object) => {
			return request({
				url: '/user/signIn',
				method: 'post',
				data: params,
			});
		},
		signOut: (params: object) => {
			return request({
				url: '/user/signOut',
				method: 'post',
				data: params,
			});
		},
	};
}


// 登录方法
export function login(loginAccount, loginPwd, factoryCode,ip) {
	return request({
	  url: "/web/system/sysUser/login.do",
	  method: "post",
	  data: {
		loginAccount,
		loginPwd,
		factoryCode,
		ip
	  }
	});
  }


  
// 退出方法
export function reqLogout() {
	return request({
	  url: "/web/system/sysUser/logout.do",
	  method: "post"
	});
  }
  
  // 工厂列表Url
  export function getModelListUrl() {
	return "/web/system/factory/ajaxList.do";
  }
  
  // 查询列表
  export function queryList(params = {}) {
	return request({
	  url: getModelListUrl(),
	  method: "get",
	  params
	});
  }
  
  // 检测账号权限
  export function loginBeforVerificat(loginAccount, loginPwd) {
	return request({
	  url: "/web/system/sysUser/loginBeforVerificat",
	  method: "post",
	  data: {
		loginAccount,
		loginPwd
	  }
	});
  }
  
  // 判断帐号是否已登录
  export function getRedisAllKeyForAccount(loginAccount) {
	return request({
	  url: "/web/system/sysUser/getRedisAllKeyForAccount",
	  method: "post",
	  data: {
		loginAccount
	  }
	});
  }
  
  
  // 帐号强行登出
  export function forceLogout(loginAccount) {
	return request({
	  url: "/web/system/sysUser/forceLogout",
	  method: "post",
	  data: {
		loginAccount
	  }
	});
  }
  
  // 帐号强行登出
  export function cancelLogout(loginAccount) {
	return request({
	  url: "/web/system/sysUser/cancelLogout",
	  method: "post",
	  data: {
		loginAccount
	  }
	});
  }
  
  // 联动下拉框
  export function loginBeforGetFacrotyData(userId, factoryCode) {
	return request({
	  url: "/web/system/sysUser/loginBeforGetFacrotyData",
	  method: "post",
	  data: {
		userId,
		factoryCode
	  }
	});
  }
  