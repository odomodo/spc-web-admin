/*
 * @Author: liuxinyi-yuhang 1029301987@qq.com
 * @Date: 2022-05-18 13:31:10
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @LastEditTime: 2022-05-18 16:14:19
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
      return `${this.nvalue}个点落在${this.mvalue}σ区以外`
    },
    ruleBasis: '一个点超出3σ，超出管制界限 ',
    nvalue: '1', mvalue: '3',
  },
  {
    discriminationRuleCode: 'R2',
    currentRule: function() {
      return `连续${this.nvalue}个点落在中心线同一侧`
    },
    ruleBasis: '连续K个点在中心线同侧',
    nvalue: '9',
  },
  {
    discriminationRuleCode: 'R3',
    currentRule: function() {
      return `连续${this.nvalue}个点递增或递减`
    },
    ruleBasis: '连续K个点全部递增或者递减',
    nvalue: '6',
  },
  {
    discriminationRuleCode: 'R4',
    currentRule: function() {
      return `连续${this.nvalue}个点中相邻点交替上下`
    },
    ruleBasis: '连续K个点上下交错',
    nvalue: '14'
  },
  {
    discriminationRuleCode: 'R5',
    currentRule: function() {
      return `连续${this.nvalue}个点中有${this.mvalue}个点落在中心线同一侧的${this.kvalue}`
    },
    ruleBasis: 'K+1个点中有K个点，距离中心线（同侧）大于2σ',
    nvalue: '3', mvalue: '2', kvalue: '2'
  },
  {
    discriminationRuleCode: 'R6',
    currentRule: function() {
      return `连续${this.nvalue}个点中有${this.mvalue}个点落在中心线的同一侧的${this.kvalue}σ`
    },
    ruleBasis: 'K+1个点中有K个点，距离中心线（同侧）大于1σ',
    nvalue: '5', mvalue: '4', kvalue: '1'
  },
  {
    discriminationRuleCode: 'R7',
    currentRule: function() {
      return `连续${this.nvalue}个点落在中心线两侧的${this.mvalue}σ 区内`
    },
    ruleBasis: '连续K个点，距离中心线任一侧1σ以内',
    nvalue: '15', mvalue: '1'
  },
  {
    discriminationRuleCode: 'R8',
    currentRule: function() {
      return `连续${this.nvalue}个点落在中心线${this.mvalue}侧且无一在1σ 区内`
    },
    ruleBasis: '连续K个点，距离中心线（同侧）大于1σ',
    nvalue: '8', mvalue: '1'
  },
]

export default table