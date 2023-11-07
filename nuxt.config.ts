import extractorPug from '@unocss/extractor-pug'
import transformerDirectives from '@unocss/transformer-directives'
// import { resolve } from "node:path"
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      bodyAttrs: {
        class: 'font-sans'
      }
    }
  },
  devtools: { enabled: false },
  // alias: {
  //   cookie: resolve(__dirname, "node_modules/cookie")
  // },
  css: [
    '@/assets/css/style.sass'
  ],
  runtimeConfig: {
    authSecret: process.env.AUTH_SECRET,
    // authJs: {
    //   secret: process.env.AUTH_SECRET, // You can generate one with `openssl rand -base64 32`
    //   guestRedirectTo: '/auth/login',
    //   authenticatedRedirectTo: '/'
    // },
    // public: {
    //   authJs: {
    //     baseUrl: process.env.AUTH_URL, // The URL of your deployed app (used for origin Check in production)
    //     verifyClientOnEveryRequest: true // whether to hit the /auth/session endpoint on every client request
    //   }
    // }
  },
  modules: [
    // '@hebilicious/authjs-nuxt',
    '@sidebase/nuxt-auth',
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@element-plus/nuxt',
    'nuxt-icon'
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
  unocss: {
    icons: true,
    transformers: [
      transformerDirectives()
    ],
    webFonts: {
      provider: 'none',
      fonts: {
        sans: ['yekan', 'Helvetica', "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", 'Arial', 'sans-serif']
      }
    },
    extractors: [extractorPug()],
    preflights: [
      {
        getCSS: () => `
          @font-face{
            font-family: "yekan";
            src: url("~/assets/fonts/IRANYekanXVF.woff2") format('woff2 supports variations'), url("~/assets/fonts/IRANYekanXVF.woff2") format('woff2-variations');
            font-weight: 100 1000;
          }
        `
      }
    ]
  },
  auth: {
    isEnabled: true,
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
