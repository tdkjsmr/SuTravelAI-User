<template>
    <div class="input-container">
        <!--图片上传展示-->
        <van-uploader v-model="fileList" max-count="1" preview-size="60" disabled v-if="!showImage" :before-delete="beforeDelete"/>
        <div class="data-query" v-if="showImage">
            <van-button v-for="(item,index) in modelList" :key="index"  :type="modelType === index ? 'warning' : 'default'" size="small" :disabled="store.prohibit" @click="modelSwitch(index)" >{{item
            }}</van-button>
        </div>
        <div class="input-box-area">
            <img src="@/assets/qingchu.png" alt="" @click="remove">
            <van-field class="input-content"
                type="textarea"
                maxlength="500"
                autosize
                rows="1"
                v-model="inputContent"
                placeholder="请输入询问内容"
                :border="false"
            />
            <van-button class="send-button" type="default" size="small" @click="sendMessage" :disabled="store.prohibit">发送</van-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref,onMounted } from "vue";
import { chatBotMessage } from "@/store/index";
import { showToast,showLoadingToast } from "vant";
import type { UploaderBeforeRead, UploaderAfterRead } from "vant";
import { uploadFile } from "@/api/request";
import { useRouter } from "vue-router";

const store = chatBotMessage()


//存储图片
const fileList = ref([
    { url: '' },
])

//是否已上传 图片
const showImage = ref(true)

//模型列表
const modelList = ref(['deepseek-R1'])
const modelType = ref(0)
const modelSwitch = (index: number) => {
    modelType.value = index
    store.modelCall = index===0 ? "qwen" : "deepseek-R1"
}
//切换页面回来后重置选项
onMounted(() => {
    modelType.value = 0
    store.modelCall = "deepseek-R1"
})
//上传文件前校验
const beforeRead:UploaderBeforeRead = (file:any) => {
    const imageType = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!imageType.includes(file.type)) {
        showToast("请上传正确的图片格式！")
        return false
    }
    return true
}


//上传成功
const afterRead: UploaderAfterRead = async (file: any) => {
    const toast = showLoadingToast({
        message: "上传中...",
        forbidClick: true,
        duration:0
    })
    const formData = new FormData();
    formData.append("file", file.file) 
    const res = await uploadFile(formData)
    //fileList.value[0].url = "http://" + res.data
    fileList.value[0].url = res.data
    showImage.value = false
    toast.close()
}
//删除图片
const beforeDelete = () => {
    fileList.value[0].url = ''
    showImage.value = true
}

//输入内容
const inputContent = ref<string>('')
const sendMessage = () => {
    if (inputContent.value.trim() === '') {
        return;
    }
    //带图询问切换至通义千问
    if (fileList.value[0].url != '') {
        modelType.value = 0
        store.modelCall = "qwen"
    }
    store.sendMessage(
        showImage.value ? inputContent.value : [
            {
                type: "text",
                text:inputContent.value
            },
            {
                type: "image_url",
                image_url:{url:fileList.value[0].url}
            }
        ]
    )
    beforeDelete()
    inputContent.value = ''
    
}

//功能按钮
const inquire = (val:string) => {
    inputContent.value = val
    sendMessage()
}
//清空
const remove = () => {
    if(store.prohibit )return
    store.messages = []
}

//投诉页面
const $router = useRouter()
const goToComplaint = () => {
    $router.push({path:"/complaintPage"})
}

</script>

<style scoped lang="less">
.input-container {
    position: fixed;   //固定底行
    bottom: 0;
    left: 0;
    right: 0;
    /deep/.van-uploader__wrapper--disabled{    //强制去除
        opacity: inherit;
        margin-left: 15px;
        .van-uploader__preview{
            background-color: #ffffff;
        }
    }
    .data-query{
        display: flex;
        align-items: center;
        .van-button{
            margin-left: 15px;
            margin-bottom: 5px;
            opacity: 1;
        }
    }
    .input-box-area{
        background-color: #ffffff;
        display: flex;
        align-items: center;
        padding-bottom: 5px;
        padding-top: 5px;
        
        img{
            width: 27px;
            height: 27px;
            margin: 0px;
        }
        .input-content{
            background-color: #f8f9fd;
            flex: 1;
            border-radius: 10px;
            padding: 6px; 
        }
        .send-button{
            border: none;
            font-size: 15px;
            color: #f9976c;
            font-weight: bold;
            margin: 0 5px;
        }
    }
}
</style>