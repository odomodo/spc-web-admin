import { mean, sum } from "lodash";
import * as math from 'mathjs';

export function Cpk(spc: any) {
  let data = [];
  let opacity = 0.5;
  let format1 = "{value} %";
  let format2 = "{c} %";
  let as = [spc.usl, spc.lsl, spc.sigma * 3, spc.sigma * (-3), (spc.usl + spc.lsl) / 2]
  let x = [...new Set(as)].sort()

  // let X = spc.x
  // 求最大值
  let y_min_cpk = 999999;
  let y_max_cpk = 0;

  // for (let v in spc.barYaxis) {
  //   defectsNumberValue[v] = roundFun(defectsNumberValue[v], 4);
  // }
  let y_for_rang_cpk = spc.barYaxis.concat();
  for (let v in y_for_rang_cpk) {
    if (y_max_cpk < y_for_rang_cpk[v]) { y_max_cpk = y_for_rang_cpk[v] };
    if (y_min_cpk > y_for_rang_cpk[v]) { y_min_cpk = y_for_rang_cpk[v] };
  }
  let delta_x = (y_max_cpk - y_min_cpk) * 0.2;
  y_max_cpk = y_max_cpk + delta_x * 0.5;
  y_min_cpk = y_min_cpk - delta_x;

  // points_violating_lines.push([{lineStyle:{color:'#7BCCC4'},coord:[x1,y_min]},{coord:[x1,spc._data[x1]]}]);
  let violating_lines = [];

  let usl = [{ name: 'usl', lineStyle: { color: '#7BCCC4' }, coord: [String(spc.usl), 0] }, { coord: [String(spc.usl), y_max_cpk] }]
  let sl = [{ name: 'sl', lineStyle: { color: '#7BCCC4' }, coord: [String((spc.usl + spc.lsl) / 2), 0] }, { coord: [String((spc.usl + spc.lsl) / 2), y_max_cpk] }]
  let lsl = [{ name: 'lsl', lineStyle: { color: '#7BCCC4' }, coord: [String(spc.lsl), 0] }, { coord: [String(spc.lsl), y_max_cpk] }]
  let sigma1 = [{ name: '3sigma', lineStyle: { color: '#7BCCC4' }, coord: [String(spc.sigma * 3), 0] }, { coord: [String(spc.sigma * 3), y_max_cpk] }]
  let sigma2 = [{ name: '-3sigma', lineStyle: { color: '#7BCCC4' }, coord: [String(spc.sigma * (-3)), 0] }, { coord: [String(spc.sigma * (-3)), y_max_cpk] }]
  violating_lines.push(usl)
  violating_lines.push(lsl)
  violating_lines.push(sigma1)
  violating_lines.push(sigma2)
  violating_lines.push(sl)
  // let violating_lines_y = [spc.usl, spc.lsl, spc.sigma * 3, spc.sigma * (-3), (spc.usl + spc.lsl) / 2, ...spc.lineYaxis];


  let lineDataSet = {
    type: "line",
    //symbol: "none", // 默认是空心圆（中间是白色的），改成实心圆 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'
    smooth: true,
    yAxisIndex: 1,
    areaStyle: {
      opacity: opacity,
    },
    data: spc.lineYaxis, //正态分布的值
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
        show: false, //开启显示
        position: "top", //在上方显示
        textStyle: {
          //数值样式
          fontSize: 16,
        },
      },
    },

  };
  let barDataSet = {
    type: "bar",
    smooth: true,
    barWidth: 10,
    yAxisIndex: 0,
    areaStyle: {
      opacity: opacity,
    },
    data: spc.barYaxis, //柱子的值
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

        label: {
          formatter: format2,
          show: false, //开启显示
          position: "top", //在上方显示
          textStyle: {
            //数值样式
            fontSize: 16,
          },
        },
      },
    },
  };

  let points = {
    name: '',
    data: '',
    type: 'line',
    lineStyle: { color: '#018801' },
    markLine: {
      symbol: ['none', 'none', 'none'],
      silent: true,
      data: violating_lines
    },
  }
  data.push(lineDataSet, barDataSet, points);
  let option = {
    type: "scroll",
    title: {
      text: "",
    },

    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
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
      type: "category",
      data: spc.xAxis,
      postion: 'buttom'
    }, {
      show: false,
      name: "正态分布曲线",
      splitLine: { show: false },
      axisLine: { show: true },
      axisLabel: { show: true },
      axisTick: { show: false },
      boundaryGap: false,
      type: "category",
      data: x,
      postion: 'buttom'
    }],
    yAxis: [
      {
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
        show: true,
        type: "value",
        nameTextStyle: {
          align: "right",
          fontSize: 14,
          fontFamily: "Microsoft YaHei",
          fontWeight: 400,
          color: "#989DAA",
        },
        axisLabel: {
          formatter: "{value}",
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
    series: data,
  };

  return option;
}


//计算正态数值分布频率
function fun(x, u, a) {
  return (1 / (Math.sqrt(2 * Math.PI) * a)) * Math.exp(-1 * ((x - u) * (x - u)) / (2 * a * a));
}
//给数组添加数据
function addParam(arr, targets) {
  //是否是等于
  let flag = false;
  let target = parseFloat(targets);
  //最小
  if (target < parseFloat(arr[0])) {
    arr.unshift(target.toString());
    return arr;
  }
  //最大
  if (target > parseFloat(arr[arr.length - 1])) {
    arr.push(target.toString());
    return arr;
  }
  //中间
  for (let i = 0; i < arr.length; i++) {
    if (parseFloat(arr[i]) > target) {
      if (arr[i - 1] == target)
        flag = true;
      break;
    }

  }
  if (flag) {
    return arr;
  } else {
    arr.splice(0, 0, target.toString());
    return arr;
  }

}
//获取数据数组最大值
function getTop(arr: any) {
  let maxIndex = 0;
  for (let i = 0; i < arr.length; i++) {
    maxIndex = parseFloat(arr[i]) > parseFloat(arr[maxIndex]) ? i : maxIndex;
  }
  return parseFloat(arr[maxIndex]);
}

//获取数据数组最小值
function getButtom(arr: any) {
  let minIndex = 0;
  for (let i = 0; i < arr.length; i++) {
    minIndex = parseFloat(arr[i]) > parseFloat(arr[minIndex]) ? minIndex : i;
  }
  return parseFloat(arr[minIndex]);
}



//构造正态曲线特定值对象
function getParam(low: string, mean: string, up: string, top: number) {
  let res: any = {};
  res['low'] = low;
  res['mean'] = mean;
  res['up'] = up;
  res['top'] = top;
  return res;
}
//求数组和
const getSum = function (x: string, y: string) { return parseFloat(x) + parseFloat(y); };
//求平均值
const getMean = function (arr_x: string | any[], arr_y: any[]): any {
  let mean = 0;
  let sum = 0;
  let len = 1;
  if (arr_x.length == arr_y.length) {
    len = arr_y.reduce(getSum);
    for (let i = 0; i < arr_x.length; i++) {
      sum = sum + parseFloat(arr_x[i]) * parseFloat(arr_y[i]);
    }
  } else {
  }
  mean = (sum / len).toFixed(0);
  return mean;
};
//求标准偏差
const getStdev = function (arr_x: string | any[], arr_y: any[], avg: number): any {
  let sum = 0;
  let len = arr_y.reduce(getSum); //总样本数
  let subtractAvg = [];
  for (let i = 0; i < arr_x.length; i++) { //做平均差平方
    subtractAvg.push((arr_x[i] - avg) * (arr_x[i] - avg));
  }
  for (let j = 0; j < subtractAvg.length; j++) { //平均差平方和
    sum = sum + parseFloat(subtractAvg[j]) * parseFloat(arr_y[j]);
  }
  return Math.sqrt(sum / len); //标准偏差
};


export function Cpks(datas: any) {


  let yArr = []; //正态分布频率
  let xArr = []; //正态分布数值
  // const x = datas.data; //数据值分布列

  // const y = datas.freq; //数据值频数数组
  let x = datas.xaxis.split(',');
    let y = datas.yaxis.split(',')

  const mean = parseFloat(getMean(x, y)); //平均值
  console.log(mean)

  const stdev = parseFloat(getStdev(x, y, mean)); //
  console.log(stdev)

  //正态分布3倍标准差范围
  const low = mean - 1 * stdev;
  const up = mean + 1 * stdev;
  xArr = x.concat();
  xArr = addParam(xArr, low.toFixed(0).toString()); //增加最小值整数
  xArr = addParam(xArr, mean.toFixed(0).toString()); //增加平均值整数
  xArr = addParam(xArr, up.toFixed(0).toString()); //增加最大值整数

  const top = (1 / Math.sqrt(2 * Math.PI) * stdev);
  const mar = getParam(low.toFixed(0).toString(), mean.toFixed(0).toString(), up.toFixed(0).toString(), top);

  let usl = [{ coord: [String(datas.usl), 0] }, { coord: [String(datas.usl), top] }]
  let sl = [{ coord: [String((datas.usl + datas.lsl) / 2), 0] }, { coord: [String((datas.usl + datas.lsl) / 2), top] }]
  let lsl = [{ coord: [String(datas.lsl), 0] }, { coord: [String(datas.lsl), top] }]

  for (let j = 0; j < x.length; j++) {
    let res = fun(x[j], mean, stdev).toFixed(2);
    yArr.push(res);
  }

  let colors = ['#4BD3D6', '#FA61A3', '#0070C0', '#FF3428'];
  let option = {
    color: colors,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    grid: {
      right: '15%'
    },
    toolbox: {
      feature: {
        dataView: {
          show: false,
          readOnly: false
        },
        restore: {
          show: true
        },
        saveAsImage: {
          show: true
        }
      }
    },
    legend: {
      data: ['原数据频数', '正态分布']
    },
    xAxis: [{
      type: 'category',
      axisTick: {
        alignWithLabel: true
      },
      data: x
    }],
    yAxis: [{
      type: 'value',
      name: '概率',
      position: 'right',
      axisLine: {
        lineStyle: {
          color: colors[1]
        }
      },
      axisLabel: {
        formatter: '{value}'
      }
    },
    {
      type: 'value',
      name: '频数',
      position: 'left',
      axisLine: {
        lineStyle: {
          color: colors[0]
        }
      },
      axisLabel: {
        formatter: '{value}'
      }
    }
    ],
    series: [{
      name: '原数据频数',
      type: 'bar',
      yAxisIndex: 1,
      data: y
    },
    {
      name: '正态分布',
      type: 'line',
      smooth: true,
      yAxisIndex: 0,
      data: yArr
    },
    {
      name: '满分线',
      type: 'line',
      markLine: {
        itemStyle: {
          color: '#000',
          normal: {
            lineStyle: {
              width: 2,
              color: colors[2],
              type: 'dotted', //'dotted'虚线 'solid'实线
            },
            label: {
              show: true,
              position: 'end',
              color: 'black',
              formatter: function (params: any) {
                let str = mar.low;
                return str
              }
            }
          }
        },
        name: 'low',
        //symbol:'none',//去掉箭头
        data: [lsl]
      }
    },
    {
      name: '及格线',
      type: 'line',
      markLine: {
        itemStyle: {
          color: '#000',
          normal: {
            lineStyle: {
              width: 2,
              color: colors[3],
              type: 'solid', //'dotted'虚线 'solid'实线
            },
            label: {
              show: true,
              position: 'end',
              color: 'black',
              formatter: function (params: any) {
                let str = mar.up;
                return str
              }
            }
          }
        },
        name: 'up',
        yAxisIndex: 0,
        //symbol: 'none',//去掉箭头
        data: [usl]
      }
    },
    {
      name: '及格线',
      type: 'line',
      markLine: {
        itemStyle: {
          color: '#000',
          normal: {
            lineStyle: {
              width: 2,
              color: colors[3],
              type: 'solid', //'dotted'虚线 'solid'实线
            },
            label: {
              show: true,
              position: 'end',
              color: 'black',
              formatter: function (params: any) {
                let str = mar.up;
                return str
              }
            }
          }
        },
        name: 'up',
        yAxisIndex: 0,
        //symbol: 'none',//去掉箭头
        data: [sl]
      }
    },
    ]
  };
  return option;

};

export function Cpkes(datas: any) {
  let sigma = datas.sigma
  let y_for_rang = [];
  y_for_rang.push(getTop(datas.oldData),getButtom(datas.oldData), -sigma * 6 , sigma * 6);
  let max = getTop(y_for_rang);
  let min = getButtom(y_for_rang);

  // 组距（d）= 全距（R）÷组数（k）
  let R = max - min  //计算全距（R）：也叫极差

  let k = parseFloat((Math.sqrt(sum(datas.freq))).toFixed(0))   //分组数约等于样本容量的平方根

  let d = parseFloat((R / k).toFixed(1))   // 组距
  

  let x = []
  let y = []
  
  for (let i = 0; i < k; i++) {
    let a = 0;
    for (let j = 0; j < datas.oldData.length; j++) {
      x.push(parseFloat((((min + d * i) + (min + d * (i + 1))) / 2).toFixed(3)))
      if ((min + d * i) <= datas.oldData[j] && datas.oldData[j] < (min + d * (i + 1))) {
        a++;
      }
    }
    y.push(a)
  }
  let xArr = [...new Set(x)]

  let yArr = []

  const means = mean(datas.oldData); //平均值

  // console.log(calcNormallineDta(datas.data,datas.freq))

  const stdev = parseFloat(getStdev(datas.oldData, datas.freq, means)); //

  for (let j = 0; j < xArr.length; j++) {
    let res = fun(xArr[j], means, stdev).toFixed(2);
    yArr.push(res);
  }
  console.log(gaussFit(datas.data, datas.freq, means))

  let colors = ['#4BD3D6', '#FA61A3', '#0070C0', '#FF3428'];
  let option = {
    color: colors,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    grid: {
      right: '15%'
    },
    toolbox: {
      feature: {
        dataView: {
          show: false,
          readOnly: false
        },
        restore: {
          show: true
        },
        saveAsImage: {
          show: true
        }
      }
    },
    legend: {
      data: ['原数据频数', '正态分布']
    },
    xAxis: [{
      type: 'category',
      axisTick: {
        alignWithLabel: true
      },
      data: xArr
    }],
    yAxis: [{
      type: 'value',
      name: '概率',
      position: 'right',
      axisLine: {
        lineStyle: {
          color: colors[1]
        }
      },
      axisLabel: {
        formatter: '{value}'
      }
    },
    {
      type: 'value',
      name: '频数',
      position: 'left',
      axisLine: {
        lineStyle: {
          color: colors[0]
        }
      },
      axisLabel: {
        formatter: '{value}'
      }
    }
    ],
    series: [{
      name: '原数据频数',
      type: 'bar',
      yAxisIndex: 1,
      data: y
    },
    {
      name: '正态分布',
      type: 'line',
      smooth: true,
      yAxisIndex: 0,
      data: yArr
    },
   
    ]
  };
  return option;
}


function gaussFit(xOriginal, yOriginal, average) {
  var x = [];
  var y = [];
  // 过滤平滑部分
  for (var i = 0; i < yOriginal.length; i++)
      if (yOriginal[i] > average) {
          x.push(xOriginal[i]);
          y.push(yOriginal[i]);
      }

  var zMatrix = math.matrix(math.log(y));
  var zMatrixT = math.transpose(zMatrix);
  var xMatrix = math.ones([y.length, 3]);

  for (var j = 0; j < y.length; j++) {
      xMatrix[j][1] = x[j];
      xMatrix[j][2] = x[j] * x[j];
  }
  // 最小二乘法
  var xMatrixT = math.transpose(xMatrix);
  var bMatrix = math.multiply(math.multiply(math.inv(math.multiply(xMatrixT,xMatrix)), xMatrixT), zMatrixT);

  var b2 = math.subset(bMatrix, math.index(2));
  var b1 = math.subset(bMatrix, math.index(1));
  var b0 = math.subset(bMatrix, math.index(0));

  var s = -1 / b2;
  var xMaxi = s * b1 / 2;//均值
  var yMaxi = math.exp(b0 + xMaxi * xMaxi / s);//正态分布归一系数

  var yFit = []
  for (var n = 0; n < yOriginal.length; n++) {
      yFit.push(gaussFunc(xOriginal[n], xMaxi, yMaxi, s));
  }

  return yFit;
}

//正态分布公式
function gaussFunc(x, xMaxi, yMaxi, s) {
  return yMaxi * math.exp(-((x - xMaxi) * (x - xMaxi) / s));
}

let yData = [
  53, 53, 58.5, 78, 115, 154.5, 200, 300.5, 383.5, 518, 871.5, 1382.5, 2192.5, 3340.5, 5249, 8979.5, 15448, 26225, 44057.5, 71392, 109113, 159006, 224595.5, 307191.5, 405623, 520332, 646965.5, 785170.5, 930962.5, 1078572.5, 1227179.5, 1373870, 1522723.5, 1671622.5, 1812839.5, 1944963, 2068185, 2180604.5, 2280685.5, 2361196.5, 2417123.5, 2457786, 2483891, 2494890, 2496943.5, 2498862.5, 2500857.5, 2500175, 2501485, 2499141, 2492862, 2478390, 2459869.5, 2443707, 2430140, 2421345.5, 2404805, 2377592.5, 2334130, 2263164, 2163510.5, 2031018.5, 1872739.5, 1698482, 1507286, 1306381.5, 1114865.5, 938499, 771654.5, 619227.5, 488654.5, 379699.5, 289925.5, 218837.5, 165510.5, 126806, 97552, 75560, 59062, 46304.5, 36476, 28583, 22280.5, 16965.5, 12631.5, 9265.5, 6629, 4548.5, 3091, 2102.5, 1396.5, 921, 580, 345, 203.5, 137, 87, 46, 27.5, 12, 6
  ]
  
let xData=[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100]



/**
* 正态分布函数
* @@param x 数据
* @@param mean 平均数
* @@param stdev 标准差
*/
function normalDistributionfun(x, mean, stdev) {
  return (1 / (Math.sqrt(2 * Math.PI) * stdev)) * Math.exp(-1 * ((x - mean) * (x - mean)) / (2 * stdev * stdev));
}


function calcNormallineDta(xData, yData) {
          var result = [];
       
          var totalCount = 0;

          var firstMode = 0;//峰值起始位置
          var modeCount = 0;//找到目前数据的峰值
      
          for (var i = 0; i < yData.length;i++) {
              totalCount += yData[i];
              if (yData[i] > modeCount) {
                  modeCount = yData[i];
                  firstMode = i;
              }
           
          }
          //找出出x轴左右范围内的均值(关键代码)
          var mode = 0;
          var modeDuplicates = 0;
      
          var fellOffTop = true;

          for (var j = firstMode; j < yData.length; j ++) {
              if (yData[j] > yData[firstMode] - (yData[firstMode]/10)) {//10：分布线系数
                  mode += j ;
                  modeDuplicates++;
              }
              else {
                  fellOffTop = false;
                  break;
              }
          }

          var fellOffBottom = true;
      
          for (var k=firstMode-1;k>=0;k--) {
              if (yData[k] > yData[firstMode] - (yData[firstMode] / 10)) {//10：分布线系数
                  mode += k;
                  modeDuplicates++;
              }
              else {
                  fellOffBottom = false;
                  break;
              }
          }
          var mean;
          if (fellOffBottom || fellOffTop) {
             
              mean = firstMode;
          }
          else {
              mean = mode/ modeDuplicates;
          }
          //求出标准差
        
          var stdev = 0;
      
          for (var n = 0; n < yData.length;n++) {
              stdev += Math.pow((n - mean), 2) * yData[n];
          }
      
          stdev /= totalCount-1;
      
          stdev = Math.sqrt(stdev);
          //带入正态分布公式
          for (var m = 0; m < yData.length;m++) {
              var probability =normalDistributionfun(m,mean,stdev);
              result.push(Math.round(probability * totalCount*100)/100);
          }
          return result;
      }