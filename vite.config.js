import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      'react-native': 'react-native-web',
      'react-native-vector-icons/MaterialIcons': 'react-native-vector-icons/dist/MaterialIcons',
      'react-native-twilio-video-webrtc': resolve(__dirname, 'src/components/TwilioVideoWeb.js'),
      '@': resolve(__dirname, 'src'),
    },
    extensions: ['.web.js', '.web.jsx', '.web.ts', '.web.tsx', '.js', '.jsx', '.ts', '.tsx'],
  },
  server: {
    port: 3000,
    host: true,
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      external: [],
    },
  },
  optimizeDeps: {
    include: ['react-native-web'],
  },
}); 