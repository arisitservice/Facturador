import type { LoginResponse, User } from '~/types/facturador';

const TOKEN_KEY = 'aris_ti_nova_auth_token';
const TOKEN_TYPE_KEY = 'aris_ti_nova_auth_token_type';
const USER_KEY = 'aris_ti_nova_auth_user';

export const useAuthStore = defineStore('useAuthStore', () => {
  const session = ref<User | null>(null);
  const token = ref<string | null>(null);
  const tokenType = ref<string | null>(null);
  const isLoading = ref(false);

  const isAuthenticated = computed(() => !!session.value && !!token.value);
  const user = computed(() => session.value || null);

  // Restore session from localStorage on store initialization
  function restoreSession() {
    if (import.meta.client) {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedTokenType = localStorage.getItem(TOKEN_TYPE_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      if (storedToken && storedTokenType && storedUser) {
        try {
          token.value = storedToken;
          tokenType.value = storedTokenType;
          session.value = JSON.parse(storedUser);
        }
        catch (error) {
          console.error('Failed to restore session:', error);
          clearSession();
        }
      }
    }
  }

  // Save session to localStorage
  function saveSession(authToken: string, authTokenType: string, authUser: User) {
    if (import.meta.client) {
      localStorage.setItem(TOKEN_KEY, authToken);
      localStorage.setItem(TOKEN_TYPE_KEY, authTokenType);
      localStorage.setItem(USER_KEY, JSON.stringify(authUser));
    }
    token.value = authToken;
    tokenType.value = authTokenType;
    session.value = authUser;
  }

  // Clear session from localStorage
  function clearSession() {
    if (import.meta.client) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(TOKEN_TYPE_KEY);
      localStorage.removeItem(USER_KEY);
    }
    token.value = null;
    tokenType.value = null;
    session.value = null;
  }

  // Get authorization header
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
    catch (error) {
      console.error('Login error:', process.env.NODE_ENV === 'development' ? error : 'An error occurred during login.');
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
    // Optional: Call logout endpoint on your Laravel API
    // try {
    //   await $fetch('http://erp.almacenadoravica.com/erp/public/api/logout', {
    //     method: 'POST',
    //     headers: {
    //       Authorization: getAuthHeader() || '',
    //     },
    //   });
    // } catch (error) {
    //   console.error('Logout error:', error);
    // }

    clearSession();
  }

  // Initialize session on store creation
  restoreSession();

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
    restoreSession,
  };
});
