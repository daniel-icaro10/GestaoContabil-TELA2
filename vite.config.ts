import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Em desenvolvimento, /api vai para o servidor local (npm run server), se estiver rodando
  server: { proxy: { '/api': 'http://localhost:3000' } },
})
