<template>
    <div class="main-header">
        <div >
            <p class="name-field">Hi，我是苏TravelAI</p>
            <div style="height: 20px;"></div>
            <p class="intro-section">基于通义千问大模型，可以帮你查询火车票和天气情况哦！</p>
        </div>
        
    </div>
    
</template>

<script setup lang="ts">

</script>

<style scoped lang="less">
.main-header{
    display: grid;
    //grid-template-columns: repeat(2,1fr);
    padding: 30px 0;
    img{
        width: 100%;
        object-fit: fill;
    }
    .name-field{
        font-size: 40px;
        //color: #4d7cd6;
        font-family: "NAME";
        text-align: center;
        background: linear-gradient(90deg, #ff0000, #ff7f00, #FFD700, #00ff00);
  background-size: 400% 400%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  animation: gradient 8s ease infinite;
    }
    @keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
    .intro-section{
        line-height: 2;
        font-weight: bold;
        text-align: center;
        line-height: 1.3; 
        //color:#A9A9A9 ;
        background: linear-gradient(to right, black,black); /* 渐变方向及颜色 */
        -webkit-background-clip: text; /* 兼容 WebKit 浏览器 */
        background-clip: text; /* 标准属性 */
        color: transparent; /* 文字透明以显示背景渐变 */
        -webkit-text-fill-color: transparent; /* 兼容 WebKit 浏览器 */
    }
}
</style>