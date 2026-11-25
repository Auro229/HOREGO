import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { auth } from './auth'
import './assets/main.css'

auth.restore().finally(() => {
  createApp(App).use(router).mount('#app')
})