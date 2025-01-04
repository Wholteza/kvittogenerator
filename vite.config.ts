import { reactRouter } from "@react-router/dev/vite"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), reactRouter()],
})
