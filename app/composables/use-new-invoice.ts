import type { NewInvoiceData } from '~/lib/schemas/billing';

export function useNewInvoice() {
  const clientsStore = useClientsStore();

  const clientList = computed(() =>
    clientsStore.clients.map(client => ({
      label: `${client.name} — ${client.taxId}`,
      value: client.id,
    })),
  );

  const state = reactive<NewInvoiceData>({
    issuer: {
      clientId: 0,
      businessName: '',
      postalCode: '',
      taxId: '',
      taxRegimeId: 0,
    },
    receiver: {
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
      relatedInvoiceId: undefined,
    },
    productServices: [],
    vatDetails: {
      vatChargedAtRate: false,
      vatExempt: false,
      vatWithholdingAtRate: false,
      incomeTaxWithholding: false,
      amount: 0,
    },
  });

  const selectedReceiverId = shallowRef<number | undefined>(undefined);
  const selectedIssuerId = shallowRef<number | undefined>(undefined);

  watch(selectedReceiverId, (id) => {
    const client = clientsStore.clients.find(c => c.id === id);
    if (!client)
      return;
    state.receiver.clientId = client.id;
    state.receiver.taxId = client.taxId;
    state.receiver.businessName = client.businessName;
    state.receiver.postalCode = client.postalCode;
    state.receiver.taxRegimeId = client.taxRegimeId;
  });

  watch(selectedIssuerId, (id) => {
    const client = clientsStore.clients.find(c => c.id === id);
    if (!client)
      return;
    state.issuer.clientId = client.id;
    state.issuer.taxId = client.taxId;
    state.issuer.businessName = client.businessName;
    state.issuer.postalCode = client.postalCode;
    state.issuer.taxRegimeId = client.taxRegimeId;
  });

  function submitInvoice() {
    // TODO: validate and call API
  }

  return { state, selectedReceiverId, selectedIssuerId, clientList, submitInvoice };
}
