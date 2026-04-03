import { StorageSerializers } from '@vueuse/core';
import { skipHydrate } from 'pinia';

import type { LoginResponse, LoginUser, Payload, SignUpPayload, SignUpResponse } from '~/types/facturador';

const PAYLOAD_KEY = 'aris_ti_nova_payload';
const TOKEN_KEY = 'aris_ti_nova_auth_token';
const TOKEN_TYPE_KEY = 'aris_ti_nova_auth_token_type';
const USER_KEY = 'aris_ti_nova_auth_user';

export const useAuthStore = defineStore('useAuthStore', () => {
  // skipHydrate prevents Nuxt SSR payload from overwriting localStorage values on page refresh
  const payload = skipHydrate(useLocalStorage<Payload | null>(PAYLOAD_KEY, null, { serializer: StorageSerializers.object }));
  const session = skipHydrate(useLocalStorage<LoginUser | null>(USER_KEY, null, { serializer: StorageSerializers.object }));
  const token = skipHydrate(useLocalStorage<string | null>(TOKEN_KEY, null));
  const tokenType = skipHydrate(useLocalStorage<string | null>(TOKEN_TYPE_KEY, null));
  const isLoading = ref(false);

  const isAuthenticated = computed(() => !!session.value && !!token.value);
  const user = computed(() => session.value || null);

  function savePayload(newPayload: Payload) {
    payload.value = newPayload;
  }

  function saveSession(authToken: string, authTokenType: string, authUser: LoginUser) {
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
      // return `${tokenType.value} ${token.value}`;
      return `Bearer ${token.value}`;
    }
    return null;
  }

  async function signIn({ email, password }: { email: string; password: string }) {
    isLoading.value = true;
    try {
      const response = await useApiFetch<LoginResponse>('/Tenant/v1/Auth/Login', {
        method: 'POST',
        headers: {
          // Test only id for aaaa@aaaa.com user
          'X-Tenant-Id': '885b4b63-3fda-4c27-9f3f-19ae61236453',
        },
        body: { email, password },
      });

      if (response.isSuccess && response.payload) {
        saveSession(response.payload.token, response.payload.userType, response.payload);
      }

      return response;
    }
    catch {
      return {
        payload: null,
        isSuccess: false,
        message: 'An error occurred during sign in. Please try again.',
        statusCode: 0,
        errors: [],
      } satisfies LoginResponse;
    }
    finally {
      isLoading.value = false;
    }
  }

  async function signUp(payload: SignUpPayload) {
    isLoading.value = true;
    try {
      const response = await useApiFetch<SignUpResponse>('/main/Tenants/Create', {
        method: 'POST',
        body: payload,
      });

      if (response.isSuccess && response.payload) {
        savePayload(response.payload);
      }

      return response;
    }
    catch {
      return {
        payload: null,
        isSuccess: false,
        message: 'An error occurred during sign up. Please try again.',
        statusCode: 0,
        errors: [],
      } satisfies SignUpResponse;
    }
    finally {
      isLoading.value = false;
    }
  }

  async function signOut() {
    clearSession();
    payload.value = null;
  }

  return {
    isLoading,
    isAuthenticated,
    session,
    user,
    token,
    tokenType,
    payload,
    signIn,
    signUp,
    signOut,
    getAuthHeader,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
