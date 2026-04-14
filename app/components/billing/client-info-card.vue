<script setup lang="ts">
import type { SelectItem } from '@nuxt/ui';

import type { ClientData } from '~/lib/schemas/billing';
import type { TaxRegimen } from '~/types/facturador/api/client-api';

import { clientDataSchema } from '~/lib/schemas/billing';

const props = defineProps<{
  title?: string;
  items: SelectItem[];
  isLoading: boolean;
  clientData: ClientData;
  businessInfoItems?: SelectItem[];
  isLoadingBusinessInfo?: boolean;
  taxRegime?: TaxRegimen | null;
}>();

const selectedClientId = defineModel<number | undefined>('selectedClientId');
const selectedBusinessInfoId = defineModel<number | undefined>('selectedBusinessInfoId');

const taxRegimeStore = useTaxRegimeStore();

const taxRegimeLabel = computed(() => {
  // Prefer embedded regime object (has satCode + description)
  if (props.taxRegime)
    return `${props.taxRegime.satCode} — ${props.taxRegime.description}`;
  // Fallback: look up by id in the loaded tax regimes list
  if (props.clientData.taxRegimeId) {
    const regime = taxRegimeStore.taxRegimes.find(r => r.id === props.clientData.taxRegimeId);
    if (regime)
      return `${regime.satCode} — ${regime.description}`;
  }
  return '';
});
</script>

<template>
  <UCard class="w-full">
    <template #header>
      <h2 class="text-xl lg:text-2xl font-bold">
        {{ props.title || 'Receiver Information' }}
      </h2>
    </template>
    <UForm
      nested
      name="client"
      :schema="clientDataSchema"
      class="flex flex-col gap-4"
    >
      <SkeletonFormCard
        v-if="props.isLoading"
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
          :items="props.items"
          placeholder="Select a client..."
          class="w-full"
        />
      </UFormField>

      <template v-if="props.businessInfoItems !== undefined">
        <UFormField
          label="Business Info"
          name="businessInfoId"
          required
        >
          <SkeletonFormCard
            v-if="props.isLoadingBusinessInfo"
            :field-count="1"
          />
          <USelect
            v-else
            v-model="selectedBusinessInfoId"
            :items="props.businessInfoItems"
            :disabled="!selectedClientId"
            placeholder="Select business info..."
            class="w-full"
          />
        </UFormField>
      </template>

      <UFormField
        label="Tax Regime"
        name="taxRegimeId"
        required
      >
        <UInput
          :model-value="taxRegimeLabel"
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
          :model-value="props.clientData.taxId"
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
          :model-value="props.clientData.businessName"
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
          :model-value="props.clientData.postalCode"
          disabled
          class="w-full"
        />
      </UFormField>
    </UForm>
  </UCard>
</template>
