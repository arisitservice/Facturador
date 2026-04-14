import type { ClientData } from '~/lib/schemas/billing';
import type { TaxRegimen } from '~/types/facturador/api/client-api';

export type IssuerMode = 'own' | 'client';

export function useIssuerSelect(issuerData: ClientData) {
  const businessInfoStore = useBusinessInfoStore();

  const issuerMode = ref<IssuerMode>('own');
  const selectedOwnId = shallowRef<number | undefined>(undefined);
  const selectedIssuerClientId = shallowRef<number | undefined>(undefined);
  const ownTaxRegime = shallowRef<TaxRegimen | null>(null);

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
    ownTaxRegime.value = null;
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
    ownTaxRegime.value = info.taxRegime?.[0] ?? null;
    issuerData.clientId = info.id;
    issuerData.taxId = info.taxId;
    issuerData.businessName = info.businessName;
    issuerData.postalCode = info.postalCode;
    issuerData.taxRegimeId = ownTaxRegime.value?.id ?? 0;
  });

  const {
    businessInfoItems: issuerClientBusinessInfoItems,
    selectedBusinessInfoId: selectedIssuerClientBusinessInfoId,
    isLoadingBusinessInfo: isLoadingIssuerClientBusinessInfo,
    selectedTaxRegime: issuerClientTaxRegime,
  } = useClientBusinessInfoSelect(selectedIssuerClientId, issuerData);

  const issuerTaxRegime = computed<TaxRegimen | null>(() =>
    issuerMode.value === 'own' ? ownTaxRegime.value : issuerClientTaxRegime.value,
  );

  onMounted(applyDefault);

  return {
    issuerMode,
    selectedOwnId,
    selectedIssuerClientId,
    selectedIssuerClientBusinessInfoId,
    issuerClientBusinessInfoItems,
    isLoadingIssuerClientBusinessInfo,
    issuerTaxRegime,
  };
}
