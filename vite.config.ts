import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: './', // <-- This line fixes asset path issues on Netlify
  plugins: [react()],
})
