<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui';

import type { NewSupplier } from '~/lib/schemas/catalogs';

import { newSupplierSchema } from '~/lib/schemas/catalogs';

const { isAddNewRecordSlideoverOpen } = useDashboard();

const state = ref<NewSupplier>({
  name: '',
  comercialName: '',
  clientId: 0,
});

const toast = useToast();
async function onSubmit(event: FormSubmitEvent<NewSupplier>) {
  toast.add({ title: 'Success', description: `New supplier ${event.data.name} added`, color: 'success' });
  isAddNewRecordSlideoverOpen.value = false;
}
</script>

<template>
  <UForm
    :schema="newSupplierSchema"
    :state="state"
    class="space-y-4"
    @submit="onSubmit"
  >
    <UFormField
      label="Name"
      placeholder="John Doe"
      name="name"
      required
    >
      <UInput v-model="state.name" class="w-full" />
    </UFormField>
    <UFormField
      label="Comercial Name"
      placeholder="Comercial Name"
      name="comercialName"
      required
    >
      <UInput v-model="state.comercialName" class="w-full" />
    </UFormField>
    <UFormField
      label="Client ID"
      placeholder="Client ID"
      name="clientId"
      required
    >
      <UInput v-model="state.clientId" class="w-full" />
    </UFormField>
    <div class="flex justify-end gap-2">
      <UButton
        label="Cancel"
        color="neutral"
        variant="subtle"
        @click="isAddNewRecordSlideoverOpen = false"
      />
      <UButton
        label="Create"
        color="primary"
        variant="solid"
        type="submit"
      />
    </div>
  </UForm>
</template>
