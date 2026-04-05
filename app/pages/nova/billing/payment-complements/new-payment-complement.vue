<script setup lang="ts">
import { newPaymentComplementDataSchema } from '~/lib/schemas/billing';

definePageMeta({
  name: 'nova-billing-payment-complements-new-payment-complement',
});

const clientsStore = useClientsStore();

await useAsyncData('payment-complement-clients', () => clientsStore.fetchClients(), {
  immediate: !clientsStore.clients.length,
});

const { state, selectedClientId, clientList, folioInput, addFolio, removeFolio, submitPaymentComplement } = useNewPaymentComplement();
</script>

<template>
  <UForm
    :schema="newPaymentComplementDataSchema"
    :state="state"
    class="flex flex-col gap-8"
  >
    <div class="flex flex-col sm:flex-row gap-4">
      <BillingClientInfoCard
        v-model:selected-client-id="selectedClientId"
        :items="clientList"
        :is-loading="clientsStore.isLoading"
        :client-data="state.client"
      />
      <BillingPaymentComplementPaymentReceptionCard
        v-model="state.paymentReception"
        :folio-input="folioInput"
        @update:folio-input="folioInput = $event"
        @add-folio="addFolio"
        @remove-folio="removeFolio"
      />
    </div>
    <div class="flex justify-end">
      <UButton
        label="Create Payment Complement"
        type="button"
        icon="i-lucide-file-plus"
        size="lg"
        @click="submitPaymentComplement"
      />
    </div>
  </UForm>
</template>
