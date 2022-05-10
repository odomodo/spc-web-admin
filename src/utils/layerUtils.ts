import { ElMessageBox, ElMessageBoxOptions, ElMessage } from "element-plus";
import { VNode, RendererNode, RendererElement } from "vue";


/**
 * 弹框提示
 *
 * @param {String} message 消息内容
 * @param {String} title 标题
 * @param {*} options
 */
export function show(message: any, title: any, options:any = {}) {
  options.message = message;
  options.showClose = true;
  options.type = options.type || "warning";
  ElMessage(options);
}

/**
 * 确认框提示
 *
 * @param {String} message 消息内容
 * @param {String} title 标题
 * @param {*} options
 */

export function confirm(message: string | VNode<RendererNode, RendererElement, { [key: string]: any; }> | undefined, title: string | undefined, options: ElMessageBoxOptions | undefined) {
  return ElMessageBox.confirm(message, title, options);
}

export default {
  show,
  confirm
};
