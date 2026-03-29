// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  runtimeConfig: {
    public: {
      apiBase: 'http://erp.almacenadoravica.com/erp/public/api',
    },
  },
  devServer: {
    host: '0.0.0.0',
  },
  devtools: { enabled: true },
  eslint: {
    config: {
      standalone: false, // <---
    },
  },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxt/eslint',
    '@nuxt/test-utils',
    '@nuxt/ui',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    'nuxt-csurf',
  ],
});
