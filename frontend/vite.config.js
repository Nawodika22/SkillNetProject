import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api/vacancies': 'http://localhost:8082',
      '/api/matches': 'http://localhost:8083',
      '/api/notifications': 'http://localhost:8083',
      '/api': 'http://localhost:8081',
    },
  },
})
