<script setup lang="ts">
import type { NewInvoiceData } from '~/lib/schemas/billing';

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
    <!-- Client Data Form -->
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
        />
      </UFormField>
      <UFormField
        label="Tax ID"
        name="taxId"
        required
      >
        <UInput
          disabled
        />
      </UFormField>
      <UFormField
        label="Business Name"
        name="businessName"
        required
      >
        <UInput
          disabled
        />
      </UFormField>
      <UFormField
        label="Postal Code"
        name="postalCode"
        required
      >
        <UInput
          disabled
        />
      </UFormField>
    </UForm>
    <!-- End Client Data Form -->

    <!-- Tax Info Form -->
    <UForm
      nested
      name="taxInfo"
      class="flex flex-col gap-4"
    >
      <UFormField
        label="Invoice Usage"
        name="invoiceUsageId"
      >
        <UInput />
      </UFormField>
      <UFormField
        label="Payment Method"
        name="paymentMethod"
      >
        <USelect :items="paymentMethods" />
      </UFormField>
      <UFormField
        label="Payment Form"
        name="paymentForm"
      >
        <USelect :items="paymentForms" />
      </UFormField>
      <UFormField
        label="Payment Currency"
        name="paymentCurrencyId"
      >
        <UInput />
      </UFormField>
    </UForm>
    <!-- End Tax Info Form -->

    <UForm
      nested
      :schema="productServiceSchema"
      name="productServices"
      class="flex flex-col gap-4"
    >
      <UFormField
        label="Detailed Description"
        name="detailedDescription"
      >
        <UInput />
      </UFormField>
      <UFormField
        label="Product/Service"
        name="productServiceId"
      >
        <UInput />
      </UFormField>
      <UFormField
        label="Measure unit"
        name="measureUnit"
      >
        <UInput />
      </UFormField>
      <UFormField
        label="Quantity"
        name="quantity"
      >
        <UInput type="number" />
      </UFormField>
      <UFormField
        label="Unit Price"
        name="unitPrice"
      >
        <UInput type="number" />
      </UFormField>
      <UButton
        label="Add Product/Service"
        type="button"
        @click="console.log('adding product');"
      />
    </UForm>
  </UForm>
</template>

<style scoped>

</style>
