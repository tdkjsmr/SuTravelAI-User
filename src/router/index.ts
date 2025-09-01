import { createWebHashHistory, createRouter } from 'vue-router'

const routes = [
    {
        //主页
        path: '/',
        name:"base",
        component:()=>import("@/page/base/index.vue")
  },
  
    {
        //聊天界面
        path: '/chat-a',
        name:"qwen",
        component:()=>import("@/page/functionPage/qwen.vue")
    },
    {
        //商品详情界面
        path: '/goodsDetails',
        name:"goodsDetails",
        component:()=>import("@/page/goodsDetails/index.vue")
    },
    {
        //投诉界面
        path: '/complaintPage',
        name:"complaintPage",
        component:()=>import("@/page/complaintPage/index.vue")
    },
    
  {
        //deepseek对话界面
        path: '/chat-b',
        name: 'chat-b',
        component: () => import('@/page/functionPage/deepseek.vue')
      },
      {
        path: '/image-qa',
        name: 'image-qa',
        component: () => import('@/page/functionPage/image.vue')
      },
      {
        path: '/feedback',
        name: 'feedback',
        component: () => import('@/page/complaintPage/index.vue')
      }
]

//创建路由实例
const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router;