import { skipHydrate } from 'pinia';

import type { LoginResponse, User } from '~/types/facturador';

const TOKEN_KEY = 'aris_ti_nova_auth_token';
const TOKEN_TYPE_KEY = 'aris_ti_nova_auth_token_type';
const USER_KEY = 'aris_ti_nova_auth_user';

export const useAuthStore = defineStore('useAuthStore', () => {
  // skipHydrate prevents Nuxt SSR payload from overwriting localStorage values on page refresh
  const session = skipHydrate(useLocalStorage<User | null>(USER_KEY, null));
  const token = skipHydrate(useLocalStorage<string | null>(TOKEN_KEY, null));
  const tokenType = skipHydrate(useLocalStorage<string | null>(TOKEN_TYPE_KEY, null));
  const isLoading = ref(false);

  const isAuthenticated = computed(() => !!session.value && !!token.value);
  const user = computed(() => session.value || null);

  function saveSession(authToken: string, authTokenType: string, authUser: User) {
    token.value = authToken;
    tokenType.value = authTokenType;
    session.value = authUser;
  }

  function clearSession() {
    token.value = null;
    tokenType.value = null;
    session.value = null;
  }

  function getAuthHeader() {
    if (token.value && tokenType.value) {
      return `${tokenType.value} ${token.value}`;
    }
    return null;
  }

  async function signIn({ email, password }: { email: string; password: string }) {
    isLoading.value = true;
    try {
      const response = await useApiFetch<LoginResponse>('/login', {
        method: 'POST',
        body: { email, password },
      });

      if (response.success && response.token && response.user) {
        saveSession(response.token, response.token_type, response.user);
      }

      return response;
    }
    catch {
      return {
        success: false,
        message: 'An error occurred during login. Please try again.',
      };
    }
    finally {
      isLoading.value = false;
    }
  }

  async function signOut() {
    clearSession();
  }

  return {
    isLoading,
    isAuthenticated,
    session,
    user,
    token,
    tokenType,
    signIn,
    signOut,
    getAuthHeader,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
