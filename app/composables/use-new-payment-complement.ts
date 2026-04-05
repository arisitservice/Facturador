import type { NewPaymentComplementData } from '~/lib/schemas/billing';

export function useNewPaymentComplement() {
  const clientsStore = useClientsStore();

  const clientList = computed(() =>
    clientsStore.clients.map(client => ({
      label: `${client.name} — ${client.taxId}`,
      value: client.id,
    })),
  );

  const state = reactive<NewPaymentComplementData>({
    client: {
      clientId: 0,
      businessName: '',
      postalCode: '',
      taxId: '',
      taxRegimeId: 0,
    },
    paymentReception: {
      paymentMethod: '0',
      paymentCurrency: 0,
      paymentDate: '',
      amount: 0,
      transactionNumber: '',
      fiscalFolios: [],
    },
  });

  const selectedClientId = shallowRef<number | undefined>(undefined);
  const folioInput = shallowRef('');

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

  function addFolio() {
    const trimmed = folioInput.value.trim();
    if (!trimmed)
      return;
    state.paymentReception.fiscalFolios.push(trimmed);
    folioInput.value = '';
  }

  function removeFolio(index: number) {
    state.paymentReception.fiscalFolios.splice(index, 1);
  }

  function submitPaymentComplement() {
    // TODO: validate and call API
  }

  return { state, selectedClientId, clientList, folioInput, addFolio, removeFolio, submitPaymentComplement };
}
