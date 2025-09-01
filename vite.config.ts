import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { dirname, resolve } from "path"
import postcss from "postcss-pxtorem"

// https://vite.dev/config/
export default defineConfig({
  //base:"/agent",
  plugins: [vue()],
  resolve: {
    alias: {  //定义路径别名
      "@": resolve(__dirname,"./src"),
    }
  },
  css: {
    postcss: {
      plugins: [
        postcss({
          rootValue: 37.5,
          unitPrecision: 3,
          propList: ["*"]
        })
      ]
    }
  }/* ,
  server: {
    host: "192.168.31.159",
    port: 5100
  } */ 
})
