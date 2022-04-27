<template>
	<!-- <el-form ref="loginform" :model="ruleForm" size="large" class="login-content-form">
		<el-form-item class="login-animation1">
			<el-input type="text" :placeholder="$t('message.account.accountPlaceholder1')" v-model="ruleForm.userName" clearable autocomplete="off">
				<template #prefix>
					<el-icon class="el-input__icon"><ele-User /></el-icon>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item class="login-animation2">
			<el-input
				:type="isShowPassword ? 'text' : 'password'"
				:placeholder="$t('message.account.accountPlaceholder2')"
				v-model="ruleForm.password"
				autocomplete="off"
			>
				<template #prefix>
					<el-icon class="el-input__icon"><ele-Unlock /></el-icon>
				</template>
				<template #suffix>
					<i
						class="iconfont el-input__icon login-content-password"
						:class="isShowPassword ? 'icon-yincangmima' : 'icon-xianshimima'"
						@click="isShowPassword = !isShowPassword"
					>
					</i>
				</template>
			</el-input>
		</el-form-item>
		<el-form-item class="login-animation3">{{disabledI18n}}
			<el-select>
				<el-option value=""></el-option>
			</el-select>
		</el-form-item>
		<el-form-item class="login-animation3">
		<el-select v-model="disabledI18n" >
				<el-option 
					v-for="item in options"
						:key="item.lable"
						:label="item.lable"
						:value="item.value"
				></el-option>
			</el-select>
		</el-form-item>
		<el-form-item class="login-animation4">
		<el-button size="large" class="login-content-submit" round @click="resetForm(loginform)" :loading="loading.signIn">
				<span>重置</span>
			</el-button>
			<el-button size="large" type="primary" class="login-content-submit" round @click="onSignIn" :loading="loading.signIn">
				<span>{{ $t('message.account.accountBtnText') }}</span>
			</el-button>
		</el-form-item>
	</el-form> -->
	<el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login-content-form">
		<el-form-item prop="loginAccount">
			<el-input v-model="loginForm.loginAccount" type="text" auto-complete="off" placeholder="账号" @blur="showDnlink"> </el-input>
		</el-form-item>
		<el-form-item prop="loginPwd">
			<el-input
				v-model="loginForm.loginPwd"
				type="password"
				auto-complete="off"
				placeholder="密码"
				@blur="detectionPermission"
				@keyup.enter.native="handleLogin"
			>
			</el-input>
		</el-form-item>

		<el-form-item v-if="!isAdmin" prop="factoryCode">
			<el-select v-model="loginForm.factoryCode" placeholder="请选择工厂" style="width: 100%">
				<el-option v-for="(factory, index) in childrenDp" :label="factory.factoryName" :value="factory.factoryCode" :key="index"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item>
			<el-select v-model="disabledI18n" placeholder="请选择语言" style="width: 100%">
				<el-option v-for="item in options" :key="item.lable" :label="item.lable" :value="item.value"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item style="width: 100%; margin-bottom: 0">
			<el-button type="" style="width: 30%; border-radius: 15px" @click="resetForm(loginFormRef)">重置</el-button>
			<el-button :loading="loading" type="primary" style="width: 30%; border-radius: 15px" @click.native.prevent="handleLogin">
				<span v-if="!loading" style="letter-spacing: 0.3em; font-size: 14px">{{ $t('message.account.accountBtnText') }}</span>
				<span v-else>登 录 中...</span>
			</el-button>
		</el-form-item>
	</el-form>
</template>

<script lang="ts" setup>
import { toRefs, reactive, defineComponent, computed, getCurrentInstance, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { initFrontEndControlRoutes } from '/@/router/frontEnd';
import { initBackEndControlRoutes,getBackEndControlRoutes } from '/@/router/backEnd';
import { useStore } from '/@/store/index';
import { Session, Local } from '/@/utils/storage';
import { formatAxis } from '/@/utils/formatTime';
import other from '/@/utils/other';
import Cookies from 'js-cookie';
//方法
import { loginBeforVerificat, getUserIP, getRedisAllKeyForAccount, forceLogout } from '/@/api/login';

const { t } = useI18n();
const store = useStore();
const route = useRoute();
const loginFormRef = ref();
const router = useRouter();
const state = reactive({
	loading: false,
	disabledI18n: '简体中文',
	ip: '',
	dataSourceCfg: '',
	codeUrl: '',
	cookiePassword: '',
	loginForm: {
		loginAccount: '',
		loginPwd: '',
		rememberMe: false,
		factoryCode: '',
		ip: '0.0.0.0',
		cookieKey: '',
		factoryName: '',
	},
	loginRules: {
		loginAccount: [{ required: true, trigger: 'blur', message: '用户名不能为空' }],
		loginPwd: [{ required: true, trigger: 'blur', message: '密码不能为空' }],
	},

	redirect: undefined,

	childrenDp: [],
	// 是否是管理员
	isAdmin: false,
});
const { isAdmin, childrenDp, redirect, loginRules, loginForm, cookiePassword, codeUrl, dataSourceCfg, ip, disabledI18n, loading } = toRefs(state);

const showDnlink = () => {
	state.isAdmin = false;
	state.loginForm.factoryCode = '';
	state.childrenDp = [];
};

const options = [
	{ value: 'ch-cn', lable: '简体中文' },
	{ value: 'ch-tw', lable: '繁體中文' },
	{ value: 'en', lable: 'English' },
];
const { proxy } = <any>getCurrentInstance();

// 获取布局配置信息
const getThemeConfig = computed(() => {
	return store.state.themeConfig.themeConfig;
});
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

// 检测账号权限
const detectionPermission = async ({ target }: any) => {
	let res = await loginBeforVerificat(state.loginForm.loginAccount, target.value);
	console.log(res);

	if (!res.flag) {
		Cookies.set('clusterGroupNo', 'QAS_A', { expires: 60 * 60 * 3 });
		ElMessage.error(res.msg);
	} else {
		// 以秒为单位，设置3小时过去
		Cookies.set('clusterGroupNo', res.data.cookieKey, { expires: 60 * 60 * 3 });

		if (!res.data.factories && res.data.userId == 'admin') {
			state.isAdmin = true;
			return;
		}
		if (res.data.factories.length <= 1) {
			state.loginForm.factoryCode = res.data.factories[0].factoryCode;
			state.loginForm.factoryName = res.data.factories[0].factoryName;
			state.childrenDp = res.data.factories;
		} else {
			state.childrenDp = res.data.factories;
			if (res.data.roleType == 0) state.isAdmin = true;
		}
	}
};

// 登录
const handleLogin = () => {
	loginFormRef.value.validate(async (valid) => {
		if (valid) {
			state.loading = true;
			if (state.loginForm.rememberMe) {
				Cookies.set('loginAccount', state.loginForm.loginAccount, {
					expires: 30,
				});
				Cookies.set('loginPwd', state.loginForm.loginPwd, {
					expires: 30,
				});
				Cookies.set('rememberMe', state.loginForm.rememberMe, {
					expires: 30,
				});
				Cookies.set('ip', state.loginForm.ip, {
					expires: 30,
				});
			} else {
				Cookies.remove('loginAccount');
				Cookies.remove('loginPwd');
				Cookies.remove('rememberMe');
				Cookies.remove('ip');
			}
			await getRedisAllKeyForAccount(state.loginForm.loginAccount)
				.then((res) => {
					if (res.code == 0) {
						if (res.data == false) {
							ElMessageBox.confirm('该帐号已登录，是否强行登录该帐号？', '系统提示', {
								confirmButtonText: '强行登录',
								cancelButtonText: '取消',
								type: 'warning',
							}).then(async () => {
								await forceLogout(state.loginForm.loginAccount).then((res) => {
									if (res.code == 0) {
										onSignIn();
									}
								});
							});
						} else {
							onSignIn();
						}
					} else {
						onSignIn();
					}
				})
				.catch(() => {
					onSignIn();
				});
		}
		state.loading = false;
	});
};

// 时间获取
const currentTime = computed(() => {
	return formatAxis(new Date());
});
// 登录
const onSignIn = async () => {
	// 模拟数据
	state.loading = true;
	let defaultRoles: Array<string> = [];
	let defaultAuthBtnList: Array<string> = [];
	// admin 页面权限标识，对应路由 meta.roles，用于控制路由的显示/隐藏
	let adminRoles: Array<string> = ['admin'];
	// admin 按钮权限标识
	let adminAuthBtnList: Array<string> = ['btn.add', 'btn.del', 'btn.edit', 'btn.link'];
	// test 页面权限标识，对应路由 meta.roles，用于控制路由的显示/隐藏
	let testRoles: Array<string> = ['common'];
	// test 按钮权限标识
	let testAuthBtnList: Array<string> = ['btn.add', 'btn.link'];
	// 不同用户模拟不同的用户权限
	if (state.loginForm.loginAccount=== 'admin') {
		defaultRoles = adminRoles;
		defaultAuthBtnList = adminAuthBtnList;
	} else {
		defaultRoles = testRoles;
		defaultAuthBtnList = testAuthBtnList;
	}
	// 用户信息模拟数据
	const userInfos = {
		userName: state.loginForm.loginAccount,
		photo:
			state.loginForm.loginAccount === 'admin'
				? 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1813762643,1914315241&fm=26&gp=0.jpg'
				: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=317673774,2961727727&fm=26&gp=0.jpg',
		time: new Date().getTime(),
		roles: defaultRoles,
		authBtnList: defaultAuthBtnList,
	};
	await store.dispatch('userInfos/Login', loginForm.value);
	// 存储用户信息到浏览器缓存
	Session.set('userInfo', userInfos);
	// 1、请注意执行顺序(存储用户信息到vuex)
	store.dispatch('userInfos/setUserInfos', userInfos);
	if (!store.state.themeConfig.themeConfig.isRequestRoutes) {
		// 前端控制路由，2、请注意执行顺序
		await initFrontEndControlRoutes();
		signInSuccess();
	} else {
		// 模拟后端控制路由，isRequestRoutes 为 true，则开启后端控制路由
		// 添加完动态路由，再进行 router 跳转，否则可能报错 No match found for location with path "/"
		await initBackEndControlRoutes();
		// 执行完 initBackEndControlRoutes，再执行 signInSuccess
		signInSuccess();
	}
};
// 登录成功后的跳转
const signInSuccess = () => {
	// 初始化登录成功时间问候语
	let currentTimeInfo = currentTime.value;
	// 登录成功，跳到转首页
	// 添加完动态路由，再进行 router 跳转，否则可能报错 No match found for location with path "/"
	// 如果是复制粘贴的路径，非首页/登录页，那么登录成功后重定向到对应的路径中
	if (route.query?.redirect) {
		router.push({
			path: <string>route.query?.redirect,
			query: Object.keys(<string>route.query?.params).length > 0 ? JSON.parse(<string>route.query?.params) : '',
		});
	} else {
		router.push('/');
	}
	// 登录成功提示
	// 关闭 loading
	state.loading = true;
	const signInText = t('message.signInText');
	ElMessage.success(`${currentTimeInfo}，${signInText}`);
};
const resetForm = (formEl: FormInstance | undefined) => {
	if (!formEl) return;
	formEl.resetFields();
	state.isAdmin = false;
	state.childrenDp = [];
};
</script>

<style scoped lang="scss">
.login-content-form {
	margin-top: 20px;
	@for $i from 1 through 4 {
		.login-animation#{$i} {
			opacity: 0;
			animation-name: error-num;
			animation-duration: 0.5s;
			animation-fill-mode: forwards;
			animation-delay: calc($i/10) + s;
		}
	}
	.login-content-password {
		display: inline-block;
		width: 20px;
		cursor: pointer;
		&:hover {
			color: #909399;
		}
	}
	.login-content-code {
		width: 100%;
		padding: 0;
		font-weight: bold;
		letter-spacing: 5px;
	}
	.login-content-submit {
		width: 25%;
		letter-spacing: 2px;
		font-weight: 300;
		margin-top: 15px;
	}
}
</style>
