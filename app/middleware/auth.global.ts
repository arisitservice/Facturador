export default defineNuxtRouteMiddleware((_to, _from) => {
  // Session is automatically restored from localStorage via useLocalStorage in useAuthStore.
  // No manual restoration needed here.
});
