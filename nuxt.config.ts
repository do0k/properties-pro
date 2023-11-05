// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: [
    '@/assets/css/style.sass'
  ],
  runtimeConfig: {
    authSecret: process.env.AUTH_SECRET
  },
  modules: [
    '@sidebase/nuxt-auth',
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@element-plus/nuxt',
  ],
  elementPlus: {
    icon: false,
    importStyle: 'scss',
    themes: ['dark']
  },
  postcss: {
    plugins: {
      rtlcss: {
        autoRename: true
      }
    }
  },
  auth: {
    baseURL: process.env.AUTH_ORIGIN,
    provider: {
      type: 'authjs',
      addDefaultCallbackUrl: false
    },
    globalAppMiddleware: {
      isEnabled: true,
      allow404WithoutAuth: true,
      addDefaultCallbackUrl: false
    }
  }
})
