<script setup lang="ts">
import type { CreditNoteProductServiceData, NewCreditNoteData } from '~/lib/schemas/billing';

import { dummyTableData } from '~/assets/data/tables/dummy';
import { paymentForms, paymentMethods } from '~/lib/conts';
import { clientDataSchema, creditNoteProductServiceSchema, creditNoteTaxInfoSchema, newCreditNoteDataSchema } from '~/lib/schemas/billing';

definePageMeta({
  name: 'nova-billing-credit-notes-new-credit-note',
});

const { data: clients } = await useBilling().client.getAllClients();

const clientList = clients?.map((client, i) => ({
  label: `client number ${i}`,
  value: i,
})) || [];

const state = ref<NewCreditNoteData>({
  client: {
    clientId: 0,
    businessName: '',
    postalCode: '',
    taxId: '',
    taxRegimeId: 0,
  },
  taxInfo: {
    invoiceUsageId: 0,
    paymentCurrencyId: 0,
    paymentMethod: '',
    paymentForm: '',
  },
  productServices: [],
});

const productServiceData = ref<CreditNoteProductServiceData>({
  detailedDescription: '',
  quantity: 0,
  unitPrice: 0,
  isTaxable: false,
  withholdingType: undefined,
});

function handleTaxableChange() {
  if (!state.value.isTaxable) {
    state.value.withholdingType = undefined;
  }
}

console.log(productServiceData);
</script>

<template>
  <UForm
    :schema="newCreditNoteDataSchema"
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
            <UInput
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
              class="w-full"
              disabled
            />
          </UFormField>
          <UFormField
            label="Business Name"
            name="businessName"
            required
          >
            <UInput
              class="w-full"
              disabled
            />
          </UFormField>
          <UFormField
            label="Postal Code"
            name="postalCode"
            required
          >
            <UInput
              class="w-full"
              disabled
            />
          </UFormField>
        </UForm>
      <!-- End Client Data Form -->
      </UCard>

      <!-- Tax Info Form -->
      <UCard class="w-full">
        <template #header>
          <h2 class="text-xl lg:text-2xl font-bold">
            Tax Information
          </h2>
        </template>
        <UForm
          nested
          name="taxInfo"
          :schema="creditNoteTaxInfoSchema"
          class="flex flex-col gap-4"
        >
          <UFormField
            label="Invoice Usage"
            name="invoiceUsageId"
          >
            <UInput
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="Payment Method"
            name="paymentMethod"
            required
          >
            <USelect :items="paymentMethods" />
          </UFormField>
          <UFormField
            label="Payment Form"
            name="paymentForm"
            required
          >
            <USelect :items="paymentForms" />
          </UFormField>
          <UFormField
            label="Payment Currency"
            name="paymentCurrencyId"
            required
          >
            <UInput
              class="w-full"
            />
          </UFormField>
        </UForm>
      </UCard>
      <!-- End Tax Info Form -->

      <!-- Product/Service Form -->
      <UCard class="w-full">
        <template #header>
          <h2 class="text-xl lg:text-2xl font-bold">
            Product/Service Information
          </h2>
        </template>
        <UForm
          nested
          :schema="creditNoteProductServiceSchema"
          name="productServices"
          class="flex flex-col gap-4"
        >
          <UFormField
            label="Detailed Description"
            name="detailedDescription"
            required
          >
            <UInput class="w-full" />
          </UFormField>
          <UFormField
            label="Quantity"
            name="quantity"
            required
          >
            <UInput type="number" class="w-full" />
          </UFormField>
          <UFormField
            label="Unit Price"
            name="unitPrice"
            required
          >
            <UInput type="number" class="w-full" />
          </UFormField>
          <div class="flex w-full flex-col md:flex-row gap-4 min-h-16">
            <UFormField
              label="Is Taxable"
              name="isTaxable"
            >
              <USwitch v-model="state.isTaxable" @change="handleTaxableChange" />
            </UFormField>
            <UFormField
              v-if="state.isTaxable"
              label="Withholding Type"
              name="withholdingType"
            >
              <USelect
                v-model="state.withholdingType"
                :items="[{ label: 'VAT', value: 'vat' }, { label: 'Income Tax', value: 'incomeTax' }]"
                class="min-w-12"
              />
            </UFormField>
          </div>
          <UButton
            label="Add Product/Service"
            type="button"
            @click="console.log('adding product');"
          />
        </UForm>
      </UCard>
    </div>
    <UTable :data="dummyTableData" class="flex-1" />
  </UForm>
</template>

<style scoped>

</style>
