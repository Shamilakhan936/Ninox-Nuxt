import 'dotenv/config';

// Define the Nuxt config
export default defineNuxtConfig({
  devtools: { enabled: true },

  // Add Nuxt UI and Tailwind modules
  modules: ['@nuxt/ui', '@nuxtjs/kinde'],

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
      apiBase: process.env.API_BASE || '/api',
      kindeDomain: process.env.NUXT_KINDE_AUTH_DOMAIN,
      kindeEnabled: true
    },

    // Add runtime config for Kinde
    kinde: {
      clientId: process.env.NUXT_KINDE_CLIENT_ID,
      clientSecret: process.env.NUXT_KINDE_CLIENT_SECRET,
      authDomain: process.env.NUXT_KINDE_AUTH_DOMAIN,
      redirectUrl: process.env.NUXT_KINDE_REDIRECT_URL,
      logoutRedirectUrl: process.env.NUXT_KINDE_LOGOUT_REDIRECT_URL,
      password: process.env.NUXT_KINDE_PASSWORD,
      postLoginRedirectUrl: process.env.NUXT_KINDE_POST_LOGIN_REDIRECT_URL || '/orders'
    }
  },

  // Add CSS files
  css: [
    '@/assets/css/tailwind.css'
  ],

  // Remove the PostCSS configuration entirely
  // The @nuxt/ui module will handle Tailwind configuration
  
  compatibilityDate: '2025-03-19',

  // Route protection
  routeRules: {
    // Protect account page
    '/account': {
      appMiddleware: ['auth-logged-in'],
      kinde: {
        redirectUrl: '/api/login',
        external: true,
      },
    },
    
    // Protect orders page
    '/orders': {
      appMiddleware: ['auth-logged-in'],
      kinde: {
        redirectUrl: '/api/login',
        external: true,
      },
    },
    
    // Protect table-orders page
    '/table-orders': {
      appMiddleware: ['auth-logged-in'],
      kinde: {
        redirectUrl: '/api/login',
        external: true,
      },
    },
    
    // Protect API routes that should only be accessed by authenticated users
    '/api/ninox/user-orders': {
      appMiddleware: ['auth-logged-in'],
      kinde: {
        redirectUrl: '/api/login',
        external: true,
      },
    },
    
    // Allow public access to login page
    '/login': {
      appMiddleware: ['auth-logged-in'],
      kinde: {
        public: true,
      },
    },
    
    // Allow public access to home page
    '/': {
      appMiddleware: ['auth-logged-in'],
      kinde: {
        public: true,
      },
    },
  },
  
  // Optional: Enable debug for health check
  kinde: {
    debug: process.env.NODE_ENV !== 'production'
  }
})