<template>
    <div class="main-header">
        <div >
            <p class="name-field">Hi，我是苏游宝</p>
            <div style="height: 20px;"></div>
            <p class="intro-section">你的绘图工具，帮你画各种风格的风景照哦！</p>
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
        background: linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3);
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
    }
}
</style>