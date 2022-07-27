/*
 * @Author: Administrator 848563840@qq.com
 * @Date: 2022-07-14 15:52:11
 * @LastEditors: Administrator 848563840@qq.com
 * @LastEditTime: 2022-07-19 11:30:41
 * @FilePath: \spc-web-admin\src\views\home\components\option.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import * as echarts from 'echarts';

export function baseOption(chart: any) {
  let option = null;

  let dataAxis = chart.dataAxis || [];
  // prettier-ignore
  let data = chart.data || [];
  option = {
    title: {
      text: '',
    },
    grid: {
      top: '40px',
      left: '60px',
      right: '0',
      height: '80%'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer:{
        type: 'line',
        lineStyle: {
          color: '#F2FAF7',
          width: 104,
          type: 'solid',
        },
        z: 0
      }
    },
    xAxis: {
      data: dataAxis,
      axisLabel: {
        inside: false,
        color: '#939599'
      },
      axisTick: {
        show: false
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#EBEFF5'
        }
      },

      z: 10
    },
    yAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: '#EBEFF5'
        } 
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#939599'
      },
      splitLine: { show: false},

    },
    dataZoom: [
      {
        type: 'inside'
      }
    ],
    series: [
      {
        type: 'bar',
        barWidth: 72,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 1, color: '#40BC92' },
            { offset: 0, color: '#C6EFE1' }
          ])
        },
        data: data
      }
    ]
  };
  return option;
}