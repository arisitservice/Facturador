<script setup lang="ts">
const { isAuthenticated, isLoading } = useAuthStore();
const route = useRoute();

const items = computed(() => [{
  label: 'Docs',
  // to: '/docs',
  active: route.path.startsWith('/docs'),
}, {
  label: 'Pricing',
  to: '/pricing',
}, {
  label: 'Blog',
  // to: '/blog',
}, {
  label: 'Changelog',
  // to: '/changelog',
}]);
</script>

<template>
  <UHeader>
    <template #left>
      <NuxtLink to="/">
        <AppLogo class="w-auto h-6 shrink-0" />
      </NuxtLink>
    </template>

    <UNavigationMenu
      :items="items"
      variant="link"
    />

    <template #right>
      <UColorModeButton />

      <ClientOnly>
        <USkeleton
          v-if="isLoading"
          class="w-24 h-8 rounded-md"
        />
        <UButton
          icon="i-lucide-log-in"
          color="neutral"
          variant="ghost"
          :to="isAuthenticated ? { name: 'nova-dashboard' } : { name: 'login' }"
          class="lg:hidden"
        />

        <UButton

          :label="isAuthenticated ? 'Dashboard' : 'Sign in'"
          color="neutral"
          variant="outline"
          :to="isAuthenticated ? { name: 'nova-dashboard' } : { name: 'login' }"
          class="hidden lg:inline-flex"
        />
        <UButton
          v-if="!isAuthenticated"
          label="Sign up"
          color="neutral"
          trailing-icon="i-lucide-arrow-right"
          class="hidden lg:inline-flex"
          to="/signup"
        />
      </ClientOnly>
    </template>

    <template #body>
      <UNavigationMenu
        :items="items"
        orientation="vertical"
        class="-mx-2.5"
      />

      <USeparator class="my-6" />

      <UButton
        label="Sign in"
        color="neutral"
        variant="subtle"
        to="/login"
        block
        class="mb-3"
      />
      <UButton
        label="Sign up"
        color="neutral"
        to="/signup"
        block
      />
    </template>
  </UHeader>
</template>
