<script setup lang="ts">
import type { NewPaymentComplementData } from '~/lib/schemas/billing';

import { paymentForms, paymentMethods } from '~/lib/conts';
import { clientDataSchema, newPaymentComplementDataSchema, paymentReceptionSchema } from '~/lib/schemas/billing';

definePageMeta({
  name: 'nova-billing-payment-complements-new-payment-complement',
});

const clientsStore = useClientsStore();

if (!clientsStore.clients.length) {
  await clientsStore.fetchClients();
}

const clientList = computed(() =>
  clientsStore.clients.map(client => ({
    label: `${client.name} — ${client.taxId}`,
    value: client.id,
  })),
);

const state = ref<NewPaymentComplementData>({
  client: {
    clientId: 0,
    businessName: '',
    postalCode: '',
    taxId: '',
    taxRegimeId: 0,
  },
  paymentReception: {
    paymentMethod: '0',
    paymentCurrency: 0,
    paymentDate: '',
    amount: 0,
    transactionNumber: '',
    fiscalFolios: [],
  },
});

const folioInput = ref('');

function addFolio() {
  const trimmed = folioInput.value.trim();
  if (!trimmed)
    return;
  state.value.paymentReception.fiscalFolios.push(trimmed);
  folioInput.value = '';
}

function removeFolio(index: number) {
  state.value.paymentReception.fiscalFolios.splice(index, 1);
}

const selectedClientId = ref<number | undefined>(undefined);

watch(selectedClientId, (id) => {
  const client = clientsStore.clients.find(c => c.id === id);
  if (!client)
    return;
  state.value.client.clientId = client.id;
  state.value.client.taxId = client.taxId;
  state.value.client.businessName = client.businessName;
  state.value.client.postalCode = client.postalCode;
  state.value.client.taxRegimeId = client.taxRegimeId;
});

function submitPaymentComplement() {
  // TODO: validate and call API — replace log with actual request
  console.log('Submitting payment complement:', JSON.stringify(state.value, null, 2));
}
</script>

<template>
  <UForm
    :schema="newPaymentComplementDataSchema"
    :state="state"
    class="flex flex-col gap-8"
  >
    <div class="flex flex-col sm:flex-row gap-4">
      <!-- Client Data Form -->
      <UCard class="w-full">
        <template #header>
          <h2 class="text-xl lg:text-2xl font-bold">
            Client Information
          </h2>
        </template>
        <UForm
          nested
          name="client"
          :schema="clientDataSchema"
          class="flex flex-col gap-4"
        >
          <SkeletonFormCard
            v-if="clientsStore.isLoading"
            :field-count="1"
          />
          <UFormField
            v-else
            label="Client"
            name="clientId"
            required
          >
            <USelect
              v-model="selectedClientId"
              :items="clientList"
              placeholder="Select a client..."
            />
          </UFormField>
          <UFormField
            label="Tax Regime"
            name="taxRegimeId"
            required
          >
            <UInput
              v-model.number="state.client.taxRegimeId"
              disabled
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="Tax ID"
            name="taxId"
            required
          >
            <UInput
              v-model="state.client.taxId"
              disabled
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="Business Name"
            name="businessName"
            required
          >
            <UInput
              v-model="state.client.businessName"
              disabled
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="Postal Code"
            name="postalCode"
            required
          >
            <UInput
              v-model="state.client.postalCode"
              disabled
              class="w-full"
            />
          </UFormField>
        </UForm>
      </UCard>
      <!-- End Client Data Form -->

      <!-- Payment Reception Form -->
      <UCard class="w-full">
        <template #header>
          <h2 class="text-xl lg:text-2xl font-bold">
            Payment Reception
          </h2>
        </template>
        <UForm
          nested
          name="paymentReception"
          :schema="paymentReceptionSchema"
          class="flex flex-col gap-4"
        >
          <UFormField
            label="Payment Method"
            name="paymentMethod"
            required
          >
            <USelect
              v-model="state.paymentReception.paymentMethod"
              :items="paymentMethods"
            />
          </UFormField>
          <UFormField
            label="Payment Currency"
            name="paymentCurrency"
            required
          >
            <USelect
              v-model="state.paymentReception.paymentCurrency"
              :items="paymentForms"
            />
          </UFormField>
          <UFormField
            label="Payment Date"
            name="paymentDate"
            required
          >
            <UInput
              v-model="state.paymentReception.paymentDate"
              type="date"
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="Amount"
            name="amount"
            required
          >
            <UInput
              v-model.number="state.paymentReception.amount"
              type="number"
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="Transaction Number"
            name="transactionNumber"
            required
          >
            <UInput
              v-model="state.paymentReception.transactionNumber"
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="Fiscal Folios"
            name="fiscalFolios"
            required
          >
            <div class="flex flex-col gap-2 w-full">
              <div class="flex gap-2">
                <UInput
                  v-model="folioInput"
                  placeholder="Enter folio UUID"
                  class="flex-1"
                  @keydown.enter.prevent="addFolio"
                />
                <UButton
                  label="Add"
                  type="button"
                  @click="addFolio"
                />
              </div>
              <div
                v-if="state.paymentReception.fiscalFolios.length"
                class="flex flex-col gap-1"
              >
                <div
                  v-for="(folio, index) in state.paymentReception.fiscalFolios"
                  :key="index"
                  class="flex items-center justify-between gap-2 px-3 py-1.5 rounded-md bg-elevated text-sm"
                >
                  <span class="truncate">{{ folio }}</span>
                  <UButton
                    icon="i-lucide-x"
                    variant="ghost"
                    color="error"
                    size="xs"
                    type="button"
                    @click="removeFolio(index)"
                  />
                </div>
              </div>
            </div>
          </UFormField>
        </UForm>
      </UCard>
      <!-- End Payment Reception Form -->
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

<style scoped>

</style>
