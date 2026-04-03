import { useClient } from './clients/use-client';

export function useBilling() {
  const billingService = {
    client: {
      getAllClients: useClient().getAll,
    },
  };

  return billingService;
};
