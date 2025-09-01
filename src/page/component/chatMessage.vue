<!--对话消息承载框-->
<template>
<div class="chat-message" v-for="(item,index) in store.messages" :keys="index">
    <div class="user-message" v-if="item.role=='user'">
        <p v-if="Array.isArray(item.content)">
            {{ (item.content[0] as textContent).text }}
        </p >
        <p v-else>
            {{ item.content }}
        </p>

    </div>


    <div class="send-message" v-if="item.role=='user' && Array.isArray(item.content)">
        <van-image
        width="120px"
        height="120px"
        radius="5"
        fit="cover"
        :src="(item.content[1] as imageContent).image_url.url"/>

    </div>


    <van-config-provider :theme-vars="themeVars">
    <div class="ai-message" v-if="item.role == 'assistant'">
        <!--通义千问回复-->
        <div class="mark-text" v-if="!item.progress && item.modelType == 'qwen'" >
            <div v-html="marked(item.content as string)"></div>
            
        </div>
        <!--deepseek回复-->
        
        <div class="mark-text" v-if="!item.progress && item.modelType == 'deepseek-R1'" >
            <div >
                <van-collapse v-model="activeNames" class="reasoning" >
                    <van-collapse-item name="1"  >
                        <template #title>
                            <div class="coltitle">思考过程 </div>
                        </template>
                        <div class="reasoning" v-if="item.content" v-html="marked(item.content as string)"></div>
                    </van-collapse-item>
                </van-collapse></div>
            <div v-if="item.deepseekContent" v-html="marked(item.deepseekContent as string)"></div>
        </div>
    </div>
    </van-config-provider>
    <div class="mark-text" v-if="item.progress">
        <loading></loading>
    </div>


        <!--火车票查询-->
        <query-train-tickets v-if="item.role =='assistant' && item.functionName == 'trainTickets'" :functionData="item.toolData"></query-train-tickets>

        <!--天气查询-->
        <weather v-if="item.role =='assistant' && item.functionName == 'getWeather'" :functionData="item.toolData"></weather>

        <!--商品推荐-->
        <searchGoods  v-if="item.role =='assistant' && item.searchGoodsData && item.searchGoodsData.length>0" 
        :search-goods-data="item.searchGoodsData"></searchGoods>
    
    
        <div style="height: 4px;"></div>
</div>

</template>

<script setup lang="ts">
import loading from "@/page/component/loading.vue";
import queryTrainTickets from "@/page/tool/queryTrainTickets.vue";
import weather from "@/page/tool/weather.vue";
import searchGoods from "@/page/tool/searchGoods.vue";
import { chatBotMessage } from "@/store/index";
import { textContent, imageContent } from "@/types/index";
import { marked } from "marked";
import { ref } from "vue";
import { reactive } from "vue";
const store = chatBotMessage()
const activeNames = ref(['1'])
const themeVars = reactive({
    collapseItemContentBackground: '#f2f4f9',
    collapseItemContentLineHeight: '1.5',
    collapseItemContentPadding:'0'
})
</script>

<style scoped lang="less">
.chat-message{
    display: flex;
    flex-direction: column;
    .user-message{
        margin-top: 15px;
        max-width: 70%;
        align-self: flex-end;
        opacity: 0;
        transform: translateY(20px);
        animation: fadeUp 0.3s ease-in-out forwards;
        p{
            font-size: 16px;
            line-height: 1.5;
            background-color: #3a71e8;
            border-bottom-left-radius: 10px;
            border-top-left-radius: 10px;
            border-bottom-right-radius: 10px;
            color: #ffffff;
            padding: 5px;
        }
    }
    .send-message{
        display: flex;
        flex-direction: column;
        animation: fadeUp 0.3s ease-in-out forwards;
        .van-image{
            align-self: flex-end;
            margin-top: 4px;
        }
    }
    .ai-message{
        margin-top: 15px;
        align-self: flex-start;
        .mark-text{
            line-height: 1.5;
            background-color: #ffffff;
            border-top-right-radius: 10px;
            border-bottom-right-radius: 10px;
            border-bottom-left-radius: 10px;
            color: #333;
            padding: 5px;
            
            .reasoning{
                background-color: #f2f4f9;
                padding: 8px;
                margin: 8px 0;
                border-radius: 10px;
                font-size: 14px
                
            }
            .reasoning::v-deep p{
                font-size: 14px  !important;
                color: #8B8B8B;
            }
            .recommend-tips{
                background-color: #F3F3F3;
                border-top-right-radius: 10px;
            border-top-left-radius: 10px;
                margin: 5px 0 0 0;
                padding: 3px;
                font-weight: bold;
                font-size: 16px;
            }
            .recommend-content{
                background-color: #f3f3f3;
            border-bottom-right-radius: 10px;
            border-bottom-left-radius: 10px;
                padding: 3px;
                .recommend-item{
                    margin-bottom: 2px;
                    color: #006c45;
                }
                .recommend-item:last-child{   //最后一行下边距为0
                    margin-bottom: 0px;
                }
            }
        }
    }
}
@keyframes fadeUp {  //动画
    0%{
        opacity: 0;
        transform: translateY(20px);
    }
    100%{
        opacity: 1;
        transform: translateY(0);
    }
}
.coltitle{
    color: black;
    font-size: 14px          
}
</style>