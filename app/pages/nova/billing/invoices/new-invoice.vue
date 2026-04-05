<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui';

import type { NewInvoiceData, ProductService } from '~/lib/schemas/billing';

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

const newProductService = ref<NewInvoiceData['productServices'][number]>({
  detailedDescription: '',
  productServiceId: 0,
  measureUnitId: 0,
  quantity: 0,
  unitPrice: 0,
});

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

const productServiceColumns: TableColumn<ProductService>[] = [
  { accessorKey: 'detailedDescription', header: 'Description' },
  { accessorKey: 'productServiceId', header: 'Product/Service' },
  { accessorKey: 'measureUnitId', header: 'Unit' },
  { accessorKey: 'quantity', header: 'Qty' },
  { accessorKey: 'unitPrice', header: 'Unit Price' },
];

function resetNewProductService() {
  newProductService.value = {
    detailedDescription: '',
    productServiceId: 0,
    measureUnitId: 0,
    quantity: 0,
    unitPrice: 0,
  };
}

const isProductModalOpen = ref(false);

function addProductService() {
  state.value.productServices.push({ ...newProductService.value });
  resetNewProductService();
  isProductModalOpen.value = false;
}

function submitInvoice() {
  // TODO: validate and call API — replace log with actual request
  console.log('Submitting invoice:', JSON.stringify(state.value, null, 2));
}
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- Client + Tax Info: one real <form> providing nested context -->
    <UForm
      :schema="newInvoiceDataSchema"
      :state="state"
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
                v-model.number="state.taxInfo.invoiceUsageId"
                class="w-full"
              />
            </UFormField>
            <UFormField
              label="Payment Method"
              name="paymentMethod"
              required
            >
              <USelect v-model="state.taxInfo.paymentMethod" :items="paymentMethods" />
            </UFormField>
            <UFormField
              label="Payment Form"
              name="paymentForm"
              required
            >
              <USelect v-model="state.taxInfo.paymentForm" :items="paymentForms" />
            </UFormField>
            <UFormField
              label="Payment Currency"
              name="paymentCurrencyId"
              required
            >
              <UInput
                v-model.number="state.taxInfo.paymentCurrencyId"
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
                <UInput
                  v-model.number="state.vatDetails.amount"
                  type="number"
                  class="w-full"
                />
              </UFormField>
            </div>
          </UForm>
        </UCard>
      <!-- End Tax Info Form -->
      </div>
    </UForm>

    <!-- Product/Service modal -->
    <UModal
      v-model:open="isProductModalOpen"
      title="Add Product / Service"
      description="Fill in the details and click Add to append the item to the invoice."
    >
      <template #body>
        <UForm
          :schema="productServiceSchema"
          :state="newProductService"
          class="flex flex-col gap-4"
          @submit="addProductService"
        >
          <UFormField
            label="Detailed Description"
            name="detailedDescription"
            required
          >
            <UInput v-model="newProductService.detailedDescription" class="w-full" />
          </UFormField>
          <UFormField
            label="Product/Service"
            name="productServiceId"
            required
          >
            <UInput v-model.number="newProductService.productServiceId" class="w-full" />
          </UFormField>
          <UFormField
            label="Measure unit"
            name="measureUnitId"
            required
          >
            <UInput v-model.number="newProductService.measureUnitId" class="w-full" />
          </UFormField>
          <UFormField
            label="Quantity"
            name="quantity"
            required
          >
            <UInput
              v-model.number="newProductService.quantity"
              type="number"
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="Unit Price"
            name="unitPrice"
            required
          >
            <UInput
              v-model.number="newProductService.unitPrice"
              type="number"
              class="w-full"
            />
          </UFormField>
          <div class="flex justify-end gap-2">
            <UButton
              label="Cancel"
              color="neutral"
              variant="ghost"
              type="button"
              @click="isProductModalOpen = false"
            />
            <UButton
              label="Add"
              type="submit"
              icon="i-lucide-plus"
            />
          </div>
        </UForm>
      </template>
    </UModal>
    <div class="flex justify-between items-center">
      <UButton
        label="Add Product / Service"
        icon="i-lucide-plus"
        variant="outline"
        @click="isProductModalOpen = true"
      />
    </div>
    <UTable
      :data="state.productServices"
      :columns="productServiceColumns"
      class="flex-1"
    />
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

<style scoped>

</style>
