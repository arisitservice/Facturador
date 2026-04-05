<script setup lang="ts">
import type { CreditNoteTaxInfo } from '~/lib/schemas/billing';

import { paymentForms, paymentMethods } from '~/lib/conts';
import { creditNoteTaxInfoSchema } from '~/lib/schemas/billing';

const taxInfo = defineModel<CreditNoteTaxInfo>('taxInfo', { required: true });
</script>

<template>
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
          :model-value="taxInfo.invoiceUsageId"
          class="w-full"
          @update:model-value="taxInfo = { ...taxInfo, invoiceUsageId: Number($event) }"
        />
      </UFormField>
      <UFormField
        label="Payment Method"
        name="paymentMethod"
        required
      >
        <USelect
          :model-value="taxInfo.paymentMethod"
          :items="paymentMethods"
          @update:model-value="taxInfo = { ...taxInfo, paymentMethod: String($event) }"
        />
      </UFormField>
      <UFormField
        label="Payment Form"
        name="paymentForm"
        required
      >
        <USelect
          :model-value="taxInfo.paymentForm"
          :items="paymentForms"
          @update:model-value="taxInfo = { ...taxInfo, paymentForm: String($event) }"
        />
      </UFormField>
      <UFormField
        label="Payment Currency"
        name="paymentCurrencyId"
        required
      >
        <UInput
          :model-value="taxInfo.paymentCurrencyId"
          class="w-full"
          @update:model-value="taxInfo = { ...taxInfo, paymentCurrencyId: Number($event) }"
        />
      </UFormField>
    </UForm>
  </UCard>
</template>
