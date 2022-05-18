/*
 * @Author: liuxinyi-yuhang 1029301987@qq.com
 * @Date: 2022-04-25 10:18:18
 * @LastEditors: liuxinyi-yuhang 1029301987@qq.com
 * @LastEditTime: 2022-05-12 15:20:43
 * @FilePath: \spc-web-admin\src\main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { store, key } from './store';
import { directive } from '/@/utils/directive';
import { i18n } from '/@/i18n/index';
import svgIcon from '/@/components/svgIcon/index.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import '/@/theme/index.scss';
import mitt from 'mitt';
import VueGridLayout from 'vue-grid-layout';
import 'virtual:svg-icons-register';
import {
    download
  } from "/@/utils/http/request";





const app = createApp(App);
app.config.globalProperties['download'] = download
directive(app);
app.component('svg-icon', svgIcon)
app.use(router).use(store, key).use(ElementPlus, { i18n: i18n.global.t }).use(i18n).use(VueGridLayout).mount('#app');

app.config.globalProperties.mittBus = mitt();
