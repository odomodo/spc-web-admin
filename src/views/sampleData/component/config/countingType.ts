//计数型
import * as echarts from 'echarts';
import { cloneDeep, size } from 'lodash';


export function basePOption(spc_data: any, index: number, config?: any) {
  const spc = cloneDeep(spc_data)
  let option = {};

  //CL UCL和LCL控制线
  let point_lines_p = new Array();

  //异常点
  let points_violating_spc = []
  let violating_points = filterArr(spc.differentRulesUMap, 1);

  //标准上下线
  let defectRateValue = spc.defectRate //缺陷率
  let x = Array.from({ length: defectRateValue.length }, (v, i) => i + 1);
  let UCL:any[] = [];
  let LCL:any[] = [];

  for(let i = 0; i < spc.excelUcl.length; i++){
    UCL.push(Number(spc.excelUcl[i].toFixed(3)))
  }

  for(let i = 0; i < spc.excelLcl.length; i++){
    LCL.push(Number(spc.excelLcl[i].toFixed(3)))
  }

  let MAXUSL = Math.max(...UCL);
  let MINLSL = Math.min(...LCL);

  let AVG = { p: spc.tSpcPVo.defectiveProductNumber / spc.tSpcPVo.checkNumber * 100};

  //求最大值和最小值，用于y控制   >>>>>> 上图
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
  y_max_p = Number((y_max_p + delta_x * 0.5).toFixed(4));
  y_min_p = (y_min_p - delta_x) < 0 ? 0 : Number((y_min_p - delta_x).toFixed(4));


  //############################获取异常点######################################
  //判异规则
  let rule_name = ['R0', 'R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8']
  let color_array = ["#0089ff", "#00ff66", "#00dcff", "#710162", "#FBBF45", '#1A9391', '#D223FE', '#4643BB', '#FF8F00'];
  let ruleArr = spc.itemDecRuleConfigList || []
  let dlt_u = (y_max_p - y_min_p) / 20; //用于异常值垂直间隔
  let points_violating_lines_u: any[] = []
  let points_violating_u: any[] = [];
  let points_xAxis_u: any[] = [];//用于记录每一个x存放了多少个异常堆叠数
  ruleArr.forEach((element: { discriminationRuleCode: string; nvalue: any; mvalue: any; kvalue: any; }, index: number) => {
    if (size(violating_points) > 0 && violating_points.hasOwnProperty(element.discriminationRuleCode)) {
      let point = { name: "", tip: "", itemStyle: {}, xAxis: 0, yAxis: 0, };
      for (let i = 0; i < violating_points[element.discriminationRuleCode].length; i++) {
        let x_u = violating_points[element.discriminationRuleCode][i];
        let R = '';
        let sColor = '';
        if (element.discriminationRuleCode == 'R0') {
          R = '超出规格线';
          sColor = color_array[0]
        } else if (element.discriminationRuleCode == 'R1') {
          R = `${element.nvalue}个点落在${element.mvalue}σ区以外;`;
          sColor = color_array[1]
        } else if (element.discriminationRuleCode == 'R2') {
          R = `连续${element.nvalue}个点落在中心线同一侧;`;
          sColor = color_array[2]
        } else if (element.discriminationRuleCode == 'R3') {
          R = `连续${element.nvalue}个点递增或递减;`;
          sColor = color_array[3]
        } else if (element.discriminationRuleCode == 'R4') {
          R = `连续${element.nvalue}个点中相邻点交替上下;`;
          sColor = color_array[4]
        } 
        point.name = R;
        point.tip = R;
        point.itemStyle = { color: sColor };
        if (points_xAxis_u[x_u] != null) {
          points_xAxis_u[x_u] += 1;
        } else {
          points_xAxis_u[x_u] = 0;
        }
        point.xAxis = x_u;
        point.yAxis = y_min_p + dlt_u * points_xAxis_u[x_u] * 1.3;
        //以下处理选择要显示的spc判异规则

        if (rule_name.indexOf(element.discriminationRuleCode) >= 0) {
          points_violating_u.push(cloneDeep(point));
          points_violating_lines_u.push([{ lineStyle: { color: '#7BCCC4' }, coord: [x_u, y_min_p] }, { coord: [x_u, defectRateValue[x_u]] }]);
        }
        //以上处理选择要显示的spc判异规则
      }

    }
  });




  // 上下图规格线
  let line_avg_p = { name: 'CL', symbol: 'none', label: { show: true, position: 'end', formatter: 'CL:' + AVG.p, color: 'rgba(114, 189, 29, 1)' }, yAxis: AVG.p, lineStyle: { color: 'rgba(114, 189, 29, 0.5)' } };
  let line_ucl_p = [{ name: 'UCL', symbol: 'none', label: { show: true, position: 'end', formatter: 'UCL:' + UCL[index], color: 'rgba(247, 164, 39, 1)' }, yAxis: UCL[index], lineStyle: { color: 'rgba(247, 164, 39, 0.5)' } }];
  let line_lcl_p = [{ name: 'LCL', symbol: 'none', label: { show: true, position: 'end', formatter: 'LCL:' + LCL[index], color: 'rgba(247, 164, 39, 1)' }, yAxis: LCL[index], lineStyle: { color: 'rgba(247, 164, 39, 0.5)' } }];
  point_lines_p = func4(point_lines_p);
  point_lines_p.push(line_avg_p);

  // 异常点
  for (let i in violating_points) {
    for (let j in violating_points[i]) {
      let violatings = { itemStyle: {}, name: "", value: "", xAxis: "", yAxis: 0, test: "" };
      let x1 = violating_points[i][j];

      violatings.itemStyle = { color: '#FF0000' };

      violatings.name = "";
      violatings.test = "";
      violatings.value = "";
      violatings.xAxis = x1;
      violatings.yAxis = defectRateValue[x1];

      //以下处理选择要显示的spc判异规则
      if (rule_name.indexOf(i) >= 0) {
        points_violating_spc.push(violatings);
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
      extraCssText: 'width: 170px'
    },
    legend: {
      data: ['异常点堆叠','异常点'],
      top: 0,
      show: false,
      selected:{
        '异常点堆叠': false,
        '异常点':true
      }
    },
    grid: {
      top: '31px',
      left: '70px',
      right: '120px',
      height: '80%'
    },


    xAxis:
    {
      type: 'category',
      boundaryGap: false,
      splitLine: { show: false },
      axisLabel: {
        inside: false,
        color: '#939599'
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#EBEFF5'
        }
      },
      axisTick: { show: false },
      data: x
    },

    yAxis:
    {
      name: '不合格品率(%)',
      min: y_min_p,
      max: y_max_p,
      type: 'value',
      axisTick: {
        show: false
      },
      splitLine: { show: false },
      axisLabel: {
        inside: false,
        color: '#939599'
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#EBEFF5'
        }
      },
      nameTextStyle:{
        color: '#313233',
      }

    },


    series: [
      {
        name: '不合格品率(%)',
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
      {
        name: '异常点',
        data: '',
        type: 'line',
        smooth: false,
        symbol: 'circle',
        symbolSize: 8,
        itemStyle:{color:'#FF0000'},
        markLine: {
          symbol: ['none', 'none', 'none'],
          silent: true,
          data: point_lines_p
        },
        markPoint: {
          symbol: 'circle',
          symbolSize: 10,
          data: points_violating_spc
        }

      },
      {
        name: '异常点堆叠',
        data: '',
        show: false,
        type: 'line',
        smooth: true,
        symbol: 'rect',
        symbolSize: 8,
        lineStyle: { color: '#018801' },
        markLine: {
          symbol: ['none', 'none', 'none'],
          silent: true,
          data: points_violating_lines_u
        },
        markPoint: {
          symbol: 'rect',
          symbolSize: 10,
          data: points_violating_u
        }

      },
    ]
  };

  return option;
}

export function baseUOption(spc_data: any, index: number, config?: any,) {
  const spc = cloneDeep(spc_data)
  let option = {};

  //异常点
  let points_violating_spc = []
  let violating_points = filterArr(spc.differentRulesUMap, 1);

  //CL UCL和LCL控制线
  let point_lines_u = new Array();

  //标准上下线
  let defectRateValue = spc.defectRate //缺陷率
  let x = Array.from({ length: defectRateValue.length }, (v, i) => i + 1);
  let UCL:any[] = [];
  let LCL:any[] = [];

  for(let i = 0; i < spc.excelUcl.length; i++){
    UCL.push(Number(spc.excelUcl[i].toFixed(3)))
  }

  for(let i = 0; i < spc.excelLcl.length; i++){
    LCL.push(Number(spc.excelLcl[i].toFixed(3)))
  }

  let MAXUCL = Math.max(...UCL);
  let MINLCL = Math.min(...LCL);

  let AVG = { u: spc.tSpcPVo.defectiveProductNumber / spc.tSpcPVo.checkNumber * 100 };

  //求最大值和最小值，用于y控制   >>>>>> 上图
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
  y_max_u = Number((y_max_u + delta_x * 0.5).toFixed(4));
  y_min_u = (y_min_u - delta_x) < 0 ? 0 : Number((y_min_u - delta_x).toFixed(4));


  //############################获取异常点######################################
  //判异规则
  let rule_name = ['R0', 'R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8']
  let color_array = ["#0089ff", "#00ff66", "#00dcff", "#710162", "#FBBF45", '#1A9391', '#D223FE', '#4643BB', '#FF8F00'];
  let ruleArr = spc.itemDecRuleConfigList || []
  let dlt_u = (y_max_u - y_min_u) / 20; //用于异常值垂直间隔
  let points_violating_lines_u: any[] = []
  let points_violating_u: any[] = [];
  let points_xAxis_u: any[] = [];//用于记录每一个x存放了多少个异常堆叠数
  ruleArr.forEach((element: { discriminationRuleCode: string; nvalue: any; mvalue: any; kvalue: any; }, index: number) => {
    if (size(violating_points) > 0 && violating_points.hasOwnProperty(element.discriminationRuleCode)) {
      let point = { name: "", tip: "", itemStyle: {}, xAxis: 0, yAxis: 0, };
      for (let i = 0; i < violating_points[element.discriminationRuleCode].length; i++) {
        let x_u = violating_points[element.discriminationRuleCode][i];
        let R = '';
        let sColor = '';
        if (element.discriminationRuleCode == 'R0') {
          R = '超出规格线';
          sColor = color_array[0]
        } else if (element.discriminationRuleCode == 'R1') {
          R = `${element.nvalue}个点落在${element.mvalue}σ区以外;`;
          sColor = color_array[1]
        } else if (element.discriminationRuleCode == 'R2') {
          R = `连续${element.nvalue}个点落在中心线同一侧;`;
          sColor = color_array[2]
        } else if (element.discriminationRuleCode == 'R3') {
          R = `连续${element.nvalue}个点递增或递减;`;
          sColor = color_array[3]
        } else if (element.discriminationRuleCode == 'R4') {
          R = `连续${element.nvalue}个点中相邻点交替上下;`;
          sColor = color_array[4]
        } 
        point.name = R;
        point.tip = R;
        point.itemStyle = { color: sColor };
        if (points_xAxis_u[x_u] != null) {
          points_xAxis_u[x_u] += 1;
        } else {
          points_xAxis_u[x_u] = 0;
        }
        point.xAxis = x_u;
        point.yAxis = y_min_u + dlt_u * points_xAxis_u[x_u] * 1.3;
        //以下处理选择要显示的spc判异规则

        if (rule_name.indexOf(element.discriminationRuleCode) >= 0) {
          points_violating_u.push(cloneDeep(point));
          points_violating_lines_u.push([{ lineStyle: { color: '#7BCCC4' }, coord: [x_u, y_min_u] }, { coord: [x_u, defectRateValue[x_u]] }]);
        }
        //以上处理选择要显示的spc判异规则
      }

    }
  });



  // 上下图规格线
  let line_avg_u = { name: 'CL', symbol: 'none', label: { show: true, position: 'end', formatter: 'CL:' + AVG.u, color: 'rgba(114, 189, 29, 1)' }, yAxis: AVG.u, lineStyle: { color: 'rgba(114, 189, 29, 0.5)' } };
  let line_ucl_u = [{ name: 'UCL', symbol: 'none', label: { show: true, position: 'end', formatter: 'UCL:' + UCL[index] , color: 'rgba(247, 164, 39, 1)' }, yAxis: UCL[index], lineStyle: { color: 'rgba(247, 164, 39, 0.5)' } }];
  let line_lcl_u = [{ name: 'LCL', symbol: 'none', label: { show: true, position: 'end', formatter: 'LCL:' + LCL[index], color: 'rgba(247, 164, 39, 1)' }, yAxis: LCL[index], lineStyle: { color: 'rgba(247, 164, 39, 0.5)' } }];
  point_lines_u = func4(point_lines_u);
  point_lines_u.push(line_avg_u);

  // 异常点
  for (let i in violating_points) {
    for (let j in violating_points[i]) {
      let violatings = { itemStyle: {}, name: "", value: "", xAxis: "", yAxis: 0, test: "" };
      let x1 = violating_points[i][j];

      violatings.itemStyle = { color: '#FF0000' };

      violatings.name = "";
      violatings.test = "";
      violatings.value = "";
      violatings.xAxis = x1;
      violatings.yAxis = defectRateValue[x1];

      //以下处理选择要显示的spc判异规则
      if (rule_name.indexOf(i) >= 0) {
        points_violating_spc.push(violatings);
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
      extraCssText: 'width: 170px'
    },
    legend: {
      data: ['异常点堆叠','异常点'],
      top: 0,
      show: false,
      selected:{
        '异常点堆叠': false,
        '异常点':true
      }
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
        top: '31px',
        left: '70px',
        right: '120px',
        height: '80%'
      },

    ],
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        splitLine: { show: false },
        axisLabel: {
          inside: false,
          color: '#939599'
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#EBEFF5'
          }
        },
        axisTick: { show: false },
        data: x
      },
    ],
    yAxis: [
      {
        name: '缺陷率(%)',
        min: y_min_u,
        max: y_max_u,
        type: 'value',

       
        axisTick: {
          show: false
        },
        splitLine: { show: false },
        axisLabel: {
          inside: false,
          color: '#939599'
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#EBEFF5'
          }
        },
        nameTextStyle: {
          color: '#313233',
          fontSize: 14
        }
      },

    ],
    series: [
      {
        name: '缺陷率(%)',
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
      {
        name: '异常点',
        data: '',
        type: 'line',
        smooth: false,
        symbol: 'circle',
        symbolSize: 8,
        itemStyle:{color:'#FF0000'},
        markLine: {
          symbol: ['none', 'none', 'none'],
          silent: true,
          data: point_lines_u
        },
        markPoint: {
          symbol: 'circle',
          symbolSize: 10,
          data: points_violating_spc
        }

      },
      {
        name: '异常点堆叠',
        data: '',
        type: 'line',
        smooth: true,
        show: false,
        symbol: 'rect',
        symbolSize: 8,
        lineStyle: { color: '#018801' },
        markLine: {
          symbol: ['none', 'none', 'none'],
          silent: true,
          data: points_violating_lines_u
        },
        markPoint: {
          symbol: 'rect',
          symbolSize: 10,
          data: points_violating_u
        }

      },

    ]
  };

  return option;
}

export function baseNPOption(spc_data: any, config?: any) {
  const spc = cloneDeep(spc_data)
  let option = {};

  //异常点
  let points_violating_spc = []
  let violating_points = filterArr(spc.differentRulesUMap, 1);

  //CL UCL和LCL控制线
  let point_lines_nP = new Array();

  //标准上下线
  let defectsNumberValue = spc.defectsNumber //不合格数
  let x = Array.from({ length: defectsNumberValue.length }, (v, i) => i + 1);
  let UCL = spc.nPUcl;
  let LCL = spc.nPLcl;


  let AVG = { nP: spc.nPcl };

  //求最大值和最小值，用于y控制   >>>>>> 上图
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
  y_max_nP = Number((y_max_nP + delta_x * 0.5).toFixed(4));
  y_min_nP = (y_min_nP - delta_x) < 0 ? 0 : Number((y_min_nP - delta_x).toFixed(4));

  //############################获取异常点######################################
  //判异规则
  let rule_name = ['R0', 'R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8']
  let color_array = ["#0089ff", "#00ff66", "#00dcff", "#710162", "#FBBF45", '#1A9391', '#D223FE', '#4643BB', '#FF8F00'];
  let ruleArr = spc.itemDecRuleConfigList || []
  let dlt_u = (y_max_nP - y_min_nP) / 20; //用于异常值垂直间隔
  let points_violating_lines_u: any[] = []
  let points_violating_u: any[] = [];
  let points_xAxis_u: any[] = [];//用于记录每一个x存放了多少个异常堆叠数
  ruleArr.forEach((element: { discriminationRuleCode: string; nvalue: any; mvalue: any; kvalue: any; }, index: number) => {
    if (size(violating_points) > 0 && violating_points.hasOwnProperty(element.discriminationRuleCode)) {
      let point = { name: "", tip: "", itemStyle: {}, xAxis: 0, yAxis: 0, };
      for (let i = 0; i < violating_points[element.discriminationRuleCode].length; i++) {
        let x_u = violating_points[element.discriminationRuleCode][i];
        let R = '';
        let sColor = '';
        if (element.discriminationRuleCode == 'R0') {
          R = '超出规格线';
          sColor = color_array[0]
        } else if (element.discriminationRuleCode == 'R1') {
          R = `${element.nvalue}个点落在${element.mvalue}σ区以外;`;
          sColor = color_array[1]
        } else if (element.discriminationRuleCode == 'R2') {
          R = `连续${element.nvalue}个点落在中心线同一侧;`;
          sColor = color_array[2]
        } else if (element.discriminationRuleCode == 'R3') {
          R = `连续${element.nvalue}个点递增或递减;`;
          sColor = color_array[3]
        } else if (element.discriminationRuleCode == 'R4') {
          R = `连续${element.nvalue}个点中相邻点交替上下;`;
          sColor = color_array[4]
        } 
        point.name = R;
        point.tip = R;
        point.itemStyle = { color: sColor };
        if (points_xAxis_u[x_u] != null) {
          points_xAxis_u[x_u] += 1;
        } else {
          points_xAxis_u[x_u] = 0;
        }
        point.xAxis = x_u;
        point.yAxis = y_min_nP + dlt_u * points_xAxis_u[x_u] * 1.3;
        //以下处理选择要显示的spc判异规则

        if (rule_name.indexOf(element.discriminationRuleCode) >= 0) {
          points_violating_u.push(cloneDeep(point));
          points_violating_lines_u.push([{ lineStyle: { color: '#7BCCC4' }, coord: [x_u, y_min_nP] }, { coord: [x_u, defectsNumberValue[x_u]] }]);
        }
        //以上处理选择要显示的spc判异规则
      }

    }
  });


  // 上下图规格线
  let line_avg_nP = { name: 'CL', symbol: 'none', label: { show: true, position: 'end', formatter: 'CL:' + AVG.nP, color: 'rgba(114, 189, 29, 1)' }, yAxis: AVG.nP, lineStyle: { color: 'rgba(114, 189, 29, 0.5)' } };
  let line_ucl_nP = { name: 'UCL', symbol: 'none', label: { show: true, position: 'end', formatter: 'UCL:' + UCL, color: 'rgba(247, 164, 39, 1)' }, yAxis: UCL, lineStyle: { color: 'rgba(247, 164, 39, 1)' } };
  let line_lcl_nP = { name: 'LCL', symbol: 'none', label: { show: true, position: 'end', formatter: 'LCL:' + LCL, color: 'rgba(247, 164, 39, 1)' }, yAxis: LCL, lineStyle: { color: 'rgba(247, 164, 39, 1)' } };
  point_lines_nP = func4(point_lines_nP);
  point_lines_nP.push(line_avg_nP);
  point_lines_nP.push(line_ucl_nP)
  point_lines_nP.push(line_lcl_nP)


  // 异常点
  for (let i in violating_points) {
    for (let j in violating_points[i]) {
      let violatings = { itemStyle: {}, name: "", value: "", xAxis: "", yAxis: 0, test: "" };
      let x1 = violating_points[i][j];

      violatings.itemStyle = { color: '#FF0000' };

      violatings.name = "";
      violatings.test = "";
      violatings.value = "";
      violatings.xAxis = x1;
      violatings.yAxis = defectsNumberValue[x1];

      //以下处理选择要显示的spc判异规则
      if (rule_name.indexOf(i) >= 0) {
        points_violating_spc.push(violatings);
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
      extraCssText: 'width: 170px'
    },
    legend: {
      data: ['异常点堆叠','异常点'],
      top: 0,
      show: false,
      selected:{
        '异常点堆叠': false,
        '异常点':true
      }
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
        top: '31px',
        left: '70px',
        right: '120px',
        height: '80%'
      },
    ],
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        splitLine: { show: false },
        axisLabel: {
          inside: false,
          color: '#939599'
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#EBEFF5'
          }
        },
        axisTick: { show: false },
        data: x
      },
    ],
    yAxis: [
      {
        name: '不合格数',
        min: y_min_nP,
        max: y_max_nP,
        type: 'value',
        axisTick: {
          show: false
        },
        splitLine: { show: false },
        axisLabel: {
          inside: false,
          color: '#939599'
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#EBEFF5'
          }
        },
        nameTextStyle: {
          color: '#313233',
          fontSize: 14
        }
      },

    ],
    series: [
      {
        name: '不合格数',
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
        data: defectsNumberValue

      },
      {
        name: '异常点',
        data: '',
        type: 'line',
        smooth: false,
        symbol: 'circle',
        symbolSize: 8,
        itemStyle:{color:'#FF0000'},
        markLine: {
          symbol: ['none', 'none', 'none'],
          silent: true,
          data: point_lines_nP
        },
        markPoint: {
          symbol: 'circle',
          symbolSize: 10,
          data: points_violating_spc
        }

      },
      {
        name: '异常点堆叠',
        data: '',
        type: 'line',
        smooth: true,
        show: false,
        symbol: 'rect',
        symbolSize: 8,
        lineStyle: { color: '#018801' },
        markLine: {
          symbol: ['none', 'none', 'none'],
          silent: true,
          data: points_violating_lines_u
        },
        markPoint: {
          symbol: 'rect',
          symbolSize: 10,
          data: points_violating_u
        }

      },

    ]
  };

  return option;
}

export function baseCOption(spc_data: any, config?: any) {
  const spc = cloneDeep(spc_data)
  let option = {};

  //异常点
  let points_violating_spc = []
  let violating_points = filterArr(spc.differentRulesUMap, 1);

  //CL UCL和LCL控制线
  let point_lines_c = new Array();

  //标准上下线
  let defectsNumberValue = spc.defectsNumber //缺陷数
  let x = Array.from({ length: defectsNumberValue.length }, (v, i) => i + 1);
  let UCL = spc.nPUcl;
  let LCL = spc.nPLcl;


  let AVG = { c: spc.nPcl };

  //求最大值和最小值，用于y控制   >>>>>> 上图
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
  y_max_c = Number((y_max_c + delta_x * 0.5).toFixed(4));
  y_min_c = (y_min_c - delta_x) < 0 ? 0 : Number((y_min_c - delta_x).toFixed(4));

  //############################获取异常点######################################
  //判异规则
  let rule_name = ['R0', 'R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8']
  let color_array = ["#0089ff", "#00ff66", "#00dcff", "#710162", "#FBBF45", '#1A9391', '#D223FE', '#4643BB', '#FF8F00'];
  let ruleArr = spc.itemDecRuleConfigList || []
  let dlt_u = (y_max_c - y_min_c) / 20; //用于异常值垂直间隔
  let points_violating_lines_u: any[] = []
  let points_violating_u: any[] = [];
  let points_xAxis_u: any[] = [];//用于记录每一个x存放了多少个异常堆叠数
  ruleArr.forEach((element: { discriminationRuleCode: string; nvalue: any; mvalue: any; kvalue: any; }, index: number) => {
    if (size(violating_points) > 0 && violating_points.hasOwnProperty(element.discriminationRuleCode)) {
      let point = { name: "", tip: "", itemStyle: {}, xAxis: 0, yAxis: 0, };
      for (let i = 0; i < violating_points[element.discriminationRuleCode].length; i++) {
        let x_u = violating_points[element.discriminationRuleCode][i];
        let R = '';
        let sColor = '';
        if (element.discriminationRuleCode == 'R0') {
          R = '超出规格线';
          sColor = color_array[0]
        } else if (element.discriminationRuleCode == 'R1') {
          R = `${element.nvalue}个点落在${element.mvalue}σ区以外;`;
          sColor = color_array[1]
        } else if (element.discriminationRuleCode == 'R2') {
          R = `连续${element.nvalue}个点落在中心线同一侧;`;
          sColor = color_array[2]
        } else if (element.discriminationRuleCode == 'R3') {
          R = `连续${element.nvalue}个点递增或递减;`;
          sColor = color_array[3]
        } else if (element.discriminationRuleCode == 'R4') {
          R = `连续${element.nvalue}个点中相邻点交替上下;`;
          sColor = color_array[4]
        } 
        point.name = R;
        point.tip = R;
        point.itemStyle = { color: sColor };
        if (points_xAxis_u[x_u] != null) {
          points_xAxis_u[x_u] += 1;
        } else {
          points_xAxis_u[x_u] = 0;
        }
        point.xAxis = x_u;
        point.yAxis = y_min_c + dlt_u * points_xAxis_u[x_u] * 1.3;
        //以下处理选择要显示的spc判异规则

        if (rule_name.indexOf(element.discriminationRuleCode) >= 0) {
          points_violating_u.push(cloneDeep(point));
          points_violating_lines_u.push([{ lineStyle: { color: '#7BCCC4' }, coord: [x_u, y_min_c] }, { coord: [x_u, defectsNumberValue[x_u]] }]);
        }
        //以上处理选择要显示的spc判异规则
      }

    }
  });




  // 上下图规格线
  let line_avg_c = { name: 'CL', symbol: 'none', label: { show: true, position: 'end', formatter: 'CL:' + AVG.c, color: 'rgba(114, 189, 29, 1)' }, yAxis: AVG.c, lineStyle: { color: 'rgba(114, 189, 29, 0.5)' } };
  let line_ucl_c = { name: 'UCL', symbol: 'none', label: { show: true, position: 'end', formatter: 'UCL:' + UCL, color: 'rgba(247, 164, 39, 1)' }, yAxis: UCL, lineStyle: { color: 'rgba(247, 164, 39, 1)' } };
  let line_lcl_c = { name: 'LCL', symbol: 'none', label: { show: true, position: 'end', formatter: 'LCL:' + LCL, color: 'rgba(247, 164, 39, 1)' }, yAxis: LCL, lineStyle: { color: 'rgba(247, 164, 39, 1)' } };
  point_lines_c = func4(point_lines_c);
  point_lines_c.push(line_avg_c);
  point_lines_c.push(line_ucl_c)
  point_lines_c.push(line_lcl_c)


  // 异常点
  for (let i in violating_points) {
    for (let j in violating_points[i]) {
      let violatings = { itemStyle: {}, name: "", value: "", xAxis: "", yAxis: 0, test: "" };
      let x1 = violating_points[i][j];

      violatings.itemStyle = { color: '#FF0000' };

      violatings.name = "";
      violatings.test = "";
      violatings.value = "";
      violatings.xAxis = x1;
      violatings.yAxis = defectsNumberValue[x1];

      //以下处理选择要显示的spc判异规则
      if (rule_name.indexOf(i) >= 0) {
        points_violating_spc.push(violatings);
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
      extraCssText: 'width: 170px'
    },
    legend: {
      data: ['异常点堆叠','异常点'],
      top: 0,
      show: false,
      selected:{
        '异常点堆叠': false,
        '异常点':true
      }
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
        top: '31px',
        left: '70px',
        right: '120px',
        height: '80%'
      },

    ],
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        axisLabel: {
          inside: false,
          color: '#939599'
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#EBEFF5'
          }
        },
        splitLine: { show: false },
        axisTick: { show: false },
        data: x
      },
    ],
    yAxis: [
      {
        name: '缺陷数',
        min: y_min_c,
        max: y_max_c,
        type: 'value',
        axisLabel: {
          inside: false,
          color: '#939599'
        },
        axisTick: {
          show: false
        },
        splitLine: { show: false },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#EBEFF5'
          }
        },
        nameTextStyle: {
          color: '#313233',
          fontSize: 14
        }
      },

    ],
    series: [
      {
        name: '缺陷数',
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
        data: defectsNumberValue

      },
      {
        name: '异常点',
        data: '',
        type: 'line',
        smooth: false,
        symbol: 'circle',
        symbolSize: 8,
        itemStyle:{color:'#FF0000'},
        markLine: {
          symbol: ['none', 'none', 'none'],
          silent: true,
          data: point_lines_c
        },
        markPoint: {
          symbol: 'circle',
          symbolSize: 10,
          data: points_violating_spc
        }

      },
      {
        name: '异常点堆叠',
        data: '',
        type: 'line',
        smooth: true,
        show: false,
        symbol: 'rect',
        symbolSize: 8,
        lineStyle: { color: '#018801' },
        markLine: {
          symbol: ['none', 'none', 'none'],
          silent: true,
          data: points_violating_lines_u
        },
        markPoint: {
          symbol: 'rect',
          symbolSize: 10,
          data: points_violating_u
        }

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

function filterArr(arr: any[], i: number) {
  let filter: any = {}
  for (let items in arr) {
    filter[items] = []
    arr[items].map((item: number, index: any) => {
      if (item == i) {

        filter[items].push(index)
      }
    })
  }

  return filter
}
