<script setup lang="ts">
import type { NewPaymentComplementData } from '~/lib/schemas/billing';

import { dummyTableData } from '~/assets/data/tables/dummy';
import { paymentForms, paymentMethods } from '~/lib/conts';
import { clientDataSchema, newPaymentComplementDataSchema, paymentReceptionSchema } from '~/lib/schemas/billing';

definePageMeta({
  name: 'nova-billing-payment-complements-new-payment-complement',
});

const { data: clients } = await useBilling().client.getAllClients();

const clientList = clients?.map((client, i) => ({
  label: `client number ${i}`,
  value: i,
})) || [];

const state = ref<NewPaymentComplementData>({
  client: {
    clientId: 0,
    businessName: '',
    postalCode: '',
    taxId: '',
    taxRegimeId: 0,
  },
  paymentReception: {
    paymentMethod: '',
    paymentCurrency: '',
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
          <UFormField
            label="Client"
            name="clientId"
            required
          >
            <USelect
              v-model="state.client.clientId"
              :items="clientList"
            />
          </UFormField>
          <UFormField
            label="Tax Regime"
            name="taxRegimeId"
            required
          >
            <UInput disabled class="w-full" />
          </UFormField>
          <UFormField
            label="Tax ID"
            name="taxId"
            required
          >
            <UInput disabled class="w-full" />
          </UFormField>
          <UFormField
            label="Business Name"
            name="businessName"
            required
          >
            <UInput disabled class="w-full" />
          </UFormField>
          <UFormField
            label="Postal Code"
            name="postalCode"
            required
          >
            <UInput disabled class="w-full" />
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
              v-model="state.paymentReception.amount"
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
    <UTable :data="dummyTableData" class="flex-1" />
  </UForm>
</template>

<style scoped>

</style>
