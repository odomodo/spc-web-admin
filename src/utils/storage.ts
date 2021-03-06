/**
 * window.localStorage 浏览器永久缓存
 * @method set 设置永久缓存
 * @method get 获取永久缓存
 * @method remove 移除永久缓存
 * @method clear 移除全部永久缓存
 */

import Cookies from "js-cookie";

const TokenKey = "Admin-Token";

const PermissionKey = "User-Permission";

export function getToken() {
	return Cookies.get(TokenKey);
}

export function setToken(token: string) {
	return Cookies.set(TokenKey, token);
}

export function removeToken() {
	return Cookies.remove(TokenKey);
}

export function getPermissionKey() {
	return Cookies.get(PermissionKey);
}

export function setPermissionKey(isPermission: string) {
	return Cookies.set(PermissionKey, isPermission);
}

export function removePermissionKey() {
	return Cookies.remove(PermissionKey);
}

export const Local = {
	// 设置永久缓存
	set(key: string, val: any) {
		window.localStorage.setItem(key, JSON.stringify(val));
	},
	// 获取永久缓存
	get(key: string) {
		let json: any = window.localStorage.getItem(key);
		return JSON.parse(json);
	},
	// 移除永久缓存
	remove(key: string) {
		window.localStorage.removeItem(key);
	},
	// 移除全部永久缓存
	clear() {
		window.localStorage.clear();
	},
	
};

/**
 * window.sessionStorage 浏览器临时缓存
 * @method set 设置临时缓存
 * @method get 获取临时缓存
 * @method remove 移除临时缓存
 * @method clear 移除全部临时缓存
 */
export const Session = {
	// 设置临时缓存
	set(key: string, val: any) {
		window.sessionStorage.setItem(key, JSON.stringify(val));
	},
	// 获取临时缓存
	get(key: string) {
		let json: any = window.sessionStorage.getItem(key);
		return JSON.parse(json);
	},
	// 移除临时缓存
	remove(key: string) {
		window.sessionStorage.removeItem(key);
	},
	// 移除全部临时缓存
	clear() {
		window.sessionStorage.clear();
	},
	setJSON(key: string, jsonValue: any) {
		if (jsonValue != null) {
			this.set(key, JSON.stringify(jsonValue))
		}
	},
	getJSON(key: string) {
		const value = this.get(key)
		if (value != null) {
			return JSON.parse(value)
		}
	},
};
