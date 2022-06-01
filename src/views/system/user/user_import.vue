<!--
 * @Description:
 * @Version: 1.0
 * @Autor: 朱发生
 * @Date: 2021-06-28 14:28:00
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @LastEditTime: 2022-05-26 13:41:36
-->
<template>
  <!-- 导入弹框 -->
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="400px"
  >
     <el-upload
             ref="UPload"
             :limit="1"
             accept=".xlsx, .xls"
             :headers="upload.headers"
             :action="upload.url"
             :disabled="upload.isUploading"
             :on-progress="handleFileUploadProgress"
             :on-success="handleFileSuccess"
             :auto-upload="false"
             drag
           >
             <i class="el-icon-upload"></i>
             <div class="el-upload__text">
               将文件拖到此处，或
               <em>点击上传</em>
             </div>
             <div class="el-upload__tip" slot="tip">
               <!-- <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的数据 -->
               <el-link type="info" style="font-size:12px" @click="importTemp">下载模板</el-link>
             </div>
             <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
           </el-upload>
           <div slot="footer" class="dialog-footer">
             <el-button type="primary" @click="submitFileForm">确 定</el-button>
             <el-button @click="cancel">取 消</el-button>
           </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, toRefs } from "vue"
import { ElMessage, ElMessageBox } from 'element-plus';
import { filterObj, isContainChineseChar } from "/@/utils/jsOptions";
import { addList, getUserIdList, editList } from "/@/api/system/user.ts";
import useCurrentInstance from "/@/utils/useCurrentInstance.ts"
import { getToken } from "/@/utils/auth.ts";

const emit = defineEmits(['queryList']);
const { proxy } = useCurrentInstance()
const dialogTitle = ref("用户数据导入")
const dialogVisible = ref(false)
const UPload: any = ref(null)
// 导入参数
const upload = ref<any>({
  // 是否显示弹出层（导入）
  open: false,
  // 弹出层标题（导入）
  title: "",
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的数据
  updateSupport: 0,
  // 设置上传的请求头部
  headers: { token:getToken() },
  // 上传的地址
  url: "/web/system/sysUser/importData.do"
})

/** 下载模板操作 */
const importTemp = () => {
  //模板方法路径
//   proxy.download('/web/system/sysUser/importTemplate.do',
//             {...this.queryParams},
//             `导入模板_${new Date().getTime()}.xlsx`)
}
// 文件上传中处理
const handleFileUploadProgress = (event: any, file: any, fileList: any) => {
  upload.value.isUploading = true;
}
// 文件上传成功处理
const handleFileSuccess = (response: any, file: any, fileList: any) => {
  upload.value.open = false;
  upload.value.isUploading = false;
  UPload.value.clearFiles();
  // ElMessageBox(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
  emit("queryList");
}
// 提交上传文件
const submitFileForm = () => {
  UPload.value.submit();
}
// 取消
const cancel = () =>{
  dialogVisible.value= false;
}
defineExpose({
  dialogVisible
})
</script>
<style lang="scss" scoped>
// 页面公共样式
// 页面样式
</style>

<style lang="scss" scoped>
>>>.el-dialog__body {
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>
