import type { UseFetchOptions } from 'nuxt/app';

export function useApi<T>(url: string, options: UseFetchOptions<T> = {}) {
  const { public: { apiBase } } = useRuntimeConfig();
  const authStore = useAuthStore();

  const defaults: UseFetchOptions<T> = {
    baseURL: apiBase,
    onRequest({ options }) {
      // Add authorization header if token exists
      const authHeader = authStore.getAuthHeader();
      if (authHeader) {
        // Convert Headers to plain object if needed
        const currentHeaders = options.headers instanceof Headers
          ? Object.fromEntries(options.headers.entries())
          : (options.headers || {});

        options.headers = {
          ...currentHeaders,
          Authorization: authHeader,
        } as any;
      }
    },
    onResponseError({ response }) {
      // Handle 401 Unauthorized - token expired or invalid
      if (response.status === 401) {
        authStore.signOut();
        navigateTo('/login');
      }
    },
  };

  // Merge defaults with user options
  const params = { ...defaults, ...options };

  return useFetch(url, params);
}

// For $fetch usage (non-reactive)
export function useApiFetch<T>(url: string, options?: any) {
  const { public: { apiBase } } = useRuntimeConfig();
  const authStore = useAuthStore();

  const authHeader = authStore.getAuthHeader();

  return $fetch<T>(`${apiBase}${url}`, {
    ...options,
    headers: {
      ...(options?.headers || {}),
      ...(authHeader ? { Authorization: authHeader } : {}),
    },
  });
}
