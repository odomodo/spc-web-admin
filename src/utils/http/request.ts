import axios from "axios";
import { ElMessage, ElMessageBox } from 'element-plus';
import errorCode from "/@/utils/http/errorCode";
import Cookies from "js-cookie";
import { Session, Local } from '/@/utils/storage';
import router from '/@/router'

//参数数据转换
function setData(e:any) {
  let t,
    n,
    i,
    r,
    o,
    s,
    a,
    c = "";
  for (t in e)
    if (((n = e[t]), n instanceof Array))
      for (a = 0; a < n.length; ++a)
        (o = n[a]),
          (i = t + "[" + a + "]"),
          (s = {}),
          (s[i] = o),
          (c += setData(s) + "&");
    else if (n instanceof Object)
      for (r in n)
        (o = n[r]),
          (i = t + "." + r),
          (s = {}),
          (s[i] = o),
          (c += setData(s) + "&");
    else
      void 0 !== n &&
        null !== n &&
        (c += encodeURIComponent(t) + "=" + encodeURIComponent(n) + "&");
  return c.length ? c.substr(0, c.length - 1) : c;
}

  // 添加按钮防抖
function changeloading(type: Boolean) {
  // let btns = document.querySelectorAll('.el-button')
  // for (let i = 0; i < btns.length; i++) {
  //   if (type) {
  //     btns[i].classList.add('is-loading')
  //     btns[i].classList.add('is-loading')
      
  //   } else {
  //     btns[i].classList.remove('is-loading')
  //   }
  // }
}

axios.defaults.headers["Content-Type"] =
  "application/x-www-form-urlencoded;charset=UTF-8";
// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_URL as any,
  // 超时
  timeout: 10000,
});
// request拦截器
service.interceptors.request.use(
  config => {
    changeloading(true)
    config.data = setData(config.data);
    let reqToken = Cookies.get("Admin-Token") || "";
    let reqlang = Cookies.get("lang") || "";
    config.headers["lang"]=reqlang;
    // if(config.headers>0){
    //   config.headers["Content-Type"]=config.headers;
    // }
    if (reqToken.length > 0) {
      //config.headers["Authorization"] = "Bearer " + getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
      config.headers["token"] = reqToken; // getToken();

    }
    return config;
  },
  error => {
    Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  res => {
    changeloading(false)
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
      ).then(async () => {
        Session.clear(); // 清除浏览器全部临时缓存
				window.location.href =  '/';
      });
    } else if (code === 500) {
      ElMessage({
        message: msg,
        type: "error"
      });
      return Promise.reject(new Error(msg));
    }
    else if (code == 404) {
      ElMessage.error({
        message: '接口连接异常,请刷新',
      });
      return Promise.reject("error");
    }
    else {
      return res.data;
    }
  },
  error => {
    changeloading(false)
    let { message } = error;
    if (message == "Network Error") {
      message = "后端接口连接异常";
    } else if (message.includes("timeout")) {
      message = "系统接口请求超时";
    } else if (message.includes("Request failed with status code")) {
      message = "系统接口" + message.substr(message.length - 3) + "异常";
    }
    ElMessage({
      message: message,
      type: "error",
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);
// 通用下载方法
export function download(url: string, params: any, filename: string) {
  return service.post(url, params, {
     headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    responseType: 'blob'
  }).then((data) => {
    const content = data
    const blob = new Blob([content])
    if ('download' in document.createElement('a')) {
      const elink = document.createElement('a')
      elink.download = filename
      elink.style.display = 'none'
      elink.href = URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href)
      document.body.removeChild(elink)
    } else {
      navigator.msSaveBlob(blob, filename)
    }
  }).catch((r) => {
    console.error(r)
  })
}

/**
* 参数处理
* @param {*} params  参数
*/
export function tansParams(params) {
  if(typeof params !== 'object'){
    return params;
  }
    let result = ''
    for (const propName of Object.keys(params)) {
        const value = params[propName];
        var part = encodeURIComponent(propName) + "=";
        if (value !== null && typeof(value) !== "undefined") {
            if (typeof value === 'object') {
                for (const key of Object.keys(value)) {
                    let params = propName + '[' + key + ']';
                    var subPart = encodeURIComponent(params) + "=";
                    result += subPart + encodeURIComponent(value[key]) + "&";
                }
            } else {
                result += part + encodeURIComponent(value) + "&";
           }
        }
    }
    return result
}

export default service;
