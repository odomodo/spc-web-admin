<!--
 * @Description: 
 * @Version: 2.0
 * @Autor: 曾宇奇
 * @Date: 2021-05-12 17:13:58
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @LastEditTime: 2022-05-10 10:10:18
-->

<template>
  <div class="warnMethod">
    <!-- 选择框组 -->
    <div class="select_group flex-c">
      <div class="flex-c" style="">
        <label>预警方法：</label>
        <el-select
          placeholder="请输入或选择"
          v-model="queryForm.id"
          filterable
          allow-create
          clearable
          default-first-option
          size="mini"
        >
          <el-option
            v-for="item in warnMethodDownList"
            :key="item.id"
            :label="item.methodName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </div>
      <div class="flex-c">
        <label>方法类型：</label>
        <el-select placeholder="请选择" v-model="queryForm.methodType" size="mini">
          <el-option value="0" label="SQL"></el-option>
          <el-option value="1" label="JAVA"></el-option>
        </el-select>
      </div>
      <div class="flex-c">
        <label>创建时间：</label>
        <el-date-picker
          type="datetime"
          placeholder="开始日期"
          value-format="yyyy-MM-dd"
          v-model="queryForm.startDateTime"
          size="mini"
        ></el-date-picker>
        <span style="font-weight: 700; margin: 0 10px">~</span>
        <el-date-picker
          type="datetime"
          placeholder="结束日期"
          value-format="yyyy-MM-dd"
          v-model="queryForm.endDateTime"
          size="mini"
        ></el-date-picker>
      </div>
      <div class="flex-c" style="margin-left: 10px;">
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          perms="search"
          @click="queryList(queryForm)"
          >查询</el-button
        >
        <el-button
          type="default"
          plain
          icon="el-icon-refresh"
          size="mini"
          perms="reset"
          @click="reset"
          >重置</el-button
        >
      </div>
    </div>
    <!-- 按钮组 -->
    <div class="button_group">
      <n-button
        type="primary"
        plain
        icon="el-icon-plus"
        size="mini"
        perms="warnMethid_menu_add"
        @click="addNew"
        >新增</n-button
      >
      <n-button
        @click="methodTest"
        type="warning"
        plain
        icon="el-icon-user"
        size="mini"
        perms="warnMethid_menu_test"
        >测试</n-button
      >
      <!-- <n-button
        type="info"
        plain
        icon="el-icon-upload2"
        size="mini"
        perms="warnMethid_menu_import"
        >导入</n-button
      >
      <n-button
        type="warning"
        plain
        icon="el-icon-download"
        size="mini"
        perms="warnMethid_menu_export"
        >导出</n-button
      > -->
    </div>

    <!-- 新增预警方法弹窗 -->
    <warn-item-add ref="warnItemAdd" @queryList="queryList"></warn-item-add>
    <!-- 编辑预警方法弹窗 -->
    <warn-item-edit ref="warnItemEdit"></warn-item-edit>
    <!-- <warn-item-edit ref="warnItemEdit" @queryList="queryList"></warn-item-edit> -->
    <!-- 预警方法表格 -->
    <n-table
      ref="warnMethodTable"
      :tableConfig="warnMethodTableConfig"
      style="margin-top: 5px"
      @handleRadioChange="handleRadioChange"
    ></n-table>

    <!-- 字段表格 -->
    <n-table
      ref="fieldTable"
      style="margin-top:30px;"
      :tableConfig="fieldTableConfig"
    ></n-table>
  </div>
</template>

<script>
// 组件
import nButton from "/@/components/content/nButton";
import nTable from "/@/components/content/nTable.vue";
import warnItemAdd from "./warnMethod/warnMethod.add.vue";
import warnItemEdit from "./warnMethod/warnMethod.edit.vue";

// 方法
import {
  getWarnMethodList,
  getFieldList,
  getFieldListById,
  getWarnMethodDownList,
  deleteWarnMethod,
  methodTest
} from "@/api/system/warnMethod";
import { resizeForm } from "@/utils/jsOptions";
import { formatDate } from "@/utils/index";
import { clearFormData, filterObj } from "@/utils/jsOptions";
// import WarnItem_edit from './warnItem/warnItem_edit.vue';

export default {
  name: "warnMethod",
  props: {},
  mounted() {
    // 获取下拉框列表
    this.getDnList();
  },
  components: {
    nButton,
    nTable,
    warnItemAdd,
    warnItemEdit
  },
  data() {
    return {
      // 预警方法表格配置
      warnMethodTableConfig: {
        url: getWarnMethodList(),
        height: 500,
        //表格表头
        columns: [
          {
            prop: "methodCode",
            label: "预警方法编号"
          },
          {
            prop: "methodName",
            label: "预警方法名称"
          },
          {
            prop: "methodType",
            label: "方法类型",
            formatter(row, column, cellValue, index) {
              if (cellValue == 0) return "SQL";
              if (cellValue == 1) return "JAVA";
            }
          },
          {
            prop: "javaPackageName",
            label: "包路径"
          },
          {
            prop: "javaClassName",
            label: "类名"
          },
          {
            prop: "javaMethodName",
            label: "方法名"
          },
          {
            prop: "sqlContent",
            label: "SQL"
          },
          {
            prop: "descript",
            label: "描述"
          },

          {
            prop: "addTime",
            label: "创建时间",
            formatter(row, column, cellValue, index) {
              return formatDate(cellValue);
            }
          },
          {
            prop: "addUserId",
            label: "创建人"
          }
          // {
          //   prop: "editTime",
          //   label: "更新时间",
          //   formatter(row, column, cellValue, index) {
          //     return formatDate(cellValue);
          //   },
          // },
          // {
          //   prop: "editUserId",
          //   label: "更新人",
          // },
        ],
        showOperation: true, //是否显示操作字段
        showPagination: true, //分页
        rowNumbers: true, //是否显示行数
        showChoose: true, //是否显示选择框， 默认不显示
        singleSelect: true, //单选，复选，默认复选
        //操作按钮列表
        options: [
          {
            type: "warning",
            label: "编辑",
            click: this.edit,
            perms: "warnMethid_menu_edit"
          },
          {
            type: "danger",
            label: "删除",
            perms: "warnMethid_menu_delete",
            click: (_, row) => {
              this.$confirm("确定删除?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              })
                .then(async () => {
                  const res = await deleteWarnMethod(row.id);
                  this.$refs.warnMethodTable.reload();
                  this.$message({
                    type: "success",
                    message: res.msg
                  });
                })
                .catch(() => {
                  this.$message({
                    type: "info",
                    message: "已取消删除"
                  });
                });
            }
          }
        ],
        //操作按钮样式
        operationColumn: {
          // 样式
          style: {},
          // 属性
          attr: {}
        }
      },
      // 字段表格配置
      fieldTableConfig: {
        url: getFieldListById(),
        initLoadFlag: false,
        height:200,
        //表格表头
        columns: [
          {
            prop: "fieldName",
            label: "字段"
          },
          {
            prop: "fieldDescript",
            label: "说明"
          },
          {
            prop: "fieldType",
            label: "类型",
            formatter(row, column, cellValue, index) {
              if (cellValue == 0) return "输入";
              if (cellValue == 1) return "输出";
            }
          },
          {
            prop: "addTime",
            label: "创建时间",
            formatter(row, column, cellValue, index) {
              return formatDate(cellValue);
            }
          },
          {
            prop: "addUserId",
            label: "创建人"
          }
          // {
          //   prop: "editTime",
          //   label: "更新时间",
          //   formatter(row, column, cellValue, index) {
          //     return formatDate(cellValue);
          //   },
          // },
          // {
          //   prop: "editUserId",
          //   label: "更新人",
          // },
        ],
        showPagination: true, //分页
        rowNumbers: true //是否显示行数
      },
      // 预警方法下拉框值
      queryForm: {
        id: "", //预防方法
        methodType: "",
        startDateTime: "", //开始时间
        endDateTime: "" //结束时间
      },
      //
      // 已有数据
      list: [],
      warnMethodDownList: [], //预警方法下拉数据
      currentRow: null //当前行
    };
  },
  methods: {
    querySearch(queryString, cb) {},
    //选择预警组查出对应字段列表
    handleRadioChange(v) {
      //alert(v.id)
      if (v && v.id) {
        this.id = v.id;
        this.queryFileListByWarnMethodId(v.id);
        
      }
    },
    //根据预警方法id查询字段列表
    queryFileListByWarnMethodId(id) {
      this.$refs.fieldTable.find({ id });
    },

    // 查询
    queryList(queryForm) {
      //console.log(queryForm);
      this.$refs.warnMethodTable.find(queryForm);
    },
    // 新增
    addNew() {
      this.$refs.warnItemAdd.dialogVisible = true;
    },
    // 编辑
    async edit(index, row) {
      this.$refs.warnItemEdit.dialogVisible = true;
      this.$refs.warnItemEdit.paramsDataForm = filterObj({ ...row }, [
        "addTime",
        "addUserId",
        "editTime",
        "editUserId",
        ""
      ]);

      let arr = (await getFieldList({ ...row }.id)).data;
      this.$refs.warnItemEdit.paramsDataForm.sysWarnMethodParamList = (
        await getFieldList({ ...row }.id)
      ).data.map(item =>
        filterObj(item, [
          "addTime",
          "addUserId",
          "editTime",
          "editUserId",
          "spare1",
          "spare2",
          "spare3"
        ])
      );
      if(row.methodType==0) this.$refs.warnItemEdit.checkShow = true;
      else this.$refs.warnItemEdit.checkShow = false;

      this.$refs.warnItemEdit.setTable();
    },

    //测试
    async methodTest(){
      if(this.id=='' || this.id == null) {
        return this.$message({
          message: "操作错误： 请先选中一条数据",
          type: "error"
        });
      }

      this.$confirm("确定测试?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const res = await methodTest(this.id);
          if(res.code==0){
            this.$refs.warnMethodTable.reload();
            this.$message({
              type: "success",
              message: '测试成功，返回：'+res.msg,
              duration: 5000
            });
          }else{
            this.$refs.warnMethodTable.reload();
            this.$message({
              message: res.msg,
              type: "error",
              duration: 5000
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },

    // 重置
    reset() {
      // 清空下拉框数据
      this.queryForm = resizeForm.call(this, "queryForm");
      this.queryList(this.queryForm);
    },
    // 获取下拉框列表
    async getDnList() {
      // 获取预警项类型下拉框列表
      this.warnMethodDownList = (await getWarnMethodDownList()).data;
    }
  },
  computed: {}
};
</script>

<style lang="scss" scoped>
// 页面公共样式
.required {
  color: red;
}
.warnMethod {
  .button_group {
    margin-top: 5px;
    padding-left: 20px;
  }
  .select_group {
    padding: 5px 0 0 20px;
    label {
      //width: 5px;
      //margin-right: 10px;
      font-size: 13px;
      color: #606266;
    }
  }
}
</style>

// 第三方样式
<style lang="scss" scoped>
>>> .el-input__inner {
  border-radius: 4px;
}
>>> .el-table th.is-leaf {
  border-bottom: 2px solid #ebeef5;
}
>>> .el-row {
  // .flex(@justify-content:flex-start);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 15px;
  .el-col {
    text-align: right;
    padding-right: 20px;
  }
}
.el-select {
  margin-right: 20px;
}
</style>
