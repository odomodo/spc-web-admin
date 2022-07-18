<!-- 尽量别改动，这页面逻辑异常恶心，能跑起来就好了，又用cookie，又用了state，每个地方都有耦合 -->
<template>
	<el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login-content-form">
		<el-form-item prop="loginAccount">
			<div class="box df aic jcc">
				<img src="../../../assets/img/账号_icon@2x.png" class="ab" />
				<el-input
					v-model="loginForm.loginAccount"
					type="text"
					auto-complete="off"
					placeholder="账号"
					@blur="detectionPermission"
					onfocus="this.removeAttribute('readonly');"
				>
				</el-input>
			</div>
		</el-form-item>
		<el-form-item prop="loginPwd">
			<div class="box df aic jcc">
				<img src="../../../assets/img/密码_icon@2x.png" class="ab"/>
				<el-input
					v-model="loginForm.loginPwd"
					type="password"
					auto-complete="off"
					placeholder="密码"
					onfocus="this.removeAttribute('readonly');"
					@blur="detectionPermission"
					@keyup.enter.native="handleLogin"
				>
				</el-input>
			</div>
			
		</el-form-item>

		<el-form-item v-if="!isAdmin" prop="factoryCode">
		<div class="box df aic jcc">
			<img src="../../../assets/img/工厂_icon@2x.png" class="ab"/>
			<el-select v-model="loginForm.factoryCode" placeholder="请选择工厂" style="width: 100%">
				<el-option v-for="(factory, index) in childrenDp" :label="factory.factoryName" :value="factory.factoryCode" :key="index"></el-option>
			</el-select>
		</div>
		</el-form-item>
		<el-form-item v-if="false">
			<el-select v-model="disabledI18n" placeholder="请选择语言" style="width: 100%">
				<el-option v-for="item in options" :key="item.lable" :label="item.lable" :value="item.value"></el-option>
			</el-select>
		</el-form-item>
		<div style="width: 100%; margin-top: 40px" class="df aic jcc">
			<el-button type="" style="width:110px; height:45px; border-radius: 23px" @click="resetForm(loginFormRef)">重置</el-button>
			<el-button :loading="loading" type="primary" style="width:110px; height:45px;  border-radius: 23px" @click.native.prevent="handleLogin">
				<span v-if="!loading" style="letter-spacing: 0.3em; font-size: 14px">{{ $t('message.account.accountBtnText') }}</span>
				<span v-else>登 录 中...</span>
			</el-button>
		</div>
	</el-form>
</template>

<script lang="ts" setup>
import { toRefs, reactive, computed, getCurrentInstance, ref, onMounted, unref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { initFrontEndControlRoutes } from '/@/router/frontEnd';
import { initBackEndControlRoutes } from '/@/router/backEnd';
import { useStore } from '/@/store/index';
import { Session, Local } from '/@/utils/storage';
import { formatAxis } from '/@/utils/formatTime';
import other from '/@/utils/other';
import Cookies from 'js-cookie';

//方法
import { loginBeforVerificat, getRedisAllKeyForAccount, forceLogout } from '/@/api/login';
import { debug } from 'console';

const { t } = useI18n();
const store = useStore();
const loginFormRef = ref();
const route = useRoute();
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
		factoryCode: [{ required: true, trigger: 'blur', message: '请选择工厂' }],
	},

	redirect: undefined,

	childrenDp: [] as Array<any>,
	// 是否是管理员
	isAdmin: false,
});
const { isAdmin, childrenDp, redirect, loginRules, loginForm, cookiePassword, codeUrl, dataSourceCfg, ip, disabledI18n, loading } = toRefs(state);

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
	if (!state.loginForm.loginPwd) {
		return;
	}
	let res: any = await loginBeforVerificat(state.loginForm.loginAccount, state.loginForm.loginPwd);
	if (!(res.code === 0)) {
		Cookies.set('clusterGroupNo', 'QAS_A', { expires: 60 * 60 * 3 });
		state.childrenDp = [];
		state.loginForm.factoryCode = '';
		state.loginForm.factoryName = '';
		ElMessage.error(res.msg);
	} else {
		// 以秒为单位，设置3小时过去
		Cookies.set('clusterGroupNo', res.data.cookieKey, { expires: 60 * 60 * 3 });
		if (!res.data.factories && res.data.userId == 'admin') {
			state.isAdmin = true;
			return;
		}
		if (res.data.factories.length <= 1) {
			state.isAdmin = false;
			state.loginForm.factoryCode = res.data.factories[0].factoryCode;
			state.loginForm.factoryName = res.data.factories[0].factoryName;
			state.childrenDp = res.data.factories;
		} else {
			state.childrenDp = res.data.factories;
			if (res.data.roleType == 0) {
				state.isAdmin = true;
			} else {
				state.isAdmin = false;
			}
		}
	}
};

// 登录
const handleLogin = () => {
	loginFormRef.value.validate(async (valid: any) => {
		if (valid) {
			state.loading = true;
			if (state.loginForm.rememberMe) {
				Cookies.set('loginAccount', state.loginForm.loginAccount, {
					expires: 30,
				});
				Cookies.set('loginPwd', state.loginForm.loginPwd, {
					expires: 30,
				});
				Cookies.set('rememberMe', String(state?.loginForm.rememberMe), {
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
			getRedisAllKeyForAccount(state.loginForm.loginAccount).then((res: any) => {
				if (res.code == 0) {
					if (res.data == false) {
						ElMessageBox.confirm('该帐号已登录，是否强行登录该帐号？', '系统提示', {
							confirmButtonText: '强行登录',
							cancelButtonText: '取消',
						}).then(async () => {
							await forceLogout(state.loginForm.loginAccount).then((ress: any) => {
								if (ress.code == 0) {
									onSignIn();
								}
							});
						});
					} else {
						onSignIn();
					}
				}
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
	if (state.loginForm.loginAccount === 'admin') {
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
				: 'http://n.sinaimg.cn/sinakd20220117ac/200/w1080h720/20220117/4878-3f4504898bf88b38117ed32ec381a287.jpg',
		time: new Date().getTime(),
		roles: defaultRoles,
		authBtnList: defaultAuthBtnList,
	};
	store
		.dispatch('userInfos/Login', loginForm.value)
		.then(async () => {
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
				// store.state.routesList.routesList = []
				await initBackEndControlRoutes();
				// 执行完 initBackEndControlRoutes，再执行 signInSuccess
				signInSuccess();
			}
		})
		.catch((error) => {
			ElMessage({
				type: 'error',
				message: error.msg || '登录异常，请稍后再试',
			});
		});
	state.loading = false;
};
// 登录成功后的跳转
const signInSuccess = () => {
	if (state.disabledI18n != '简体中文') {
		onLanguageChange(state.disabledI18n);
	}
	// 初始化登录成功时间问候语
	let currentTimeInfo = currentTime.value;
	// 登录成功，跳到转首页
	// 添加完动态路由，再进行 router 跳转，否则可能报错 No match found for location with path "/"
	// 如果是复制粘贴的路径，非首页/登录页，那么登录成功后重定向到对应的路径中
	const toPath = decodeURIComponent((route.query?.redirect || '/') as string);
	if (toPath == '/' || toPath == '/home') {
		if (store.state.userInfos.userInfos.userName === 'admin') {
			router.replace('/menu_manage');
		} else {
			router.replace('/home');
		}
	} else {
		router.replace(toPath);
	}
	const signInText = t('message.signInText');
	ElMessage.success(`${currentTimeInfo}，${signInText}`);
};
const resetForm = (formEl: any) => {
	if (!formEl) return;
	formEl.resetFields();
	state.isAdmin = false;
	state.childrenDp = [];
};
// 页面加载时
onMounted(() => {
	// if (Local.get('themeConfig')) {
	// 	disabledI18n.value = Local.get('themeConfig').globalI18n
	// 	initI18n();
	// }
});
</script>

<style scoped lang="scss">
.box{
	 width: 100%;
	//  padding-bottom: 10px;
	 margin-bottom: 6px;;
}
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
::v-deep(input:-webkit-autofill) {
	box-shadow: 0 0 0px 1000px #c7c6c6 inset !important;
	// -webkit-text-fill-color: #ededed !important;
	-webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
	background-color: transparent;
	background-image: none;
	transition: background-color 50000s ease-in-out 0s;
}
::v-deep(.el-form-item--default .el-form-item__error){
	padding-left: 27px !important;
}

.ab{
	width: 15px;
	height: 15px;
	margin-right: 10px;
}
:deep(.el-select){
	box-shadow: none inset !important;

}


</style>
