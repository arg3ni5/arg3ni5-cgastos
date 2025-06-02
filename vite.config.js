/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  test: { // Vitest configuration
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js', // Or .ts if you prefer; create this file next
    css: true, // If you want to process CSS during tests
  },
})
