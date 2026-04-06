import type { ClientData } from '~/lib/schemas/billing';

export type IssuerMode = 'own' | 'client';

export function useIssuerSelect(issuerData: ClientData) {
  const businessInfoStore = useBusinessInfoStore();

  const issuerMode = ref<IssuerMode>('own');
  const selectedOwnId = shallowRef<number | undefined>(undefined);
  const selectedIssuerClientId = shallowRef<number | undefined>(undefined);

  function clearIssuerData() {
    issuerData.clientId = 0;
    issuerData.taxId = '';
    issuerData.businessName = '';
    issuerData.postalCode = '';
    issuerData.taxRegimeId = 0;
  }

  function applyDefault() {
    const id = businessInfoStore.defaultBusinessInfoId;
    if (id) {
      selectedOwnId.value = id;
    }
  }

  watch(issuerMode, (mode) => {
    clearIssuerData();
    selectedOwnId.value = undefined;
    selectedIssuerClientId.value = undefined;
    if (mode === 'own') {
      applyDefault();
    }
  });

  watch(selectedOwnId, (id) => {
    const info = businessInfoStore.businessInfoList.find(b => b.id === id);
    if (!info)
      return;
    issuerData.clientId = info.id;
    issuerData.taxId = info.taxId;
    issuerData.businessName = info.businessName;
    issuerData.postalCode = info.postalCode;
    issuerData.taxRegimeId = info.taxRegimeId;
  });

  const {
    businessInfoItems: issuerClientBusinessInfoItems,
    selectedBusinessInfoId: selectedIssuerClientBusinessInfoId,
    isLoadingBusinessInfo: isLoadingIssuerClientBusinessInfo,
  } = useClientBusinessInfoSelect(selectedIssuerClientId, issuerData);

  onMounted(applyDefault);

  return {
    issuerMode,
    selectedOwnId,
    selectedIssuerClientId,
    selectedIssuerClientBusinessInfoId,
    issuerClientBusinessInfoItems,
    isLoadingIssuerClientBusinessInfo,
  };
}
