import { defineConfig } from 'vite'
import packageJson from './package.json'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  define: {
    VITE_APP_VERSION: JSON.stringify(packageJson.version)
  }
})
