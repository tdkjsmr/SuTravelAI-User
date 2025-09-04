<!--投诉页面-->
<template>
    <van-nav-bar
      title="投诉"
      left-arrow
      fixed
      placeholder
      @click-left="onclickLeft"
    />

    <div class="complaint-page">
        <p class="title-text">你要投诉谁</p>
        <van-field
        class="input-pick"
        is-link
        readonly
        placeholder="选择投诉对象"
        @click="showPicker = true"
        v-model="selectData.complaintTarget"
        />
        <van-popup :show="showPicker" round position="bottom">
            <van-picker
            :columns="objectData"
            @cancel="showPicker = false"
            @confirm="selectObject"
        />
        </van-popup>
    </div>
        
    <div class="complaint-page">
        <p class="title-text">发生了什么</p>
        <van-field type="textarea" v-model="selectData.complaintReason" class="input-content" placeholder="请输入投诉原因" />
    </div>

    <div class="complaint-page">
            <p class="title-text">发生在哪里</p>
            <van-field
            class="input-pick"
            is-link
            readonly
            placeholder="选择地区"
            @click="showPickerPlace = true"
            v-model="selectData.location"
            />
            <van-popup :show="showPickerPlace" round position="bottom">
                <van-picker
                :columns="cityData"
                @cancel="showPickerPlace = false"
                @confirm="selectRegion"
            />
            </van-popup>
        </div>
    
    <div class="complaint-page">
        <p class="title-text">你想要的处理结果</p>
        <van-field type="textarea" class="input-content" v-model="selectData.appeal" placeholder="点击输入处理诉求" />
    </div>

    <div class="complaint-page">
        <p class="title-text">请告知我们你的个人信息，以便于核实与联系您 </p>
        <van-field class="name-text"  label="姓名" v-model="selectData.userName" placeholder="请输入姓名" />
        <van-field  label="联系方式" type="tel" v-model="selectData.phoneNumber" placeholder="请输入手机号" />
        <van-field
            class="input-pick-how"
            is-link
            readonly
            placeholder="你在江苏是如何旅行的"
            @click="showPickerTravel = true"
            v-model="selectData.travelMethod"
            />
            <van-popup :show="showPickerTravel" round position="bottom">
                <van-picker
                :columns="travelData"
                @cancel="showPickerTravel = false"
                @confirm="selectTravel"
            />
            </van-popup>
    </div>

    <van-button class="submit-button" type="primary" @click="submit">提交投诉</van-button>
    <div style="height: 150px;"></div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { cityData } from "@/config/ct";
import { reactive } from "vue";
import { showToast, showLoadingToast } from "vant";
import { addComplaint } from "@/api/request";
const onclickLeft = () => {
    history.back()
}
const objectData = ref([
    {
        text: '投诉旅行社', value: '001'
    },
    {
        text: '投诉导游', value: '002'
    },
    {
        text: '投诉商家', value: '003'
    },
    {
        text: '投诉景区', value: '004'
    }
]);
const showPicker = ref(false)
//选择投诉对象
const selectObject = ({selectedOptions}:any) => {
    selectData.complaintTarget = selectedOptions[0].text
    showPicker.value=false
}




//选择地区
const showPickerPlace = ref(false)
const selectRegion = ({ selectedOptions }: any) => {
    selectData.location=''
    selectedOptions.forEach((element:any) => {
        selectData.location += element.text
    });
    showPickerPlace.value=false

}

//选择旅行方式
const travelData = ref([
    {
        text: '自游行', value: '001'
    },
    {
        text: '跟团游', value: '002'
    }
])

const showPickerTravel = ref(false)
const selectTravel = ({ selectedOptions }: any) => {
    selectData.travelMethod = selectedOptions[0].text
    showPickerTravel.value=false

}
//存储页面选择的数据
const selectData = reactive({
    complaintTarget: '',
    complaintReason: '',
    location: '',
    appeal: '',
    userName: '',
    phoneNumber: '',
    travelMethod: '',
})

//提交
const submit = async() => {
    showLoadingToast({
        message: "提交中...",
        forbidClick: true,
        duration:0
    })
    await addComplaint(selectData)
    showToast("提交成功！")
    history.back()
}
</script>

<style scoped lang="less">
.complaint-page{
    padding: 10px;
    .input-pick{
        border-radius: 10px;
    }
    .title-text{
        padding-bottom: 10px;
        font-weight: bold;
    }
    .input-content{
        background-color: #f8f9fd;
        border-radius: 10px;
        padding: 6px;
    }
    .name-text{
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
    }
    .input-pick-how{
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
    }
    
}
.submit-button{
        position: fixed;
        bottom: 20px;
        left: 0;
        right: 0;
        margin: 10px;
    }
</style>