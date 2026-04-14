<script setup lang="ts">
import { newPaymentComplementDataSchema } from '~/lib/schemas/billing';

definePageMeta({
  name: 'nova-billing-payment-complements-new-payment-complement',
});

const clientsStore = useClientsStore();
const businessInfoStore = useBusinessInfoStore();
const taxRegimeStore = useTaxRegimeStore();

await Promise.all([
  useAsyncData('payment-complement-clients', () => clientsStore.fetchClients(), {
    immediate: !clientsStore.clients.length,
  }),
  useAsyncData('payment-complement-business-info', () => businessInfoStore.fetchBusinessInfoList(), {
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
  selectedClientId,
  selectedClientBusinessInfoId,
  clientList,
  clientBusinessInfoItems,
  isLoadingClientBusinessInfo,
  clientTaxRegime,
  folioInput,
  addFolio,
  removeFolio,
  submitPaymentComplement,
} = useNewPaymentComplement();
</script>

<template>
  <UForm
    :schema="newPaymentComplementDataSchema"
    :state="state"
    class="flex flex-col gap-8"
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
        v-model:selected-client-id="selectedClientId"
        v-model:selected-business-info-id="selectedClientBusinessInfoId"
        :items="clientList"
        :is-loading="clientsStore.isLoading"
        :client-data="state.client"
        :business-info-items="clientBusinessInfoItems"
        :is-loading-business-info="isLoadingClientBusinessInfo"
        :tax-regime="clientTaxRegime"
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
