import {presetUno} from 'unocss'
import extractorPug from '@unocss/extractor-pug'
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
  unocss: {
    presetUno: true,
    icons: true,
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
    baseURL: process.env.AUTH_ORIGIN,
    provider: {
      type: 'authjs',
      addDefaultCallbackUrl: false
    },
    // globalAppMiddleware: {
    //   isEnabled: true,
    //   allow404WithoutAuth: true,
    //   addDefaultCallbackUrl: false
    // }
  }
})
