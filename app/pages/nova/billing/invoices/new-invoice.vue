<script setup lang="ts">
import type { NewInvoiceData } from '~/lib/schemas/billing';

import { dummyTableData } from '~/assets/data/tables/dummy';
import { paymentForms, paymentMethods } from '~/lib/conts';
import { clientDataSchema, newInvoiceDataSchema, productServiceSchema } from '~/lib/schemas/billing';

definePageMeta({
  name: 'nova-billing-invoices-new-invoice',
});

const { data: clients } = await useBilling().client.getAllClients();

const clientList = clients?.map((client, i) => ({
  label: `client number ${i}`,
  value: i,
})) || [];

console.log(clients);
const state = ref<NewInvoiceData>({
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
    relatedInvoiceId: undefined,
  },
  productServices: [],
  vatDetails: {
    vatChargedAtRate: false,
    vatExempt: false,
    vatWithholdingAtRate: false,
    incomeTaxWithholding: false,
    amount: 0,
  },
});
</script>

<template>
  <UForm
    :schema="newInvoiceDataSchema"
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
          :schema="productServiceSchema"
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
            label="Product/Service"
            name="productServiceId"
            required
          >
            <UInput class="w-full" />
          </UFormField>
          <UFormField
            label="Measure unit"
            name="measureUnit"
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
          <UButton
            label="Add Product/Service"
            type="button"
            @click="console.log('adding product');"
          />
        </UForm>
      </UCard>
    </div>
    <UTable :data="dummyTableData" class="flex-1" />
    <UCard>
      <template #header>
        <h2 class="text-xl lg:text-2xl font-bold">
          VAT Details
        </h2>
      </template>
      <UForm
        nested
        name="vatDetails"
        class="flex gap-4"
      >
        <UFormField
          label="VAT Charged at Rate"
          name="vatChargedAtRate"
        >
          <USwitch v-model="state.vatDetails.vatChargedAtRate" @change="state.vatDetails.vatExempt = false" />
        </UFormField>
        <UFormField
          label="VAT Exempt"
          name="vatExempt"
        >
          <USwitch v-model="state.vatDetails.vatExempt" @change="state.vatDetails.vatChargedAtRate = false" />
        </UFormField>
        <UFormField
          label="VAT Withholding at Rate"
          name="vatWithholdingAtRate"
        >
          <USwitch v-model="state.vatDetails.vatWithholdingAtRate" />
        </UFormField>
        <UFormField
          label="Income Tax Withholding"
          name="incomeTaxWithholding"
        >
          <USwitch v-model="state.vatDetails.incomeTaxWithholding" />
        </UFormField>
        <UFormField
          label="Amount"
          name="amount"
        >
          <UInput type="number" class="w-full" />
        </UFormField>
      </UForm>
    </ucard>
  </UForm>
</template>

<style scoped>

</style>
