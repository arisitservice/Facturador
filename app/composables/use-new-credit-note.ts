import type { NewCreditNoteData } from '~/lib/schemas/billing';

export function useNewCreditNote() {
  const clientsStore = useClientsStore();

  const clientList = computed(() =>
    clientsStore.clients.map(client => ({
      label: `${client.name} — ${client.taxId}`,
      value: client.id,
    })),
  );

  const state = reactive<NewCreditNoteData>({
    client: {
      clientId: 0,
      businessName: '',
      postalCode: '',
      taxId: '',
      taxRegimeId: 0,
    },
    taxInfo: {
      invoiceUsageId: 0,
      paymentCurrencyId: 0,
      paymentMethod: '',
      paymentForm: '',
    },
    productServices: [],
  });

  const selectedClientId = shallowRef<number | undefined>(undefined);

  watch(selectedClientId, (id) => {
    const client = clientsStore.clients.find(c => c.id === id);
    if (!client)
      return;
    state.client.clientId = client.id;
    state.client.taxId = client.taxId;
    state.client.businessName = client.businessName;
    state.client.postalCode = client.postalCode;
    state.client.taxRegimeId = client.taxRegimeId;
  });

  function submitCreditNote() {
    // TODO: validate and call API
  }

  return { state, selectedClientId, clientList, submitCreditNote };
}
