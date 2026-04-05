<script setup lang="ts">
import type { PaymentReception } from '~/lib/schemas/billing';

import { paymentForms, paymentMethods } from '~/lib/conts';
import { paymentReceptionSchema } from '~/lib/schemas/billing';

const props = defineProps<{
  folioInput: string;
}>();

const emit = defineEmits<{
  'update:folioInput': [value: string];
  'addFolio': [];
  'removeFolio': [index: number];
}>();

const paymentReception = defineModel<PaymentReception>({ required: true });
</script>

<template>
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
          :model-value="paymentReception.paymentMethod"
          :items="paymentMethods"
          @update:model-value="paymentReception = { ...paymentReception, paymentMethod: String($event) }"
        />
      </UFormField>
      <UFormField
        label="Payment Currency"
        name="paymentCurrency"
        required
      >
        <USelect
          :model-value="paymentReception.paymentCurrency"
          :items="paymentForms"
          @update:model-value="paymentReception = { ...paymentReception, paymentCurrency: Number($event) }"
        />
      </UFormField>
      <UFormField
        label="Payment Date"
        name="paymentDate"
        required
      >
        <UInput
          :model-value="paymentReception.paymentDate"
          type="date"
          class="w-full"
          @update:model-value="paymentReception = { ...paymentReception, paymentDate: String($event) }"
        />
      </UFormField>
      <UFormField
        label="Amount"
        name="amount"
        required
      >
        <UInput
          :model-value="paymentReception.amount"
          type="number"
          class="w-full"
          @update:model-value="paymentReception = { ...paymentReception, amount: Number($event) }"
        />
      </UFormField>
      <UFormField
        label="Transaction Number"
        name="transactionNumber"
        required
      >
        <UInput
          :model-value="paymentReception.transactionNumber"
          class="w-full"
          @update:model-value="paymentReception = { ...paymentReception, transactionNumber: String($event) }"
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
              :model-value="props.folioInput"
              placeholder="Enter folio UUID"
              class="flex-1"
              @update:model-value="emit('update:folioInput', String($event))"
              @keydown.enter.prevent="emit('addFolio')"
            />
            <UButton
              label="Add"
              type="button"
              @click="emit('addFolio')"
            />
          </div>
          <div
            v-if="paymentReception.fiscalFolios.length"
            class="flex flex-col gap-1"
          >
            <div
              v-for="(folio, index) in paymentReception.fiscalFolios"
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
                @click="emit('removeFolio', index)"
              />
            </div>
          </div>
        </div>
      </UFormField>
    </UForm>
  </UCard>
</template>
