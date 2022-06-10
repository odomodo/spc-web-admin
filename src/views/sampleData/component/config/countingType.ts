//计数型
import * as echarts from 'echarts';
export function basePOption(spc: any,index:number, config?: any) {

  let option = {};
  let color_array = ["#FF0000", "#EF6A32", "#AAD962", "#03C383", "#710162", "#FBBF45"];

  //CL UCL和LCL控制线
  let point_lines_p = new Array();

  //标准上下线
  let defectRateValue = spc.defectRate //缺陷率
  let x = Array.from({ length: defectRateValue.length }, (v, i) => i + 1);
  let UCL = spc.excelUcl || [];
  let LCL = spc.excelLcl || [];

  let MAXUSL = Math.max(...UCL);
  let MINLSL = Math.min(...UCL);

  let AVG = { p: spc.tSpcPVo.defectiveProductNumber / spc.tSpcPVo.checkNumber * 100 };

  //求最大值和最小值，用于y控制   ::v-deep::v-deep> 上图
  let y_min_p = 999999;
  let y_max_p = 0;
  for (let v in defectRateValue) {
    defectRateValue[v] = roundFun(defectRateValue[v], 4);
  }
  let y_for_rang_p = defectRateValue.concat();
  y_for_rang_p.push(MAXUSL);
  y_for_rang_p.push(MINLSL);
  for (let v in y_for_rang_p) {
    if (y_max_p < y_for_rang_p[v]) { y_max_p = y_for_rang_p[v] };
    if (y_min_p > y_for_rang_p[v]) { y_min_p = y_for_rang_p[v] };
  }
  let delta_x = (y_max_p - y_min_p) * 0.2;
  y_max_p = y_max_p + delta_x * 0.5;
  y_min_p = y_min_p - delta_x;



  // 上下图规格线
  let line_avg_p = { name: 'CL', symbol: 'none', label: { show: true, position: 'end', formatter: 'CL:' + Math.round(AVG.p * 100) / 100, color: 'rgba(114, 189, 29, 1)' }, yAxis: AVG.p, lineStyle: { color: 'rgba(114, 189, 29, 1)' } };
  let  line_ucl_p = [{ name: 'UCL', symbol: 'none', label: { show: true, position: 'end', formatter: 'UCL:' + Math.round(UCL[index] * 100) / 100, color: 'rgba(247, 164, 39, 1)' }, yAxis: UCL[index], lineStyle: { color: 'rgba(247, 164, 39, 1)' } }];
  let  line_lcl_p = [{ name: 'LCL', symbol: 'none', label: { show: true, position: 'end', formatter: 'LCL:' + Math.round(LCL[index] * 100) / 100, color: 'rgba(235, 113, 94, 1)'}, yAxis: LCL[index], lineStyle: { color: 'rgba(235, 113, 94, 1)' } }];
  point_lines_p = func4(point_lines_p);
  point_lines_p.push(line_avg_p);




  option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      extraCssText: 'width: 170px'
    },
    legend: {
      data: ['观测值','UCL','LCL'],
      left: 10,
      show: false
    },
    grid: 
      {
        left: '60px',
        right: '60px',
        height: '80%'
      },

    
    xAxis: 
      {
        type: 'category',
        boundaryGap: false,
        axisLine: { onZero: true },
        splitLine: { show: false },
        axisLabel: { show: true },
        axisTick: { show: false },
        data: x
      },
    
    yAxis: 
      {
        name: '不合格品率',
        min: Math.round(y_min_p),
        max: Math.round(y_max_p),
        type: 'value',

      },

    
    series: [
      {
        name: '不合格品率',
        type: 'line',
        symbolSize: 8,
        lineStyle: { color: 'rgba(87, 129, 193, 1)' },
          itemStyle: { color: 'rgba(87, 129, 193, 1)' },
        smooth: false,
        symbol: 'circle',
        markLine: {
          symbol: ['none', 'none', 'none'],
          silent: true,
          data: point_lines_p
        },
        areaStyle: {
          opacity: 0.5,
          color: new echarts.graphic.LinearGradient(0, 0, 0,1, [
            {
              offset: 0,
              color: 'rgba(120, 177, 214, 1)'
            },
            {
              offset: 1,
              color: 'rgba(255, 255, 255, 1)'
            }
          ])
        },
        data: defectRateValue

      },
      {
        name: 'UCL',
        type: 'line',
        step: 'start',
        symbolSize: 0,
        lineStyle: { color: 'green' },
        itemStyle: { color: 'green' },
        markLine: {
          symbol: ['none', 'none', 'none'],
          silent: true,
          data: line_ucl_p
        },
        data: UCL

      },
      {
        name: 'LCL',
        type: 'line',
        step: 'start',
        symbolSize: 0,
        lineStyle: { color: 'green' },
        itemStyle: { color: 'green' },
        markLine: {
          symbol: ['none', 'none', 'none'],
          silent: true,
          data: line_lcl_p
        },
        data: LCL

      },

    ]
  };

  return option;
}

export function baseUOption(spc: any,index:number, config?: any,) {

  let option = {};
  // let index = 0;  //标线位置
  let color_array = ["#FF0000", "#EF6A32", "#AAD962", "#03C383", "#710162", "#FBBF45"];

  //CL UCL和LCL控制线
  let point_lines_u = new Array();

  //标准上下线
  let defectRateValue = spc.defectRate //缺陷率
  let x = Array.from({ length: defectRateValue.length }, (v, i) => i + 1);
  let UCL = spc.excelUcl || [];
  let LCL = spc.excelLcl || [];

  let MAXUCL = Math.max(...UCL);
  let MINLCL = Math.min(...UCL);

  let AVG = { u: spc.tSpcPVo.defectiveProductNumber / spc.tSpcPVo.checkNumber * 100 };

  //求最大值和最小值，用于y控制   ::v-deep::v-deep> 上图
  let y_min_u = 999999;
  let y_max_u = 0;
  for (let v in defectRateValue) {
    defectRateValue[v] = roundFun(defectRateValue[v], 4);
  }
  let y_for_rang_u = defectRateValue.concat();
  y_for_rang_u.push(MAXUCL);
  y_for_rang_u.push(MINLCL);
  for (let v in y_for_rang_u) {
    if (y_max_u < y_for_rang_u[v]) { y_max_u = y_for_rang_u[v] };
    if (y_min_u > y_for_rang_u[v]) { y_min_u = y_for_rang_u[v] };
  }
  let delta_x = (y_max_u - y_min_u) * 0.2;
  y_max_u = y_max_u + delta_x * 0.5;
  y_min_u = y_min_u - delta_x;



  // 上下图规格线
  let line_avg_u = { name: 'CL', symbol: 'none', label: { show: true, position: 'end', formatter: 'CL:' + Math.round(AVG.u * 100) / 100, color: 'rgba(114, 189, 29, 1)' }, yAxis: AVG.u, lineStyle: { color: 'rgba(114, 189, 29, 1)' } };
  let  line_ucl_u = [{ name: 'UCL', symbol: 'none', label: { show: true, position: 'end', formatter: 'UCL:' + Math.round(UCL[index] * 100) / 100, color: 'rgba(247, 164, 39, 1)' }, yAxis: UCL[index], lineStyle: { color: 'rgba(247, 164, 39, 1)' } }];
  let  line_lcl_u = [{ name: 'LCL', symbol: 'none', label: { show: true, position: 'end', formatter: 'LCL:' + Math.round(LCL[index] * 100) / 100, color: 'rgba(235, 113, 94, 1)'}, yAxis: LCL[index], lineStyle: { color: 'rgba(235, 113, 94, 1)' } }];
  point_lines_u = func4(point_lines_u);
  point_lines_u.push(line_avg_u);




  option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      extraCssText: 'width: 170px'
    },
    legend: {
      data: ['观测值',],
      left: 10,
      show: false
    },


    axisPointer: {
      link: [
        {
          xAxisIndex: 'all'
        }
      ],
      label: {
        backgroundColor: '#777'
      }
    },

    grid: [
      {
        left: '60px',
        right: '60px',
        height: '80%'
      },

    ],
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        axisLine: { onZero: true },
        splitLine: { show: false },
        axisLabel: { show: true },
        axisTick: { show: false },
        data: x
      },
    ],
    yAxis: [
      {
        name: '不合格品率',
        min: Math.round(y_min_u),
        max: Math.round(y_max_u),
        type: 'value',

      },

    ],
    series: [
      {
        name: '不合格品率',
        type: 'line',
        symbolSize: 8,
        lineStyle: { color: 'rgba(87, 129, 193, 1)' },
          itemStyle: { color: 'rgba(87, 129, 193, 1)' },
        smooth: false,
        symbol: 'circle',
        markLine: {
          symbol: ['none', 'none', 'none'],
          silent: true,
          data: point_lines_u
        },
        areaStyle: {
          opacity: 0.5,
          color: new echarts.graphic.LinearGradient(0, 0, 0,1, [
            {
              offset: 0,
              color: 'rgba(120, 177, 214, 1)'
            },
            {
              offset: 1,
              color: 'rgba(255, 255, 255, 1)'
            }
          ])
        },
        data: defectRateValue

      },
      
      {
        name: 'UCL',
        type: 'line',
        symbolSize: 0,
        step: 'start',
        lineStyle: { color: 'green' },
        itemStyle: { color: 'green' },
        markLine: {
          symbol: ['none', 'none', 'none'],
          silent: true,
          data: line_ucl_u
        },
        data: UCL

      },
      {
        name: 'LCL',
        type: 'line',
        symbolSize: 0,
        step: 'start',
        lineStyle: { color: 'green' },
        itemStyle: { color: 'green' },
        markLine: {
          symbol: ['none', 'none', 'none'],
          silent: true,
          data: line_lcl_u
        },
        data: LCL

      },

    ]
  };

  return option;
}

export function baseNPOption(spc: any, config?: any) {

  let option = {};
  let color_array = ["#FF0000", "#EF6A32", "#AAD962", "#03C383", "#710162", "#FBBF45"];

  //CL UCL和LCL控制线
  let point_lines_nP = new Array();

  //标准上下线
  let defectsNumberValue = spc.defectsNumber //不合格数
  let x = Array.from({ length: defectsNumberValue.length }, (v, i) => i + 1);
  let UCL = spc.nPUcl || '';
  let LCL = spc.nPLcl || '';


  let AVG = { nP: spc.tSpcPVo.defectiveProductNumber / spc.tSpcPVo.checkNumber * 100 };

  //求最大值和最小值，用于y控制   ::v-deep::v-deep> 上图
  let y_min_nP = 999999;
  let y_max_nP = 0;
  for (let v in defectsNumberValue) {
    defectsNumberValue[v] = roundFun(defectsNumberValue[v], 4);
  }
  let y_for_rang_p = defectsNumberValue.concat();
  y_for_rang_p.push(UCL);
  y_for_rang_p.push(LCL);
  for (let v in y_for_rang_p) {
    if (y_max_nP < y_for_rang_p[v]) { y_max_nP = y_for_rang_p[v] };
    if (y_min_nP > y_for_rang_p[v]) { y_min_nP = y_for_rang_p[v] };
  }
  let delta_x = (y_max_nP - y_min_nP) * 0.2;
  y_max_nP = y_max_nP + delta_x * 0.5;
  y_min_nP = y_min_nP - delta_x;



  // 上下图规格线
  let line_avg_nP = { name: 'CL', symbol: 'none', label: { show: true, position: 'end', formatter: 'CL:' + Math.round(AVG.nP * 100) / 100, color: 'rgba(114, 189, 29, 1)' }, yAxis: AVG.nP, lineStyle: { color: 'rgba(114, 189, 29, 1)' } };
  let  line_ucl_nP = { name: 'UCL', symbol: 'none', label: { show: true, position: 'end', formatter: 'UCL:' + Math.round(UCL * 100) / 100, color: 'rgba(247, 164, 39, 1)' }, yAxis: UCL, lineStyle: { color: 'rgba(247, 164, 39, 1)' } };
  let  line_lcl_nP = { name: 'LCL', symbol: 'none', label: { show: true, position: 'end', formatter: 'LCL:' + Math.round(LCL * 100) / 100, color: 'rgba(235, 113, 94, 1)' }, yAxis: LCL, lineStyle: { color: 'rgba(235, 113, 94, 1)' } };
  point_lines_nP = func4(point_lines_nP);
  point_lines_nP.push(line_avg_nP);
  point_lines_nP.push(line_ucl_nP)
  point_lines_nP.push(line_lcl_nP)




  option = {
    title: {
      text: 'NP',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      extraCssText: 'width: 170px'
    },
    legend: {
      data: ['观测值',],
      left: 10,
      show: false
    },


    axisPointer: {
      link: [
        {
          xAxisIndex: 'all'
        }
      ],
      label: {
        backgroundColor: '#777'
      }
    },

    grid: [
      {
        left: '60px',
        right: '60px',
        height: '80%'
      },

    ],
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        axisLine: { onZero: true },
        splitLine: { show: false },
        axisLabel: { show: true },
        axisTick: { show: false },
        data: x
      },
    ],
    yAxis: [
      {
        name: '不合格品率',
        min: Math.round(y_min_nP),
        max: Math.round(y_max_nP),
        type: 'value',

      },

    ],
    series: [
      {
        name: '不合格品率',
        type: 'line',
        symbolSize: 8,
        lineStyle: { color: 'rgba(87, 129, 193, 1)' },
          itemStyle: { color: 'rgba(87, 129, 193, 1)' },
        smooth: false,
        symbol: 'circle',
        markLine: {
          symbol: ['none', 'none', 'none'],
          silent: true,
          data: point_lines_nP
        },
        areaStyle: {
          opacity: 0.5,
          color: new echarts.graphic.LinearGradient(0, 0, 0,1, [
            {
              offset: 0,
              color: 'rgba(120, 177, 214, 1)'
            },
            {
              offset: 1,
              color: 'rgba(255, 255, 255, 1)'
            }
          ])
        },
        data: defectsNumberValue

      },
      

    ]
  };

  return option;
}

export function baseCOption(spc: any, config?: any) {

  let option = {};
  let color_array = ["#FF0000", "#EF6A32", "#AAD962", "#03C383", "#710162", "#FBBF45"];

  //CL UCL和LCL控制线
  let point_lines_c = new Array();

  //标准上下线
  let defectsNumberValue = spc.defectsNumber //缺陷数
  let x = Array.from({ length: defectsNumberValue.length }, (v, i) => i + 1);
  let UCL = spc.nPUcl || '';
  let LCL = spc.nPLcl || '';


  let AVG = { c: spc.tSpcPVo.defectiveProductNumber / spc.tSpcPVo.checkNumber * 100 };

  //求最大值和最小值，用于y控制   ::v-deep::v-deep> 上图
  let y_min_c = 999999;
  let y_max_c = 0;
  for (let v in defectsNumberValue) {
    defectsNumberValue[v] = roundFun(defectsNumberValue[v], 4);
  }
  let y_for_rang_c = defectsNumberValue.concat();
  y_for_rang_c.push(UCL);
  y_for_rang_c.push(LCL);
  for (let v in y_for_rang_c) {
    if (y_max_c < y_for_rang_c[v]) { y_max_c = y_for_rang_c[v] };
    if (y_min_c > y_for_rang_c[v]) { y_min_c = y_for_rang_c[v] };
  }
  let delta_x = (y_max_c - y_min_c) * 0.2;
  y_max_c = y_max_c + delta_x * 0.5;
  y_min_c = y_min_c - delta_x;



  // 上下图规格线
  let line_avg_c = { name: 'CL', symbol: 'none', label: { show: true, position: 'end', formatter: 'CL:' + Math.round(AVG.c * 100) / 100, color: 'rgba(114, 189, 29, 1)' }, yAxis: AVG.c, lineStyle: { color: 'rgba(114, 189, 29, 1)' } };
  let  line_ucl_c = { name: 'UCL', symbol: 'none', label: { show: true, position: 'end', formatter: 'UCL:' + Math.round(UCL * 100) / 100, color: 'rgba(247, 164, 39, 1)' }, yAxis: UCL, lineStyle: { color: 'rgba(247, 164, 39, 1)' } };
  let  line_lcl_c = { name: 'LCL', symbol: 'none', label: { show: true, position: 'end', formatter: 'LCL:' + Math.round(LCL * 100) / 100, color: 'rgba(235, 113, 94, 1)'}, yAxis: LCL, lineStyle: { color: 'rgba(235, 113, 94, 1)' } };
  point_lines_c = func4(point_lines_c);
  point_lines_c.push(line_avg_c);
  point_lines_c.push(line_ucl_c)
  point_lines_c.push(line_lcl_c)




  option = {
    title: {
      text: 'C',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      extraCssText: 'width: 170px'
    },
    legend: {
      data: ['观测值',],
      left: 10,
      show: false
    },


    axisPointer: {
      link: [
        {
          xAxisIndex: 'all'
        }
      ],
      label: {
        backgroundColor: '#777'
      }
    },

    grid: [
      {
        left: '60px',
        right: '60px',
        height: '80%'
      },

    ],
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        axisLine: { onZero: true },
        splitLine: { show: false },
        axisLabel: { show: true },
        axisTick: { show: false },
        data: x
      },
    ],
    yAxis: [
      {
        name: '不合格品率',
        min: Math.round(y_min_c),
        max: Math.round(y_max_c),
        type: 'value',

      },

    ],
    series: [
      {
        name: '不合格品率',
        type: 'line',
        symbolSize: 8,
        lineStyle: { color: 'rgba(87, 129, 193, 1)' },
          itemStyle: { color: 'rgba(87, 129, 193, 1)' },
        smooth: false,
        symbol: 'circle',
        markLine: {
          symbol: ['none', 'none', 'none'],
          silent: true,
          data: point_lines_c
        },
        areaStyle: {
          opacity: 0.5,
          color: new echarts.graphic.LinearGradient(0, 0, 0,1, [
            {
              offset: 0,
              color: 'rgba(120, 177, 214, 1)'
            },
            {
              offset: 1,
              color: 'rgba(255, 255, 255, 1)'
            }
          ])
        },
        data: defectsNumberValue

      },
      

    ]
  };

  return option;
}


function roundFun(value: number, n: number) {
  return Math.round(value * Math.pow(10, n)) / Math.pow(10, n);
}

function func4(objArray: string | any[]) {
  let result = [];//去重后返回的结果数组
  let temp: any = {};//临时对象
  //将对象数组中每一项的name值作为属性，若temp不拥有此属性时则为temp添加此属性且将其值赋为true，并将这一项push到结果数组中
  for (let i = 0; i < objArray.length; i++) {
    let myname = objArray[i][2].name;//去掉数组的重复项目，基于第三个属性 name的唯一性
    if (temp[myname]) {//如果temp中已经存在此属性名，则说明遇到重复项
      continue;//不继续执行接下来的代码，跳转至循环开头
    }
    temp[myname] = true;//为temp添加此属性（myname）且将其值赋为true
    result.push(objArray[i]);//将这一项复制到结果数组result中去
  }
  return result;
}