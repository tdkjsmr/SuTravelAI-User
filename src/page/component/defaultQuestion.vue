<!--预载默认问题-->
<template>
<div class="support-agent">
    <img src="@/assets/助手.png" alt="">
    <p class="name-app">苏游宝</p>
</div>

<div class="customer-service">
    <span class="tips">试一下这样问我吧！</span>
    <div class="customer-service-list" v-for="(item,index) in displayList" :key="index" @click="selectSend(item)">
        <img src="@/assets/zhushou.png" alt="">
        <p>{{ item }}</p>
    </div>
</div>

<div class="change-section"  @click="switchMode">
    <img src="@/assets/huanyihuan.png" alt="">
    <p>换一换</p>
</div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { chatBotMessage } from "@/store/index";
//默认问题
const customerServiceList = ref([
  "南京博物院有哪些必看的镇馆之宝？",
  "苏州园林中哪个最适合穿汉服拍照？",
  "扬州早茶最有名的茶社是哪几家？",
  "无锡除了鼋头渚还有哪些冷门景点？",
  "在连云港连岛海滩游玩需要注意什么？",
  "江苏有哪些适合周末自驾的短途路线？",
  "常州恐龙园适合带5岁孩子玩吗？",
  "镇江锅盖面哪家老字号最地道？",
  "南通滨海景区赶海的最佳时间是什么时候？",
  "江苏非遗文化体验项目哪里可以参与？",
  "泰州水乡古镇和苏州有什么不同？",
  "盐城丹顶鹤自然保护区观鸟几月份最合适？",
  "宿迁三台山森林公园有什么特色景观？",
  "淮安周恩来纪念馆开放时间是什么？",
  "去溧阳南山竹海需要准备登山装备吗？",
  "江苏跨市旅游大巴在哪里查时刻表？",
  "昆山阳澄湖吃大闸蟹哪个月份最肥？",
  "宜兴除了紫砂壶还有什么特色手信？",
  "高邮咸鸭蛋哪里买比较正宗？",
  "江苏哪些古镇晚上有灯光秀表演？",
  "带孩子去江苏科技馆值得吗？",
  "连云港海鲜市场怎么挑新鲜货？",
  "南京老门东附近有哪些民国建筑？",
  "苏州评弹表演哪里可以现场听？",
  "徐州汉文化景区主要看什么？",
  "江苏哪些温泉度假村适合情侣？",
  "扬州瘦西湖游船票怎么买划算？",
  "无锡灵山大佛景区内有素食餐厅吗？",
  "常州青果巷历史文化街区值得逛吗？",
  "盐城大洋湾樱花和其他城市比有什么特色？"
])
const currentIndex = ref(0)
const displayList = computed<string[]>(() => {
    return JSON.parse(JSON.stringify(customerServiceList.value)).splice(currentIndex.value,5)  //避免改变源数据
})
//换一换
let grop=0
const switchMode = () => {
    grop += 5;
  if (grop >= customerServiceList.value.length) {
    currentIndex.value = 0;
    grop = 0;
    return;
  }
  currentIndex.value += 5;
}
const store =chatBotMessage()
const selectSend = (val:string) => {
    store.sendMessage(val)
}

</script>

<style scoped lang="less">
.support-agent{
    display: flex;
    align-items: center;
    img{
        object-fit: cover;
        width: 30px;
        height: 30px;
        margin-right: 4px;
    }
    .name-app{
        font-family: "name";
        font-size: 18px;
        //color: #1E90FF;
        background: linear-gradient(90deg, #0085CA, #0000ff, #4b0082, #9400d3);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  animation: gradient 8s ease infinite;
    }
    @keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
}
.customer-service{
    background-color: rgba(255,255,255,0.9);
    margin: 10px 0;
    padding: 10px;
    //opacity: 0.8;  //不透明度
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
    .tips{
        font-size: 16px;

    }
    .customer-service-list{
        display: flex;
        align-items: center;
        background-color: #f2f4ff;
        border-radius: 40px;
        margin-top: 10px;
        padding: 5px 7px;
        img{
            width: 15px;
            height: 15px;
            object-fit: cover;

        }
        p{
            font-size: 14px;
            padding-left: 4px;
            font-weight: bold;
        }
    }
}

.change-section{
    display: inline-flex;
    align-items: center;
    background-color: #a8abb0;
    border-radius: 40px;
    padding: 4px 7px;
    img{
        width:20px;
        height: 20px;
    }
    p{
        font-size: 14px;
        padding-left: 7px;
        color: #ffffff;
    }
}
</style>