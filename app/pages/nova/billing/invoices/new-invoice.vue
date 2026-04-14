<script setup lang="ts">
import { newInvoiceDataSchema } from '~/lib/schemas/billing';

definePageMeta({
  name: 'nova-billing-invoices-new-invoice',
});

const clientsStore = useClientsStore();
const businessInfoStore = useBusinessInfoStore();
const taxRegimeStore = useTaxRegimeStore();

await Promise.all([
  useAsyncData('invoice-clients', () => clientsStore.fetchClients(), {
    immediate: !clientsStore.clients.length,
  }),
  useAsyncData('invoice-business-info', () => businessInfoStore.fetchBusinessInfoList(), {
    immediate: !businessInfoStore.businessInfoList.length,
  }),
  taxRegimeStore.getTaxRegimes(),
]);

const {
  state,
  issuerMode,
  selectedOwnId,
  selectedIssuerClientId,
  selectedIssuerClientBusinessInfoId,
  issuerClientBusinessInfoItems,
  isLoadingIssuerClientBusinessInfo,
  issuerTaxRegime,
  selectedReceiverId,
  selectedReceiverBusinessInfoId,
  clientList,
  receiverBusinessInfoItems,
  isLoadingReceiverBusinessInfo,
  receiverTaxRegime,
  submitInvoice,
} = useNewInvoice();
</script>

<template>
  <div class="flex flex-col gap-8">
    <UForm
      :schema="newInvoiceDataSchema"
      :state="state"
    >
      <div class="flex flex-col sm:flex-row gap-4">
        <BillingIssuerInfoCard
          v-model:issuer-mode="issuerMode"
          v-model:selected-own-id="selectedOwnId"
          v-model:selected-issuer-client-id="selectedIssuerClientId"
          v-model:selected-issuer-client-business-info-id="selectedIssuerClientBusinessInfoId"
          :client-list="clientList"
          :is-loading-clients="clientsStore.isLoading"
          :issuer-data="state.issuer"
          :issuer-client-business-info-items="issuerClientBusinessInfoItems"
          :is-loading-issuer-client-business-info="isLoadingIssuerClientBusinessInfo"
          :issuer-tax-regime="issuerTaxRegime"
        />

        <BillingClientInfoCard
          v-model:selected-client-id="selectedReceiverId"
          v-model:selected-business-info-id="selectedReceiverBusinessInfoId"
          title="Receiver Information"
          :items="clientList"
          :is-loading="clientsStore.isLoading"
          :client-data="state.receiver"
          :business-info-items="receiverBusinessInfoItems"
          :is-loading-business-info="isLoadingReceiverBusinessInfo"
          :tax-regime="receiverTaxRegime"
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
