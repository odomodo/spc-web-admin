<template>
  <div class="page flex-col">
    <div class="section2 flex-col">
      <div class="layer1 flex-col">
        <div class="main2 flex-row justify-between">
          <div class="mod2 flex-col">
            <img
              class="pic1"
              referrerpolicy="no-referrer"
              src="../../assets/img/logo.png"
            />
          </div>
          <div class="mod3 flex-col">
		  	<span class="txt1">{{ getThemeConfig.globalTitle }}后台模板</span>

			<div class="item"><account /></div>
            
          </div>
        </div>
        <div class="box14 flex-row">
          <span class="txt3">Shenzhen&nbsp;UINFOR&nbsp;Software&nbsp;Co.,&nbsp;Ltd.</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import account from './component/account.vue'
import { useStore } from '/@/store/index';

const store = useStore();
// 获取布局配置信息
const getThemeConfig = computed(() => {
	return store.state.themeConfig.themeConfig;
});



</script>
<style scoped lang="scss">
.page {
  background-color: rgba(255, 255, 255, 1);
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .section2 {
    height: 100%;
    background: url(/@/assets/img/bg.png) 100% 100%;
    width: 100%;
    .layer1 {
      height: 835px;
      background: url(/@/assets/img/center.png)
        100% no-repeat;
      width: 1511px;
      margin: 111px 0 0 205px;
      .main2 {
        width: 1310px;
        height: 604px;
        margin: 90px 0 0 85px;
        .mod2 {
          height: 678px;
          background: url(/@/assets/img/center_bg.png)
            100% no-repeat;
          width: 824px;
          .pic1 {
            width: 167px;
            height: 64px;
            margin: 50px 0 0 50px;
          }
        }
        .mod3 {
          width: 427px;
          height: 558px;
          margin-top: 54px;
          .txt1 {
            width: 357px;
            height: 36px;
            overflow-wrap: break-word;
            color: rgba(49, 50, 51, 1);
            font-size: 33px;
            font-family: MicrosoftYaHei-Bold;
            text-align: left;
            white-space: nowrap;
            line-height: 36px;
            display: block;
          }
		}
		}
		.box14 {
        width: 278px;
        height: 16px;
        margin: 129px 0 22px 616px;
        .txt3 {
          width: 278px;
          height: 16px;
          overflow-wrap: break-word;
          color: rgba(255, 255, 255, 1);
          font-size: 16px;
          font-family: MicrosoftYaHei;
          text-align: left;
          white-space: nowrap;
          line-height: 16px;
          display: block;
        }
      }
    }
  }
}



button {
  margin: 0;
  padding: 0;
  border: 1px solid transparent;
  outline: none;
  background-color: transparent;
}

button:active {
  opacity: 0.6;
}
.flex-col {
  display: flex;
  flex-direction: column;
}
.flex-row {
  display: flex;
  flex-direction: row;
}
.justify-start {
    display: flex;
    justify-content: flex-start;
  }
.justify-center {
    display: flex;
    justify-content: center;
}
  
.justify-end {
    display: flex;
    justify-content: flex-end;
}
.justify-evenly {
    display: flex;
    justify-content: space-evenly;
}
.justify-around {
    display: flex;
    justify-content: space-around;
}
.justify-between {
    display: flex;
    justify-content: space-between;
}
.align-start {
    display: flex;
    align-items: flex-start;
}
.align-center {
    display: flex;
    align-items: center;
}
.align-end {
    display: flex;
    align-items: flex-end;
}
    

	.item{
		margin-top: 15px;
	}

</style>