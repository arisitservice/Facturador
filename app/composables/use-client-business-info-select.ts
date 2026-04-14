import type { Ref } from 'vue';

import type { ClientData } from '~/lib/schemas/billing';
import type { BusinessInfo, TaxRegimen } from '~/types/facturador/api/client-api';

import { useClientBusinessInfo } from '~/composables/clients/use-client-business-info';

/**
 * Handles the two-step client → BusinessInfo selection used in billing forms.
 * Uses clientTaxInfos from the clients store if already loaded, otherwise fetches.
 * Auto-selects if there is only one BusinessInfo.
 * When a BusinessInfo is selected, fills the provided clientData state.
 */
export function useClientBusinessInfoSelect(
  selectedClientId: Ref<number | undefined>,
  clientData: ClientData,
) {
  const clientsStore = useClientsStore();
  const { getAll } = useClientBusinessInfo();

  const businessInfoList = ref<BusinessInfo[]>([]);
  const isLoadingBusinessInfo = ref(false);
  const selectedBusinessInfoId = shallowRef<number | undefined>(undefined);
  const selectedTaxRegime = shallowRef<TaxRegimen | null>(null);

  const businessInfoItems = computed(() =>
    businessInfoList.value.map(info => ({
      label: `${info.businessName} — ${info.taxId}`,
      value: info.id,
    })),
  );

  watch(selectedClientId, async (id) => {
    selectedBusinessInfoId.value = undefined;
    selectedTaxRegime.value = null;
    businessInfoList.value = [];
    clientData.taxId = '';
    clientData.businessName = '';
    clientData.postalCode = '';
    clientData.taxRegimeId = 0;

    if (!id)
      return;

    clientData.clientId = id;

    // Use store data if already available, otherwise fetch
    const cached = clientsStore.clients.find(c => c.id === id)?.clientTaxInfos;
    if (cached?.length) {
      businessInfoList.value = cached;
    }
    else {
      isLoadingBusinessInfo.value = true;
      try {
        const response = await getAll(id);
        if (response.isSuccess && response.payload) {
          businessInfoList.value = response.payload;
        }
      }
      finally {
        isLoadingBusinessInfo.value = false;
      }
    }

    if (businessInfoList.value.length === 1) {
      selectedBusinessInfoId.value = businessInfoList.value[0]!.id;
    }
  });

  watch(selectedBusinessInfoId, (id) => {
    const info = businessInfoList.value.find(b => b.id === id);
    if (!info)
      return;
    const regime = info.taxRegime ?? null;
    selectedTaxRegime.value = regime;
    clientData.taxId = info.taxId;
    clientData.businessName = info.businessName;
    clientData.postalCode = info.postalCode;
    clientData.taxRegimeId = regime?.id ?? 0;
  });

  return { businessInfoItems, selectedBusinessInfoId, isLoadingBusinessInfo, selectedTaxRegime };
}
