//计量型
import * as echarts from 'echarts';
export function baseXbarSOption(spc: any, config?: any) {
  let format1 = "{value} %";
  let format2 = "{c} %";
  let option = {};
  let color_array = ["#FF0000", "#EF6A32", "#AAD962", "#03C383", "#710162", "#FBBF45"];

  //CL UCL和LCL控制线
  let point_lines_x = new Array();
  let point_lines_s = new Array();

  //异常点
  let points_violating_spcU = []
  let violating_pointsU = spc.differentRulesUMap || {};
  let points_violating_spcL = []
  let violating_pointsL = spc.differentRulesLMap || {};
  //判异规则
  let rule_name = ['R0', 'R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8']

  //标准上下线
  let averageValue = spc.averageValue || []//平均值
  let standardDeviation = spc.standardDeviation || []//标准差
  let x = Array.from({ length: averageValue.length }, (v, i) => i + 1);
  let UCL = { x: Number((Number(spc.tSpcXBarSVo.upperLimitValueX).toFixed(4)).substring(0,(Number(spc.tSpcXBarSVo.upperLimitValueX).toFixed(4)).lastIndexOf('.')+4)), s: Number((Number(spc.tSpcXBarSVo.upperLimitValueS).toFixed(4)).substring(0,(Number(spc.tSpcXBarSVo.upperLimitValueS).toFixed(4)).lastIndexOf('.')+4)) };
  let LCL = { x: Number((Number(spc.tSpcXBarSVo.lowerLimitValueX).toFixed(4)).substring(0,(Number(spc.tSpcXBarSVo.lowerLimitValueX).toFixed(4)).lastIndexOf('.')+4)), s: Number((Number(spc.tSpcXBarSVo.lowerLimitValueS).toFixed(4)).substring(0,(Number(spc.tSpcXBarSVo.lowerLimitValueS).toFixed(4)).lastIndexOf('.')+4)) };
  let USL = Number((Number(spc.usl).toFixed(4)).substring(0,(Number(spc.usl).toFixed(4)).lastIndexOf('.')+4));
  let LSL = Number((Number(spc.lsl).toFixed(4)).substring(0,(Number(spc.lsl).toFixed(4)).lastIndexOf('.')+4));
  let AVG = { x: Number((Number(spc.tSpcXBarSVo.centralLimitValueX).toFixed(4)).substring(0,(Number(spc.tSpcXBarSVo.centralLimitValueX).toFixed(4)).lastIndexOf('.')+4)), s: Number((Number(spc.tSpcXBarSVo.centralLimitValueS).toFixed(4)).substring(0,(Number(spc.tSpcXBarSVo.centralLimitValueS).toFixed(4)).lastIndexOf('.')+4)) };
  let target = Number((Number(spc.target).toFixed(4)).substring(0,(Number(spc.target).toFixed(4)).lastIndexOf('.')+4));

  //求最大值和最小值，用于y控制   ::v-deep>>>>>> 上图
  let y_min_x = 999999;
  let y_max_x = 0;
  for (let v in averageValue) {
    averageValue[v] = roundFun(averageValue[v], 4);
  }
  let y_for_rang_x = averageValue.concat();
  y_for_rang_x.push(UCL.x);
  y_for_rang_x.push(LCL.x);
  y_for_rang_x.push(USL);
  y_for_rang_x.push(LSL);
  for (let v in y_for_rang_x) {
    if (y_max_x < y_for_rang_x[v]) { y_max_x = y_for_rang_x[v] };
    if (y_min_x > y_for_rang_x[v]) { y_min_x = y_for_rang_x[v] };
  }
  let delta_x = (y_max_x - y_min_x) * 0.2;
  y_max_x = y_max_x + delta_x * 0.5;
  y_min_x = y_min_x - delta_x;

  //求最大值和最小值，用于y控制   >>>>>> 下图
  let y_min_s = 999999;
  let y_max_s = 0;
  for (let v in standardDeviation) {
    standardDeviation[v] = roundFun(standardDeviation[v], 4);
  }
  let y_for_rang_s = standardDeviation.concat();
  y_for_rang_s.push(UCL.s);
  y_for_rang_s.push(LCL.s);
  for (let v in y_for_rang_s) {
    if (y_max_s < y_for_rang_s[v]) { y_max_s = y_for_rang_s[v] };
    if (y_min_s > y_for_rang_s[v]) { y_min_s = y_for_rang_s[v] };
  }
  let delta_s = (y_max_s - y_min_s) * 0.2;
  y_max_s = y_max_s + delta_s * 0.5;
  y_min_s = y_min_s - delta_s;


  // 上下图规格线
  let line_target_x = { name: 'target', symbol: 'none', label: { show: true, position: 'end', formatter: 'target:' + String(target) , color: 'rgba(114, 189, 29, 1)' }, yAxis: target, lineStyle: { color: 'rgba(114, 189, 29, 1)' } };
  let line_avg_x = { name: 'CL', symbol: 'none', label: { show: true, position: 'end', formatter: 'CL:' + AVG.x, color: 'rgba(114, 189, 29, 1)' }, yAxis: AVG.x, lineStyle: { color: 'rgba(114, 189, 29, 1)' } };
  let line_ucl_x = { name: 'UCL', symbol: 'none', label: { show: true, position: 'end', formatter: 'UCL:' + UCL.x, color: 'rgba(247, 164, 39, 1)' }, yAxis: UCL.x, lineStyle: { color: 'rgba(247, 164, 39, 1)' } };
  let line_lcl_x = { name: 'LCL', symbol: 'none', label: { show: true, position: 'end', formatter: 'LCL:' + LCL.x, color: 'rgba(235, 113, 94, 1)' }, yAxis: LCL.x, lineStyle: { color: 'rgba(235, 113, 94, 1)' } };
  let line_usl_x = { name: 'USL', symbol: 'none', label: { show: true, position: 'end', formatter: 'USL:' + USL, color: 'rgba(247, 164, 39, 1)' }, yAxis: USL, lineStyle: { color: 'rgba(247, 164, 39, 1)' } };
  let line_lsl_x = { name: 'LSL', symbol: 'none', label: { show: true, position: 'end', formatter: 'LSL:' + LSL, color: 'rgba(235, 113, 94, 1)' }, yAxis: LSL, lineStyle: { color: 'rgba(235, 113, 94, 1)' } };

  let line_avg_s = { name: 'CL', symbol: 'none', label: { show: true, position: 'end', formatter: 'CL:' + AVG.s , color: 'rgba(114, 189, 29, 1)' }, yAxis: AVG.s, lineStyle: { color: 'rgba(114, 189, 29, 1)' } };
  let line_ucl_s = { name: 'UCL', symbol: 'none', label: { show: true, position: 'end', formatter: 'UCL:' + UCL.s , color: 'rgba(247, 164, 39, 1)' }, yAxis: UCL.s, lineStyle: { color: 'rgba(247, 164, 39, 1)' } };
  let line_lcl_s = { name: 'LCL', symbol: 'none', label: { show: true, position: 'end', formatter: 'LCL:' + LCL.s, color: 'rgba(235, 113, 94, 1)' }, yAxis: LCL.s, lineStyle: { color: 'rgba(235, 113, 94, 1)' } };

  point_lines_x = func4(point_lines_x);
  point_lines_x.push(line_avg_x);
  point_lines_x.push(line_lcl_x);
  point_lines_x.push(line_ucl_x);
  point_lines_x.push(line_lsl_x);
  point_lines_x.push(line_usl_x);
  point_lines_x.push(line_target_x)

  point_lines_s = func4(point_lines_s);
  point_lines_s.push(line_avg_s);
  point_lines_s.push(line_lcl_s);
  point_lines_s.push(line_ucl_s);

  // 异常点 ------->上图
  for (let i in violating_pointsU) {
    for (let j in violating_pointsU[i]) {
      let violatings = { itemStyle: {}, name: "", value: "", xAxis: "", yAxis: 0, test: "" };
      let x1 = violating_pointsU[i][j];

      violatings.itemStyle = { color: '#FF0000' };

      violatings.name = "";
      violatings.test = "";
      violatings.value = "";
      violatings.xAxis = x1;
      violatings.yAxis = averageValue[x1];

      //以下处理选择要显示的spc判异规则
      if (rule_name.indexOf(i) >= 0) {
        points_violating_spcU.push(violatings);
      }
      //以上处理选择要显示的spc判异规则

    }
  }
  // 异常点 ------->下图
  for (let i in violating_pointsL) {
    for (let j in violating_pointsL[i]) {
      let violatings = { itemStyle: {}, name: "", value: "", xAxis: "", yAxis: 0, test: "" };
      let x1 = violating_pointsL[i][j];

      violatings.itemStyle = { color: '#FF0000' };

      violatings.name = "";
      violatings.test = "";
      violatings.value = "";
      violatings.xAxis = x1;
      violatings.yAxis = standardDeviation[x1];

      //以下处理选择要显示的spc判异规则
      if (rule_name.indexOf(i) >= 0) {
        points_violating_spcL.push(violatings);
      }
      //以上处理选择要显示的spc判异规则

    }
  }

  option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',

      },
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      formatter: '{b} <br /> {a0}:{c0} <br /> {a1}:{c1}',
      extraCssText: 'width: 170px',
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
        top: '40px',
        left: '60px',
        right: '80px',
        height: '36%'
      },
      {
        left: '60px',
        right: '80px',
        top: '60%',
        height: '35%'
      }
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
      {
        gridIndex: 1,
        type: 'category',
        boundaryGap: false,
        axisLine: { onZero: true },
        splitLine: { show: false },
        axisLabel: { show: true },
        axisTick: { show: false },
        data: x,
      }
    ],
    yAxis: [
      {
        name: '平均值',
        min: Math.ceil(y_min_x),
        max: Math.ceil(y_max_x),
        type: 'value',

      },
      {
        gridIndex: 1,
        name: '标准差',
        min: Math.ceil(y_min_s),
        max: Math.ceil(y_max_s),
        type: 'value',
        inverse: false
      }
    ],
    series: [
      {
        name: '异常点',
        data: '',
        type: 'line',
        smooth: false,
        symbol: 'rect',
        symbolSize: 8,
        lineStyle: { color: '#018801' },
        markLine: {
          symbol: ['none', 'none', 'none'],
          silent: true,
          data: point_lines_x
        },
        markPoint: {
          symbol: 'rect',
          symbolSize: 10,
          data: points_violating_spcU
        }

      },
      {
        name: '异常点',
        data: '',
        type: 'line',
        xAxisIndex: 1,
        yAxisIndex: 1,
        smooth: false,
        symbol: 'rect',
        symbolSize: 8,
        lineStyle: { color: '#018801' },
        markLine: {
          symbol: ['none', 'none', 'none'],
          silent: true,
          data: point_lines_s
        },
        markPoint: {
          symbol: 'rect',
          symbolSize: 10,
          data: points_violating_spcL
        }

      },
      {
        name: '平均值',
        type: 'line',
        symbolSize: 8,
        lineStyle: { color: 'rgba(87, 129, 193, 1)' },
        itemStyle: { color: 'rgba(87, 129, 193, 1)' },
        smooth: false,
        symbol: 'circle',
        markLine: {
          symbol: ['none', 'none', 'none'],
          silent: true,
          data: point_lines_x
        },
        areaStyle: {
          opacity: 0.5,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
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
        data: averageValue

      },
      {
        name: '标准差',
        type: 'line',
        xAxisIndex: 1,
        yAxisIndex: 1,
        symbolSize: 8,
        smooth: false,
        symbol: 'circle',
        lineStyle: { color: 'rgba(87, 129, 193, 1)' },
        itemStyle: {
          color: 'rgba(87, 129, 193, 1)', label: {
            formatter: format2,
            show: false, //开启显示
            position: "top", //在上方显示
            textStyle: {
              //数值样式
              fontSize: 16,
            },
          },
        },
        markLine: {
          symbol: ['none', 'none', 'none'],
          silent: true,
          data: point_lines_s
        },
        areaStyle: {
          opacity: 0.5,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
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
        data: standardDeviation

      },

    ]
  };

  return option;

}

export function baseXROption(spc: any, config?: any) {

  let option = {};
  let color_array = ["#FF0000", "#EF6A32", "#AAD962", "#03C383", "#710162", "#FBBF45"];

  //CL UCL和LCL控制线
  let point_lines_x = new Array();
  let point_lines_r = new Array();

  //异常点
  let points_violating_spcU = []
  let violating_pointsU = spc.differentRulesUMap || {};
  let points_violating_spcL = []
  let violating_pointsL = spc.differentRulesLMap || {};
  //判异规则
  let rule_name = ['R0', 'R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8']

  //标准上下线
  let averageValue = spc.averageValue || [] //平均值
  let rangeValue = spc.rangeArray || []  //极差
  let x = Array.from({ length: averageValue.length }, (v, i) => i + 1);
  let UCL = { x: Number((Number(spc.tSpcXRVo.upperLimitValueX).toFixed(4)).substring(0,(Number(spc.tSpcXRVo.upperLimitValueX).toFixed(4)).lastIndexOf('.')+4)), r:  Number((Number(spc.tSpcXRVo.upperLimitValueR).toFixed(4)).substring(0,(Number(spc.tSpcXRVo.upperLimitValueR).toFixed(4)).lastIndexOf('.')+4))};
  let LCL = { x: Number((Number(spc.tSpcXRVo.lowerLimitValueX).toFixed(4)).substring(0,(Number(spc.tSpcXRVo.lowerLimitValueX).toFixed(4)).lastIndexOf('.')+4)), r:  Number((Number(spc.tSpcXRVo.lowerLimitValueR).toFixed(4)).substring(0,(Number(spc.tSpcXRVo.lowerLimitValueR).toFixed(4)).lastIndexOf('.')+4))};
  let USL = Number((Number(spc.usl).toFixed(4)).substring(0,(Number(spc.usl).toFixed(4)).lastIndexOf('.')+4));
  let LSL = Number((Number(spc.lsl).toFixed(4)).substring(0,(Number(spc.lsl).toFixed(4)).lastIndexOf('.')+4));
  let AVG = { x: Number((Number(spc.tSpcXRVo.centralLimitValueX).toFixed(4)).substring(0,(Number(spc.tSpcXRVo.centralLimitValueX).toFixed(4)).lastIndexOf('.')+4)), r: Number((Number(spc.tSpcXRVo.centralLimitValueR).toFixed(4)).substring(0,(Number(spc.tSpcXRVo.centralLimitValueR).toFixed(4)).lastIndexOf('.')+4)) };
  let target = Number((Number(spc.target).toFixed(4)).substring(0,(Number(spc.target).toFixed(4)).lastIndexOf('.')+4));

  //求最大值和最小值，用于y控制   ::v-deep>>>>>> 上图
  let y_min_x = 999999;
  let y_max_x = 0;
  for (let v in averageValue) {
    averageValue[v] = roundFun(averageValue[v], 4);
  }
  let y_for_rang_x = averageValue.concat();
  y_for_rang_x.push(UCL.x);
  y_for_rang_x.push(LCL.x);
  y_for_rang_x.push(USL);
  y_for_rang_x.push(LSL);
  for (let v in y_for_rang_x) {
    if (y_max_x < y_for_rang_x[v]) { y_max_x = y_for_rang_x[v] };
    if (y_min_x > y_for_rang_x[v]) { y_min_x = y_for_rang_x[v] };
  }
  let delta_x = (y_max_x - y_min_x) * 0.2;
  y_max_x = y_max_x + delta_x * 0.5;
  y_min_x = y_min_x - delta_x;

  //求最大值和最小值，用于y控制   ::v-deep>>>>>> 下图
  let y_min_r = 999999;
  let y_max_r = 0;
  for (let v in rangeValue) {
    rangeValue[v] = roundFun(rangeValue[v], 4);
  }
  let y_for_rang_r = rangeValue.concat();
  y_for_rang_r.push(UCL.r);
  y_for_rang_r.push(LCL.r);
  for (let v in y_for_rang_r) {
    if (y_max_r < y_for_rang_r[v]) { y_max_r = y_for_rang_r[v] };
    if (y_min_r > y_for_rang_r[v]) { y_min_r = y_for_rang_r[v] };
  }
  let delta_r = (y_max_r - y_min_r) * 0.2;
  y_max_r = y_max_r + delta_r * 0.5;
  y_min_r = y_min_r - delta_r;


  // 上下图规格线
  let line_target_x = { name: 'target', symbol: 'none', label: { show: true, position: 'end', formatter: 'target:' + target, color: 'rgba(114, 189, 29, 1)' }, yAxis: target, lineStyle: { color: 'rgba(114, 189, 29, 1)' } };
  let line_avg_x = { name: 'CL', symbol: 'none', label: { show: true, position: 'end', formatter: 'CL:' + AVG.x, color: 'rgba(114, 189, 29, 1)' }, yAxis: AVG.x, lineStyle: { color: 'rgba(114, 189, 29, 1)' } };
  let line_ucl_x = { name: 'UCL', symbol: 'none', label: { show: true, position: 'end', formatter: 'UCL:' + UCL.x, color: 'rgba(247, 164, 39, 1)' }, yAxis: UCL.x, lineStyle: { color: 'rgba(247, 164, 39, 1)' } };
  let line_lcl_x = { name: 'LCL', symbol: 'none', label: { show: true, position: 'end', formatter: 'LCL:' + LCL.x, color: 'rgba(235, 113, 94, 1)' }, yAxis: LCL.x, lineStyle: { color: 'rgba(235, 113, 94, 1)' } };
  let line_usl_x = { name: 'USL', symbol: 'none', label: { show: true, position: 'end', formatter: 'USL:' + USL, color: 'rgba(247, 164, 39, 1)' }, yAxis: USL, lineStyle: { color: 'rgba(247, 164, 39, 1)' } };
  let line_lsl_x = { name: 'LSL', symbol: 'none', label: { show: true, position: 'end', formatter: 'LSL:' + LSL, color: 'rgba(235, 113, 94, 1)' }, yAxis: LSL, lineStyle: { color: 'rgba(235, 113, 94, 1)' } };

  let line_avg_r = { name: 'CL', symbol: 'none', label: { show: true, position: 'end', formatter: 'CL:' + AVG.r, color: 'rgba(114, 189, 29, 1)' }, yAxis: AVG.r, lineStyle: { color: 'rgba(114, 189, 29, 1)' } };
  let line_ucl_r = { name: 'UCL', symbol: 'none', label: { show: true, position: 'end', formatter: 'UCL:' + UCL.r, color: 'rgba(247, 164, 39, 1)' }, yAxis: UCL.r, lineStyle: { color: 'rgba(247, 164, 39, 1)' } };
  let line_lcl_r = { name: 'LCL', symbol: 'none', label: { show: true, position: 'end', formatter: 'LCL:' + LCL.r, color: 'rgba(235, 113, 94, 1)' }, yAxis: LCL.r, lineStyle: { color: 'rgba(235, 113, 94, 1)' } };

  point_lines_x = func4(point_lines_x);
  point_lines_x.push(line_avg_x);
  point_lines_x.push(line_lcl_x);
  point_lines_x.push(line_ucl_x);
  point_lines_x.push(line_lsl_x);
  point_lines_x.push(line_usl_x);
  point_lines_x.push(line_target_x)

  point_lines_r = func4(point_lines_r);
  point_lines_r.push(line_avg_r);
  point_lines_r.push(line_lcl_r);
  point_lines_r.push(line_ucl_r);

  // 异常点 ------->上图
  for (let i in violating_pointsU) {
    for (let j in violating_pointsU[i]) {
      let violatings = { itemStyle: {}, name: "", value: "", xAxis: "", yAxis: 0, test: "" };
      let x1 = violating_pointsU[i][j];

      violatings.itemStyle = { color: '#FF0000' };

      violatings.name = "";
      violatings.test = "";
      violatings.value = "";
      violatings.xAxis = x1;
      violatings.yAxis = averageValue[x1];

      //以下处理选择要显示的spc判异规则
      if (rule_name.indexOf(i) >= 0) {
        points_violating_spcU.push(violatings);
      }
      //以上处理选择要显示的spc判异规则

    }
  }
  // 异常点 ------->下图
  for (let i in violating_pointsL) {
    for (let j in violating_pointsL[i]) {
      let violatings = { itemStyle: {}, name: "", value: "", xAxis: "", yAxis: 0, test: "" };
      let x1 = violating_pointsL[i][j];

      violatings.itemStyle = { color: '#FF0000' };

      violatings.name = "";
      violatings.test = "";
      violatings.value = "";
      violatings.xAxis = x1;
      violatings.yAxis = rangeValue[x1];

      //以下处理选择要显示的spc判异规则
      if (rule_name.indexOf(i) >= 0) {
        points_violating_spcL.push(violatings);
      }
      //以上处理选择要显示的spc判异规则

    }
  }

  option = {

    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      formatter: '{b} <br /> {a0}:{c0} <br /> {a1}:{c1}',
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
        top: '40px',
        left: '60px',
        right: '80px',
        height: '36%'
      },
      {
        left: '60px',
        right: '80px',
        top: '60%',
        height: '35%'
      }
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
      {
        gridIndex: 1,
        type: 'category',
        boundaryGap: false,
        axisLine: { onZero: true },
        data: x,
      }
    ],
    yAxis: [
      {
        name: '平均值',
        min: Math.ceil(y_min_x),
        max: Math.ceil(y_max_x),
        type: 'value',
        splitLine: { show: false },
      },
      {
        gridIndex: 1,
        name: '极差值',
        min: Math.ceil(y_min_r),
        max: Math.ceil(y_max_r),
        type: 'value',
        inverse: false,
        // interval: cutApartR,
      }
    ],
    series: [
      {
        name: '平均值',
        type: 'line',
        symbolSize: 8,
        lineStyle: { color: 'rgba(87, 129, 193, 1)' },
        itemStyle: { color: 'rgba(87, 129, 193, 1)' },
        smooth: false,
        symbol: 'circle',
        markLine: {
          symbol: ['none', 'none', 'none'],
          silent: true,
          data: point_lines_x
        },
        areaStyle: {
          opacity: 0.5,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
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
        data: averageValue

      },
      {
        name: '极差值',
        type: 'line',
        xAxisIndex: 1,
        yAxisIndex: 1,
        symbolSize: 8,
        smooth: false,
        symbol: 'circle',
        lineStyle: { color: 'rgba(87, 129, 193, 1)' },
        itemStyle: { color: 'rgba(87, 129, 193, 1)' },
        markLine: {
          symbol: ['none', 'none', 'none'],
          silent: true,
          data: point_lines_r
        },
        areaStyle: {
          opacity: 0.5,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
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
        data: rangeValue

      },
      {
        name: '异常点',
        data: '',
        type: 'line',
        smooth: false,
        symbol: 'rect',
        symbolSize: 8,
        lineStyle: { color: '#018801' },
        markLine: {
          symbol: ['none', 'none', 'none'],
          silent: true,
          data: point_lines_x
        },
        markPoint: {
          symbol: 'rect',
          symbolSize: 10,
          data: points_violating_spcU
        }

      },
      {
        name: '异常点',
        data: '',
        type: 'line',
        xAxisIndex: 1,
        yAxisIndex: 1,
        smooth: false,
        symbol: 'rect',
        symbolSize: 8,
        lineStyle: { color: '#018801' },
        markLine: {
          symbol: ['none', 'none', 'none'],
          silent: true,
          data: point_lines_r
        },
        markPoint: {
          symbol: 'rect',
          symbolSize: 10,
          data: points_violating_spcL
        }

      },
    ]
  };

  return option;
}

export function baseXbarROption(spc: any, config?: any) {

  let option = {};
  let color_array = ["#FF0000", "#EF6A32", "#AAD962", "#03C383", "#710162", "#FBBF45"];

  //CL UCL和LCL控制线
  let point_lines_x = new Array();
  let point_lines_r = new Array();

  //异常点
  let points_violating_spcU = []
  let violating_pointsU = spc.differentRulesUMap || {};
  let points_violating_spcL = []
  let violating_pointsL = spc.differentRulesLMap || {};
  //判异规则
  let rule_name = ['R0', 'R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8']

  //标准上下线(Number().toFixed(4)).substring(0,(Number().toFixed(4)).lastIndexOf('.')+4)
  let averageValue = spc.averageValue || [] //平均值
  let rangeValue = spc.rangeArray || [] //极差
  let x = Array.from({ length: averageValue.length }, (v, i) => i + 1);
  let UCL_x = Number((Number(spc.tSpcXBarRVo.upperLimitValueX).toFixed(4)).substring(0,(Number(spc.tSpcXBarRVo.upperLimitValueX).toFixed(4)).lastIndexOf('.')+4));
  let LCL_x = Number((Number(spc.tSpcXBarRVo.lowerLimitValueX).toFixed(4)).substring(0,(Number(spc.tSpcXBarRVo.lowerLimitValueX).toFixed(4)).lastIndexOf('.')+4));
  let UCL_r = Number((Number(spc.tSpcXBarRVo.upperLimitValueR).toFixed(4)).substring(0,(Number(spc.tSpcXBarRVo.upperLimitValueR).toFixed(4)).lastIndexOf('.')+4));
  let LCL_r = Number((Number(spc.tSpcXBarRVo.lowerLimitValueR).toFixed(4)).substring(0,(Number(spc.tSpcXBarRVo.lowerLimitValueR).toFixed(4)).lastIndexOf('.')+4));
  let USL = Number((Number(spc.usl).toFixed(4)).substring(0,(Number(spc.usl).toFixed(4)).lastIndexOf('.')+4));
  let LSL = Number((Number(spc.lsl).toFixed(4)).substring(0,(Number(spc.lsl).toFixed(4)).lastIndexOf('.')+4));
  let AVG_x = Number((Number(spc.tSpcXBarRVo.centralLimitValueX).toFixed(4)).substring(0,(Number(spc.tSpcXBarRVo.centralLimitValueX).toFixed(4)).lastIndexOf('.')+4));
  let AVG_r = Number((Number(spc.tSpcXBarRVo.centralLimitValueR).toFixed(4)).substring(0,(Number(spc.tSpcXBarRVo.centralLimitValueR).toFixed(4)).lastIndexOf('.')+4));
  let target = Number((Number(spc.target).toFixed(4)).substring(0,(Number(spc.target).toFixed(4)).lastIndexOf('.')+4));

  //求最大值和最小值，用于y控制   ::v-deep>>>>>> 上图
  let y_min_x = 999999;
  let y_max_x = 0;
  for (let v in averageValue) {
    averageValue[v] = roundFun(averageValue[v], 4);
  }
  let y_for_rang_x = averageValue.concat();
  y_for_rang_x.push(UCL_x);
  y_for_rang_x.push(LCL_x);
  y_for_rang_x.push(USL);
  y_for_rang_x.push(LSL);
  for (let v in y_for_rang_x) {
    if (y_max_x < y_for_rang_x[v]) { y_max_x = y_for_rang_x[v] };
    if (y_min_x > y_for_rang_x[v]) { y_min_x = y_for_rang_x[v] };
  }
  let delta_x = (y_max_x - y_min_x) * 0.2;
  y_max_x = y_max_x + delta_x * 0.5;
  y_min_x = y_min_x - delta_x;

  //求最大值和最小值，用于y控制   ::v-deep>>>>>> 下图
  let y_min_r = 999999;
  let y_max_r = 0;
  for (let v in rangeValue) {
    rangeValue[v] = roundFun(rangeValue[v], 4);
  }
  let y_for_rang_r = rangeValue.concat();
  y_for_rang_r.push(UCL_r);
  y_for_rang_r.push(LCL_r);
  for (let v in y_for_rang_r) {
    if (y_max_r < y_for_rang_r[v]) { y_max_r = y_for_rang_r[v] };
    if (y_min_r > y_for_rang_r[v]) { y_min_r = y_for_rang_r[v] };
  }
  let delta_r = (y_max_r - y_min_r) * 0.2;
  y_max_r = y_max_r + delta_r * 0.5;
  y_min_r = y_min_r - delta_r;

  // 上下图规格线
  let line_target_x = { name: 'target', symbol: 'none', label: { show: true, position: 'end', formatter: 'target:' + target, color: 'rgba(114, 189, 29, 1)' }, yAxis: target, lineStyle: { color: 'rgba(114, 189, 29, 1)' } };
  let line_avg_x = { name: 'CL', symbol: 'none', label: { show: true, position: 'end', formatter: 'CL:' + AVG_x , color: 'rgba(114, 189, 29, 1)' }, yAxis: AVG_x, lineStyle: { color: 'rgba(114, 189, 29, 1)' } };
  let line_ucl_x = { name: 'UCL', symbol: 'none', label: { show: true, position: 'end', formatter: 'UCL:' + UCL_x, color: 'rgba(247, 164, 39, 1)' }, yAxis: UCL_x, lineStyle: { color: 'rgba(247, 164, 39, 1)' } };
  let line_lcl_x = { name: 'LCL', symbol: 'none', label: { show: true, position: 'end', formatter: 'LCL:' + LCL_x, color: 'rgba(235, 113, 94, 1)' }, yAxis: LCL_x, lineStyle: { color: 'rgba(235, 113, 94, 1)' } };
  let line_usl_x = { name: 'USL', symbol: 'none', label: { show: true, position: 'end', formatter: 'USL:' + USL, color: 'rgba(247, 164, 39, 1)' }, yAxis: USL, lineStyle: { color: 'rgba(247, 164, 39, 1)' } };
  let line_lsl_x = { name: 'LSL', symbol: 'none', label: { show: true, position: 'end', formatter: 'LSL:' + LSL, color: 'rgba(235, 113, 94, 1)' }, yAxis: LSL, lineStyle: { color: 'rgba(235, 113, 94, 1)' } };

  let line_avg_r = { name: 'CL', symbol: 'none', label: { show: true, position: 'end', formatter: 'CL:' + AVG_r , color: 'rgba(114, 189, 29, 1)' }, yAxis: AVG_r, lineStyle: { color: 'rgba(114, 189, 29, 1)' } };
  let line_ucl_r = { name: 'UCL', symbol: 'none', label: { show: true, position: 'end', formatter: 'UCL:' + UCL_r, color: 'rgba(247, 164, 39, 1)' }, yAxis: UCL_r, lineStyle: { color: 'rgba(247, 164, 39, 1)' } };
  let line_lcl_r = { name: 'LCL', symbol: 'none', label: { show: true, position: 'end', formatter: 'LCL:' + LCL_r, color: 'rgba(235, 113, 94, 1)' }, yAxis: LCL_r, lineStyle: { color: 'rgba(235, 113, 94, 1)' } };

  point_lines_x = func4(point_lines_x);
  point_lines_x.push(line_avg_x);
  point_lines_x.push(line_lcl_x);
  point_lines_x.push(line_ucl_x);
  point_lines_x.push(line_lsl_x);
  point_lines_x.push(line_usl_x);
  point_lines_x.push(line_target_x);

  point_lines_r = func4(point_lines_r);
  point_lines_r.push(line_avg_r);
  point_lines_r.push(line_lcl_r);
  point_lines_r.push(line_ucl_r);

  // 异常点 ------->上图
  for (let i in violating_pointsU) {
    for (let j in violating_pointsU[i]) {
      let violatings = { itemStyle: {}, name: "", value: "", xAxis: "", yAxis: 0, test: "" };
      let x1 = violating_pointsU[i][j];

      violatings.itemStyle = { color: '#FF0000' };

      violatings.name = "";
      violatings.test = "";
      violatings.value = "";
      violatings.xAxis = x1;
      violatings.yAxis = averageValue[x1];

      //以下处理选择要显示的spc判异规则
      if (rule_name.indexOf(i) >= 0) {
        points_violating_spcU.push(violatings);
      }
      //以上处理选择要显示的spc判异规则

    }
  }
  // 异常点 ------->下图
  for (let i in violating_pointsL) {
    for (let j in violating_pointsL[i]) {
      let violatings = { itemStyle: {}, name: "", value: "", xAxis: "", yAxis: 0, test: "" };
      let x1 = violating_pointsL[i][j];

      violatings.itemStyle = { color: '#FF0000' };

      violatings.name = "";
      violatings.test = "";
      violatings.value = "";
      violatings.xAxis = x1;
      violatings.yAxis = rangeValue[x1];

      //以下处理选择要显示的spc判异规则
      if (rule_name.indexOf(i) >= 0) {
        points_violating_spcL.push(violatings);
      }
      //以上处理选择要显示的spc判异规则

    }
  }

  option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        axis: 'auto'
      },
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      extraCssText: 'width: 170px',
      formatter: '{b} <br /> {a0}:{c0} <br /> {a1}:{c1}',
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
        top: '40px',
        left: '60px',
        right: '80px',
        height: '36%'
      },
      {
        left: '60px',
        right: '80px',
        top: '60%',
        height: '35%'
      }
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
      {
        gridIndex: 1,
        type: 'category',
        boundaryGap: false,
        axisLine: { onZero: true },
        data: x,
      }
    ],
    yAxis: [
      {
        name: '平均值',
        min: Math.ceil(y_min_x),
        max: Math.ceil(y_max_x),
        type: 'value',

      },
      {
        gridIndex: 1,
        name: '极差值',
        min: Math.ceil(y_min_r),
        max: Math.ceil(y_max_r),
        type: 'value',
        inverse: false
      }
    ],
    series: [
      {
        name: '平均值',
        type: 'line',
        symbolSize: 8,
        lineStyle: { color: 'rgba(87, 129, 193, 1)' },
        itemStyle: { color: 'rgba(87, 129, 193, 1)' },
        smooth: false,
        symbol: 'circle',
        markLine: {
          symbol: ['none', 'none', 'none'],
          silent: true,
          data: point_lines_x
        },
        areaStyle: {
          opacity: 0.5,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
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
        data: averageValue

      },
      {
        name: '极差值',
        type: 'line',
        xAxisIndex: 1,
        yAxisIndex: 1,
        symbolSize: 8,
        smooth: false,
        symbol: 'circle',
        lineStyle: { color: 'rgba(87, 129, 193, 1)' },
        itemStyle: { color: 'rgba(87, 129, 193, 1)' },
        markLine: {
          symbol: ['none', 'none', 'none'],
          silent: true,
          data: point_lines_r
        },
        areaStyle: {
          opacity: 0.5,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
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
        data: rangeValue

      },
      {
        name: '异常点',
        data: '',
        type: 'line',
        smooth: false,
        symbol: 'rect',
        symbolSize: 8,
        lineStyle: { color: '#018801' },
        markLine: {
          symbol: ['none', 'none', 'none'],
          silent: true,
          data: point_lines_x
        },
        markPoint: {
          symbol: 'rect',
          symbolSize: 10,
          data: points_violating_spcU
        }

      },
      {
        name: '异常点',
        data: '',
        type: 'line',
        xAxisIndex: 1,
        yAxisIndex: 1,
        smooth: false,
        symbol: 'rect',
        symbolSize: 8,
        lineStyle: { color: '#018801' },
        markLine: {
          symbol: ['none', 'none', 'none'],
          silent: true,
          data: point_lines_r
        },
        markPoint: {
          symbol: 'rect',
          symbolSize: 10,
          data: points_violating_spcL
        }

      },
    ]
  };

  return option;
}

export function baseXMROption(spc: any, config?: any) {

  let option = {};
  let color_array = ["#FF0000", "#EF6A32", "#AAD962", "#03C383", "#710162", "#FBBF45"];

  //CL UCL和LCL控制线
  let point_lines_x = new Array();
  let point_lines_mr = new Array();

  //异常点
  let points_violating_spcU = []
  let violating_pointsU = spc.differentRulesUMap || {};
  let points_violating_spcL = []
  let violating_pointsL = spc.differentRulesLMap || {};

  //判异规则
  let rule_name = ['R0', 'R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8']

  //标准上下线
  let averageValue = spc.averageValue || []//平均值
  let moveRangeValue = [0, ...spc.moveRange] || [] //移动极差
  let x = Array.from({ length: averageValue.length }, (v, i) => i + 1);
  let UCL = { x: Number((Number(spc.tSpcXMrVo.upperLimitValueX).toFixed(4)).substring(0,(Number(spc.tSpcXMrVo.upperLimitValueX).toFixed(4)).lastIndexOf('.')+4)), mr: Number((Number(spc.tSpcXMrVo.upperLimitValueMr).toFixed(4)).substring(0,(Number(spc.tSpcXMrVo.upperLimitValueMr).toFixed(4)).lastIndexOf('.')+4)) };
  let LCL = { x: Number((Number(spc.tSpcXMrVo.lowerLimitValueX).toFixed(4)).substring(0,(Number(spc.tSpcXMrVo.lowerLimitValueX).toFixed(4)).lastIndexOf('.')+4)), mr: Number((Number(spc.tSpcXMrVo.lowerLimitValueMr).toFixed(4)).substring(0,(Number(spc.tSpcXMrVo.lowerLimitValueMr).toFixed(4)).lastIndexOf('.')+4))};
  let USL = Number((Number(spc.usl).toFixed(4)).substring(0,(Number(spc.usl).toFixed(4)).lastIndexOf('.')+4));
  let LSL = Number((Number(spc.lsl).toFixed(4)).substring(0,(Number(spc.lsl).toFixed(4)).lastIndexOf('.')+4));
  let AVG = { x: Number((Number(spc.tSpcXMrVo.centralLimitValueX).toFixed(4)).substring(0,(Number(spc.tSpcXMrVo.centralLimitValueX).toFixed(4)).lastIndexOf('.')+4)), mr: Number((Number(spc.tSpcXMrVo.centralLimitValueMr).toFixed(4)).substring(0,(Number(spc.tSpcXMrVo.centralLimitValueMr).toFixed(4)).lastIndexOf('.')+4)) };
  let target = Number((Number(spc.target).toFixed(4)).substring(0,(Number(spc.target).toFixed(4)).lastIndexOf('.')+4));

  //求最大值和最小值，用于y控制   ::v-deep::v-deep> 上图
  let y_min_x = 999999;
  let y_max_x = 0;
  for (let v in averageValue) {
    averageValue[v] = roundFun(averageValue[v], 4);
  }
  let y_for_rang_x = averageValue.concat();
  y_for_rang_x.push(UCL.x);
  y_for_rang_x.push(LCL.x);
  y_for_rang_x.push(USL);
  y_for_rang_x.push(LSL);
  for (let v in y_for_rang_x) {
    if (y_max_x < y_for_rang_x[v]) { y_max_x = y_for_rang_x[v] };
    if (y_min_x > y_for_rang_x[v]) { y_min_x = y_for_rang_x[v] };
  }
  let delta_x = (y_max_x - y_min_x) * 0.2;
  y_max_x = y_max_x + delta_x * 0.5;
  y_min_x = y_min_x - delta_x;

  //求最大值和最小值，用于y控制   ::v-deep>>>>>> 下图
  let y_min_mr = 999999;
  let y_max_mr = 0;
  for (let v in moveRangeValue) {
    moveRangeValue[v] = roundFun(moveRangeValue[v], 4);
  }
  let y_for_rang_mr = moveRangeValue.concat();
  y_for_rang_mr.push(UCL.mr);
  y_for_rang_mr.push(LCL.mr);
  for (let v in y_for_rang_mr) {
    if (y_max_mr < y_for_rang_mr[v]) { y_max_mr = y_for_rang_mr[v] };
    if (y_min_mr > y_for_rang_mr[v]) { y_min_mr = y_for_rang_mr[v] };
  }
  let delta_mr = (y_max_mr - y_min_mr) * 0.2;
  y_max_mr = y_max_mr + delta_mr * 0.5;
  y_min_mr = y_min_mr - delta_mr;


  // 上下图规格线
  let line_target_x = { name: 'target', symbol: 'none', label: { show: true, position: 'end', formatter: 'target:' + target, color: 'rgba(114, 189, 29, 1)' }, yAxis: target, lineStyle: { color: 'rgba(114, 189, 29, 1)' } };
  let line_avg_x = { name: 'CL', symbol: 'none', label: { show: true, position: 'end', formatter: 'CL:' + AVG.x, color: 'rgba(114, 189, 29, 1)' }, yAxis: AVG.x, lineStyle: { color: 'rgba(114, 189, 29, 1)' } };
  let line_ucl_x = { name: 'UCL', symbol: 'none', label: { show: true, position: 'end', formatter: 'UCL:' + UCL.x, color: 'rgba(247, 164, 39, 1)' }, yAxis: UCL.x, lineStyle: { color: 'rgba(247, 164, 39, 1)' } };
  let line_lcl_x = { name: 'LCL', symbol: 'none', label: { show: true, position: 'end', formatter: 'LCL:' + LCL.x, color: 'rgba(235, 113, 94, 1)' }, yAxis: LCL.x, lineStyle: { color: 'rgba(235, 113, 94, 1)' } };
  let line_usl_x = { name: 'USL', symbol: 'none', label: { show: true, position: 'end', formatter: 'USL:' + USL, color: 'rgba(247, 164, 39, 1)' }, yAxis: USL, lineStyle: { color: 'rgba(247, 164, 39, 1)' } };
  let line_lsl_x = { name: 'LSL', symbol: 'none', label: { show: true, position: 'end', formatter: 'LSL:' + LSL, color: 'rgba(235, 113, 94, 1)' }, yAxis: LSL, lineStyle: { color: 'rgba(235, 113, 94, 1)' } };

  let line_avg_mr = { name: 'CL', symbol: 'none', label: { show: true, position: 'end', formatter: 'CL:' + AVG.mr, color: 'rgba(114, 189, 29, 1)' }, yAxis: AVG.mr, lineStyle: { color: 'rgba(114, 189, 29, 1)' } };
  let line_ucl_mr = { name: 'UCL', symbol: 'none', label: { show: true, position: 'end', formatter: 'UCL:' + UCL.mr, color: 'rgba(247, 164, 39, 1)' }, yAxis: UCL.mr, lineStyle: { color: 'rgba(247, 164, 39, 1)' } };
  let line_lcl_mr = { name: 'LCL', symbol: 'none', label: { show: true, position: 'end', formatter: 'LCL:' + LCL.mr, color: 'rgba(235, 113, 94, 1)' }, yAxis: LCL.mr, lineStyle: { color: 'rgba(235, 113, 94, 1)' } };

  point_lines_x = func4(point_lines_x);
  point_lines_x.push(line_avg_x);
  point_lines_x.push(line_lcl_x);
  point_lines_x.push(line_ucl_x);
  point_lines_x.push(line_lsl_x);
  point_lines_x.push(line_usl_x);
  point_lines_x.push(line_target_x)

  point_lines_mr = func4(point_lines_mr);
  point_lines_mr.push(line_avg_mr);
  point_lines_mr.push(line_lcl_mr);
  point_lines_mr.push(line_ucl_mr);

  // 异常点 ------->上图
  for (let i in violating_pointsU) {
    for (let j in violating_pointsU[i]) {
      let violatings = { itemStyle: {}, name: "", value: "", xAxis: "", yAxis: 0, test: "" };
      let x1 = violating_pointsU[i][j];

      violatings.itemStyle = { color: '#FF0000' };

      violatings.name = "";
      violatings.test = "";
      violatings.value = "";
      violatings.xAxis = x1;
      violatings.yAxis = averageValue[x1];

      //以下处理选择要显示的spc判异规则
      if (rule_name.indexOf(i) >= 0) {
        points_violating_spcU.push(violatings);
      }
      //以上处理选择要显示的spc判异规则

    }
  }
  // 异常点 ------->下图
  for (let i in violating_pointsL) {
    for (let j in violating_pointsL[i]) {
      let violatings = { itemStyle: {}, name: "", value: "", xAxis: "", yAxis: 0, test: "" };
      let x1 = violating_pointsL[i][j];

      violatings.itemStyle = { color: '#FF0000' };

      violatings.name = "";
      violatings.test = "";
      violatings.value = "";
      violatings.xAxis = x1;
      violatings.yAxis = moveRangeValue[x1];

      //以下处理选择要显示的spc判异规则
      if (rule_name.indexOf(i) >= 0) {
        points_violating_spcL.push(violatings);
      }
      //以上处理选择要显示的spc判异规则

    }
  }

  option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      formatter: '{b} <br /> {a0}:{c0} <br /> {a1}:{c1}',
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
        top: '40px',
        left: '60px',
        right: '80px',
        height: '36%'
      },
      {
        left: '60px',
        right: '80px',
        top: '60%',
        height: '35%'
      }
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
      {
        gridIndex: 1,
        type: 'category',
        boundaryGap: false,
        axisLine: { onZero: true },
        data: x,
      }
    ],
    yAxis: [
      {
        name: '单值',
        min: Math.ceil(y_min_x),
        max: Math.ceil(y_max_x),
        type: 'value',

      },
      {
        gridIndex: 1,
        name: '移动极差',
        min: Math.ceil(y_min_mr),
        max: Math.ceil(y_max_mr),
        type: 'value',
        inverse: false
      }
    ],
    series: [
      {
        name: '单值',
        type: 'line',
        symbolSize: 8,
        lineStyle: { color: 'rgba(87, 129, 193, 1)' },
        itemStyle: { color: 'rgba(87, 129, 193, 1)' },
        smooth: false,
        symbol: 'circle',
        markLine: {
          symbol: ['none', 'none', 'none'],
          silent: true,
          data: point_lines_x
        },
        areaStyle: {
          opacity: 0.5,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
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
        data: averageValue

      },
      {
        name: '移动极差',
        type: 'line',
        xAxisIndex: 1,
        yAxisIndex: 1,
        symbolSize: 8,
        smooth: false,
        symbol: 'circle',
        lineStyle: { color: 'rgba(87, 129, 193, 1)' },
        itemStyle: { color: 'rgba(87, 129, 193, 1)' },
        markLine: {
          symbol: ['none', 'none', 'none'],
          silent: true,
          data: point_lines_mr
        },
        areaStyle: {
          opacity: 0.5,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
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
        data: moveRangeValue

      },
      {
        name: '异常点',
        data: '',
        type: 'line',
        smooth: false,
        symbol: 'rect',
        symbolSize: 8,
        lineStyle: { color: '#018801' },
        markLine: {
          symbol: ['none', 'none', 'none'],
          silent: true,
          data: point_lines_x
        },
        markPoint: {
          symbol: 'rect',
          symbolSize: 10,
          data: points_violating_spcU
        }

      },
      {
        name: '异常点',
        data: '',
        type: 'line',
        xAxisIndex: 1,
        yAxisIndex: 1,
        smooth: false,
        symbol: 'rect',
        symbolSize: 8,
        lineStyle: { color: '#018801' },
        markLine: {
          symbol: ['none', 'none', 'none'],
          silent: true,
          data: point_lines_mr
        },
        markPoint: {
          symbol: 'rect',
          symbolSize: 10,
          data: points_violating_spcL
        }

      },
    ]
  };

  return option;
}

export function baseNullOption(spc: any) {
  let options = {
    title: {
      text: '暂无数据',
      top: 'center',
      left: 'center'
    },
    xAxis: {
      show:false,
      type: 'category',
      data: []
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [],
        type: 'line'
      }
    ]
  }
  return options;
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