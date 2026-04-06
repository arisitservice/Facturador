import type { Ref } from 'vue';

import type { ClientData } from '~/lib/schemas/billing';
import type { BusinessInfo } from '~/types/facturador/api/client-api';

import { useClientBusinessInfo } from '~/composables/clients/use-client-business-info';

/**
 * Handles the two-step client → BusinessInfo selection used in billing forms.
 * When a client is selected, fetches their BusinessInfo list.
 * When a BusinessInfo is selected, fills the provided clientData state.
 */
export function useClientBusinessInfoSelect(
  selectedClientId: Ref<number | undefined>,
  clientData: ClientData,
) {
  const { getAll } = useClientBusinessInfo();

  const businessInfoList = ref<BusinessInfo[]>([]);
  const isLoadingBusinessInfo = ref(false);
  const selectedBusinessInfoId = shallowRef<number | undefined>(undefined);

  const businessInfoItems = computed(() =>
    businessInfoList.value.map(info => ({
      label: `${info.businessName} — ${info.taxId}`,
      value: info.id,
    })),
  );

  watch(selectedClientId, async (id) => {
    selectedBusinessInfoId.value = undefined;
    businessInfoList.value = [];
    clientData.taxId = '';
    clientData.businessName = '';
    clientData.postalCode = '';
    clientData.taxRegimeId = 0;

    if (!id)
      return;

    clientData.clientId = id;
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
  });

  watch(selectedBusinessInfoId, (id) => {
    const info = businessInfoList.value.find(b => b.id === id);
    if (!info)
      return;
    clientData.taxId = info.taxId;
    clientData.businessName = info.businessName;
    clientData.postalCode = info.postalCode;
    clientData.taxRegimeId = info.taxRegimeId;
  });

  return { businessInfoItems, selectedBusinessInfoId, isLoadingBusinessInfo };
}
