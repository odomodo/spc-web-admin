import { ElMessage } from 'element-plus';
import { Module } from 'vuex';
import { InputDataState, RootStateTypes, RowConfigState, TableConfigState } from '/@/store/interface/index';

interface Res {
  [key: string]: { x: number | string }
}
const inputDataModule: Module<InputDataState, RootStateTypes> = {
  namespaced: true,
  state: {
    rowConfig: {

    },
    tableConfig: {
      parentId: '',
      tableData: [], //要加载的数据
      rowKey: "id",
      columns: [], //显示字段
      height: 25 * 15, //表格高度
      stripe: false, //是否为斑马纹，默认false
      border: false, //是否带有纵向边框 false
      fit: true, //列的宽度是否自撑开
      showHeader: true, //是否显示表头
      highlightCurrentRow: true, //是否要高亮当前行
      row: {},
      sampleSize: 0,
      decimalPlaces: 0,
      type: '',
    }
  },
  mutations: {
    getRowConfig(state, data: RowConfigState) {
      state.rowConfig = data
    },
    getTableConfig(state, data: TableConfigState) {
      state.tableConfig = data
    }

  },
  actions: {
    setRowConfig(state: any, data: any) {
      let options = data;

      if (['X_MR', 'Xbar_S', 'MR', 'Xbar_R'].includes(options.controlChartCode)) {
        let rows = {
          id: "",
          sampleTime: "",
          entryTime: '',
          status: 0,
          averageValue: "",
          rangeValue: "",
          standardDeviation: "",
          maximum: "",
          minimum: "",
          inputUser: "",
          editable: 0,
          judgeStatus: 0,
          errorSampleValues: '',
          sampleValues: '',
        }
        state.state.tableConfig.columns = [];
        state.state.tableConfig.row = rows
        if (options.sampleSize > 0) {
          let columns = [
            { type: "time", color: "", prop: "sampleTime", label: "抽样时间" },
            { type: "text", color: "", prop: "entryTime", label: "录入时间" },
          ];
          for (let i = 1; i <= options.sampleSize; i++) {
            let column = {
              type: "input",
              color: "",
              prop: "sampleValues" + i,
              label: "样本" + i,
            };
            let a = { [column.prop]: '' }
            Object.assign(state.state.tableConfig.row, a)
            columns.push(column);
          }
          let lastColumn: any = [
            { type: "status", color: "", prop: "status", label: "样本数据状态" },
            { type: "judgeStatus", color: "", prop: "judgeStatus", label: "状态" },
            { type: "text", color: "", prop: "averageValue", label: "平均值" },
            { type: "text", color: "", prop: "rangeValue", label: "极差值" },
            { type: "text", color: "", prop: "standardDeviation", label: "标准差" },
            { type: "text", color: "", prop: "maximum", label: "最大值" },
            { type: "text", color: "", prop: "minimum", label: "最小值" },
            { type: "text", color: "", prop: "inputUser", label: "录入用户" },
          ];
          if(options.controlChartCode == 'MR'){
            columns.push({type: "text", color: "", prop: "median", label: "中位数"})
          }
          columns.push(...lastColumn);
          state.state.tableConfig.columns.push(...columns);
          state.state.tableConfig.sampleSize = options.sampleSize;
          state.state.tableConfig.parentId = options.id;
          state.state.tableConfig.decimalPlaces = options.decimalPlaces;
          state.state.tableConfig.type = options.controlChartCode;
        }
        state.state.rowConfig = data
      } else if (['P', 'U'].includes(options.controlChartCode)) {

        //计数型{defectRate}复用计量型字段{sampleValues}
        let rows = {
          id: "",
          sampleTime: "",
          entryTime: '',
          status: 0,
          checkNumber: '',
          judgeStatus: 0,
          inputUser: "",
          editable: 0,
          errorSampleValues: '',
          sampleValues: ''
        }
        state.state.tableConfig.columns = [];
        state.state.tableConfig.row = rows

        //计数型{defectRate}复用计量型字段{sampleValues}
        let columns = [
          { type: "time", color: "", prop: "sampleTime", label: "抽样时间" },
          { type: "text", color: "", prop: "entryTime", label: "录入时间" },
          { type: "input", color: "", prop: "checkNumber", label: "抽检数" },
          {
            type: "input",
            color: "",
            prop: 'sampleValues',
            label: options.controlChartCode == 'P' ? '不合格品数' : '缺陷数',
          },

          { type: "judgeStatus", color: "", prop: "judgeStatus", label: "状态" },

        ];
        if (options.controlChartCode == 'U') {
          columns.push({ type: "text", color: "", prop: "defectRate", label: "缺陷率(%)" });
        }
        if(options.controlChartCode == 'P') {
          columns.push({ type: "text", color: "", prop: "defectRate", label: "不合格品率(%)" })
        }
        let lastColumn: any = [
          { type: "text", color: "", prop: "inputUser", label: "录入用户" },
        ];
        columns.push(...lastColumn);

        state.state.tableConfig.columns.push(...columns);
        state.state.tableConfig.parentId = options.id;
        state.state.tableConfig.decimalPlaces = options.decimalPlaces;
        state.state.tableConfig.type = options.controlChartCode;

        state.state.rowConfig = data
      } else if (['NP', 'C'].includes(options.controlChartCode)) {
        //计数型{defectRate}复用计量型字段{sampleValues}
        let rows = {
          id: "",
          sampleTime: "",
          entryTime: '',
          status: 0,
          checkNumber: String(options.sampleSize),
          defectsNumber: '',
          inputUser: "",
          editable: 0,
          judgeStatus: 0,
          errorSampleValues: '',
          sampleValues: ''
        }
        state.state.tableConfig.columns = [];
        state.state.tableConfig.row = rows

        //计数型{defectRate}复用计量型字段{sampleValues}
        let columns = [
          { type: "time", color: "", prop: "sampleTime", label: "抽样时间" },
          { type: "text", color: "", prop: "entryTime", label: "录入时间" },
          { type: "text", color: "", prop: "checkNumber", label: "抽检数" },
          {
            type: "input",
            color: "",
            prop: 'sampleValues',
            label: options.controlChartCode == 'NP' ? '不合格品数' : '缺陷数',
          },
          { type: "judgeStatus", color: "", prop: "judgeStatus", label: "状态" },
        ];
        if (options.controlChartCode == 'C') {
          columns.push({ type: "text", color: "", prop: "defectsNumber", label: "缺陷数" });
        }
        if (options.controlChartCode == 'NP') {
          columns.push({ type: "text", color: "", prop: "defectsNumber", label: "不合格品数" });
        }
        let lastColumn: any = [
          { type: "text", color: "", prop: "inputUser", label: "录入用户" },
        ];
        columns.push(...lastColumn);
        state.state.tableConfig.columns.push(...columns);
        state.state.tableConfig.parentId = options.id;
        state.state.tableConfig.decimalPlaces = options.decimalPlaces;
        state.state.tableConfig.type = options.controlChartCode;

        state.state.rowConfig = data
      }


    },
    setTableConfig({ commit }, data) {
      commit('getTableConfig', data)
    },
  }



};
export default inputDataModule;