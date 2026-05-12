import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate',
    manifest: {
      id: '/',
      name: 'Zack Financial',
      short_name: 'Finance',
      description: 'Financial management app',
      theme_color: '#0f172a',
      background_color: '#ffffff',
      display: 'standalone',
      start_url: '/',
      icons: [
        {sizes:'192x192', src: '/icons/icon-192x192.png', type: 'image/png' },
        {sizes:'512x512', src: '/icons/icon-512x512.png', type: 'image/png' },
      ]
    },
    workbox: {
      navigateFallback: '/index.html',
      navigateFallbackDenylist: [
        /^\/trpc/,
        /^\/api/,
      ],
      runtimeCaching: [
        {
          urlPattern: ({ request }) => request.destination === 'document',
          handler: 'NetworkFirst',
          options: {
            cacheName: 'pages'
          }
        },
        {
          urlPattern: ({ request }) => ['script', 'style', 'image', 'font'].includes(request.destination),
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'assets'
          }
        }
      ]
    },
    devOptions: { enabled: true }
  })],
  server: { port: 5173 },
});
