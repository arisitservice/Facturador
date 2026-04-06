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
    issuer: { clientId: 0, businessName: '', postalCode: '', taxId: '', taxRegimeId: 0 },
    client: { clientId: 0, businessName: '', postalCode: '', taxId: '', taxRegimeId: 0 },
    taxInfo: { invoiceUsageId: 0, paymentCurrencyId: 0, paymentMethod: '', paymentForm: '' },
    productServices: [],
  });

  const selectedClientId = shallowRef<number | undefined>(undefined);

  const {
    issuerMode,
    selectedOwnId,
    selectedIssuerClientId,
    selectedIssuerClientBusinessInfoId,
    issuerClientBusinessInfoItems,
    isLoadingIssuerClientBusinessInfo,
  } = useIssuerSelect(state.issuer);

  const {
    businessInfoItems: clientBusinessInfoItems,
    selectedBusinessInfoId: selectedClientBusinessInfoId,
    isLoadingBusinessInfo: isLoadingClientBusinessInfo,
  } = useClientBusinessInfoSelect(selectedClientId, state.client);

  function submitCreditNote() {
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
    selectedClientId,
    selectedClientBusinessInfoId,
    clientList,
    clientBusinessInfoItems,
    isLoadingClientBusinessInfo,
    submitCreditNote,
  };
}
