// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@vesp/nuxt-fontawesome'],
  css: ['~/assets/main.css'],
  fontawesome: {
    component: 'font-awesome-icon',
    icons: {
      solid: ['fa-angle-right', 'fa-angle-left', 'fa-magnifying-glass']
    },
  }
})