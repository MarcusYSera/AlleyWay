import type { NuxtConfig } from '@nuxt/types'

const config: NuxtConfig = {
  devtools: { enabled: true },
  target: 'static', // Generate static files
  app: {
    baseURL: '/AlleyWay/' // Base URL for GitHub Pages
  },
  nitro: {
    preset: 'static' // Ensure Nitro is set to static for static site generation
  },
  generate: {
    fallback: true // Enable SPA fallback for single-page application support
  }
}

export default config
