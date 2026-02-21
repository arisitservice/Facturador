<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui';

import type { NewClient } from '~/lib/schemas/catalogs';

import { newClientSchema } from '~/lib/schemas/catalogs';

const { isAddNewRecordSlideoverOpen } = useDashboard();

const state = ref<NewClient>({
  name: '',
  rfc: '',
  postalCode: '',
  taxRegime: '',
  businessName: '',
  accessApp: '',
});

const toast = useToast();
async function onSubmit(event: FormSubmitEvent<NewClient>) {
  toast.add({ title: 'Success', description: `New customer ${event.data.name} added`, color: 'success' });
  isAddNewRecordSlideoverOpen.value = false;
}
</script>

<template>
  <UForm
    :schema="newClientSchema"
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
      label="R.F.C"
      placeholder="XAXX010101000"
      name="rfc"
      required
    >
      <UInput v-model="state.rfc" class="w-full" />
    </UFormField>
    <UFormField
      label="Postal Code"
      placeholder="12345"
      name="postalCode"
      required
    >
      <UInput v-model="state.postalCode" class="w-full" />
    </UFormField>
    <UFormField
      label="Tax Regime"
      placeholder="General"
      name="taxRegime"
      required
    >
      <UInput v-model="state.taxRegime" class="w-full" />
    </UFormField>
    <UFormField
      label="Access App"
      placeholder="App Name"
      name="accessApp"
      required
    >
      <UInput v-model="state.accessApp" class="w-full" />
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
