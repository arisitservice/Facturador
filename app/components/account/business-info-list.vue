<script setup lang="ts">
import type { BusinessInfo } from '~/types/facturador/api/client-api';

const businessInfoStore = useBusinessInfoStore();
const { businessInfoList, isLoading } = storeToRefs(businessInfoStore);
const toast = useToast();
const settingDefaultId = ref<number | null>(null);

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

function openCreate() {
  editTarget.value = undefined;
  slideoverOpen.value = true;
}

function openEdit(info: BusinessInfo) {
  editTarget.value = info;
  slideoverOpen.value = true;
}

function onSaved() {
  slideoverOpen.value = false;
}

async function setDefault(info: BusinessInfo) {
  settingDefaultId.value = info.id;
  const response = await businessInfoStore.setDefault(info.id);
  settingDefaultId.value = null;
  if (response.isSuccess) {
    toast.add({ title: `"${info.businessName}" set as default`, color: 'success', icon: 'i-lucide-star' });
  }
  else {
    toast.add({ title: 'Failed to set default', color: 'error', icon: 'i-lucide-alert-circle' });
  }
}

async function confirmDelete() {
  if (!deleteTarget.value)
    return;
  isDeleting.value = true;
  const response = await businessInfoStore.deleteBusinessInfo(deleteTarget.value.id);
  isDeleting.value = false;
  if (response.isSuccess) {
    toast.add({ title: 'Business info deleted', color: 'success', icon: 'i-lucide-trash' });
  }
  else {
    toast.add({ title: 'Failed to delete', color: 'error', icon: 'i-lucide-alert-circle' });
  }
  deleteTarget.value = undefined;
}
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold">
            Business Information
          </h2>
          <p class="text-sm text-dimmed mt-0.5">
            Manage the business profiles you can use when issuing invoices. The default is auto-selected when creating documents.
          </p>
        </div>
        <UButton
          label="Add business"
          icon="i-lucide-plus"
          size="sm"
          @click="openCreate"
        />
      </div>
    </template>

    <div
      v-if="isLoading"
      class="flex flex-col gap-3"
    >
      <USkeleton
        v-for="n in 2"
        :key="n"
        class="h-20 w-full rounded-lg"
      />
    </div>

    <div
      v-else-if="!businessInfoList.length"
      class="flex flex-col items-center justify-center py-12 gap-3 text-dimmed"
    >
      <UIcon
        name="i-lucide-building-2"
        class="size-10"
      />
      <p class="text-sm">
        No business information yet. Add one to get started.
      </p>
    </div>

    <div
      v-else
      class="flex flex-col gap-3"
    >
      <div
        v-for="info in businessInfoList"
        :key="info.id"
        class="flex items-start justify-between p-4 rounded-lg border border-default bg-elevated/30"
        :class="{ 'ring-2 ring-primary': info.default }"
      >
        <div class="flex flex-col gap-1">
          <div class="flex items-center gap-2">
            <p class="font-semibold">
              {{ info.businessName }}
            </p>
            <UBadge
              v-if="info.default"
              label="Default"
              color="primary"
              variant="subtle"
              size="xs"
              icon="i-lucide-star"
            />
          </div>
          <p class="text-sm text-dimmed">
            RFC: {{ info.taxId }}
          </p>
          <p class="text-sm text-dimmed">
            {{ info.taxAddress }} · CP {{ info.postalCode }}
          </p>
        </div>
        <div class="flex gap-1 shrink-0">
          <UTooltip
            v-if="!info.default"
            text="Set as default"
          >
            <UButton
              icon="i-lucide-star"
              color="neutral"
              variant="ghost"
              size="sm"
              :loading="settingDefaultId === info.id"
              @click="setDefault(info)"
            />
          </UTooltip>
          <UButton
            icon="i-lucide-pencil"
            color="neutral"
            variant="ghost"
            size="sm"
            @click="openEdit(info)"
          />
          <UButton
            icon="i-lucide-trash"
            color="error"
            variant="ghost"
            size="sm"
            @click="deleteTarget = info"
          />
        </div>
      </div>
    </div>
  </UCard>

  <USlideover
    v-model:open="slideoverOpen"
    :title="editTarget ? 'Edit Business Info' : 'Add Business Info'"
    side="right"
  >
    <template #body>
      <AccountBusinessInfoForm
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
