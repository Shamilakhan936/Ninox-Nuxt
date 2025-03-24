import 'dotenv/config';

// Define the Nuxt config
export default defineNuxtConfig({
  devtools: { enabled: true },

  // Add Nuxt UI and Tailwind modules
  modules: [
    '@nuxt/ui'
  ],

  // UI configuration
  ui: {
    global: true,
    icons: ['heroicons']
  },

  // Runtime config
  runtimeConfig: {
    // Server-only env variables
    ninoxApiKey: process.env.NINOX_API_KEY,
    ninoxTeamId: process.env.NINOX_TEAM_ID,
    ninoxDatabaseId: process.env.NINOX_DATABASE_ID,
    
    // Public variables that are exposed to the client
    public: {
      apiBase: process.env.API_BASE || '/api'
    }
  },

  // Add CSS files
  css: [
    '@/assets/css/tailwind.css'
  ],

  // Remove the PostCSS configuration entirely
  // The @nuxt/ui module will handle Tailwind configuration
  
  compatibilityDate: '2025-03-19'
}) 