<!---->
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
     "常州有哪些休闲旅游景区？",
      "江苏省有哪些夜市可以逛？",
      "徐州云龙湖可以坐游艇吗？",
      "带着家人到南京旅游三天,帮我规划一个行程吧",
      "在江苏旅游遇到黑导游怎么办",
      "怎样前往寒山寺？",
      "连云港有哪些必去的景点？",
      "江苏有哪些著名的旅游景点？",
      "如何品尝正宗的徐州美食？",
      "在南京周边有哪些值得一游的小镇？",
      "帮我查询一下徐州最近的天气情况",
      "在南京逛大学城是种怎么样的体验？",
      "查一下苏州到南京2025年6月1日的火车票。",
      "盐城有哪些适合徒步的景点？",
      "苏州有哪些适合拍婚纱照的景点？",
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
            background: linear-gradient(90deg, #ff0000, #ff7f00, #FFD700, #00ff00);
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