/*
 * @Author: 曾宇奇
 * @Date: 2021-04-01 15:02:49
 * @LastEditTime: 2022-06-13 15:44:28
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @Description: In User Settings Edit
 * @FilePath: \mes-ui\src\utils\clearInputForm.js
 */

/**
 * @description: 清空表单数据
 * @param {Object} formData
 * @return {Object}
 */

export function clearFormData(formData: { [x: string]: string; }) {
  for (let key in formData) {
    formData[key] = "";
  }
  return formData;
}

/**
 * @description: 过滤对象中不需要的键值对并返回过滤后的对象
 * @param {Object} obj 被过滤对象
 * @param {Array} arr 过滤属性数组
 * @return {Object}
 */

export function filterObj(obj: { [x: string]: any; }, arr: string | string[]) {
  if (typeof obj !== "object" || !Array.isArray(arr)) {
    throw new Error("参数格式不正确");
  }
  const result = {};
  Object.keys(obj)
    .filter(key => !arr.includes(key))
    .forEach(key => {
      result[key] = obj[key];
    });
  return result;
}

/**
 * @description: 过滤对象中不需要的键值对并返回过滤后的对象
 * @param {Object} obj 被过滤对象
 * @param {Array} arr 过滤属性数组
 * @return {Object}
 */

export function filterCurrObj(obj: { [x: string]: any; }, arr: string | string[]) {
  if (typeof obj !== "object" || !Array.isArray(arr)) {
    throw new Error("参数格式不正确");
  }
  const result = {};
  Object.keys(obj)
    .filter(key => arr.includes(key))
    .forEach(key => {
      result[key] = obj[key];
    });
  return result;
}

/**
 * @description: 清空表单数据
 * @param {Object} form
 * @return {Object}
 */

export function resizeForm(form: string | number) {
  return this.$options.data()[form];
}

  // 表单重置
  export function resetForm(this: any, refName: string | number) {
    if (this.$refs[refName]) {
      this.$refs[refName].resetFields();
    }
  }

//判断是否闰年
//参数        intYear 代表年份的值
//return    true: 是闰年   false: 不是闰年
function IsLeapYear(intYear: number) {
  if (intYear % 100 == 0) {
    if (intYear % 400 == 0) {
      return true;
    }
  } else {
    if (intYear % 4 == 0) {
      return true;
    }
  }
  return false;
}

export function awaitWraper(promise: Promise<any>) {
  return promise.then((res: any) => [null, res]).catch((err: any) => [err, null]);
}

//加月 日期功能 OK
export function AddMonthNumsDate(p_date: string | number | Date, MonthNums: string | number) {
  if (!MonthNums && MonthNums == "") {
    MonthNums = 0;
  }
  MonthNums = parseInt(MonthNums);
  var t_date = new Date(p_date);
  //记录开始月日
  var M = t_date.getMonth() + 1;
  var D = t_date.getDate();
  //获取当前月最大天数
  var s_max_D = GetMaxDays(t_date.getFullYear(), t_date.getMonth(), 0);
  var isMaxDay = false;
  if (D == s_max_D) isMaxDay = true;
  //
  t_date.setMonth(t_date.getMonth() + parseInt(MonthNums));
  //
  //ShowAlert(isMaxDay + " " + s_max_D + " " + D);
  if (isMaxDay == true) {
    var e_max_D = GetMaxDays(t_date.getFullYear(), t_date.getMonth(), 0);
    t_date.setDate(e_max_D);
  }
  if (0 != MonthNums) {
    t_date.setDate(t_date.getDate() - 1); //减一天
  }
  //
  return t_date.Format("yyyy-MM-dd");
}
//获取年月的最大天数 OK
function GetMaxDays(year: number, month: number, day_0: number) {
  //2月
  if (IsLeapYear(year) == true) {
    if (1 == month) return 29; //是闰年2月29天
  } else {
    if (1 == month) return 28; //是平年2月28天
  }
  if (0 == month) return 31; //1月
  if (2 == month) return 31; //3月
  if (3 == month) return 30; //4月
  if (4 == month) return 31; //5月
  if (5 == month) return 30; //6月
  if (6 == month) return 31; //7月
  if (7 == month) return 31; //8月
  //
  if (8 == month) return 30; //9月
  if (9 == month) return 31; //10月
  if (10 == month) return 30; //11月
  if (11 == month) return 31; //12月
}

//Date类原型扩展方法
Date.prototype.Format = function(fmt: string) {
  //author: meizz
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
    "H+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
  return fmt;
};

/**
 * @description: 校验是否包含中文(包含：true)
 * @param code 字符串
 * @return {Object}
 * @author zfs
 */
export function isContainChineseChar(code: string) {
  return /[\u4E00-\u9FA5]/g.test(code);
}

/**
 * @description: Element校验是否包含中文
 * @param 
 * @return 
 * @author 
 */
 export const hasChinase = (rule: any, value: any, callback: any) => {
  if (value) {
     if (/[\u4E00-\u9FA5]/g.test(value)) {
       callback(new Error('编码不能输入汉字!'));
     } else {
       callback();
     }
   }
   callback();
 }