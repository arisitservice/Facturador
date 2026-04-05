<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui';

import type { NewClient } from '~/lib/schemas/catalogs';

import { newClientSchema } from '~/lib/schemas/catalogs';

const { isAddNewRecordSlideoverOpen } = useDashboard();
const clientsStore = useClientsStore();
const taxRegimeStore = useTaxRegimeStore();
const toast = useToast();

await taxRegimeStore.getTaxRegimes();

const state = ref<NewClient>({
  name: '',
  businessName: '',
  taxId: '',
  taxRegimeId: 0,
  taxAddress: '',
  postalCode: '',
});

async function onSubmit(event: FormSubmitEvent<NewClient>) {
  const response = await clientsStore.createClient(event.data);

  if (response.isSuccess) {
    toast.add({ title: 'Cliente creado', description: `${event.data.name} fue agregado correctamente.`, color: 'success' });
    isAddNewRecordSlideoverOpen.value = false;
  }
  else {
    toast.add({ title: 'Error', description: response.message ?? 'Ocurrió un error al crear el cliente.', color: 'error' });
  }
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
      label="Nombre"
      name="name"
      required
    >
      <UInput
        v-model="state.name"
        placeholder="Juan Pérez"
        class="w-full"
      />
    </UFormField>

    <UFormField
      label="Razón Social"
      name="businessName"
      required
    >
      <UInput
        v-model="state.businessName"
        placeholder="Empresa S.A. de C.V."
        class="w-full"
      />
    </UFormField>

    <UFormField
      label="R.F.C"
      name="taxId"
      required
    >
      <UInput
        v-model="state.taxId"
        placeholder="XAXX010101000"
        class="w-full"
      />
    </UFormField>

    <UFormField
      label="ID Régimen Fiscal"
      name="taxRegimeId"
      required
    >
      <USelect
        v-model.number="state.taxRegimeId"
        :items="taxRegimeStore.taxRegimes"
        value-key="id"
        label-key="description"
        description-key="satCode"
        class="w-full"
      />
    </UFormField>

    <UFormField
      label="Domicilio Fiscal"
      name="taxAddress"
      required
    >
      <UInput
        v-model="state.taxAddress"
        placeholder="Calle, Número, Colonia"
        class="w-full"
      />
    </UFormField>

    <UFormField
      label="Código Postal"
      name="postalCode"
      required
    >
      <UInput
        v-model="state.postalCode"
        placeholder="12345"
        class="w-full"
      />
    </UFormField>

    <div class="flex justify-end gap-2">
      <UButton
        label="Cancelar"
        color="neutral"
        variant="subtle"
        @click="isAddNewRecordSlideoverOpen = false"
      />
      <UButton
        label="Crear"
        color="primary"
        variant="solid"
        type="submit"
        :loading="clientsStore.isSaving"
      />
    </div>
  </UForm>
</template>
