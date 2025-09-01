<template>
    <div class="style-title">生成风格</div>


    <div class="style-list">
        <div class="style-item" v-for="(item,index) in styleList" :key="index" :class="{'select-style':selectIndex ===index}">
            <div class="style-child" @click="selectIndex=index">
                <img :src="item.icon"  alt="">
                <p :style="{'backgroundColor':item.color}" class="style-content">{{ item.style }}</p>
            </div>
                
        </div>    
            
    </div>

    <div class="keyword-title">关键词</div>
    <div class="textarea-view">
        <van-field type="textarea" :disabled="store.prohibit" class="input-content" placeholder="请输入中文描述，比如画一副江南水乡的风景画" v-model="content"/>
    </div>

    <div v-for="(item,index) in store.messages" :key="index">
        <div class="create-tips">{{ item.tips }}</div>
        <div class="create-image" v-if="item.url != ''" >
            <img :src=item.url alt="" @click="saveImages(item.url)">
        </div>
    </div>
    

    <div class="submit-create">
        <van-button block type="primary" color="linear-gradient(to right, #D9D919,#a2c5fe)" :disabled="store.prohibit" @click="submitCreation">生成图片</van-button>
    </div>

</template>

<script setup lang="ts">
import { ref } from "vue"
import { chatCreateImage } from "@/store/index"
const store = chatCreateImage()
const getImageUrl = (name: string) => {
  return new URL(`/src/assets/drawAI/${name}`, import.meta.url).href
}
const styleList = ref([
    {
        icon: getImageUrl('人像摄影.jpg'),
        style: '人像摄影',
        color:'#1f9be5'
    },
    {
        icon: getImageUrl('电影写真.jpg'),
        style: '电影写真',
        color:'#4f965e'
    },
    {
        icon: getImageUrl('中国风.jpg'),
        style: '中国风',
        color:'#93726f'
    },
    {
        icon: getImageUrl('动漫.jpg'),
        style: '动漫风',
        color:'#204251'
    },
    {
        icon: getImageUrl('3D渲染.jpg'),
        style: '3D渲染',
        color:'#656565'
    },
    {
        icon: getImageUrl('油画.jpg'),
        style: '油画',
        color:'#d49d7d'
    },
    {
        icon: getImageUrl('古典.jpg'),
        style: '古典',
        color:'#ff9999'
    },
    {
        icon: getImageUrl('平面插画.jpg'),
        style: '平面插画',
        color:'#ffcc66'
    },
    {
        icon: getImageUrl('像素风格.jpg'),
        style: '像素风格',
        color:'#cc3300'
    }
    
])
//选择风格
const selectIndex = ref(0)

//画面关键词
const content = ref('')

const submitCreation = () => {
    if(content.value.trim() ==='')return false
    store.artSending(`${content.value},风格：${styleList.value[selectIndex.value].style}`)
}

//下载到本地
const saveImages = (url:any) => {
    const link = document.createElement('a');
    link.href = url; // 图片路径（需同源）
    const fileName = url.split('/').pop().split('?')[0];
    link.download = fileName || 'default.jpg'; // 设置下载文件名
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

</script>

<style scoped lang="less">
  .style-title{
    padding: 5px;
    font-size: 15px;
  }
 
  .style-list{
        overflow-x: auto;
        display: flex;
        padding-top: 3px;
        height: 70px;
        .style-item{
            height: 70px;
            width: 70px;
            //background: #f3f3f3;
            display: flex;
            flex-direction: column;
            flex-shrink: 0; //空间不足时不会缩小
            margin-left: 10px;
            border-radius: 8px;
            .style-child{
                position: relative; //父级定位
                margin: auto;
                width:  60px;
                height: 60px;
                img{
                    position: relative;
                    width:  60px;
                    height: 60px;
                    object-fit: fill;
                    align-content: center;
                    border-radius: 10px;
                }
                .style-content{
                    position: absolute;//子级定位
                    left: 0;
                    right: 0;
                    bottom: 0;
                    font-size: 10px;
                    
                    border-bottom-left-radius: 10px;
                    border-bottom-right-radius: 10px;
                    text-align: center;
                    padding: 3px 0;
                    color: white;
                }
            }
            //选中加上边框
            
            
            
        }
        .select-style{
                border: 2px solid #e23256;
                border-radius: 8px;
                box-sizing: border-box;  //边框不会增加宽度
            }
        .style-item:last-child{
            margin-right: 8px;
        }
    }
    .style-list::-webkit-scrollbar {
             display: none;
        }  //清除滚动条，仅在谷歌游览器

    .keyword-title{
            padding: 20px 5px 5px 5px;
            font-size: 15px;
    }
    .textarea-view{
        background-color: #fff;
        margin: 0 10px;
        border-radius: 10px;
        padding: 5px;
        .input-content{
            width: 100%;
            line-height: 1.4;
        }
    }


    //生成ai绘图
    .create-tips{
        text-align: center;
        padding: 15px 10px;
        color: darkorange;
        font-weight: bold;
        line-height: 1.5;
    }
    .create-image{
        margin: 0 10px;
        img{
            width: 100%;
            border-radius: 3px;
        }
    }

    //底部按钮
    .submit-create{
        position: fixed;
        bottom:15px;
        left: 10px;
        right: 10px;
        padding: 10px 0;
        border-radius: 20px;
    }
</style>