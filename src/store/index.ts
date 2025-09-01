import { defineStore } from "pinia"
import { conversationType, sendMessageType ,serverDataType,serverSearchGoodsType,textContent,imageContent,createImagesType} from "@/types/index"
import { chatMessageApi, queryTrainTickets, queryWeather, searchGoods,createImages,userlogin,saveChatHistory,userChatList } from "@/api/request"
import dayjs from 'dayjs';

interface UserInfo {
    nickName?: string;
    avatar?: string;
    token?:any
}
//对话
export const chatBotMessage = defineStore('chatBotMessage', {
    state: () => ({
        messages: [] as conversationType,  //存储聊天记录
        prohibit: false,//false不禁用
        searchGoodsData: [] as serverSearchGoodsType,  //临时存储商品数据
        userScrolled: false, //如果用户下拉页面，就不在自动滚动
        modelCall: "qwen", //模型切换
    }),
    actions: {
        //发送消息
        async sendMessage(content: sendMessageType) {
            this.messages.push({ role: 'user', content });
            this.messages.push({ role: 'assistant', content: "", progress: true })
            this.prohibit = true
            this.userScrolled = false
            this.messages[this.messages.length - 1]["deepseekContent"] = ""  //添加了一个字段并赋空
            
            //搜索商品
            let userMessages = ''
            const userMessageType = this.messages[this.messages.length - 2].content
            if (typeof userMessageType === 'string') {
                userMessages=userMessageType
            } else
            {
                userMessages = (userMessageType[0] as textContent).text
            }
            searchGoods({ userMessages }).then(res => {
                this.searchGoodsData = res.data;
            })
            //请求服务器发送大模型对话  
            console.log("发送之前")
            await chatMessageApi({ chatMessage: this.messages })
            this.messages[this.messages.length - 1]["searchGoodsData"] = this.searchGoodsData;
            this.prohibit = false; //放开按钮点击
            console.log("发送完毕")

            //存储对话记录到服务器
            const uploadChat = [...this.messages.slice(-2)]
            const result = await saveChatHistory({ messages: uploadChat,sessionId:userData().sessionId })
            console.log(result)
  
            if (userData().newChat) {
                userData().chatList.unshift(result.data)
                userData().sessionId = result.data.session_id
                userData().newChat = false
            }
            
        },
        //接收服务器端返回的消息
        async serverData(res: serverDataType) {
            console.log("接受完毕")
            let aiMessages = this.messages[this.messages.length - 1]
            aiMessages.progress = false  //关闭loading加载
            aiMessages["modelType"] = res.modelType
            aiMessages["replyType"] = res.replyType
            //如果有工具调用
            if (res.type && res.type === "function") {
                aiMessages['type'] = 'function'
                //查询火车票传递参数
                if (res.functionName === "trainTickets") {
                    const { departure, destination, date } = res.data
                    //判断是否是相对时间
                    const relativeTime = ["今天", "明天", "后天"]
                    let dateVal = "";
                    if (relativeTime.includes(date)) {
                        switch (date) {
                            case "今天":
                                dateVal = dayjs().format("YYYY-MM-DD");
                                break;
                            case "明天":
                                dateVal = dayjs().add(1,"day").format("YYYY-MM-DD");
                                break;
                            case "后天":
                                dateVal = dayjs().add(2,"day").format("YYYY-MM-DD");
                                break;
                        }
                    } else {
                        dateVal = date;
                    }
                    aiMessages.content = `正在为您查询${departure}到${destination}${date}的火车票`
                    const queryRes = await queryTrainTickets({ departure, destination, date:dateVal })
                    //考虑到没有查询到
                    if (queryRes.serviceCode == 200) {
                        aiMessages.content = `以下是为您查询到的${departure}到${destination}${date}的火车票信息`
                        aiMessages["toolData"] = queryRes.data
                        aiMessages["functionName"] = "trainTickets"
                    } else {
                        aiMessages.content = queryRes.msg
                    }

                }
                // 查询天气
                if (res.functionName === "getWeather") {
                    const { city } = res.data;
                    aiMessages.content = `正在为您查询${city}的天气情况`;
                    const queryRes = await queryWeather({ city });
                    console.log(queryRes.serviceCode)
                    // 考虑没有查询到
                    if (queryRes.serviceCode == 200) {
                    aiMessages.content = `以下是为您查询到的${city}的天气情况`;
                    aiMessages["toolData"] = queryRes.data;
                    aiMessages["functionName"] = "getWeather";
                    } else {
                    aiMessages.content = queryRes.msg;
                    }
                }
            }
            //无函数工具调用
            if (res.type && res.type === "content") {
                //判断返回的是哪个大模型
                if (res.modelType === "qwen") {
                    aiMessages.content +=res.data
                } else {
                    if (res.replyType === "reasoning") {
                        aiMessages.content +=res.data
                    } else {
                        aiMessages.deepseekContent += res.data
                    }
                }
                
            }
        }
    }

})


//文生图
export const chatCreateImage = defineStore('chatCreateImage', {
    state: () => ({
        messages:[   
            {
                url: '',
                tips:''
            }
        ],
        prohibit: false,//false不禁用
    }),
    actions: {
        //开始发送
        async artSending(context: string) {
            
            
            this.messages = [
                {
                    url: '',
                    tips:'AI正在生成中...'
                }
            ]
            this.prohibit = true
            try {
                const res = await createImages({prompt:context})
                let aiMessagesDraw = this.messages[0]
                if (res.serviceCode === 200) {
                    aiMessagesDraw.url = res.data.url
                    
                } else {
                    aiMessagesDraw.url = ''

                }
                aiMessagesDraw.tips = res.data.prompt || res.msg || '当前生成图片出错，您可以重新尝试'
                this.prohibit = false; //放开按钮点击
            } catch (error) {
                this.messages = [   
                    {
                        url: '',
                        tips:'当前生成图片出错，您可以重新尝试'
                    }
                ]
                this.prohibit = false; //放开按钮点击
            }
        }
    }
}
)

//登录状态
export const userData = defineStore('userData', {
    state: () => ({
        isLogin: false,//false未登录
        userInfo: {} as UserInfo,//用户信息
        chatList: [],//聊天列表
        sessionId: '', //会话id
        newChat:true //true表示开启新会话，false表示打开历史对话
        
    }),
    actions: {
        //未登录获取用户信息
        async isNotLoggedIn(nickName:string,avatar:string) {
            //请求接口
            const result = await userlogin({ nickName, avatar })
            console.log(result)
            //存储本地缓存
            localStorage.setItem('userInfo',JSON.stringify(result.data))
            this.userInfo = result.data
            //请求聊天列表
            const chatListData = await userChatList()
            this.chatList = chatListData.data
            this.isLogin = true
        },
        //判断登录状态
        async isLoggedIn() {
            const userInfo = localStorage.getItem('userInfo')
            this.userInfo = userInfo ? JSON.parse(userInfo) : {}
            this.isLogin = userInfo ? true : false
            //请求聊天列表
            const chatListData = await userChatList()
            this.chatList = chatListData.data
            if(userInfo) return false
            
         }
    }
})

//个人中心
export const userMy = defineStore('userMy', {
    state: () => ({
        isOpen: false,
        isExit:false
    }),
    actions: {
        
    }
})
