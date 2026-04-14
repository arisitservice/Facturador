// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:8080/api',
      testTenantId: '33910ce2-a7fb-4479-8f9f-bcb8e98e91cc',
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
