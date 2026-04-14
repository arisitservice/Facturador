import type { ApiResponse } from '~/types/facturador/api';
import type { TaxRegimen } from '~/types/facturador/api/client-api';

const authStore = useAuthStore();

function emptyError(message: string): ApiResponse<never> {
  return { payload: null, isSuccess: false, message, statusCode: 0, errors: null };
}
const TENANT_ID = useRuntimeConfig().public.testTenantId; // '33910ce2-a7fb-4479-8f9f-bcb8e98e91cc';
function tenantHeaders() {
  return {
    'X-Tenant-Id': TENANT_ID,
    'X-Token-Id': `${authStore.token ?? ''}`,
  };
}

export const useTaxRegimeStore = defineStore('taxRegime', () => {
  const taxRegimes = ref<TaxRegimen[]>([]);
  const cachedAt = ref<number | null>(null);
  const isLoading = ref(false);
  const TTL = 1000 * 60 * 60 * 24 * 7; // 7 days

  async function getTaxRegimes() {
    const now = Date.now();
    const isExpired = !cachedAt.value || (now - cachedAt.value) > TTL;

    if (taxRegimes.value.length && !isExpired)
      return null;

    try {
      isLoading.value = true;

      const response = await useApiFetch<ApiResponse<TaxRegimen[]>>('/Tenant/v1/TaxRegimes/GetAll', {
        headers: tenantHeaders(),
      });
      if (response.isSuccess && response.payload) {
        taxRegimes.value = response.payload;
        cachedAt.value = Date.now();
      }

      return response;
    }
    catch {
      return emptyError('Failed to fetch tax regimes. Please try again later.');
    }
    finally {
      isLoading.value = false;
    }
  }
  return {
    taxRegimes,
    isLoading,
    getTaxRegimes,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTaxRegimeStore, import.meta.hot));
}
