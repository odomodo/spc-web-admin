/*
 * @Author: Administrator 848563840@qq.com
 * @Date: 2022-05-26 09:20:20
 * @LastEditors: Administrator 848563840@qq.com
 * @LastEditTime: 2022-07-18 11:48:53
 * @FilePath: \chartc:\Users\Administrator\Desktop\share\code\spc-web-admin\src\utils\request.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Session } from '/@/utils/storage';
import errorCode from "/@/utils/http/errorCode";
import router from '/@/router'

// 配置新建一个 axios 实例
const service = axios.create({
	baseURL: import.meta.env.VITE_API_URL as any,
	timeout: 50000,
	headers: { 'Content-Type': 'application/json' },
});

// 添加请求拦截器
service.interceptors.request.use(
	(config) => {
		// 在发送请求之前做些什么 token
		if (Session.get('token')) {
			(<any>config).headers['token'] = `${Session.get('token')}`;
		}
		return config;
	},
	(error) => {
		// 对请求错误做些什么
		return Promise.reject(error);
	}
);

// 添加响应拦截器
service.interceptors.response.use(
	(res) => {
		// 未设置状态码则默认成功状态
		const code = res.data.code || 200;
		// 获取错误信息
		const msg = errorCode[code] || res.data.msg || errorCode["default"];
		if (code === 1101 || code === 1100) {
			let _currentRouter = router.currentRoute
			ElMessageBox.confirm(
				//"登录状态已过期，您可以继续留在该页面，或者重新登录",
				msg,
				"系统提示",
				{
					confirmButtonText: "重新登录",
					cancelButtonText: "取消",
					
				}
			).then(() => {
				Session.clear(); // 清除浏览器全部临时缓存
				window.location.href = '/';
			});
		} else if (code === 500) {
			ElMessage({
				message: msg,
				type: "error"
			});
			return Promise.reject(new Error(msg));
		}
		// else if (code !== 200) {
		//   Notification.error({
		//     title: msg
		//   });
		//   return Promise.reject("error");
		// }
		else {
			return res.data;
		}
	},
	(error) => {
		// 对响应错误做点什么
		if (error.message.indexOf('timeout') != -1) {
			ElMessage.error('网络超时');
		} else if (error.message == 'Network Error') {
			ElMessage.error('网络连接错误');
		} else {
			if (error.response.data) ElMessage.error(error.response.statusText);
			else ElMessage.error('接口路径找不到');
		}
		return Promise.reject(error);
	}
);

// 导出 axios 实例
export default service;
