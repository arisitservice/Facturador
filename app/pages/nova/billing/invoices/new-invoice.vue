<script setup lang="ts">
import { newInvoiceDataSchema } from '~/lib/schemas/billing';

definePageMeta({
  name: 'nova-billing-invoices-new-invoice',
});

const clientsStore = useClientsStore();

await useAsyncData('invoice-clients', () => clientsStore.fetchClients(), {
  immediate: !clientsStore.clients.length,
});

const { state, selectedClientId, clientList, submitInvoice } = useNewInvoice();
</script>

<template>
  <div class="flex flex-col gap-8">
    <UForm
      :schema="newInvoiceDataSchema"
      :state="state"
    >
      <div class="flex flex-col sm:flex-row gap-4">
        <BillingInvoiceClientInfoCard
          v-model:selected-client-id="selectedClientId"
          :items="clientList"
          :is-loading="clientsStore.isLoading"
          :client-data="state.client"
        />
        <BillingInvoiceTaxInfoCard
          v-model:tax-info="state.taxInfo"
          v-model:vat-details="state.vatDetails"
        />
      </div>
    </UForm>
    <BillingInvoiceProductServicesTable v-model="state.productServices" />
    <div class="flex justify-end">
      <UButton
        label="Create Invoice"
        type="button"
        icon="i-lucide-file-plus"
        size="lg"
        @click="submitInvoice"
      />
    </div>
  </div>
</template>
