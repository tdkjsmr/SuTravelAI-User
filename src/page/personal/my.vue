
<template>
    <!--个人中心界面-->

    
    <div class="modal-backdrop">
        
    </div>
    <div class="personal-center">
        
        <div class="user-info">
            <img :src="userDataStore.userInfo.avatar" alt="">
            <div>{{ userDataStore.userInfo.nickName }}</div>
        </div>
        
        <div class="exit-button">
            <el-button plain @click="dialogVisible = true">
                退出账号
            </el-button>
        </div>
        <el-dialog
            v-model="dialogVisible"
            title="提示"
            width="250"
        >
            <span>你确定要退出当前账号吗？</span>
            <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="userExit">
                确定
                </el-button>
            </div>
            </template>
        </el-dialog>

        <div class="new-chat" @click="openNewChat">开启新对话</div>
        <div class="history" v-if="userDataStore.chatList.length > 0">对话历史</div>

        <div class="history-content" v-if="userDataStore.chatList.length > 0" >
            <div 
            class="history-list" 
            v-for="(item,index) in userDataStore.chatList" 
            :key="index" 
            @click="selectChatHistory(item.session_id)"
            >
                <div v-for="(itema,indexa) in item.message" :key="indexa">
                    <div class="history-text">{{ itema.content }}</div>
                </div>
                
                <div class="history-time">{{item.time}}</div>
            </div>
        </div>


        <div class="my-back"><el-button type="success" size="large" :icon="Check" @click="navigateToMain" circle /></div>
    </div> 
    

    
</template>

<script setup lang="ts">
import { userData,userMy,chatBotMessage } from '@/store/index';
import { ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import {
    Check,
} from '@element-plus/icons-vue'
import {onlineChatHistory} from "@/api/request"
const userDataStore = userData() 

const router = useRouter()
const navigateToMain = () => {
  userMy().isOpen = false
}
const chatBotMessageStore = chatBotMessage()
//开启新对话
const openNewChat = () => {
    userDataStore.newChat = true  //开启新会话
    userDataStore.sessionId = ''  //传递空的对话id
    chatBotMessageStore.messages = [] //清空暂存的对话数据
    userMy().isOpen = false
    router.push('/chat-a') //转向对话界面
}

//点击聊天列表获取聊天记录
const selectChatHistory =async (sessionId:string) => {
    userDataStore.newChat = false  //不开启新会话
    userDataStore.sessionId = sessionId//传递对话id
    userMy().isOpen = false
    router.push('/chat-a') //转向对话界面

    const result = await onlineChatHistory( sessionId )
    chatBotMessageStore.messages =result.data
}

//退出账号
const dialogVisible = ref(false)
const userExit = () => {
    dialogVisible.value = false
    userMy().isOpen = false
    localStorage.removeItem('userInfo');
    userData().isLogin = false
}
</script>

<style scoped lang="less">
    .modal-backdrop{
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        background-color: rgba(0, 0, 0, 0.8);
        z-index: 9999;
    }
    .personal-center{
        background-color: #f8f8f8;
        position: fixed;
        left: -80%;   //缓慢弹出
        top: 0;
        bottom: 0;
        width: 80%;
        z-index: 10000;
        animation: slideInfo 0.5s forwards;  //动画完成后保持现状
        @keyframes slideInfo {
            from{
                left: -80%;
            }
            to{
                left: 0%;
            }
        }
        .user-info{
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 15px 0;
            img{
                width: 45px;
                height: 45px;
                border-radius: 50%;
            }
            p{
                font-size: 17.5px;
                padding: 5px;
                font-weight: bold;
            }
        }
        .new-chat{
            
            margin: 22.5px 10px;
            font-size: 15px;
        }
        .exit-button{
            display: flex;
            justify-content: center;
            margin: 3px 22.5px 10px 10px;
            font-size: 15px;
        }
        .history{
            margin: 15px 10px;
            border-bottom: 1px solid rgba(218,218,218,0.6);
            padding-bottom: 10px;
            font-size: 15px;
        }
        .history-content{
            overflow-y: auto;
            height: 370px;
            .history-list{
                background-color: #fff;
                border-radius: 10px;
                margin: 10px;
                padding: 10px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                .history-text{
                    flex: 1;
                    font-size: 15px;
                    -webkit-line-clamp: 1;
                    overflow: hidden;
                    -webkit-box-orient: vertical;
                    display: -webkit-box;
                    text-overflow: ellipsis;
                }
                .history-time{
                    color: #9d9eab;
                    font-size: 13px;
                    padding: 10px;
                }
            }
            
        }
        .my-back{
            display: flex;
            justify-content: center;
        }
    }
    
</style>