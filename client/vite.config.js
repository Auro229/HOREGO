import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Le proxy envoie /api vers le serveur Express (port 3000) : cookies et CORS simplifiés
export default defineConfig({
  plugins: [vue()],
  server: { port: 5173, proxy: { '/api': 'http://localhost:3000' } }
})
