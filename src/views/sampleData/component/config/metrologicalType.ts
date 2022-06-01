//计量型

export function baseXbarSOption(spc:any,config?:any){
    let option = {};
    let color_array = ["#FF0000", "#EF6A32", "#AAD962", "#03C383", "#710162", "#FBBF45"];

    //CL UCL和LCL控制线
    let point_lines_x = new Array();
    let point_lines_s = new Array();

    //标准上下线
    let averageValue = spc.averageValue //平均值
    let standardDeviation = spc.standardDeviation  //标准差
    let x = Array.from({ length: averageValue.length }, (v, i) => i+1);
    let UCL = {x:spc.tSpcXBarSVo.upperLimitValueX,s:spc.tSpcXBarSVo.upperLimitValueS};
    let LCL = {x:spc.tSpcXBarSVo.lowerLimitValueX,s:spc.tSpcXBarSVo.lowerLimitValueS};
    let USL = spc.usl;
    let LSL = spc.lsl;
    let AVG = {x:spc.tSpcXBarSVo.centralLimitValueX,s:spc.tSpcXBarSVo.centralLimitValueS};

    //求最大值和最小值，用于y控制   >>>>>>> 上图
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

    //求最大值和最小值，用于y控制   >>>>>>> 下图
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
    let line_avg_x = { name: 'CL', symbol: 'none', label: { show: true, position: 'end', formatter: 'CL:' + Math.round(AVG.x * 100) / 100 }, yAxis: AVG.x, lineStyle: { color: 'red' } };
    let  line_ucl_x = { name: 'UCL', symbol: 'none', label: { show: true, position: 'end', formatter: 'UCL:' + Math.round(UCL.x * 100) / 100 }, yAxis: UCL.x, lineStyle: { color: 'green' } };
    let  line_lcl_x = { name: 'LCL', symbol: 'none', label: { show: true, position: 'end', formatter: 'LCL:' + Math.round(LCL.x * 100) / 100 }, yAxis: LCL.x, lineStyle: { color: 'green' } };
    let  line_usl_x = { name: 'USL', symbol: 'none', label: { show: true, position: 'end', formatter: 'USL:' + Math.round(USL * 100) / 100 }, yAxis: USL, lineStyle: { color: '#FBBF45' } };
    let  line_lsl_x = { name: 'LSL', symbol: 'none', label: { show: true, position: 'end', formatter: 'LSL:' + Math.round(LSL * 100) / 100 }, yAxis: LSL, lineStyle: { color: '#FBBF45' } };

    let  line_avg_s = { name: 'CL', symbol: 'none', label: { show: true, position: 'end', formatter: 'CL:' + Math.round(AVG.s * 100) / 100 }, yAxis: AVG.s, lineStyle: { color: 'red' } };
    let  line_ucl_s = { name: 'UCL', symbol: 'none', label: { show: true, position: 'end', formatter: 'UCL:' + Math.round(UCL.s * 100) / 100 }, yAxis: UCL.s, lineStyle: { color: 'green' } };
    let  line_lcl_s = { name: 'LCL', symbol: 'none', label: { show: true, position: 'end', formatter: 'LCL:' + Math.round(LCL.s * 100) / 100 }, yAxis: LCL.s, lineStyle: { color: 'green' } };

    point_lines_x = func4(point_lines_x);
    point_lines_x.push(line_avg_x);
    point_lines_x.push(line_lcl_x);
    point_lines_x.push(line_ucl_x);
    point_lines_x.push(line_lsl_x);
    point_lines_x.push(line_usl_x);

    point_lines_s = func4(point_lines_s);
    point_lines_s.push(line_avg_s);
    point_lines_s.push(line_lcl_s);
    point_lines_s.push(line_ucl_s);

    option = {
      title: {
        text: 'Xbar_S',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        },
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        // position: function (pos: number[], params: any, el: any, elRect: any, size: { viewSize: number[]; }) {
        //   var obj = { top: 10 };
        //   // obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
        //   return obj;
        // },
        extraCssText: 'width: 170px'
      },
      legend: {
        data: ['观测值',],
        left: 10,
        show: false
      },
      // toolbox: {
      //   feature: {
      //     dataZoom: {
      //       yAxisIndex: 'none'
      //     },
      //     restore: {},
      //     saveAsImage: {}
      //   }
      // },
  
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
      // dataZoom: [
      //   {
      //     show: true,
      //     realtime: true,
      //     start: 30,
      //     end: 70,
      //     xAxisIndex: [0, 1]
      //   },
      //   {
      //     type: 'inside',
      //     realtime: true,
      //     start: 30,
      //     end: 70,
      //     xAxisIndex: [0, 1]
      //   }
      // ],
      grid: [
        {
          left: '60px',
          right: '60px',
          height: '30%'
        },
        {
          left: '60px',
          right: '60px',
          top: '60%',
          height: '30%'
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
          min:Math.round(y_min_x),
          max:Math.round(y_max_x),
          type: 'value',
          
        },
        {
          gridIndex: 1,
          name: '标准差',
          min:Math.round(y_min_s),
          max:Math.round(y_max_s),
          type: 'value',
          inverse: false
        }
      ],
      series: [
        {
          name: '平均值',
          type: 'line',
          symbolSize: 8,
          lineStyle: { color: '#084081' },
          itemStyle: { color: '#084081' },
          smooth: true,
          symbol: 'circle',
          markLine: {
            symbol: ['none', 'none', 'none'],
            silent: true,
            data: point_lines_x
          },
          data:averageValue
             
        },
        {
          name: '标准差',
          type: 'line',
          xAxisIndex: 1,
          yAxisIndex: 1,
          symbolSize: 8,
          smooth: true,
          symbol: 'circle',
          lineStyle: { color: '#088' },
          itemStyle: { color: '#088' },
          markLine: {
            symbol: ['none', 'none', 'none'],
            silent: true,
            data: point_lines_s
          },
          data:standardDeviation
              
        }
      ]
    };
  
    return option;

}

export function baseXROption(spc:any,config?:any){

  let option = {};
    let color_array = ["#FF0000", "#EF6A32", "#AAD962", "#03C383", "#710162", "#FBBF45"];

    //CL UCL和LCL控制线
    let point_lines_x = new Array();
    let point_lines_r = new Array();

    //标准上下线
    let averageValue = spc.averageValue //平均值
    let rangeValue = spc.rangeArray  //极差
    let x = Array.from({ length: averageValue.length }, (v, i) => i+1);
    let UCL = {x:spc.tSpcXRVo.upperLimitValueX,r:spc.tSpcXRVo.upperLimitValueR};
    let LCL = {x:spc.tSpcXRVo.lowerLimitValueX,r:spc.tSpcXRVo.lowerLimitValueR};
    let USL = spc.usl;
    let LSL = spc.lsl;
    let AVG = {x:spc.tSpcXRVo.centralLimitValueX,r:spc.tSpcXRVo.centralLimitValueR};
    let cutApartR = (UCL.r - LCL.r)/6

    //求最大值和最小值，用于y控制   >>>>>>> 上图
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

    //求最大值和最小值，用于y控制   >>>>>>> 下图
    let y_min_r = 999999;
    let y_max_r = 0;
    for (let v in rangeValue ) {
      rangeValue [v] = roundFun(rangeValue [v], 4);
    }
    let y_for_rang_r = rangeValue .concat();
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
    let line_avg_x = { name: 'CL', symbol: 'none', label: { show: true, position: 'end', formatter: 'CL:' + Math.round(AVG.x * 100) / 100 }, yAxis: AVG.x, lineStyle: { color: 'red' } };
    let  line_ucl_x = { name: 'UCL', symbol: 'none', label: { show: true, position: 'end', formatter: 'UCL:' + Math.round(UCL.x * 100) / 100 }, yAxis: UCL.x, lineStyle: { color: 'green' } };
    let  line_lcl_x = { name: 'LCL', symbol: 'none', label: { show: true, position: 'end', formatter: 'LCL:' + Math.round(LCL.x * 100) / 100 }, yAxis: LCL.x, lineStyle: { color: 'green' } };
    let  line_usl_x = { name: 'USL', symbol: 'none', label: { show: true, position: 'end', formatter: 'USL:' + Math.round(USL * 100) / 100 }, yAxis: USL, lineStyle: { color: '#FBBF45' } };
    let  line_lsl_x = { name: 'LSL', symbol: 'none', label: { show: true, position: 'end', formatter: 'LSL:' + Math.round(LSL * 100) / 100 }, yAxis: LSL, lineStyle: { color: '#FBBF45' } };

    let  line_avg_r = { name: 'CL', symbol: 'none', label: { show: true, position: 'end', formatter: 'CL:' + Math.round(AVG.r * 100) / 100 }, yAxis: AVG.r, lineStyle: { color: 'red' } };
    let  line_ucl_r = { name: 'UCL', symbol: 'none', label: { show: true, position: 'end', formatter: 'UCL:' + Math.round(UCL.r * 100) / 100 }, yAxis: UCL.r, lineStyle: { color: 'green' } };
    let  line_lcl_r = { name: 'LCL', symbol: 'none', label: { show: true, position: 'end', formatter: 'LCL:' + Math.round(LCL.r * 100) / 100 }, yAxis: LCL.r, lineStyle: { color: 'green' } };

    point_lines_x = func4(point_lines_x);
    point_lines_x.push(line_avg_x);
    point_lines_x.push(line_lcl_x);
    point_lines_x.push(line_ucl_x);
    point_lines_x.push(line_lsl_x);
    point_lines_x.push(line_usl_x);

    point_lines_r = func4(point_lines_r);
    point_lines_r.push(line_avg_r);
    point_lines_r.push(line_lcl_r);
    point_lines_r.push(line_ucl_r);

    option = {
      title: {
        text: 'X_R',
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
          height: '30%'
        },
        {
          left: '60px',
          right: '60px',
          top: '60%',
          height: '30%'
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
          min:Math.round(y_min_x),
          max:Math.round(y_max_x),
          type: 'value',
          splitLine:{show:false },
        },
        {
          gridIndex: 1,
          name: '极差值',
          min:Math.round(y_min_r),
          max:Math.round(y_max_r),
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
          lineStyle: { color: '#084081' },
          itemStyle: { color: '#084081' },
          smooth: true,
          symbol: 'circle',
          markLine: {
            symbol: ['none', 'none', 'none'],
            silent: true,
            data: point_lines_x
          },
          data:averageValue
             
        },
        {
          name: '极差值',
          type: 'line',
          xAxisIndex: 1,
          yAxisIndex: 1,
          symbolSize: 8,
          smooth: true,
          symbol: 'circle',
          lineStyle: { color: '#088' },
          itemStyle: { color: '#088' },
          markLine: {
            symbol: ['none', 'none', 'none'],
            silent: true,
            data: point_lines_r
          },
          data:rangeValue 
              
        }
      ]
    };
  
    return option;
}

export function baseXbarROption(spc:any,config?:any){

  let option = {};
    let color_array = ["#FF0000", "#EF6A32", "#AAD962", "#03C383", "#710162", "#FBBF45"];

    //CL UCL和LCL控制线
    let point_lines_x = new Array();
    let point_lines_r = new Array();

    //标准上下线
    let averageValue = spc.averageValue //平均值
    let rangeValue = spc.rangeArray  //极差
    let x = Array.from({ length: averageValue.length }, (v, i) => i+1);
    let UCL = {x:spc.tSpcXBarRVo.upperLimitValueX,r:spc.tSpcXBarRVo.upperLimitValueR};
    let LCL = {x:spc.tSpcXBarRVo.lowerLimitValueX,r:spc.tSpcXBarRVo.lowerLimitValueR};
    let USL = spc.usl;
    let LSL = spc.lsl;
    let AVG = {x:spc.tSpcXBarRVo.centralLimitValueX,r:spc.tSpcXBarRVo.centralLimitValueR};

    //求最大值和最小值，用于y控制   >>>>>>> 上图
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

    //求最大值和最小值，用于y控制   >>>>>>> 下图
    let y_min_r = 999999;
    let y_max_r = 0;
    for (let v in rangeValue ) {
      rangeValue [v] = roundFun(rangeValue [v], 4);
    }
    let y_for_rang_r = rangeValue .concat();
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
    let line_avg_x = { name: 'CL', symbol: 'none', label: { show: true, position: 'end', formatter: 'CL:' + Math.round(AVG.x * 100) / 100 }, yAxis: AVG.x, lineStyle: { color: 'red' } };
    let  line_ucl_x = { name: 'UCL', symbol: 'none', label: { show: true, position: 'end', formatter: 'UCL:' + Math.round(UCL.x * 100) / 100 }, yAxis: UCL.x, lineStyle: { color: 'green' } };
    let  line_lcl_x = { name: 'LCL', symbol: 'none', label: { show: true, position: 'end', formatter: 'LCL:' + Math.round(LCL.x * 100) / 100 }, yAxis: LCL.x, lineStyle: { color: 'green' } };
    let  line_usl_x = { name: 'USL', symbol: 'none', label: { show: true, position: 'end', formatter: 'USL:' + Math.round(USL * 100) / 100 }, yAxis: USL, lineStyle: { color: '#FBBF45' } };
    let  line_lsl_x = { name: 'LSL', symbol: 'none', label: { show: true, position: 'end', formatter: 'LSL:' + Math.round(LSL * 100) / 100 }, yAxis: LSL, lineStyle: { color: '#FBBF45' } };

    let  line_avg_r = { name: 'CL', symbol: 'none', label: { show: true, position: 'end', formatter: 'CL:' + Math.round(AVG.r * 100) / 100 }, yAxis: AVG.r, lineStyle: { color: 'red' } };
    let  line_ucl_r = { name: 'UCL', symbol: 'none', label: { show: true, position: 'end', formatter: 'UCL:' + Math.round(UCL.r * 100) / 100 }, yAxis: UCL.r, lineStyle: { color: 'green' } };
    let  line_lcl_r = { name: 'LCL', symbol: 'none', label: { show: true, position: 'end', formatter: 'LCL:' + Math.round(LCL.r * 100) / 100 }, yAxis: LCL.r, lineStyle: { color: 'green' } };

    point_lines_x = func4(point_lines_x);
    point_lines_x.push(line_avg_x);
    point_lines_x.push(line_lcl_x);
    point_lines_x.push(line_ucl_x);
    point_lines_x.push(line_lsl_x);
    point_lines_x.push(line_usl_x);

    point_lines_r = func4(point_lines_r);
    point_lines_r.push(line_avg_r);
    point_lines_r.push(line_lcl_r);
    point_lines_r.push(line_ucl_r);

    option = {
      title: {
        text: 'Xbar_R',
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
          height: '30%'
        },
        {
          left: '60px',
          right: '60px',
          top: '60%',
          height: '30%'
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
          min:Math.round(y_min_x),
          max:Math.round(y_max_x),
          type: 'value',
          
        },
        {
          gridIndex: 1,
          name: '极差值',
          min:Math.round(y_min_r),
          max:Math.round(y_max_r),
          type: 'value',
          inverse: false
        }
      ],
      series: [
        {
          name: '平均值',
          type: 'line',
          symbolSize: 8,
          lineStyle: { color: '#084081' },
          itemStyle: { color: '#084081' },
          smooth: true,
          symbol: 'circle',
          markLine: {
            symbol: ['none', 'none', 'none'],
            silent: true,
            data: point_lines_x
          },
          data:averageValue
             
        },
        {
          name: '极差值',
          type: 'line',
          xAxisIndex: 1,
          yAxisIndex: 1,
          symbolSize: 8,
          smooth: true,
          symbol: 'circle',
          lineStyle: { color: '#088' },
          itemStyle: { color: '#088' },
          markLine: {
            symbol: ['none', 'none', 'none'],
            silent: true,
            data: point_lines_r
          },
          data:rangeValue 
              
        }
      ]
    };
  
    return option;
}














function roundFun(value: number, n: number) {
    return Math.round(value * Math.pow(10, n)) / Math.pow(10, n);
  }
  
  function func4(objArray: string | any[]) {
    let result = [];//去重后返回的结果数组
    let temp:any = {};//临时对象
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