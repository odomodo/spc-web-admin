export function Cpk(spc: any) {
  let data = [];
  let opacity = 0.5;
  let format1 = "{value} %";
  let format2 = "{c} %";
  let lineDataSet = {
    type: "line",
    symbol: "none", // 默认是空心圆（中间是白色的），改成实心圆 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow', 'none'
    smooth: true,
    yAxisIndex: 1,
    areaStyle: {
      opacity: opacity,
    },
    data: spc.lineYaxis, //正态分布的值
    name: "正态分布曲线",
    itemStyle: {
      normal: {
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
    },
  };
  let barDataSet = {
    type: "bar",
    smooth: true,
    barWidth: 40,
    yAxisIndex: 0,
    areaStyle: {
      opacity: opacity,
    },
    data: spc.barYaxis, //柱子的值
    name: "实际分布",
    itemStyle: {
      normal: {
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
  data.push(lineDataSet, barDataSet);
  let option = {
    type: "scroll",
    title: {
      text: "",
    },

    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    legend: {
      data: ["正态分布曲线", "实际分布"],
    },
    xAxis: [{
      name: "正态分布曲线",
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
    }],
    yAxis: [
      {
        name: "频数",
        nameTextStyle: {
          align: "right",
          fontSize: 14,
          fontFamily: "Microsoft YaHei",
          fontWeight: 400,
          color: "#989DAA",
        },
        type: "value",

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