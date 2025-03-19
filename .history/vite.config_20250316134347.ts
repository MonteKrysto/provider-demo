import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Adds Tailwind CSS processing
  ],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'), // Alias for Shadcn
    },
  }
});