import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteStaticCopy({
      targets: [{ src: '../manifest.json', dest: '.' }]
    })
  ],
  root: 'src',
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    rollupOptions: {
      input: {
        popup: path.resolve(__dirname, 'src/popup.html'),
        background: path.resolve(__dirname, 'src/background.ts')
      },
      output: {
        entryFileNames: '[name].js', // ✅ No hash
        chunkFileNames: '[name].js', // ✅ Avoid hashed dynamic chunks
        assetFileNames: '[name].[ext]', // Optional for CSS cleanup
        format: 'es' // ✅ Required for MV3 service_worker
      }
    }
  }
});
