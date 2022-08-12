import { Module } from 'vuex';
import { Session } from '/@/utils/storage';
import { UserInfosState, RootStateTypes } from '/@/store/interface/index';
import {
	getToken,
	setToken,
	removeToken,
	getPermissionKey,
	setPermissionKey,
	removePermissionKey
} from "/@/utils/storage";
import { login} from "/@/api/login";
const userInfosModule: Module<UserInfosState, RootStateTypes> = {
	namespaced: true,
	state: {
		userInfos: {
			authBtnList: [],
			photo: '',
			roles: [],
			time: 0,
			userName: '',
			token: getToken(),
			avatar: "",
			permissions: [],
			menuList: [],
			account: null,
			factory: "",
			isPerms: getPermissionKey()
		},

	},
	mutations: {
		// 设置用户信息
		getUserInfos(state, data: any) {
			state.userInfos = data;
		},
		SET_TOKEN: (state, token) => {
			state.userInfos.token = token;
		},
		SET_NAME: (state, name) => {
			state.userInfos.userName = name;
		},
		SET_FACTORY: (state, factory:any) => {
			state.userInfos.factory = factory;
		},
		SET_AVATAR: (state, avatar) => {
			state.userInfos.avatar = avatar;
		},
		SET_ROLES: (state, roles) => {
			state.userInfos.roles = roles;
		},
		SET_PERMISSIONS: (state, permissions) => {
			state.userInfos.permissions = permissions;
		},
		SET_MENULIST: (state, menuList) => {
			state.userInfos.menuList = menuList;
		},
		SET_ISPERMS: (state, isPerms) => {
			state.userInfos.isPerms = isPerms;
		}
	},
	actions: {
		// 设置用户信息
		async setUserInfos({ commit }, data: any) {
			if (data) {
				commit('getUserInfos', data);
			} else {
				if (Session.get('userInfo')) commit('getUserInfos', Session.get('userInfo'));
			}
		},
		// 登录
		Login({ commit }, _this) {
			const loginAccount = _this.loginAccount.trim();
			const loginPwd = _this.loginPwd;
			const factoryCode = _this.factoryCode;
			const ip = _this.ip;
			return new Promise(async (resolve, reject) => {
				let res = await login(loginAccount, loginPwd, factoryCode, ip);
				commit;
				res?.data?.identify == 2
					? setPermissionKey(true)
					: setPermissionKey(false);
				if (res.code === 0) {
					Session.set("token",res.data.token)
					Session.set("userId", res.data.userId)
					setToken(res.data.token);
					commit("SET_TOKEN", res.data.token);
					if (loginAccount != null) {
						this.state.userInfos.account = res.data;
						this.state.userInfos.userName = res.data.userName;
					}
					commit("SET_ISPERMS", getPermissionKey());
					sessionStorage.setItem("userName", res.data.userName);
					sessionStorage.setItem("factoryName", res.data.factoryName);
					sessionStorage.setItem("loginVersion", res.data.loginVersion);
					sessionStorage.setItem("factoryCode", res.data.factoryCode);
					sessionStorage.setItem("loginerIp", ip);
					resolve();
				} else {
					reject(res);
				}
				
			});
		},

		LoginSSO({ commit }, _this) {
			const loginAccount = _this.loginForm.loginAccount.trim();
			const loginPwd = _this.loginForm.loginPwd;
			const factoryCode = _this.loginForm.factoryCode;
			const ip = _this.loginForm.ip;
			const factoryName = _this.loginForm.factoryName;
			const loginVersion = _this.loginForm.loginVersion;
			const userName = _this.loginForm.userName;
			const token = _this.loginForm.token;
			let loginVO = _this.loginForm.loginVO;
			return new Promise(async (resolve, reject) => {
				commit;
				loginVO.identify = setPermissionKey(true);
				commit("SET_ISPERMS", getPermissionKey());
				sessionStorage.setItem("userName", userName);
				sessionStorage.setItem("factoryName", factoryName);
				sessionStorage.setItem("loginVersion", loginVersion);
				sessionStorage.setItem("factoryCode", factoryCode);
				sessionStorage.setItem("loginerIp", ip);

				if (loginVO) {
					setToken(token);
					commit("SET_TOKEN", token);
					if (loginAccount != null) {
						this.state.userInfos.account = loginVO;
					}
					resolve();
				}

				reject();
			});
		},

		// 退出系统
		LogOut({ commit, state }) {
			return new Promise((resolve, reject) => {
				commit("SET_TOKEN", "");
				commit("SET_ROLES", []);
				commit("SET_PERMISSIONS", []);
				removeToken();
				removePermissionKey();
				resolve();
			});
		},

		// 前端 登出
		FedLogOut({ commit }) {
			return new Promise(resolve => {
				commit("SET_TOKEN", "");
				removeToken();
				resolve();
			});
		}
	},
};

export default userInfosModule;
