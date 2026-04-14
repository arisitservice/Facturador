import type { ApiResponse } from '~/types/facturador/api';
import type { BusinessInfo, CreateClientTaxInfoPayload, UpdateClientTaxInfoPayload } from '~/types/facturador/api/client-api';

const TENANT_ID = useRuntimeConfig().public.testTenantId;

export function useClientBusinessInfo() {
  const authStore = useAuthStore();

  function tenantHeaders() {
    return {
      'X-Tenant-Id': TENANT_ID,
      'X-Token-Id': `${authStore.token ?? ''}`,
    };
  }

  async function getAll(clientId: number) {
    return useApiFetch<ApiResponse<BusinessInfo[]>>(`/Tenant/v1/ClientTaxInfos/GetAllByClient/${clientId}`, {
      headers: tenantHeaders(),
    });
  }

  async function getById(id: number) {
    return useApiFetch<ApiResponse<BusinessInfo>>(`/Tenant/v1/ClientTaxInfos/GetById/${id}`, {
      headers: tenantHeaders(),
    });
  }

  async function create(body: CreateClientTaxInfoPayload) {
    return useApiFetch<ApiResponse<BusinessInfo>>('/Tenant/v1/ClientTaxInfos/Create', {
      method: 'POST',
      headers: tenantHeaders(),
      body,
    });
  }

  async function update(id: number, body: UpdateClientTaxInfoPayload) {
    return useApiFetch<ApiResponse<BusinessInfo>>(`/Tenant/v1/ClientTaxInfos/Update/${id}`, {
      method: 'PUT',
      headers: tenantHeaders(),
      body,
    });
  }

  async function remove(id: number): Promise<ApiResponse<null>> {
    await useApiFetch<void>(`/Tenant/v1/ClientTaxInfos/Delete/${id}`, {
      method: 'DELETE',
      headers: tenantHeaders(),
    });
    return { payload: null, isSuccess: true, message: null, statusCode: 204, errors: null };
  }

  return { getAll, getById, create, update, remove };
}
