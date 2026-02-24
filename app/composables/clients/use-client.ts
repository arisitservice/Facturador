import type { ApiResponse } from '~/types/facturador/api';
import type { Client } from '~/types/facturador/api/client-api';

export type ClientListResponse = ApiResponse<Client[]>;

export default () => {
  const END_POINT_CLIENTES_ALL = '/catalogos/clientes/all';
  // const END_POINT_CLIENTES_CREATE = '/catalogos/clientes/create';
  // const END_POINT_CLIENTES_UPDATE = '/catalogos/clientes/update';
  // const END_POINT_CLIENTES_DELETE = '/catalogos/clientes/delete';

  const getClients = async (): Promise<ClientListResponse> => {
    try {
      const response = await useApiFetch<ClientListResponse>(END_POINT_CLIENTES_ALL);
      console.log('from useClient', response);
      return response;
    }
    catch (error) {
      console.log(error);
      return {
        success: false,
        data: [],
        message: 'Error fetching clients',
      };
    }
  };

  return { getClients };
};
