<template> 
<div class="content">
    
    <introParagraph></introParagraph>
    <defaultQuestion></defaultQuestion>
    <chatMessage></chatMessage>
    
    
</div>
<inputArea></inputArea>
 <div style="height: 300px;"></div>

</template>

<script setup lang="ts">
import introParagraph from "@/page/component/introParagraph.vue";
import defaultQuestion from "@/page/component/defaultQuestion.vue";
import chatMessage from "@/page/component/chatMessage.vue";
import inputArea from "@/page/component/inputArea.vue";
//监听滚动页面
import { watch,onMounted,ref,onUnmounted } from "vue";
import { chatBotMessage } from "@/store/index";
import { validateHeaderName } from "http";
import { throttle } from "lodash"; //节流函数，提高性能
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
}
</style>

