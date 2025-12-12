import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/kurrent-app/', // GitHub Pages
  plugins: [react()],
});