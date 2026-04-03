import type { Client, ClientsApiResponse, CreateClientPayload, UpdateClientPayload } from '~/types/facturador/api/client-api';

const TENANT_ID = '885b4b63-3fda-4c27-9f3f-19ae61236453';

export function useClient() {
  const authStore = useAuthStore();

  function tenantHeaders() {
    return {
      'X-Tenant-Id': TENANT_ID,
      'X-Token-Id': `${authStore.token ?? ''}`,
    };
  }

  async function getAll() {
    return useApiFetch<ClientsApiResponse<Client[]>>('/Tenant/v1/Clients/GetAll', {
      headers: tenantHeaders(),
    });
  }

  async function getById(id: number) {
    return useApiFetch<ClientsApiResponse<Client>>(`/Tenant/v1/Clients/GetById/${id}`, {
      headers: tenantHeaders(),
    });
  }

  async function create(body: CreateClientPayload) {
    return useApiFetch<ClientsApiResponse<Client>>('/Tenant/v1/Clients/Create', {
      method: 'POST',
      headers: tenantHeaders(),
      body,
    });
  }

  async function update(id: number, body: UpdateClientPayload) {
    return useApiFetch<ClientsApiResponse<Client>>(`/Tenant/v1/Clients/Update/${id}`, {
      method: 'PUT',
      headers: tenantHeaders(),
      body,
    });
  }

  async function remove(id: number): Promise<ClientsApiResponse<null>> {
    await useApiFetch<void>(`/Tenant/v1/Clients/Delete/${id}`, {
      method: 'DELETE',
      headers: tenantHeaders(),
    });
    return { payload: null, isSuccess: true, message: null, statusCode: 204, errors: null };
  }

  return { getAll, getById, create, update, remove };
}
