import type { ApiResponse } from '~/types/facturador/api';
import type { BusinessInfo, CreateBusinessInfoPayload, UpdateBusinessInfoPayload } from '~/types/facturador/api/client-api';

import { useBusinessInfo } from '~/composables/business-info/use-business-info';

function emptyError(message: string): ApiResponse<never> {
  return { payload: null, isSuccess: false, message, statusCode: 0, errors: null };
}

export const useBusinessInfoStore = defineStore('businessInfo', () => {
  const { getAll, create, update, remove, setPrimary } = useBusinessInfo();

  const businessInfoList = ref<BusinessInfo[]>([]);
  const isLoading = ref(false);
  const isSaving = ref(false);

  const defaultBusinessInfo = computed(() =>
    businessInfoList.value.find(b => b.default) ?? businessInfoList.value[0] ?? null,
  );

  const defaultBusinessInfoId = computed(() => defaultBusinessInfo.value?.id ?? null);

  const selectItems = computed(() =>
    businessInfoList.value.map(info => ({
      label: `${info.businessName} — ${info.taxId}`,
      value: info.id,
    })),
  );

  async function fetchBusinessInfoList() {
    isLoading.value = true;
    try {
      const response = await getAll();
      if (response.isSuccess && response.payload) {
        businessInfoList.value = response.payload;
      }
      return response;
    }
    catch {
      return emptyError('Failed to load business information.');
    }
    finally {
      isLoading.value = false;
    }
  }

  async function setDefault(id: number): Promise<ApiResponse<BusinessInfo>> {
    isSaving.value = true;
    try {
      const response = await setPrimary(id);
      if (response.isSuccess && response.payload) {
        // Update default flags locally
        businessInfoList.value = businessInfoList.value.map(b => ({
          ...b,
          default: b.id === id,
        }));
      }
      return response;
    }
    catch {
      return emptyError('Failed to set default business information.');
    }
    finally {
      isSaving.value = false;
    }
  }

  async function createBusinessInfo(payload: CreateBusinessInfoPayload): Promise<ApiResponse<BusinessInfo>> {
    isSaving.value = true;
    try {
      const response = await create(payload);
      if (response.isSuccess && response.payload) {
        businessInfoList.value.push(response.payload);
      }
      return response;
    }
    catch {
      return emptyError('Failed to create business information.');
    }
    finally {
      isSaving.value = false;
    }
  }

  async function updateBusinessInfo(id: number, payload: UpdateBusinessInfoPayload): Promise<ApiResponse<BusinessInfo>> {
    isSaving.value = true;
    try {
      const response = await update(id, payload);
      if (response.isSuccess && response.payload) {
        const index = businessInfoList.value.findIndex(b => b.id === id);
        if (index !== -1) {
          businessInfoList.value[index] = response.payload;
        }
      }
      return response;
    }
    catch {
      return emptyError('Failed to update business information.');
    }
    finally {
      isSaving.value = false;
    }
  }

  async function deleteBusinessInfo(id: number): Promise<ApiResponse<null>> {
    isSaving.value = true;
    try {
      const response = await remove(id);
      if (response.isSuccess) {
        businessInfoList.value = businessInfoList.value.filter(b => b.id !== id);
      }
      return response;
    }
    catch {
      return emptyError('Failed to delete business information.');
    }
    finally {
      isSaving.value = false;
    }
  }

  return {
    businessInfoList,
    isLoading,
    isSaving,
    defaultBusinessInfoId,
    defaultBusinessInfo,
    selectItems,
    setDefault,
    fetchBusinessInfoList,
    createBusinessInfo,
    updateBusinessInfo,
    deleteBusinessInfo,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBusinessInfoStore, import.meta.hot));
}
