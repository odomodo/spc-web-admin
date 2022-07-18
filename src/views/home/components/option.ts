/*
 * @Author: Administrator 848563840@qq.com
 * @Date: 2022-07-14 15:52:11
 * @LastEditors: Administrator 848563840@qq.com
 * @LastEditTime: 2022-07-14 16:10:28
 * @FilePath: \chartc:\Users\Administrator\Desktop\share\code\spc-web-admin\src\views\home\components\option.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import * as echarts from 'echarts';

export function baseOption(chart:any){
    let option = null;

    let dataAxis = ['X-R图', 'X-R图', 'M-R图', 'M-R图', 'P图', 'NP图', 'C图', 'C图'];
    // prettier-ignore
    let data = [220, 182, 191, 234, 290, 330, 310, 123,];
    option = {
        title: {
          text: '示例',
        },
        grid: {
              top: '40px',
              left: '60px',
              right: '30px',
              height: '85%'
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
            show: true
          },
          
          z: 10
        },
        yAxis: {
          axisLine: {
            show: true
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#939599'
          },
          splitLine: { show: false },
        },
        dataZoom: [
          {
            type: 'inside'
          }
        ],
        series: [
          {
            type: 'bar',
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