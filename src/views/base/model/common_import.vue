<!--
 * @Description:
 * @Version: 1.0
 * @Autor: 谢海光
 * @Date: 2021-06-28 14:28:00
 * @LastEditors: zhuangxingguo
 * @LastEditTime: 2021-08-26 15:07:54
-->
<template>
  <!-- 导入弹框 -->
  <el-dialog
    :title="title"
    v-model="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="400px"
  >
    <el-upload
      ref="uploads"
      :limit="1"
      accept=".xlsx, .xls"
      :headers="upload.headers"
      :action="upload.importUrl"
      :disabled="upload.isUploading"
      :on-progress="handleFileUploadProgress"
      :on-success="handleFileSuccess"
      :auto-upload="false"
      drag
    >
      <i class="el-icon-upload"><svg-icon class="upload" iconName="upload"></svg-icon></i>

      <div class="el-upload__text">
        将文件拖到此处，或
        <em>点击上传</em>
      </div>
      <template #tip>
        <el-link type="info" style="font-size: 12px" @click="importTemp"
          >下载模板</el-link
        >

        <div class="el-upload__tip" style="color: red">
          提示：仅允许导入“xls”或“xlsx”格式文件！
        </div>
      </template>
    </el-upload>
    <div class="dialog-footer" style="float: right">
      <el-button color="#5781C1" @click="submitFileForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { download } from "/@/utils/http/request";
import { reactive, toRefs, ref, RendererElement, RendererNode, VNode } from "vue";
import { ElMessageBox } from "element-plus";
import Cookies from "js-cookie";

const state = reactive({
  dialogVisible: false,
  // 导入参数
  upload: {
    // 是否显示弹出层（导入）
    open: false,
    // 弹出层标题（导入）
    title: "",
    // 是否禁用上传
    isUploading: false,
    // 是否更新已经存在的数据
    updateSupport: 0,
    // 设置上传的请求头部
    headers: { token: Cookies.get("Admin-Token") },
    // 上传的地址
    importUrl: "/web/base/model/importData.do",
  },
});

const uploads = ref();
const emit = defineEmits(["queryList"]);
const { dialogVisible, upload } = toRefs(state);
const prpos = defineProps({
  title: {
    type: String,
    default() {
      return "";
    },
  },
});

/** 下载模板操作 */
const importTemp = () => {
  //模板方法路径
  download(
    "/web/base/model/importTemplate.do",
    {},
    `工厂模型导入模板_${new Date().getTime()}.xlsx`
  );
};
// 文件上传中处理
const handleFileUploadProgress = () => {
  state.upload.isUploading = true;
};
// 文件上传成功处理
const handleFileSuccess = (response: { msg: string | VNode<RendererNode, RendererElement, { [key: string]: any; }> | undefined; }) => {
  state.upload.open = false;
  state.upload.isUploading = false;
  uploads.value.clearFiles();
  ElMessageBox.alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
  emit("queryList");
};
// 提交上传文件
const submitFileForm = () => {
  uploads.value.submit();
};
// 取消
const cancel = () => {
  state.dialogVisible = false;
};
defineExpose({
  dialogVisible,
});
</script>

// 自定义样式
<style lang="scss" scoped>
// 页面公共样式
// 页面样式
.upload {
  width: 100px !important;
  height: 100px !important;
}
</style>

// 第三方样式
<style lang="scss" scoped>
>>> .el-dialog__body {
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>
