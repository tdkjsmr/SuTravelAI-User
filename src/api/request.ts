//发送消息
import { conversationType ,queryTrainTicketsType,serverTrainTicketsType,queryWeatherType,serverWeatherType,serverSearchGoodsType,searchGoodsType,searchGoodsDetails,complaintType,loginType,serverLoginType,serverCreateImagesType,createImagesType} from "@/types/index"
import { showToast } from "vant";
import { chatBotMessage, userData } from "@/store/index"
import { encode } from 'js-base64';
import { reject } from "lodash";

let buffer = ''
export const aliyunUrl = "wss://nls-gateway.cn-shanghai.aliyuncs.com/ws/v1"
export const appKey = 'APPKEY' //百炼平台的appkey
export const uploadUrl = 'UPLOADURL' //应为你的静态文件存储仓库

const requestUrl = "http://127.0.0.1:7000"    //使用主机调试时应该使用


// 获取token
function getToken() {
	const token = JSON.parse(localStorage.getItem('userInfo') || '{}').token || '';
	const base64Token = encode(token + ":")
	return "Basic " + base64Token
}




//fetch请求
const fetchApi = async (url: string , method: "POST" | "GET" , body?: any , resType = "seream", reqType="json") =>    //流式输出格式
{ 
    const headers: HeadersInit = {

        Authorization: getToken(),

        ...(reqType == 'json' && { "Content-Type": "application/json" })
        //如果等于json，headers会携带content-type
    };

   
    let bodyData = method === "GET" ? null : 
        reqType === "json" ? JSON.stringify(body) : body;
    
    
    const options:RequestInit = {
        method,
        headers,
        ...(bodyData !== null && { body: bodyData }) // 只有body不为null时才包含body
    }

    const response = await fetch(url, options)
    console.log(response)

    if (!response.ok) {
        const errorData = await response.json();
        const status = response.status;
        switch (status) {
          case 404:
            console.error("404错误");
            break;
          case 401:
                userData().isLogin = false
                console.log('401没有访问权限')
                reject('401')
                break;
          case 500:
          case 501:
          case 502:
            console.error("发生异常错误");
            showToast({ message: "出现异常错误了，请重新试试", duration: 1000 });
            break;
          case 400:
            console.error("参数不对");
            break;
          case 422:
            console.error("参数不对");
            showToast({ message: errorData.msg, duration: 1000 });
            break;
        }
        // 如果出现错误，用户依然可以点击按钮
        chatBotMessage().prohibit = false;
        if (chatBotMessage().messages.length > 0) {
            chatBotMessage().messages[chatBotMessage().messages.length - 1].progress = false;
        }
        throw errorData;
    }
    

    //判断非流式输出
    if (response.ok && resType != "seream") {
        const result: any = await response.json();
        return result;
    }
    //判断流式输出
    if (response.ok && resType == "seream") {
        const reader = response.body?.getReader()
        while (reader) {
            const { done, value } = await reader.read()
            if (done) {
                break
            }
            //把字节流解码为utf-8字符串
            const decoder = new TextDecoder("utf-8")
            //解码二进制数据为字符串
            const decodedString = decoder.decode(value)
            if (decodedString !== "OK") {
                //在字符串中查找成对的{}之间的内容
                const matches = []
                let depth = 0   //深度
                let start = 0   //索引下标
                for (let i = 0; i < decodedString.length; i++){
                    if (decodedString[i] === "{") {
                        if (depth === 0) {
                            start = i
                        }
                        depth++;
                    } else if (decodedString[i] === "}") {
                        depth--
                        if (depth === 0) {
                            matches.push(decodedString.slice(start, i + 1))
                        }
                    }
                }
                for (let index = 0; index < matches.length; index++) {
                    var jsonString = matches[index]
                    const res = JSON.parse(jsonString)
                    console.log(res)
                    chatBotMessage().serverData(res)
                }
            }
            if (decodedString === "OK") {
                console.log("输出完毕")
            }
        }
    }
}



//统一返回的结果类型
interface ApiResponse<T>{
    data:T,  //无法确定类型，定为泛型
    msg:string,
    error: any,
    serviceCode:number,
    code:number

}
export const chatMessageApi = (data: { chatMessage: conversationType }): Promise<ApiResponse<Buffer>> => {
    if (chatBotMessage().modelCall === "qwen") {
        return fetchApi(`${requestUrl}/chatMessage`,"POST",data)
    } else {
        return fetchApi(`${requestUrl}/deepseeekMessage`,"POST",data)
    }
    
}

//登录
export const userlogin = (data:loginType): Promise<ApiResponse<serverLoginType>>=>{
	return fetchApi(`${requestUrl}/login`,'POST',data,"!s")
}

//存储聊天记录
export const saveChatHistory = (data:any): Promise<ApiResponse<any>>=>{
	return fetchApi(`${requestUrl}/save-chat-history`,'POST',data,"!s")
}
//获取用户全部聊天记录
export const userChatList = (): Promise<ApiResponse<any>>=>{
	return fetchApi(`${requestUrl}/fetch-chat-history`,'GET',undefined,"!s")
}
//点击聊天列表获取对应聊天记录
export const onlineChatHistory = (data:string): Promise<ApiResponse<any>>=>{
	return fetchApi(`${requestUrl}/online-chat-history?sessionId=${data}`,'GET',undefined,"!s")
}

//ai绘画
export const createImages = (data:createImagesType): Promise<ApiResponse<serverCreateImagesType>> => {
	return fetchApi(`${requestUrl}/create-images`,'POST',data,"!s","json")
}


//获取阿里云token
export const aliToken = (): Promise<ApiResponse<string>> => {
	return fetchApi(`${requestUrl}/alitoken`,'GET',null,"!s","!s")
}

//查询火车票
export const queryTrainTickets = (data: queryTrainTicketsType):Promise<ApiResponse<serverTrainTicketsType>> => {
    return fetchApi(`${requestUrl}/queryTrainTickets`,"POST",data,"!s")
}

//查询天气
export const queryWeather = (data: queryWeatherType): Promise<ApiResponse<serverWeatherType>> => {
    return fetchApi(`${requestUrl}/queryWeather?city=${data.city}`,"GET",' ',"1234","1234")
}

//搜索商品
export const searchGoods = (data: searchGoodsType):Promise<ApiResponse<serverSearchGoodsType>> => {
    return fetchApi(`${requestUrl}/searchGoods`,"POST",data,"!s")
}

//商品详情页
export const  queryGoodsDetails = (data: {goodsId:string}):Promise<ApiResponse<searchGoodsDetails>> => {
    return fetchApi(`${requestUrl}/queryGoodsDetails`,"POST",data,"!s")
}

//图片上传
export const  uploadFile = (data: FormData):Promise<ApiResponse<string>> => {
    return fetchApi(`${requestUrl}/uploadFile`,"POST",data,"!s","1234")
}

//提交投诉
export const  addComplaint = (data: complaintType):Promise<ApiResponse<null>> => {
    return fetchApi(`${requestUrl}/addComplaint`,"POST",data,"!s")  //最后一个字段是json
}

//流式输出，axios在前端是不支持的，故使用fetch




