import type { ApiResponse } from '~/types/facturador/api';
import type { BusinessInfo, CreateBusinessInfoPayload, UpdateBusinessInfoPayload } from '~/types/facturador/api/client-api';

const TENANT_ID = '885b4b63-3fda-4c27-9f3f-19ae61236453';

export function useClientBusinessInfo() {
  const authStore = useAuthStore();

  function tenantHeaders() {
    return {
      'X-Tenant-Id': TENANT_ID,
      'X-Token-Id': `${authStore.token ?? ''}`,
    };
  }

  async function getAll(clientId: number) {
    return useApiFetch<ApiResponse<BusinessInfo[]>>(`/Tenant/v1/Clients/${clientId}/BusinessInfo/GetAll`, {
      headers: tenantHeaders(),
    });
  }

  async function create(clientId: number, body: CreateBusinessInfoPayload) {
    return useApiFetch<ApiResponse<BusinessInfo>>(`/Tenant/v1/Clients/${clientId}/BusinessInfo/Create`, {
      method: 'POST',
      headers: tenantHeaders(),
      body,
    });
  }

  async function update(clientId: number, infoId: number, body: UpdateBusinessInfoPayload) {
    return useApiFetch<ApiResponse<BusinessInfo>>(`/Tenant/v1/Clients/${clientId}/BusinessInfo/Update/${infoId}`, {
      method: 'PUT',
      headers: tenantHeaders(),
      body,
    });
  }

  async function remove(clientId: number, infoId: number): Promise<ApiResponse<null>> {
    await useApiFetch<void>(`/Tenant/v1/Clients/${clientId}/BusinessInfo/Delete/${infoId}`, {
      method: 'DELETE',
      headers: tenantHeaders(),
    });
    return { payload: null, isSuccess: true, message: null, statusCode: 204, errors: null };
  }

  return { getAll, create, update, remove };
}
