/*
 * @Author: liuxinyi-yuhang 1029301987@qq.com
 * @Date: 2022-05-18 13:31:10
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @LastEditTime: 2022-07-15 10:06:36
 * @FilePath: \spc-web-admin\src\views\controlChart\components\tableData.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ruleItem } from './type.ts'
 const table: ruleItem[] = [
  {
    discriminationRuleCode: 'R0',
    currentRule: function() {
      return `超出规格限制`
    },
    ruleBasis: '',
  },
  {
    discriminationRuleCode: 'R1',
    currentRule: function() {
      return `${this.nvalue}个点落在${this.kvalue}σ区以外`
    },
    ruleBasis: '[n]个点落在[k]倍σ 区以外',
    nvalue: '1', kvalue: '3',
  },
  {
    discriminationRuleCode: 'R2',
    currentRule: function() {
      return `连续${this.nvalue}个点落在中心线同一侧`
    },
    ruleBasis: '连续[n]个点落在中心线同一侧',
    nvalue: '9',
  },
  {
    discriminationRuleCode: 'R3',
    currentRule: function() {
      return `连续${this.nvalue}个点递增或递减`
    },
    ruleBasis: '连续[n]个点递增或递减 ',
    nvalue: '6',
  },
  {
    discriminationRuleCode: 'R4',
    currentRule: function() {
      return `连续${this.nvalue}个点中相邻点交替上下`
    },
    ruleBasis: '连续[n]个点中相邻点交替上下',
    nvalue: '14'
  },
  {
    discriminationRuleCode: 'R5',
    currentRule: function() {
      return `连续${this.nvalue}个点中有${this.mvalue}个点落在中心线同一侧的${this.kvalue}σ以外`
    },
    ruleBasis: '连续[n]点中有[m]点落在中心线同一侧的[k]倍σ区以外',
    nvalue: '3', mvalue: '2', kvalue: '2'
  },
  {
    discriminationRuleCode: 'R6',
    currentRule: function() {
      return `连续${this.nvalue}个点中有${this.mvalue}个点落在中心线的同一侧的${this.kvalue}σ以外`
    },
    ruleBasis: '连续[n]点中有[m]点落在中心线同一侧的[k]倍σ区以外',
    nvalue: '5', mvalue: '4', kvalue: '1'
  },
  {
    discriminationRuleCode: 'R7',
    currentRule: function() {
      return `连续${this.nvalue}个点落在中心线两侧的${this.kvalue}σ 区内`
    },
    ruleBasis: '连续[n]个点落在中心线两侧的[k]倍σ区内 ',
    nvalue: '15', kvalue: '1'
  },
  {
    discriminationRuleCode: 'R8',
    currentRule: function() {
      return `连续${this.nvalue}个点落在中心线两侧且无一在${this.kvalue}σ区内`
    },
    ruleBasis: '连续[n]个点落点中心线两侧且无一在[k]倍σ区内 ',
    nvalue: '8', kvalue: '1'
  },
]

export default table