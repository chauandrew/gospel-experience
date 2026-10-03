import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    VitePWA({
      // 'prompt' = a new version waits until the app is closed and reopened. No mid-event reloads.
      registerType: 'prompt',
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      manifest: {
        name: 'The Gospel Experience',
        short_name: 'Gospel',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#000000',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,woff2,mp3,svg,png,webmanifest}'],
        // Borrowed assets not used yet stay out of the offline cache.
        globIgnores: ['lottie/**', 'img/shooting-star.png', 'img/leaves.png'],
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
        rollupFormat: 'iife', // classic SW: widest iOS support
      },
    }),
  ],
})
