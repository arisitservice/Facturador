import type { ApiResponse } from '~/types/facturador/api';
import type { Client } from '~/types/facturador/api/client-api';

export type ClientListResponse = ApiResponse<Client[]>;

export default () => {
  const END_POINT_CLIENTES_ALL = '/catalogos/clientes/all';

  const getClients = async (): Promise<ClientListResponse> => {
    try {
      return await useApiFetch<ClientListResponse>(END_POINT_CLIENTES_ALL);
    }
    catch {
      return {
        success: false,
        data: [],
        message: 'Error fetching clients',
      };
    }
  };

  return { getClients };
};
