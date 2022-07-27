<template>
  <div class="page flex-col">
    <div class="section2 flex-col">
      <div class="layer1 flex-col">
        <div class="main2 df ">
          <div class="mod2 flex-col">
            <img
              class="pic1"
              referrerpolicy="no-referrer"
              src="../../assets/img/logo.png"
            />
          </div>
          <div class="mod3 df aic fdc">
            <span class="txt1">{{ getThemeConfig.globalViceTitle }}</span>
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
    display: flex;
    align-items: center;
    justify-content: center;
    .layer1 {
      width: 1050px;
      height: 648px;
      position: relative;
      background: url(/@/assets/img/center.png) no-repeat;
      background-size: cover;
      padding-top: 66px;
      .main2 {
        display: flex;
        width: 100%;
        padding-left: 22px;
        box-sizing: border-box;
        .mod2 {
          width: 618px;
          height: 501px;
          background: url(/@/assets/img/center_bg.png) no-repeat;
          background-size: cover;
          margin-right: 40px;
          .pic1 {
            width: 117px;
            height: 44px;
            margin: 60px 0 0 61px;
          }
        }
        .mod3 {
          width: 330px;
          margin-top: 62px;
          
          .txt1 {
            text-align: center;
            overflow-wrap: break-word;
            color: rgba(49, 50, 51, 1);
            font-size: 26px;
            font-family: MicrosoftYaHei-Bold;
            text-align: left;
            white-space: nowrap;
            line-height: 36px;
            display: block;
          }
		}
		}

    }
  }
  .box14 {
    position: absolute;
    bottom: 17px;
    left: 421px;
    .txt3 {
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #ACC5EA;
      line-height: 23px;
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
    width: 100%;
	}

</style>