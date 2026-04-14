import type { ApiResponse } from '~/types/facturador/api';
import type { BusinessInfo, CreateBusinessInfoPayload, UpdateBusinessInfoPayload } from '~/types/facturador/api/client-api';

const TENANT_ID = useRuntimeConfig().public.testTenantId; // '33910ce2-a7fb-4479-8f9f-bcb8e98e91cc';

export function useBusinessInfo() {
  const authStore = useAuthStore();

  function tenantHeaders() {
    return {
      'X-Tenant-Id': TENANT_ID,
      'X-Token-Id': `${authStore.token ?? ''}`,
    };
  }

  async function getAll() {
    return useApiFetch<ApiResponse<BusinessInfo[]>>('/Tenant/v1/AccountTaxInfos/GetAll', {
      headers: tenantHeaders(),
    });
  }

  async function create(body: CreateBusinessInfoPayload) {
    return useApiFetch<ApiResponse<BusinessInfo>>('/Tenant/v1/AccountTaxInfos/Create', {
      method: 'POST',
      headers: tenantHeaders(),
      body,
    });
  }

  async function update(id: number, body: UpdateBusinessInfoPayload) {
    return useApiFetch<ApiResponse<BusinessInfo>>(`/Tenant/v1/AccountTaxInfos/Update/${id}`, {
      method: 'PUT',
      headers: tenantHeaders(),
      body,
    });
  }

  async function remove(id: number): Promise<ApiResponse<null>> {
    await useApiFetch<void>(`/Tenant/v1/AccountTaxInfos/Delete/${id}`, {
      method: 'DELETE',
      headers: tenantHeaders(),
    });
    return { payload: null, isSuccess: true, message: null, statusCode: 204, errors: null };
  }

  async function setPrimary(id: number) {
    return useApiFetch<ApiResponse<BusinessInfo>>(`/Tenant/v1/AccountTaxInfos/SetPrimary/${id}`, {
      method: 'PATCH',
      headers: tenantHeaders(),
    });
  }

  return { getAll, create, update, remove, setPrimary };
}
