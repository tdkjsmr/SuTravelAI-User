<template>
    <div class="login-page">
        <div style="height: 100px;" class="zhanwei"></div>
        <div class="login-tips">登录体验苏TravelAI</div>

        
        <van-form >

            <van-cell-group inset>
                <van-field name="uploader" label="头像上传">
                    <template #input>
                        <van-uploader 
                        :before-read="beforeRead" 
                        :after-read="afterRead"  
                        v-model="fileList"
                        max-count="1"    
                        :before-delete="beforeDelete" 
                        reupload />
                    </template>
                </van-field>
                <van-field
                name="用户名"
                label="昵称"
                placeholder="请输入昵称"
                v-model="userInfo.nickName"
                :rules="[{ required: true, message: '请填写昵称' }]"
                />
                
            </van-cell-group>

            

            <div style="margin: 16px;">
                <van-button round block type="primary" native-type="submit" @click="login" :loading="loading">
                登录
                </van-button>
            </div>
        </van-form>
        
    </div>
</template>

<script setup lang="ts">
import { ref,reactive } from "vue"
import { showToast, showLoadingToast } from "vant";
import type { UploaderBeforeRead, UploaderAfterRead } from "vant";
import { uploadFile, userlogin, uploadUrl } from "@/api/request";
import { ElMessage } from 'element-plus'
import { uploadFileOnline } from "@/utils/uploadFile.js"
import {userData} from "@/store/index"
import { json } from "stream/consumers";
const showImage = ref(true)
const fileList = ref([
    { url: 'https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg' },
])
const userInfo = reactive({
    nickName:'',
    avatar: 'https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg',
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
        //forbidClick: true,
        duration:0
    })
    toast.close()
    const formData = new FormData();
    formData.append('file', file.file) 
    const res = await uploadFile(formData)
    fileList.value[0].url = res.data
    userInfo.avatar = fileList.value[0].url
    const uploadAvatar = await uploadFileOnline({
        url: uploadUrl,
        filePath: file.file,
        name:'file'
    })
    const fileurl = uploadAvatar.data.data.fileurl
    userInfo.avatar = fileurl
    console.log(fileurl)
    showImage.value = false
    
}
const beforeDelete = () => {
    fileList.value[0].url = 'https://fastly.jsdelivr.net/npm/@vant/assets/leaf.jpeg'
    showImage.value = true
}

const loading = ref(false)
const login = async() => {
    console.log(userInfo.avatar)
    loading.value = true
    //上传头像
    await userData().isNotLoggedIn(
		userInfo.nickName,
		userInfo.avatar,
    )
    
}


</script>

<style scoped lang="less">
    .login-page{

        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        //background-color: #fff;
        background-image: url('@/assets/background/设计水墨画旅游 logo.png'); /* 使用 @ 别名指向 src 目录 */
        background-size: cover; /* 让背景图覆盖整个容器 */
        background-position: center center; /* 居中显示背景图 */
        background-repeat: no-repeat; /* 防止背景图平铺 */
        background-attachment: fixed; /* 可选：如果希望背景图固定不随滚动条滚动 */
        z-index:10001;
        .login-img{
            width: 300px;
            height: 300px;
            margin-top: 56px;
            
        }
        .login-tips{
            font-size: 25px;
            padding: 10px 10px 50px 20px;
            font-weight: bold;
            color: #07EABF;
            display: flex;
            justify-content: center;
        }
        
    }
</style>