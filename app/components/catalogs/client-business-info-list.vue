<script setup lang="ts">
import type { BusinessInfo } from '~/types/facturador/api/client-api';

import { useClientBusinessInfo } from '~/composables/clients/use-client-business-info';

const props = defineProps<{
  clientId: number;
}>();

const { getAll, remove } = useClientBusinessInfo();
const toast = useToast();

const businessInfoList = ref<BusinessInfo[]>([]);
const isLoading = ref(false);
const slideoverOpen = ref(false);
const editTarget = ref<BusinessInfo | undefined>(undefined);
const deleteTarget = ref<BusinessInfo | undefined>(undefined);
const isDeleting = ref(false);

const isDeleteModalOpen = computed({
  get: () => !!deleteTarget.value,
  set: (val) => {
    if (!val)
      deleteTarget.value = undefined;
  },
});

onMounted(async () => {
  isLoading.value = true;
  try {
    const response = await getAll(props.clientId);
    if (response.isSuccess && response.payload) {
      businessInfoList.value = response.payload;
    }
  }
  finally {
    isLoading.value = false;
  }
});

function openCreate() {
  editTarget.value = undefined;
  slideoverOpen.value = true;
}

function openEdit(info: BusinessInfo) {
  editTarget.value = info;
  slideoverOpen.value = true;
}

function onSaved(info: BusinessInfo) {
  if (editTarget.value) {
    const index = businessInfoList.value.findIndex(b => b.id === info.id);
    if (index !== -1)
      businessInfoList.value[index] = info;
  }
  else {
    businessInfoList.value.push(info);
  }
  slideoverOpen.value = false;
}

async function confirmDelete() {
  if (!deleteTarget.value)
    return;
  isDeleting.value = true;
  const response = await remove(props.clientId, deleteTarget.value.id);
  isDeleting.value = false;
  if (response.isSuccess) {
    businessInfoList.value = businessInfoList.value.filter(b => b.id !== deleteTarget.value!.id);
    toast.add({ title: 'Business info deleted', color: 'success', icon: 'i-lucide-trash' });
  }
  else {
    toast.add({ title: 'Failed to delete', color: 'error', icon: 'i-lucide-alert-circle' });
  }
  deleteTarget.value = undefined;
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center justify-between">
      <p class="text-sm font-medium text-highlighted">
        Business Information
      </p>
      <UButton
        label="Add"
        icon="i-lucide-plus"
        size="xs"
        color="neutral"
        variant="outline"
        @click="openCreate"
      />
    </div>

    <div
      v-if="isLoading"
      class="flex flex-col gap-2"
    >
      <USkeleton
        v-for="n in 2"
        :key="n"
        class="h-16 w-full rounded-lg"
      />
    </div>

    <div
      v-else-if="!businessInfoList.length"
      class="flex flex-col items-center justify-center py-6 gap-2 text-dimmed border border-dashed border-default rounded-lg"
    >
      <UIcon
        name="i-lucide-building-2"
        class="size-6"
      />
      <p class="text-xs">
        No business info added yet.
      </p>
    </div>

    <div
      v-else
      class="flex flex-col gap-2"
    >
      <div
        v-for="info in businessInfoList"
        :key="info.id"
        class="flex items-start justify-between p-3 rounded-lg border border-default bg-elevated/30"
      >
        <div class="flex flex-col gap-0.5">
          <p class="text-sm font-semibold">
            {{ info.businessName }}
          </p>
          <p class="text-xs text-dimmed">
            RFC: {{ info.taxId }} · CP {{ info.postalCode }}
          </p>
        </div>
        <div class="flex gap-1 shrink-0">
          <UButton
            icon="i-lucide-pencil"
            color="neutral"
            variant="ghost"
            size="xs"
            @click="openEdit(info)"
          />
          <UButton
            icon="i-lucide-trash"
            color="error"
            variant="ghost"
            size="xs"
            @click="deleteTarget = info"
          />
        </div>
      </div>
    </div>
  </div>

  <USlideover
    v-model:open="slideoverOpen"
    :title="editTarget ? 'Edit Business Info' : 'Add Business Info'"
    side="right"
  >
    <template #body>
      <CatalogsFormsClientBusinessInfoForm
        :client-id="clientId"
        :edit-target="editTarget"
        @saved="onSaved"
        @cancel="slideoverOpen = false"
      />
    </template>
  </USlideover>

  <UModal
    v-model:open="isDeleteModalOpen"
    title="Delete business info"
    :description="`Are you sure you want to delete '${deleteTarget?.businessName}'? This action cannot be undone.`"
  >
    <template #footer>
      <UButton
        label="Cancel"
        color="neutral"
        variant="ghost"
        @click="deleteTarget = undefined"
      />
      <UButton
        label="Delete"
        color="error"
        icon="i-lucide-trash"
        :loading="isDeleting"
        @click="confirmDelete"
      />
    </template>
  </UModal>
</template>
