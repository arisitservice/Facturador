import type { ApiResponse } from '~/types/facturador/api';
import type { Client, CreateClientPayload, UpdateClientPayload } from '~/types/facturador/api/client-api';

import { useClient } from '~/composables/clients/use-client';

function emptyError(message: string): ApiResponse<never> {
  return { payload: null, isSuccess: false, message, statusCode: 0, errors: null };
}

export const useClientsStore = defineStore('useClientsStore', () => {
  const { getAll, getById, create, update, remove } = useClient();

  const clients = ref<Client[]>([]);
  const selectedClient = ref<Client | null>(null);
  const isLoading = ref(false);
  const isSaving = ref(false);

  async function fetchClients() {
    isLoading.value = true;
    try {
      const response = await getAll();
      if (response.isSuccess && response.payload) {
        clients.value = response.payload;
      }
      return response;
    }
    catch {
      return emptyError('Error al cargar los clientes.');
    }
    finally {
      isLoading.value = false;
    }
  }

  async function fetchClientById(id: number) {
    isLoading.value = true;
    try {
      const response = await getById(id);
      if (response.isSuccess && response.payload) {
        selectedClient.value = response.payload;
      }
      return response;
    }
    catch {
      return emptyError('Error al obtener el cliente.');
    }
    finally {
      isLoading.value = false;
    }
  }

  async function createClient(payload: CreateClientPayload): Promise<ApiResponse<Client>> {
    isSaving.value = true;
    try {
      const response = await create(payload);
      if (response.isSuccess) {
        await fetchClients();
      }
      return response;
    }
    catch {
      return emptyError('Error al crear el cliente.');
    }
    finally {
      isSaving.value = false;
    }
  }

  async function updateClient(id: number, payload: UpdateClientPayload): Promise<ApiResponse<Client>> {
    isSaving.value = true;
    try {
      const response = await update(id, payload);
      if (response.isSuccess && response.payload) {
        const index = clients.value.findIndex(c => c.id === id);
        if (index !== -1) {
          clients.value[index] = response.payload;
        }
      }
      return response;
    }
    catch {
      return emptyError('Error al actualizar el cliente.');
    }
    finally {
      isSaving.value = false;
    }
  }

  async function deleteClient(id: number): Promise<ApiResponse<null>> {
    isSaving.value = true;
    try {
      const response = await remove(id);
      if (response.isSuccess) {
        clients.value = clients.value.filter(c => c.id !== id);
        if (selectedClient.value?.id === id) {
          selectedClient.value = null;
        }
      }
      return response;
    }
    catch {
      return emptyError('Error al eliminar el cliente.');
    }
    finally {
      isSaving.value = false;
    }
  }

  function addClientTaxInfo(clientId: number, info: import('~/types/facturador/api/client-api').BusinessInfo) {
    const client = clients.value.find(c => c.id === clientId);
    if (client)
      client.clientTaxInfos.push(info);
  }

  function updateClientTaxInfo(clientId: number, info: import('~/types/facturador/api/client-api').BusinessInfo) {
    const client = clients.value.find(c => c.id === clientId);
    if (!client)
      return;
    const index = client.clientTaxInfos.findIndex(t => t.id === info.id);
    if (index !== -1)
      client.clientTaxInfos[index] = info;
  }

  function removeClientTaxInfo(clientId: number, taxInfoId: number) {
    const client = clients.value.find(c => c.id === clientId);
    if (client)
      client.clientTaxInfos = client.clientTaxInfos.filter(t => t.id !== taxInfoId);
  }

  return {
    clients,
    selectedClient,
    isLoading,
    isSaving,
    fetchClients,
    fetchClientById,
    createClient,
    updateClient,
    deleteClient,
    addClientTaxInfo,
    updateClientTaxInfo,
    removeClientTaxInfo,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useClientsStore, import.meta.hot));
}
