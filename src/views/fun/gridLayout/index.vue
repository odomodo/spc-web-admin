
<template>
  <div>
    <el-button>预览</el-button>
    <div @drag="drag" @dragend="dragend" class="droppable-element" draggable="true" unselectable="on">Droppable Element
      (Drag me!)</div>
    
    <div id="content">
      <grid-layout ref="gridlayout" :layout.sync="layout" :col-num="12" :row-height="30" :is-draggable="true"
        :is-resizable="true" :vertical-compact="true" :use-css-transforms="true">
        <grid-item :key="item.i" v-for="(item, index) in layout" :x="item.x" :y="item.y" :w="item.w" :h="item.h" :i="item.i" :class="`item${index}`" ref="Gitem">
        </grid-item>
      </grid-layout>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive } from "vue"
// import { MouseXY } from './type'
let mouseXY: { [key: string]: any } = { "x": null, "y": null };
let DragPos: { [key: string]: any } = { "x": null, "y": null, "w": 1, "h": 1, "i": null };
let layout: Array<any> = reactive([
  {"x": 0, "y": 0, "w": 2, "h": 2, "i": "a"},
])
const gridlayout: any= ref(null)
const Gitem: any = ref(null)
onMounted(() => {
  document.addEventListener("dragover", function (e) {
    mouseXY.x = e.clientX;
    mouseXY.y = e.clientY;
  }, false);
})
const drag = (e: any) => {
  let parentRect: any = document.getElementById('content')?.getBoundingClientRect();
  let mouseInGrid = false;
  if (((mouseXY.x > parentRect.left) && (mouseXY.x < parentRect.right)) && ((mouseXY.y > parentRect.top) && (mouseXY.y < parentRect.bottom))) {
    mouseInGrid = true;
  }
  if (mouseInGrid === true && (layout.findIndex((item: any)=> item.i === 'drop')) === -1) {
    layout.push({
        x: (layout.length * 2) % ( 12),
        y: layout.length + (12), // puts it at the bottom
        w: 1,
        h: 1,
        i: 'drop',
    });
  }
  let index = layout.findIndex(item => item.i === 'drop');
  if (index !== -1) {
      let el: any = Gitem.value[index]
      // try {
      //   el.style.display = "none";
      // } catch(e) {
      //   console.log(e);
      // }
      try {
        el[index].dragging = {"top": mouseXY.y - parentRect.top, "left": mouseXY.x - parentRect.left};
      } catch (error) {

      }
      let new_pos = el.calcXY(mouseXY.y - parentRect.top, mouseXY.x - parentRect.left);
      if (mouseInGrid === true) {
          gridlayout.value.dragEvent('dragstart', 'drop', new_pos.x, new_pos.y, 1, 1);
          DragPos.i = String(index);
          DragPos.x = layout[index].x;
          DragPos.y = layout[index].y;
      }
      // if (mouseInGrid === false) {
      //   console.log(32111);
      //     gridlayout.value.dragEvent('dragend', 'drop', new_pos.x, new_pos.y, 1, 1);
      //     layout = layout.filter(obj => obj.i !== 'drop');
      // }
  }
}

const dragend = (e: any) => {
  let parentRect: any = document.getElementById('content')?.getBoundingClientRect();
  let mouseInGrid = false;
  if (((mouseXY.x > parentRect.left) && (mouseXY.x < parentRect.right)) && ((mouseXY.y > parentRect.top) && (mouseXY.y < parentRect.bottom))) {
      mouseInGrid = true;
  }
  if (mouseInGrid === true) {
      gridlayout.value.dragEvent('dragend', 'drop', DragPos.x, DragPos.y, 1, 1);
      let index = layout.findIndex(obj => obj.i === 'drop')
      layout.splice(index, 1)
      layout.push({
          x: DragPos.x,
          y: DragPos.y,
          w: 1,
          h: 1,
          i: DragPos.i,
      });
  }
}
</script>

<style scoped>
.droppable-element {
  width: 150px;
  text-align: center;
  background: #fdd;
  border: 1px solid black;
  margin: 10px 0;
  padding: 10px;
}

.vue-grid-layout {
  background: #eee;
}

.vue-grid-item:not(.vue-grid-placeholder) {
  border: 1px solid black;
}

.vue-grid-item .resizing {
  opacity: 0.9;
}

.vue-grid-item .static {
  background: #cce;
}

.vue-grid-item .text {
  font-size: 24px;
  text-align: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  height: 100%;
  width: 100%;
}

.vue-grid-item .no-drag {
  height: 100%;
  width: 100%;
}

.vue-grid-item .minMax {
  font-size: 12px;
}

.vue-grid-item .add {
  cursor: pointer;
}

.vue-draggable-handle {
  position: absolute;
  width: 20px;
  height: 20px;
  top: 0;
  left: 0;
  background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><circle cx='5' cy='5' r='5' fill='#999999'/></svg>") no-repeat;
  background-position: bottom right;
  padding: 0 8px 8px 0;
  background-repeat: no-repeat;
  background-origin: content-box;
  box-sizing: border-box;
  cursor: pointer;
}

.layoutJSON {
  background: #ddd;
  border: 1px solid black;
  margin-top: 10px;
  padding: 10px;
}

.layoutJSON {
  background: #ddd;
  border: 1px solid black;
  margin-top: 10px;
  padding: 10px;
}

.columns {
  -moz-columns: 120px;
  -webkit-columns: 120px;
  columns: 120px;
}
</style>
