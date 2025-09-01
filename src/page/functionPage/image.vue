<template> 
  <div class="content">
    <van-nav-bar
      title="江苏旅游助手"
      left-arrow
      fixed
      placeholder
      @click-left="onclickLeft"
    />
    <introParagraphDraw></introParagraphDraw>
    <selectDraw></selectDraw>
    <div style="height: 300px;"></div>
  </div>
   
  
  </template>
  
  <script setup lang="ts">
  //监听滚动页面
  import { watch, onMounted, ref, onUnmounted } from "vue";
  import introParagraphDraw from "@/page/component/introParagraphDraw.vue";
  import selectDraw  from "@/page/component/selectDraw.vue"
  import { chatBotMessage } from "@/store/index";
  import { throttle } from "lodash"; //节流函数，提高性能

  const onclickLeft = () => {
    if(store.prohibit )return
    store.messages = []
    history.back()
}
  const store = chatBotMessage(
  
  )
  watch(() => store.messages, (val) => {
      if (store.userScrolled) return;//下拉就不滚动
      automatic()
  }, { deep: true })//深度监听
  const automatic = () => {
      const contentElement = document.querySelector(".content")
      window.scrollTo({
          top: contentElement?.scrollHeight,
          behavior:"smooth"
      })
  }
  //监听滚动事件
  onMounted(() => {
      window.addEventListener("scroll",handleScroll)
  })
  
  //监听滚动方向
  const lastScroll = ref(0)
  const handleScroll = () => {
      const currentScroll = window.scrollY
      if (currentScroll > lastScroll.value) {
      } else {
          store.userScrolled= true
      }
      lastScroll.value=currentScroll
  }
  //节流
  const throttledHandleScroll = throttle(handleScroll, 300)
  
  //页面卸载时触发，离开移除监听
  onUnmounted(() => {
      window.removeEventListener("scroll",handleScroll)
  })
  </script>
  
  <style scoped lang="less">
  .content{
      padding:0 15px;
      background-image: url('@/assets/background/AI作画背景.png'); /* 使用 @ 别名指向 src 目录 */
        background-size: cover; /* 让背景图覆盖整个容器 */
  background-position: center center; /* 居中显示背景图 */
  background-repeat: no-repeat; /* 防止背景图平铺 */
   background-attachment: fixed; /* 可选：如果希望背景图固定不随滚动条滚动 */
  }

  </style>
  
  