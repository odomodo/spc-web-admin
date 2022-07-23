import { ElMessage } from 'element-plus';
import { Module } from 'vuex';
import { MetrologicalState, RootStateTypes, RowConfigState, TableConfigState } from '/@/store/interface/index';

interface Res {
  [key: string]: { x: number | string }
}
const MetrologicalModule: Module<MetrologicalState, RootStateTypes> = {
  namespaced: true,
  state: {
    rowConfig: {

    },
    tableConfig: {
      parentId: '',
      tableData: [], //要加载的数据
      rowKey: "id",
      columns: [], //显示字段
      height: 25 * 14, //表格高度
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
    },
    setTableConfig({ commit }, data) {
      commit('getTableConfig', data)
    },
  }



};
export default MetrologicalModule;