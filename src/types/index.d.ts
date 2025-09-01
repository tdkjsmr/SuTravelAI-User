//不编译



export type textContent = {
    type: "text",text:string
}
export type imageContent = {
    type: "image_url",image_url:{url:string}
}

//发送消息
export type chatMessageType = {
    role: "user" | "assistant"   //角色
    content: string | Array<textContent | imageContent>  //发送的内容，纯文本或图片
    toolData?: any //存储返回的函数调用工具数据,返回类型不确定
    type?: "function"  //有可能返回纯文本或含有工具调用
    functionName?: string //函数名称
    progress?: boolean //返回进度，false数据已返回，true请求中
    searchGoodsData?:serverSearchGoodsType  //搜索商品返回的数据
    modelType?: string//模型
    replyType?: string //deepseek返回类型
    deepseekContent?: string //deepseek返回总结
    
}

export type conversationType = chatMessageType[]

//发送消息的字段
export type sendMessageType = string | Array<textContent | imageContent> 


//大模型返回的消息字段
export type serverDataType = {
    type: string
    functionName: string
    data: any
    modelType?: "qwen" | "deepseek-R1"//模型
    replyType?: string  //deepseek返回类型 
}

//查询火车票传递的参数
export type queryTrainTicketsType = {
    departure:string,destination:string,date:string
};

//火车票返回参数
export type serverTrainTicketsType = {
    trainno:string,station:string,endstation:string,departuretime:string,arrivaltime:string,costtime:string,priceed:string,priceyz:string
}[];

//查询天气传递参数
export type queryWeatherType = {
    city:string
};
//查询天气返回参数
export type serverWeatherType = {
    daytime: string;
    day_weather: string;
    day_weather_pic: string;
    night_air_temperature: string;
    day_air_temperature: string; 

}[];

//搜索商品传递参数
export type searchGoodsType = {
    userMessages: string;

}
//搜索商品返回的结果
export type serverSearchGoodsType = {
    _id: string
    coverImage:string
    contentTitle:string
    price:Number
}[]

//查看商品详情
type serverGoodsDetailsType = {
    productImages:string[]
} & serverSearchGoodsType[number]

export type searchGoodsDetails = serverGoodsDetailsType[]


//登录提交参数
export type loginType = {
    nickName: string,
    avatar:string
};
//登录返回参数
export type serverLoginType = {
    token:string,
    nickName: string,
    avatar:string
};

//AI绘画提交参数
export type createImagesType = {
    prompt: string
};
//AI绘画返回参数
export type serverCreateImagesType = {
    url:string,
    prompt: string
};


//存储聊天记录



//提交投诉传递参数
export type complaintType = {
    complaintTarget: string;
    complaintReason: string;
    location: string;
    appeal: string;
    userName: string;
    phoneNumber: string;
    travelMethod: string;
  }; 
