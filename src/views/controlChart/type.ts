/*
 * @Author: liuxinyi-yuhang 1029301987@qq.com
 * @Date: 2022-05-17 15:37:48
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @LastEditTime: 2022-05-18 16:13:56
 * @FilePath: \spc-web-admin\src\views\controlChart\type.d.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

interface fn { 
  (): any;
}
export interface ruleItem {
  discriminationRuleCode: string,
  currentRule: fn,
  ruleBasis: string,
  nvalue: string | number,
  mvalue: string | number,
  kvalue: string | number,
}