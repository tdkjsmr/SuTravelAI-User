<!--系统主页-->
<template>
  <div class="bgimage">
    <login v-if="!userData().isLogin"></login>
  <div class="menu-style" @click="openMy" ><el-button color="#626aef" size="large" type="info" :icon="Message" circle /></div>
  
  <!--个人中心界面---->
  <my v-if="userMy().isOpen" @click.right="navigateToMain"></my>
  <div class="container">
    <introParagraph></introParagraph>
    <div class="grid">
      <div class="grid-1">
        <router-link 
        v-for="(item, index) in features1" 
        :key="index" 
        :to="item.path" 
        class="feature-card"
        :style="{ 'animation-delay': index * 0.1 + 's' }"
      >
        <div class="card-content">
          <span class="icon">{{ item.icon }}</span>
          <h2 class="feature-title">{{ item.title }}</h2>
          <p class="feature-desc">{{ item.description }}</p>
        </div>
      </router-link>
      </div>
      
      <div class="grid-1">
        <router-link 
        v-for="(item, index) in features2" 
        :key="index" 
        :to="item.path" 
        class="feature-card"
        :style="{ 'animation-delay': index * 0.1 + 's' }"
      >
        <div class="card-content">
          <span class="icon">{{ item.icon }}</span>
          <h2 class="feature-title">{{ item.title }}</h2>
          <p class="feature-desc">{{ item.description }}</p>
        </div>
      </router-link>
      </div>
    </div>
    
    


    <div class="kuozhan">
      <div></div>
      <img src="@/assets/talk/助手小机器人.png" alt="">
      <div class="prompt-title">您可以点击上方模块使用各种功能！</div>
    </div>
    
  </div>
</div>
  
</template>

<script setup lang="ts">
import { ref,onMounted } from 'vue';
import introParagraph from "@/page/component/introParagraph.vue";
import { userData,userMy } from '@/store/index'
import my from "@/page/personal/my.vue"
import login from "@/page/personal/login.vue"
import {
  Message,
} from '@element-plus/icons-vue'
const features1 = ref([
  {
    title: '通义千问模型',
    description: '支持调用工具',
    icon: '💬',
    path: '/chat-a'
  },
  {
    title: 'deepseek-r1',
    description: '支持深度思考',
    icon: '🧠',
    path: '/chat-b'
  }
]);
const features2 = ref([
  {
    title: 'AI绘图',
    description: '以图访景',
    icon: '🖼️',
    path: '/image-qa'
  },
  {
    title: '旅游投诉',
    description: '您的意见很重要',
    icon: '📝',
    path: '/feedback'
  }
]);

//获取登录信息
onMounted(() => {
  userData().isLoggedIn()
})

//background: linear-gradient(to left bottom, #D9D919, #f2f5fa);
//控制我的页面
const openMy = () => {
  userMy().isOpen = true
}


const navigateToMain = (event: any) => {
  console.log('dianji')
  // 检查是否点击了页面右侧（可根据需求调整阈值）
  if (event.clientX > window.innerWidth * 0.7) {
      
    userMy().isOpen = false
  }
}
</script>

<style scoped lang="less">
.bgimage{
  background-image: url('@/assets/background/主页背景.png'); /* 使用 @ 别名指向 src 目录 */
  background-size: cover; /* 让背景图覆盖整个容器 */
  background-position: center center; /* 居中显示背景图 */
  background-repeat: no-repeat; /* 防止背景图平铺 */
   background-attachment: fixed; /* 可选：如果希望背景图固定不随滚动条滚动 */
  .container {
  height: 100%;
  padding: 20px 20px 20px 20px;
  
  display: flex;
  flex-direction: column;
  align-items: center;
  .grid {
  width: 90%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  
  .grid-1{
    display: flex;
    .feature-card {
    background: rgba(255,255,255,0.8);
    border-radius: 15px;
    padding: 20px;
    display: flex;
    flex: 1;
    text-decoration: none;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
    opacity: 0;  //不透明度
    animation: cardEntrance 0.5s ease forwards;
    .card-content {
    height: 100px;
    width: 100px;
    flex:50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    .icon {
    width: 24px;
    height: 24px;
    margin-bottom: 10px;
    align-items: center;
  }
  .feature-title {
    color: #34495e;
    font-size: 16px;
    margin: 5px 0;
    align-items: center;
  }
  .feature-desc {
    color: #7f8c8d;
    font-size: 14px;
    text-align: center;
    margin: 0;
  }
}
}
  }
}
}

/* .title {
  color: #2c3e50;
  font-size: 2.2rem;
  margin: 20px 0;
  text-shadow: 1px 1px 2px rgba(255,255,255,0.5);
} */
/*  .feature-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 12px rgba(0,0,0,0.15);
}  */

.kuozhan {
    position: fixed;   //固定底行
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    background-image: url('@/assets/background/主页背景.png'); // 添加相同的背景
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    background-attachment: fixed;

    

    img {
      width: 150px;
      height: 150px;
      object-fit: fill;
    }
    .prompt-title {
      font-size: 20px;
      //font-weight: bold;
      text-align: center;
      color: #ffff00;
      font-family: "STFangsong";
    }
}

@keyframes cardEntrance {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 480px) {
  .container {
    padding: 15px;
  }
  
  .title {
    font-size: 2rem;
  }
  
  .feature-title {
    font-size: 1.2rem;
  }
}

.menu-style{
  padding: 10px 0 10px 15px;
  color: #9d9486;
  font-weight: bold;
}
}

</style>