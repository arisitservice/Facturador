import type { NewPaymentComplementData } from '~/lib/schemas/billing';

export function useNewPaymentComplement() {
  const clientsStore = useClientsStore();

  const clientList = computed(() =>
    clientsStore.clients.map(client => ({
      label: `${client.name} — ${client.clientTaxInfos[0]?.taxId ?? ''}`,
      value: client.id,
    })),
  );

  const state = reactive<NewPaymentComplementData>({
    issuer: { clientId: 0, businessName: '', postalCode: '', taxId: '', taxRegimeId: 0 },
    client: { clientId: 0, businessName: '', postalCode: '', taxId: '', taxRegimeId: 0 },
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

  const {
    issuerMode,
    selectedOwnId,
    selectedIssuerClientId,
    selectedIssuerClientBusinessInfoId,
    issuerClientBusinessInfoItems,
    isLoadingIssuerClientBusinessInfo,
    issuerTaxRegime,
  } = useIssuerSelect(state.issuer);

  const {
    businessInfoItems: clientBusinessInfoItems,
    selectedBusinessInfoId: selectedClientBusinessInfoId,
    isLoadingBusinessInfo: isLoadingClientBusinessInfo,
    selectedTaxRegime: clientTaxRegime,
  } = useClientBusinessInfoSelect(selectedClientId, state.client);

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

  return {
    state,
    issuerMode,
    selectedOwnId,
    selectedIssuerClientId,
    selectedIssuerClientBusinessInfoId,
    issuerClientBusinessInfoItems,
    isLoadingIssuerClientBusinessInfo,
    issuerTaxRegime,
    selectedClientId,
    selectedClientBusinessInfoId,
    clientList,
    clientBusinessInfoItems,
    isLoadingClientBusinessInfo,
    clientTaxRegime,
    folioInput,
    addFolio,
    removeFolio,
    submitPaymentComplement,
  };
}
