import type { ApiResponse } from '~/types/facturador/api';

const authStore = useAuthStore();
const TENANT_ID = useRuntimeConfig().public.testTenantId; // '33910ce2-a7fb-4479-8f9f-bcb8e98e91cc';

function tenantHeaders() {
  return {
    'X-Tenant-Id': TENANT_ID,
    'X-Token-Id': `${authStore.token ?? ''}`,
  };
}

function invoice() {
  const getAll = async () => {
    return useApiFetch<ApiResponse<any>>('/Tenant/v1/Billing/Invoice/GetAll', {
      headers: tenantHeaders(),
    });
  };

  const singInvoice = async (body: any) => {
    // Implement the logic to sign an invoice here
    // This is a placeholder function and should be replaced with actual API calls
    return useApiFetch<ApiResponse<any>>('/Tenant/v1/Billing/Invoice/Sing', {
      method: 'POST',
      headers: tenantHeaders(),
      body,
    });
  };

  return {
    getAll,
    singInvoice,
  };
}

export function useBilling() {
  const billingService = {
    invoice: {
      getAll: invoice().getAll,
      singInvoice: invoice().singInvoice,
    },
  };

  return billingService;
};
