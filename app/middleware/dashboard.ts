export default defineNuxtRouteMiddleware((_to, _from) => {
  const authStore = useAuthStore();

  console.log('dashboard middleware, validation if user exists');
  if (!authStore.user) {
    console.log('users not exist, redirecting to login');
    return navigateTo('/login');
  }
});
