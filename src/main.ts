import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index'
import "amfe-flexible"; //动态改变根字体大小
// 1. 引入你需要的组件
import { Button ,Image as VanImage,Form,Uploader,Field, CellGroup,NavBar,Picker,Popup,Collapse, CollapseItem,ConfigProvider } from 'vant';
// 2. 引入组件样式
import 'vant/lib/index.css';
import { Dialog } from 'vant';
//
import { createPinia } from "pinia"
import { Icon } from 'vant';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'vue/jsx';

const app = createApp(App)
const pinia = createPinia()

app.use(Popup);
app.use(Collapse);
app.use(CollapseItem);
app.use(Dialog);
app.use(ElementPlus)
app.use(pinia)
app.use(ConfigProvider)
app.use(NavBar);
app.use(Form);
app.use(Icon);
app.use(VanImage);
app.use(Picker);
app.use(Uploader);
app.use(Button);
app.use(Field);
app.use(CellGroup);app.use(router);
app.mount('#app')
