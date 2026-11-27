import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/horego.css'
import './styles/sections.css'
import './styles/pages.css'
import { initTheme } from './composables/useTheme'
import { initAuth } from './composables/useAuth'

initTheme()
initAuth()

createApp(App).use(router).mount('#app')
