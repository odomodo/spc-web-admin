import { number } from "@intlify/core-base";
import { mean, cloneDeep } from "lodash";


export function Cpk(spc_data: any) {
  const spc = cloneDeep(spc_data)
  let opacity = 0.5;
  let format2 = "{c} %";


  // 求最大值
  let y_min_cpk = 999999;
  let y_max_cpk = 0;
  let min = Math.min(...spc.xAxis, spc.lsl)
  let max = Math.max(...spc.xAxis, spc.usl)
  // let average = mean(spc.xAxis)
  let average = Number(spc.mean.toFixed(2))
  let standardDeviation = spc.stdev.toFixed(2)
  let yArr = []
  let xArr = []
  for (let i = 0; i < spc.xAxis.length; i++) {
    yArr.push([Number(spc.xAxis[i].toFixed(2)), spc.lineYaxis[i]])
  }
  for (let i = 0; i < spc.barYaxis.length; i++) {
    xArr.push([Number(spc.zhiXAxis[i].toFixed(2)), Number(spc.barYaxis[i].toFixed(2))])
  }


  let y_for_rang_cpk = spc.barYaxis.concat();
  for (let v in y_for_rang_cpk) {
    if (y_max_cpk < y_for_rang_cpk[v]) { y_max_cpk = y_for_rang_cpk[v] };
    if (y_min_cpk > y_for_rang_cpk[v]) { y_min_cpk = y_for_rang_cpk[v] };
  }
  let delta_x = (y_max_cpk - y_min_cpk) * 0.2;
  y_max_cpk = y_max_cpk + delta_x * 0.5;
  y_min_cpk = y_min_cpk - delta_x;

  let option = {
    type: "scroll",
    title: {
      text: "",
    },

    tooltip: {
      show: true,
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      formatter: function (params:any) {
        if(params[0].componentIndex == 1){
          return params[0].data[0]+ '<br />'+ '频数'+':'+params[0].data[1]
        }
      },
    },
    legend: {
      show: false,
      data: ["正态分布曲线", "实际分布"],
    },
    xAxis: [{
      name: "正态分布曲线",
      splitLine: { show: false },
      axisLine: { show: true },
      axisLabel: { show: true },
      axisTick: { show: false },
      nameTextStyle: {
        align: "left",
        fontSize: 14,
        fontFamily: "Microsoft YaHei",
        fontWeight: 400,
        color: "#989DAA",
      },
      boundaryGap: false,
      type: "value",
      min: min,
      max: max,
      postion: 'buttom'
    },

    ],
    yAxis: [
      {
        splitLine: { show: false },
        axisLine: { show: true },
        axisLabel: { show: true },
        axisTick: { show: false },
        
        name: "频数",
        min: 0,
        max: y_max_cpk,
        nameTextStyle: {
          align: "right",
          fontSize: 14,
          fontFamily: "Microsoft YaHei",
          fontWeight: 400,
          color: "#989DAA",
        },
        type: "value",
        position: 'right',

      },
      {
        splitLine: { show: false },
        axisLine: { show: true },
        axisLabel: { show: true },
        axisTick: { show: false },
        show: true,
       
        type: "value",
        nameTextStyle: {
          align: "right",
          fontSize: 14,
          fontFamily: "Microsoft YaHei",
          fontWeight: 400,
          color: "#989DAA",
        },

      },
    ],
    grid: [
      {
        show: false,
        top: "15%",
        bottom: "10%",
        left: "5%",
        right: "12%",
      },
    ],
    series: [
      {
        type: "line",
        symbol: "none", // 默认是空心圆（中间是白色的），改成实心圆 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'
        // smooth: true,
        yAxisIndex: 1,
        areaStyle: {
          opacity: opacity,
        },
        data: yArr, //正态分布的值
        name: "正态分布曲线",
        itemStyle: {

          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#FD723CFF", // 0% 处的颜色
              },
              {
                offset: 0.45,
                color: "#FD723CFF", // 45% 处的颜色
              },
              {
                offset: 0.85,
                color: "#FF5B82FF", // 85% 处的颜色
              },
              {
                offset: 1,
                color: "#FF5B82FF", // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
          label: {
            formatter: format2,
            show: true, //开启显示
            position: "top", //在上方显示
            textStyle: {
              //数值样式
              fontSize: 16,
            },
          },
        },
        // 警示线
        markLine: {
          symbol: ['none'], // 箭头方向
          lineStyle: {
            type: "silent",
            color: "green",
          },
         
          label: {
            show: true,
            position: "middle"
          },
          data: [
            {
              name: 'USL',
              lineStyle: {
                type: 'dashed',
                color: 'green'
              },
              xAxis: spc.usl.toFixed(2),
              // 当 n 倍标准差在坐标轴外时，将其隐藏，否则它会默认显示在最小值部分，容易引起混淆
              label: {
                position: 'end',
                formatter: 'USL:' + spc.usl.toFixed(2),
                color: 'green'
              },
            },
            {
              name: 'LSL',
              lineStyle: {
                type: 'dashed',
                color: 'green'
              },
              xAxis: spc.lsl.toFixed(1),
              // 当 n 倍标准差在坐标轴外时，将其隐藏，否则它会默认显示在最小值部分，容易引起混淆
              label: {
                position: 'end',
                formatter: 'LSL:' + spc.lsl.toFixed(1),
                color: 'green'
              },
            },
            {
              name: '平均值',
              // type: 'average',
              xAxis: average.toFixed(2),
              lineStyle: {
                type: 'dashed',
                color: 'red'
              },
              label: {
                position: 'end',
                formatter: '中心线:' + average.toFixed(2),
                color: 'red',
                show: false
              },

            },
            {
              name: 'target',
              // type: 'average',
              xAxis: ((spc.lsl + spc.usl) / 2).toFixed(2),
              lineStyle: {
                type: 'dashed',
                color: 'green'
              },
              label: {
                position: 'end',
                formatter: 'target:' + ((spc.lsl + spc.usl) / 2).toFixed(2),
                show: true,
                color: 'green'
              },

            },
          ]
        }

      },
      {
        type: "bar",
        smooth: true,
        barCategoryGap: 0, //柱子之间的间距
        // barWidth: 10,
        yAxisIndex: 0,
        areaStyle: {
          opacity: opacity,
        },
        data: xArr, //柱子的值
        name: "实际分布",
        itemStyle: {

          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#79c7f3FF", // 0% 处的颜色
              },
              {
                offset: 1,
                color: "#7E7CEB", // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
        },



      }
    ],
  };

  return option;
}

/**
 * @Description： 计算一倍标准差范围
 * @Author： ChengduMeng
 * @Date： 2020-11-27 15:26:03
 * */
function standarDevRangeOfOne(average: number, standardDeviation: number) {
  return {
    low: average + (- 1) * standardDeviation,
    up: average + 1 * standardDeviation
  }
}
/**
* @Description： 计算三倍标准差范围
* @Author： ChengduMeng
* @Date： 2020-11-27 15:29:43
* */
function standarDevRangeOfTwo(average: number, standardDeviation: number) {
  return {
    low: average + (- 2) * standardDeviation,
    up: average + 2 * standardDeviation
  }
}
/**
* @Description： 计算三倍标准差范围
* @Author： ChengduMeng
* @Date： 2020-11-27 15:30:49
* */
function standarDevRangeOfThree(average: number, standardDeviation: number) {
  return {
    low: average - 3 * standardDeviation,
    up: average + 3 * standardDeviation
  }
}

// {
//   name: '一倍标准差',
//   xAxis: standarDevRangeOfOne(average, standardDeviation).low.toFixed(2),
//   // 当 n 倍标准差在坐标轴外时，将其隐藏，否则它会默认显示在最小值部分，容易引起混淆
//   lineStyle: {
//     opacity: (min > standarDevRangeOfOne(average, standardDeviation)
//       .low) ? 0 : 1,
//       color:'rgb(87, 129, 193)',
//       type: 'dashed'
//   },
//   label: {
//     show: !(min > standarDevRangeOfOne(average, standardDeviation).low),
//     position: 'end',
//     color:'rgb(87, 129, 193)',
//     formatter: '-1sigma:' + standarDevRangeOfOne(average, standardDeviation).low.toFixed(2)
//   }
// },
// {
//   name: '一倍标准差',
//   xAxis: standarDevRangeOfOne(average, standardDeviation).up.toFixed(2),
//   lineStyle: {
//     color:'rgb(87, 129, 193)',
//     type: 'dashed',
//     opacity: (max < standarDevRangeOfOne(average, standardDeviation).up) ?
//       0 : 1
//   },
//   label: {
//     color:'rgb(87, 129, 193)',
//     show: !(max < standarDevRangeOfOne(average, standardDeviation).up),
//     position: 'end',
//     formatter: '1sigma:' + standarDevRangeOfOne(average, standardDeviation).up.toFixed(2)
//   }
// }, {
//   name: '二倍标准差',
//   xAxis: standarDevRangeOfTwo(average, standardDeviation).low.toFixed(2),
//   lineStyle: {
//     type: 'dashed',
//     color:'rgb(87, 129, 193)',
//     opacity: (min > standarDevRangeOfTwo(average, standardDeviation)
//       .low) ? 0 : 1
//   },
//   label: {
//     color:'rgb(87, 129, 193)',
//     show: !(min > standarDevRangeOfTwo(average, standardDeviation).low),
//     position: 'end',
//     formatter: '-2sigma:' + standarDevRangeOfTwo(average, standardDeviation).low.toFixed(2)
//   }
// }, {
//   name: '二倍标准差',
//   xAxis: standarDevRangeOfTwo(average, standardDeviation).up.toFixed(2),
//   lineStyle: {
//     type: 'dashed',
//     color:'rgb(87, 129, 193)',
//     opacity: (max < standarDevRangeOfTwo(average, standardDeviation)
//       .up) ? 0 : 1
//   },
//   label: {
//     color:'rgb(87, 129, 193)',
//     show: !(max < standarDevRangeOfTwo(average, standardDeviation).up),
//     position: 'end',
//     formatter: '2sigma:' + standarDevRangeOfTwo(average, standardDeviation).up.toFixed(2)
//   }
// }, {
//   name: '三倍标准差',
//   xAxis: standarDevRangeOfThree(average, standardDeviation).low.toFixed(2),
//   lineStyle: {
//     type: 'dashed',
//     color:'rgb(87, 129, 193)',
//     opacity: (min > standarDevRangeOfThree(average, standardDeviation)
//       .low) ? 0 : 1
//   },
//   label: {
//     color:'rgb(87, 129, 193)',
//     show: !(min > standarDevRangeOfThree(average, standardDeviation).low),
//     position: 'end',
//     formatter: '-3sigma:' + standarDevRangeOfThree(average, standardDeviation).low.toFixed(2)
//   }
// }, {
//   name: '三倍标准差',
//   xAxis: standarDevRangeOfThree(average, standardDeviation).up.toFixed(2),
//   lineStyle: {
//     type: 'dashed',
//     color:'rgb(87, 129, 193)',
//     opacity: (max < standarDevRangeOfThree(average, standardDeviation)
//       .up) ? 0 : 1,
//   },
//   label: {
//     color:'rgb(87, 129, 193)',
//     show: !(max < standarDevRangeOfThree(average, standardDeviation).up),
//     position: 'end',
//     formatter: '3sigma:'+ standarDevRangeOfThree(average, standardDeviation).up.toFixed(2)
//   }
// },