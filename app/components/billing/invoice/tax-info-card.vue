<script setup lang="ts">
import type { InvoiceTaxInfo, VatDetails } from '~/lib/schemas/billing';

import { paymentForms, paymentMethods } from '~/lib/conts';

const taxInfo = defineModel<InvoiceTaxInfo>('taxInfo', { required: true });
const vatDetails = defineModel<VatDetails>('vatDetails', { required: true });

function setVatRate(v: boolean) {
  vatDetails.value = { ...vatDetails.value, vatChargedAtRate: v, vatExempt: v ? false : vatDetails.value.vatExempt };
}

function setVatExempt(v: boolean) {
  vatDetails.value = { ...vatDetails.value, vatExempt: v, vatChargedAtRate: v ? false : vatDetails.value.vatChargedAtRate };
}
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
    <USeparator
      class="my-4"
      label="VAT Details"
    />
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
          <USwitch
            :model-value="vatDetails.vatChargedAtRate"
            @update:model-value="setVatRate($event as boolean)"
          />
        </UFormField>
        <UFormField
          label="VAT Exempt"
          name="vatExempt"
        >
          <USwitch
            :model-value="vatDetails.vatExempt"
            @update:model-value="setVatExempt($event as boolean)"
          />
        </UFormField>
        <UFormField
          label="VAT Retention Rate"
          name="vatWithholdingAtRate"
        >
          <USwitch
            :model-value="vatDetails.vatWithholdingAtRate"
            @update:model-value="vatDetails = { ...vatDetails, vatWithholdingAtRate: $event as boolean }"
          />
        </UFormField>
        <UFormField
          label="Tax Retention Rate"
          name="incomeTaxWithholding"
        >
          <USwitch
            :model-value="vatDetails.incomeTaxWithholding"
            @update:model-value="vatDetails = { ...vatDetails, incomeTaxWithholding: $event as boolean }"
          />
        </UFormField>
        <UFormField
          label="Amount"
          name="amount"
        >
          <UInput
            :model-value="vatDetails.amount"
            type="number"
            class="w-full"
            @update:model-value="vatDetails = { ...vatDetails, amount: Number($event) }"
          />
        </UFormField>
      </div>
    </UForm>
  </UCard>
</template>
