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
    issuer: { clientId: 0, businessName: '', postalCode: '', taxId: '', taxRegimeId: 0 },
    receiver: { clientId: 0, businessName: '', postalCode: '', taxId: '', taxRegimeId: 0 },
    taxInfo: { invoiceUsageId: 0, paymentCurrencyId: 0, paymentMethod: '', paymentForm: '', relatedInvoiceId: undefined },
    productServices: [],
    vatDetails: { vatChargedAtRate: false, vatExempt: false, vatWithholdingAtRate: false, incomeTaxWithholding: false, amount: 0 },
  });

  const selectedReceiverId = shallowRef<number | undefined>(undefined);

  const {
    issuerMode,
    selectedOwnId,
    selectedIssuerClientId,
    selectedIssuerClientBusinessInfoId,
    issuerClientBusinessInfoItems,
    isLoadingIssuerClientBusinessInfo,
  } = useIssuerSelect(state.issuer);

  const {
    businessInfoItems: receiverBusinessInfoItems,
    selectedBusinessInfoId: selectedReceiverBusinessInfoId,
    isLoadingBusinessInfo: isLoadingReceiverBusinessInfo,
  } = useClientBusinessInfoSelect(selectedReceiverId, state.receiver);

  function submitInvoice() {
    // TODO: validate and call API
  }

  return {
    state,
    issuerMode,
    selectedOwnId,
    selectedIssuerClientId,
    selectedIssuerClientBusinessInfoId,
    issuerClientBusinessInfoItems,
    isLoadingIssuerClientBusinessInfo,
    selectedReceiverId,
    selectedReceiverBusinessInfoId,
    clientList,
    receiverBusinessInfoItems,
    isLoadingReceiverBusinessInfo,
    submitInvoice,
  };
}
