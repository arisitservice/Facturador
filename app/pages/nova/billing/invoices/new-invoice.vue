<script setup lang="ts">
import type { NewInvoiceData } from '~/lib/schemas/billing';

import { dummyTableData } from '~/assets/data/tables/dummy';
import { paymentForms, paymentMethods } from '~/lib/conts';
import { clientDataSchema, newInvoiceDataSchema, productServiceSchema } from '~/lib/schemas/billing';

definePageMeta({
  name: 'nova-billing-invoices-new-invoice',
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
              v-model="state.client.businessName"
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
              v-model="state.client.postalCode"
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
        <USeparator class="my-4" label="VAT Details" />
        <UForm
          nested
          name="vatDetails"
          class="flex gap-4"
        >
          <div class="flex flex-col 2xl:flex-row gap-4">
            <UFormField
              label="VAT Rate"
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
              label="VAT Retention Rate"
              name="vatWithholdingAtRate"
            >
              <USwitch v-model="state.vatDetails.vatWithholdingAtRate" />
            </UFormField>
            <UFormField
              label="Tax Retention Rate"
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
          </div>
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
  </UForm>
</template>

<style scoped>

</style>
