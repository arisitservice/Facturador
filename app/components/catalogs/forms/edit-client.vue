<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui';

import type { NewClient } from '~/lib/schemas/catalogs';
import type { Client } from '~/types/facturador/api/client-api';

import { newClientSchema } from '~/lib/schemas/catalogs';

const props = defineProps<{ client: Client }>();
const emit = defineEmits<{ close: [] }>();

const clientsStore = useClientsStore();
const toast = useToast();

const state = ref<NewClient>({
  name: props.client.name,
  businessName: props.client.businessName,
  taxId: props.client.taxId,
  taxRegimeId: props.client.taxRegimeId,
  taxAddress: props.client.taxAddress,
  postalCode: props.client.postalCode,
});

async function onSubmit(event: FormSubmitEvent<NewClient>) {
  const response = await clientsStore.updateClient(props.client.id, event.data);

  if (response.isSuccess) {
    toast.add({ title: 'Cliente actualizado', description: `${event.data.name} fue actualizado correctamente.`, color: 'success' });
    emit('close');
  }
  else {
    toast.add({ title: 'Error', description: response.message ?? 'Ocurrió un error al actualizar el cliente.', color: 'error' });
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
      <UInput
        v-model.number="state.taxRegimeId"
        type="number"
        placeholder="601"
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
        @click="emit('close')"
      />
      <UButton
        label="Guardar"
        color="primary"
        variant="solid"
        type="submit"
        :loading="clientsStore.isSaving"
      />
    </div>
  </UForm>
</template>
