//计数型
export function basePOption(spc:any,config?:any){

    let option = {};
      let color_array = ["#FF0000", "#EF6A32", "#AAD962", "#03C383", "#710162", "#FBBF45"];
  
      //CL UCL和LCL控制线
      let point_lines_p = new Array();
  
      //标准上下线
      let defectRateValue = spc.defectRate //缺陷率
      let x = Array.from({ length: defectRateValue.length }, (v, i) => i+1);
      let UCL = spc.excelLcl ||[];
      let LCL = spc.excelUcl || [];
      // let UCL = {p:spc.pucl};
      // let LCL = {p:spc.plcl};
    //   let USL = spc.usl;
    //   let LSL = spc.lsl;
      let AVG = {p:spc.pcl};
  
      //求最大值和最小值，用于y控制   >>>>>>> 上图
      let y_min_p = 999999;
      let y_max_p = 0;
      for (let v in defectRateValue) {
          defectRateValue[v] = roundFun(defectRateValue[v], 4);
      }
      let y_for_rang_p = defectRateValue.concat();
    //   y_for_rang_p.push(UCL.p);
    //   y_for_rang_p.push(LCL.p);
    //   y_for_rang_p.push(USL);
    //   y_for_rang_p.push(LSL);
      for (let v in y_for_rang_p) {
        if (y_max_p < y_for_rang_p[v]) { y_max_p = y_for_rang_p[v] };
        if (y_min_p > y_for_rang_p[v]) { y_min_p = y_for_rang_p[v] };
      }
      let delta_x = (y_max_p - y_min_p) * 0.2;
      y_max_p = y_max_p + delta_x * 0.5;
      y_min_p = y_min_p - delta_x;
  
  
  
      // 上下图规格线
      // let line_avg_p = { name: 'CL', symbol: 'none', label: { show: true, position: 'end', formatter: 'CL:' + Math.round(AVG.p * 100) / 100 }, yAxis: AVG.p, lineStyle: { color: 'red' } };
      // let  line_ucl_p = { name: 'UCL', symbol: 'none', label: { show: true, position: 'end', formatter: 'UCL:' + Math.round(UCL.p * 100) / 100 }, yAxis: UCL.p, lineStyle: { color: 'green' } };
      // let  line_lcl_p = { name: 'LCL', symbol: 'none', label: { show: true, position: 'end', formatter: 'LCL:' + Math.round(LCL.p * 100) / 100 }, yAxis: LCL.p, lineStyle: { color: 'green' } };
    //   let  line_usl_p = { name: 'USL', symbol: 'none', label: { show: true, position: 'end', formatter: 'USL:' + Math.round(USL * 100) / 100 }, yAxis: USL, lineStyle: { color: '#FBBF45' } };
    //   let  line_lsl_p = { name: 'LSL', symbol: 'none', label: { show: true, position: 'end', formatter: 'LSL:' + Math.round(LSL * 100) / 100 }, yAxis: LSL, lineStyle: { color: '#FBBF45' } };
  
      // point_lines_p = func4(point_lines_p);
      // point_lines_p.push(line_avg_p);
      // point_lines_p.push(line_lcl_p);
      // point_lines_p.push(line_ucl_p);
    //   point_lines_p.push(line_lsl_p);
    //   point_lines_p.push(line_usl_p);
  

  
      option = {
        title: {
          text: 'P',
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
            min:Math.round(y_min_p),
            max:Math.round(y_max_p),
            type: 'value',
            
          },
          
        ],
        series: [
          {
            name: '不合格品率',
            type: 'line',
            symbolSize: 8,
            lineStyle: { color: '#084081' },
            itemStyle: { color: '#084081' },
            smooth: false,
            symbol: 'circle',
            // markLine: {
            //   symbol: ['none', 'none', 'none'],
            //   silent: true,
            //   data: point_lines_p
            // },
            data:defectRateValue
               
          },
          {
            name: 'UCL',
            type: 'line',
            symbolSize: 0,
            lineStyle: { color: '#084081' },
            itemStyle: { color: '#084081' },
            smooth: false,
            symbol: 'circle',
            markLine: {
              symbol: ['none', 'none', 'none'],
              silent: true,
              data: [{
                name:"UCL"
              }]
            },
            data:UCL
               
          },
          {
            name: 'LCL',
            type: 'line',
            symbolSize: 0,
            lineStyle: { color: '#084081' },
            itemStyle: { color: '#084081' },
            smooth: false,
            symbol: 'circle',
            // markLine: {
            //   symbol: ['none', 'none', 'none'],
            //   silent: true,
            //   data: point_lines_p
            // },
            data:LCL
               
          },
          
        ]
      };
    
      return option;
  }

  export function baseUOption(spc:any,config?:any){

    let option = {};
    let color_array = ["#FF0000", "#EF6A32", "#AAD962", "#03C383", "#710162", "#FBBF45"];

    //CL UCL和LCL控制线
    let point_lines_p = new Array();

    //标准上下线
    let defectRateValue = spc.defectRate //缺陷率
    let x = Array.from({ length: defectRateValue.length }, (v, i) => i+1);
    let UCL = {p:spc.pucl};
    let LCL = {p:spc.plcl};
  //   let USL = spc.usl;
  //   let LSL = spc.lsl;
    let AVG = {p:spc.pcl};

    //求最大值和最小值，用于y控制   >>>>>>> 上图
    let y_min_p = 999999;
    let y_max_p = 0;
    for (let v in defectRateValue) {
        defectRateValue[v] = roundFun(defectRateValue[v], 4);
    }
    let y_for_rang_p = defectRateValue.concat();
  //   y_for_rang_p.push(UCL.p);
  //   y_for_rang_p.push(LCL.p);
  //   y_for_rang_p.push(USL);
  //   y_for_rang_p.push(LSL);
    for (let v in y_for_rang_p) {
      if (y_max_p < y_for_rang_p[v]) { y_max_p = y_for_rang_p[v] };
      if (y_min_p > y_for_rang_p[v]) { y_min_p = y_for_rang_p[v] };
    }
    let delta_x = (y_max_p - y_min_p) * 0.2;
    y_max_p = y_max_p + delta_x * 0.5;
    y_min_p = y_min_p - delta_x;



    // 上下图规格线
    let line_avg_p = { name: 'CL', symbol: 'none', label: { show: true, position: 'end', formatter: 'CL:' + Math.round(AVG.p * 100) / 100 }, yAxis: AVG.p, lineStyle: { color: 'red' } };
    let  line_ucl_p = { name: 'UCL', symbol: 'none', label: { show: true, position: 'end', formatter: 'UCL:' + Math.round(UCL.p * 100) / 100 }, yAxis: UCL.p, lineStyle: { color: 'green' } };
    let  line_lcl_p = { name: 'LCL', symbol: 'none', label: { show: true, position: 'end', formatter: 'LCL:' + Math.round(LCL.p * 100) / 100 }, yAxis: LCL.p, lineStyle: { color: 'green' } };
  //   let  line_usl_p = { name: 'USL', symbol: 'none', label: { show: true, position: 'end', formatter: 'USL:' + Math.round(USL * 100) / 100 }, yAxis: USL, lineStyle: { color: '#FBBF45' } };
  //   let  line_lsl_p = { name: 'LSL', symbol: 'none', label: { show: true, position: 'end', formatter: 'LSL:' + Math.round(LSL * 100) / 100 }, yAxis: LSL, lineStyle: { color: '#FBBF45' } };

    point_lines_p = func4(point_lines_p);
    point_lines_p.push(line_avg_p);
    point_lines_p.push(line_lcl_p);
    point_lines_p.push(line_ucl_p);
  //   point_lines_p.push(line_lsl_p);
  //   point_lines_p.push(line_usl_p);



    option = {
      title: {
        text: 'U',
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
          min:Math.round(y_min_p),
          max:Math.round(y_max_p),
          type: 'value',
          
        },
        
      ],
      series: [
        {
          name: '不合格品率',
          type: 'line',
          symbolSize: 8,
          lineStyle: { color: '#084081' },
          itemStyle: { color: '#084081' },
          smooth: false,
          symbol: 'circle',
          markLine: {
            symbol: ['none', 'none', 'none'],
            silent: true,
            data: point_lines_p
          },
          data:defectRateValue
             
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