<script setup lang="ts">
import { newCreditNoteDataSchema } from '~/lib/schemas/billing';

definePageMeta({
  name: 'nova-billing-credit-notes-new-credit-note',
});

const clientsStore = useClientsStore();

await useAsyncData('credit-note-clients', () => clientsStore.fetchClients(), {
  immediate: !clientsStore.clients.length,
});

const { state, selectedClientId, clientList, submitCreditNote } = useNewCreditNote();
</script>

<template>
  <div class="flex flex-col gap-8">
    <UForm
      :schema="newCreditNoteDataSchema"
      :state="state"
    >
      <div class="flex flex-col sm:flex-row gap-4">
        <BillingClientInfoCard
          v-model:selected-client-id="selectedClientId"
          :items="clientList"
          :is-loading="clientsStore.isLoading"
          :client-data="state.client"
        />
        <BillingCreditNoteTaxInfoCard v-model:tax-info="state.taxInfo" />
      </div>
    </UForm>
    <BillingCreditNoteProductServicesTable v-model="state.productServices" />
    <div class="flex justify-end">
      <UButton
        label="Create Credit Note"
        type="button"
        icon="i-lucide-file-plus"
        size="lg"
        @click="submitCreditNote"
      />
    </div>
  </div>
</template>
