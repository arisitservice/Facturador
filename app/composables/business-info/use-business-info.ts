import type { ApiResponse } from '~/types/facturador/api';
import type { BusinessInfo, CreateBusinessInfoPayload, UpdateBusinessInfoPayload } from '~/types/facturador/api/client-api';

const TENANT_ID = '885b4b63-3fda-4c27-9f3f-19ae61236453';

export function useBusinessInfo() {
  const authStore = useAuthStore();

  function tenantHeaders() {
    return {
      'X-Tenant-Id': TENANT_ID,
      'X-Token-Id': `${authStore.token ?? ''}`,
    };
  }

  async function getAll() {
    return useApiFetch<ApiResponse<BusinessInfo[]>>('/Tenant/v1/BusinessInfo/GetAll', {
      headers: tenantHeaders(),
    });
  }

  async function create(body: CreateBusinessInfoPayload) {
    return useApiFetch<ApiResponse<BusinessInfo>>('/Tenant/v1/BusinessInfo/Create', {
      method: 'POST',
      headers: tenantHeaders(),
      body,
    });
  }

  async function update(id: number, body: UpdateBusinessInfoPayload) {
    return useApiFetch<ApiResponse<BusinessInfo>>(`/Tenant/v1/BusinessInfo/Update/${id}`, {
      method: 'PUT',
      headers: tenantHeaders(),
      body,
    });
  }

  async function remove(id: number): Promise<ApiResponse<null>> {
    await useApiFetch<void>(`/Tenant/v1/BusinessInfo/Delete/${id}`, {
      method: 'DELETE',
      headers: tenantHeaders(),
    });
    return { payload: null, isSuccess: true, message: null, statusCode: 204, errors: null };
  }

  async function setPrimary(id: number) {
    return useApiFetch<ApiResponse<BusinessInfo>>(`/Tenant/v1/BusinessInfo/SetPrimary/${id}`, {
      method: 'PATCH',
      headers: tenantHeaders(),
    });
  }

  return { getAll, create, update, remove, setPrimary };
}
