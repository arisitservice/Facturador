<script setup lang="ts">
import { newInvoiceDataSchema } from '~/lib/schemas/billing';

definePageMeta({
  name: 'nova-billing-invoices-new-invoice',
});

const clientsStore = useClientsStore();

await useAsyncData('invoice-clients', () => clientsStore.fetchClients(), {
  immediate: !clientsStore.clients.length,
});

const { state, selectedReceiverId, selectedIssuerId, clientList, submitInvoice } = useNewInvoice();
</script>

<template>
  <div class="flex flex-col gap-8">
    <UForm
      :schema="newInvoiceDataSchema"
      :state="state"
    >
      <div class="flex flex-col sm:flex-row gap-4">
        <BillingClientInfoCard
          v-model:selected-client-id="selectedIssuerId"
          title="Issuer Information"
          :items="clientList"
          :is-loading="clientsStore.isLoading"
          :client-data="state.issuer"
        />

        <BillingClientInfoCard
          v-model:selected-client-id="selectedReceiverId"
          title="Receiver Information"
          :items="clientList"
          :is-loading="clientsStore.isLoading"
          :client-data="state.receiver"
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
