export default defineNuxtRouteMiddleware(async (_to, _from) => {
  const authStore = useAuthStore();

  console.log('revisando usuario en middleware', authStore.user);
  if (!authStore.user) {
    authStore.restoreSession();
  }
});
