<script setup lang="ts">
import type { SelectItem } from '@nuxt/ui';

import type { IssuerMode } from '~/composables/use-issuer-select';
import type { ClientData } from '~/lib/schemas/billing';

defineProps<{
  clientList: SelectItem[];
  isLoadingClients: boolean;
  issuerData: ClientData;
  issuerClientBusinessInfoItems: SelectItem[];
  isLoadingIssuerClientBusinessInfo: boolean;
}>();

const issuerMode = defineModel<IssuerMode>('issuerMode', { required: true });
const selectedOwnId = defineModel<number | undefined>('selectedOwnId');
const selectedIssuerClientId = defineModel<number | undefined>('selectedIssuerClientId');
const selectedIssuerClientBusinessInfoId = defineModel<number | undefined>('selectedIssuerClientBusinessInfoId');

const businessInfoStore = useBusinessInfoStore();
const { businessInfoList, selectItems: ownItems, isLoading: isLoadingOwn } = storeToRefs(businessInfoStore);

const modeOptions = [
  { label: 'My Business', value: 'own' as IssuerMode },
  { label: 'Client', value: 'client' as IssuerMode },
];
</script>

<template>
  <UCard class="w-full">
    <template #header>
      <div class="flex flex-col gap-3">
        <h2 class="text-xl lg:text-2xl font-bold">
          Issuer Information
        </h2>
        <UButtonGroup class="w-full">
          <UButton
            v-for="opt in modeOptions"
            :key="opt.value"
            :label="opt.label"
            :color="issuerMode === opt.value ? 'primary' : 'neutral'"
            :variant="issuerMode === opt.value ? 'solid' : 'outline'"
            class="flex-1"
            @click="issuerMode = opt.value"
          />
        </UButtonGroup>
      </div>
    </template>

    <div class="flex flex-col gap-4">
      <!-- Own business mode -->
      <template v-if="issuerMode === 'own'">
        <div
          v-if="isLoadingOwn"
          class="flex flex-col gap-3"
        >
          <USkeleton class="h-8 w-full rounded-md" />
        </div>

        <!-- No business info added yet -->
        <UAlert
          v-else-if="!businessInfoList.length"
          icon="i-lucide-building-2"
          color="warning"
          variant="subtle"
          title="No business information found"
          description="Go to your Account page to add a business profile before creating documents."
        >
          <template #description>
            <p class="text-sm mt-1">
              Go to your
              <ULink
                :to="{ name: 'nova-account' }"
                class="font-medium underline"
              >
                Account page
              </ULink>
              to add a business profile before creating documents.
            </p>
          </template>
        </UAlert>

        <!-- Business info select -->
        <UFormField
          v-else
          label="Business Profile"
          name="ownBusinessId"
          required
        >
          <USelect
            v-model="selectedOwnId"
            :items="ownItems"
            placeholder="Select a business profile..."
            class="w-full"
          />
        </UFormField>
      </template>

      <!-- Client mode -->
      <template v-else>
        <UFormField
          label="Client"
          name="issuerClientId"
          required
        >
          <SkeletonFormCard
            v-if="isLoadingClients"
            :field-count="1"
          />
          <USelect
            v-else
            v-model="selectedIssuerClientId"
            :items="clientList"
            placeholder="Select a client..."
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Business Info"
          name="issuerClientBusinessInfoId"
          required
        >
          <SkeletonFormCard
            v-if="isLoadingIssuerClientBusinessInfo"
            :field-count="1"
          />
          <USelect
            v-else
            v-model="selectedIssuerClientBusinessInfoId"
            :items="issuerClientBusinessInfoItems"
            :disabled="!selectedIssuerClientId"
            placeholder="Select business info..."
            class="w-full"
          />
        </UFormField>
      </template>

      <!-- Populated fields (read-only) -->
      <USeparator v-if="issuerData.businessName || issuerData.taxId" />

      <template v-if="issuerData.businessName || issuerData.taxId">
        <UFormField
          label="Tax Regime"
          name="issuerTaxRegimeId"
        >
          <UInput
            :model-value="issuerData.taxRegimeId || ''"
            disabled
            class="w-full"
          />
        </UFormField>
        <UFormField
          label="Tax ID"
          name="issuerTaxId"
        >
          <UInput
            :model-value="issuerData.taxId"
            disabled
            class="w-full"
          />
        </UFormField>
        <UFormField
          label="Business Name"
          name="issuerBusinessName"
        >
          <UInput
            :model-value="issuerData.businessName"
            disabled
            class="w-full"
          />
        </UFormField>
        <UFormField
          label="Postal Code"
          name="issuerPostalCode"
        >
          <UInput
            :model-value="issuerData.postalCode"
            disabled
            class="w-full"
          />
        </UFormField>
      </template>
    </div>
  </UCard>
</template>
