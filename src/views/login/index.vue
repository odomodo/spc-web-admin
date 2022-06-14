<template>
  <div class="page flex-col">
    <div class="section2 flex-col">
      <div class="layer1 flex-col">
        <div class="main2 flex-row ">
          <div class="mod2 flex-col">
            <img
              class="pic1"
              referrerpolicy="no-referrer"
              src="../../assets/img/logo.png"
            />
          </div>
          <div class="mod3 flex-col">
            <span class="txt1">{{ getThemeConfig.globalTitle }}</span>
            <div class="item"><account /></div>
          </div>
        </div>
      </div>
      <div class="box14 flex-row">
        <span class="txt3">Shenzhen&nbsp;UINFOR&nbsp;Software&nbsp;Co.,&nbsp;Ltd.</span>
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
      width: 1259px;
      height: 749px;
      background: url(/@/assets/img/center.png) no-repeat;
      background-size: cover;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 120px;
      .main2 {
        display: flex;
        justify-content: space-around;
        width: 100%;
        padding: 0 30px;
        .mod2 {
          width: 618px;
          height: 501px;
          background: url(/@/assets/img/center_bg.png) no-repeat;
          background-size: cover;
          .pic1 {
            width: 43px;
            height: 38px;
            margin: 60px 0 0 61px;
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

    }
  }
  .box14 {
    .txt3 {
      overflow-wrap: break-word;
      color: rgba(255, 255, 255, 1);
      font-size: 16px;
      font-family: MicrosoftYaHei;
      text-align: left;
      display: block;
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